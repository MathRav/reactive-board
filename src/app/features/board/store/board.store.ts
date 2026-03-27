import {BoardState, Card, List, ListVm} from './board-state.types';
import {
  patchState,
  signalStore, type,
  withComputed,
  withHooks,
  withMethods,
  withState
} from '@ngrx/signals';
import {computed} from '@angular/core';
import {Id} from '@core/store/entity-base.type';
import {CardUpdateInput, CreateCardInput} from './board-actions.type';
import {
  cardById, cardIndexInList, listByCardId,
  listById,
  moveCardInList,
  removeCardInLists,
  updateListElement
} from './board.util';
import {BOARD_LOCAL_STATE_KEY} from './board.local-state.utils';
import {withNotifications} from '@core/errors/with-notifications';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {map, of, pipe, switchMap, tap, timer} from 'rxjs';
import {MOCK_BOARD_STATE, MOCK_CARDS} from './board.mock.constants';
import { tapResponse } from '@ngrx/operators';
import {withPersistence} from '@core/local-storage/state/with-persistence';
import {
  addEntity,
  NamedEntityState,
  removeEntity, setEntities,
  updateEntity,
  withEntities
} from '@ngrx/signals/entities';

const initialState: BoardState = {
  boardId: null,
  filterQuery: '',
  lists: [],
  selectedCardId: null,
  loading: false,
  history: [],
  future: [],
}

const CardCollection = 'card' as const;

export const BoardStore = signalStore(
  withEntities({entity: type<Card>(), collection: CardCollection}),
  withState(initialState),
  withNotifications(),
  withComputed(({ lists, cardEntityMap, filterQuery, history, future, selectedCardId }) => ({
    listsVm: computed((): ListVm[] => {
      const listsValue = lists();
      const q = filterQuery().trim();
      const cardsValue = cardEntityMap();

      return listsValue.map((currentList) => ({
        id: currentList.id,
        title: currentList.title,
        cards: currentList.cardIds.reduce<Card[]>((acc, cardId) => {
          const currentCard = cardsValue[cardId];
          if (!currentCard) return acc;

          if (!q || currentCard.title.includes(q)) {
            acc.push(currentCard);
          }
          return acc;
        }, []),
      }));
    }),
    selectedCard: computed(() => {
      const id = selectedCardId();
      const cardsValue = cardEntityMap();
      return id ? cardsValue[id] ?? null : null;
    }),
    canUndo: computed(() => Boolean(history().length)),
    canRedo: computed(() => Boolean(future().length)),
  })),
  withPersistence<BoardState & NamedEntityState<Card, typeof CardCollection>, Pick<BoardState, 'lists'|'filterQuery'|'boardId'> & Pick<NamedEntityState<Card, typeof CardCollection>, 'cardEntityMap' >>(
    BOARD_LOCAL_STATE_KEY,
    (store) => {
      const {lists, cardEntityMap,  filterQuery, boardId} = store;
      return ({
        lists: lists(),
        cardEntityMap: cardEntityMap(),
        filterQuery: filterQuery(),
        boardId: boardId()
      });
    },
    2
  ),
  withMethods((store) => {
    const {cardEntityMap: cards, selectedCardId, lists, _notificationService, history, future, getPersistedState} = store;

    /**
     * @param cardId
     * @param toListId
     * @param index
     * @param mutateHistory
     */
    const moveCard = (cardId: Id, toListId: Id, index?: number, mutateHistory: boolean = true): void  => {
      const listsValue = lists();
      const cardsValue = cards();
      const initialTarget = listById(toListId, listsValue);

      if (!initialTarget) return;

      const initialList = listByCardId(cardId, listsValue) as List;
      const initialCardIndex = cardIndexInList(cardId, initialList) as number;

      if(!cardById(cardId, cardsValue)){
        const listsRepaired = removeCardInLists(cardId, listsValue);
        if(listsRepaired !== listsValue){
          patchState(store, { lists: listsRepaired });
        }
        return;
      }

      let normalizedLists = removeCardInLists(cardId, listsValue);

      const normalizedInitialTarget = listById(toListId, normalizedLists);
      if(!normalizedInitialTarget){
        if(ngDevMode){
          throw new Error(`[moveCard] Target list ${toListId} missing after normalization`)
        }
        return;
      }
      const finalTargetList = moveCardInList(cardId, normalizedInitialTarget, index);
      if(finalTargetList === normalizedInitialTarget){
        if(normalizedLists !== listsValue){
          patchState(store, {
            lists: normalizedLists
          })
        }
        return;
      }
      const updatedLists = updateListElement(finalTargetList, normalizedLists);
      if(updatedLists === normalizedLists){
        return;
      }
      patchState(store, (state) => {

        const mutations: Partial<BoardState> = ({
          lists: updatedLists,
        });

        if(mutateHistory){
          mutations['history'] = [...state.history, {
            cardId,
            fromListId: initialList.id,
            fromIndex: initialCardIndex,
            toListId: finalTargetList.id,
            toIndex: cardIndexInList(cardId, finalTargetList),
          }].slice(-20);
          mutations['future'] =  []
        }

        return mutations;
      }, updateEntity({ id: cardId, changes: { lastUpdatedAt: Date.now() } }, { collection: CardCollection }));
    };

    return {
      /** write methods **/
      setFilterQuery(query: string): void {
        patchState(store, {
          filterQuery: query.trim()
        });
      },
      selectCard(cardId: Id | null): void {
        patchState(store, {
          selectedCardId: cardId,
        });
      },
      addCard(listId: Id, cardInput: CreateCardInput): Id {
        const targetId = crypto.randomUUID();
        const newCard: Card = {id: targetId, ...cardInput, lastUpdatedAt: Date.now()};

        patchState(store, (state) => {
          const targetList = listById(listId, state.lists);
          if (!targetList) {
            throw new Error("The list does not exist");
          }
          return {
            lists: state.lists.map((l) =>
              l.id === listId ? {...l, cardIds: [...l.cardIds, targetId]} : l
            ),
          };
        }, addEntity(newCard,{collection: CardCollection}));
        return targetId;
      },
      removeCard(cardId: Id): void {
        const cardsValue = cards();
        const listsValue = lists();

        const cardExists = cardsValue[cardId] !== undefined;
        const nextLists = removeCardInLists(cardId, listsValue);
        const shouldClearSelection = selectedCardId() === cardId;


        if (!cardExists && nextLists === listsValue && !shouldClearSelection) return;
        if (ngDevMode && !cardExists && nextLists !== listsValue) {
          throw new Error(`Invariant broken: card ${cardId} missing from cards but exists in lists`);
        }

        patchState(store, (state) => {
          const updates: Partial<BoardState> = {};

          if (nextLists !== state.lists) {
            updates.lists = nextLists;
          }

          if (shouldClearSelection) {
            updates.selectedCardId = null;
          }

          return updates;
        }, removeEntity(cardId, {collection: CardCollection}));
      },
      addList(title: string): void {
        patchState(store, ({lists}) =>  {
          return {
            lists: [
              ...lists,
              {
                id: crypto.randomUUID(),
                title: title,
                cardIds: []
              }
            ]
          }
        })
      },
      updateCard(cardId: Id, updates: CardUpdateInput): void {
        const cardsValue = cards();
        const card = cardById(cardId, cardsValue);

        if(!card){
          const listsValue = lists();
          const listsRepaired = removeCardInLists(cardId, listsValue);
          if(listsRepaired !== listsValue){
            patchState(store, { lists: listsRepaired });

            if(ngDevMode){
              throw new Error(`the card ${cardId} is missing from cards but exists in lists`);
            }
          }
          return;
        }

        patchState(store, updateEntity({id: cardId, changes: {
            ...updates,
            lastUpdatedAt: Date.now()
        }}, {collection: CardCollection}))
      },
      moveCard,
      loadBoard: rxMethod<Id>(
        pipe(
          tap(() => patchState(store, {
            loading: true
          })),
          switchMap((id) => {
            const cached = getPersistedState();
            if(cached){
              return of(cached)
            } else {
              return timer(1000).pipe(
                map(() => ({
                  ...MOCK_BOARD_STATE,
                  boardId: id,
                  cardEntityMap: MOCK_CARDS
                }))
              )
            }
          }),
          tapResponse({
              next: (data) => {
                const {cardEntityMap, ...rest} = data;
                return patchState(store, {
                  ...rest,
                  loading: false,
                }, setEntities(Object.values(cardEntityMap), {collection: CardCollection}));
              },
              error: (error) => {
                _notificationService.error('An error occured during the initialization of the board', error);
                patchState(store, {loading: false})
              }
            })
        )
      ),
      undo: () => {
        const historyValue = history();
        const futureValue = future();

        if(!historyValue.length){
          return;
        }

        const lastElement = historyValue.at(-1);

        if(!lastElement){
          return;
        }

        const newFutureValue = [...futureValue, lastElement] ;

        moveCard(lastElement.cardId, lastElement.fromListId, lastElement.fromIndex, false);

        patchState(store, {
          future: newFutureValue,
          history: historyValue.slice(0,-1)
        });

      },
      redo: () => {
        const historyValue = history();
        const futureValue = future();

        if(!futureValue.length){
          return;
        }

        const lastElement = futureValue.at(-1);
        if(!lastElement){
          return;
        }

        const newHistoryValue = [...historyValue, lastElement] ;

        moveCard(lastElement.cardId, lastElement.toListId, lastElement.toIndex, false);

        patchState(store, {
          future: futureValue.slice(0,-1),
          history: newHistoryValue
        });
      }
    }
  }),
  withHooks({
    onInit: (store) => {
      const {loadBoard} = store;
      loadBoard(MOCK_BOARD_STATE.boardId);
    },
  }),
);
