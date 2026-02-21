import {BoardState, Card, ListVm} from './board-state.types';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {computed} from '@angular/core';
import {Id} from '@core/store/entity-base.type';
import {CardUpdateInput, CreateCardInput} from './board-actions.type';
import {
  cardById,
  listById,
  moveCardInList,
  removeCardInLists, updateCardData,
  updateListElement
} from './board.util';

const initialState: BoardState = {
  boardId: null,
  cards: {},
  filterQuery: '',
  lists: [],
  selectedCardId: null,
}

export const BoardStore = signalStore(
  withState(initialState),
  withComputed(({ lists, cards, selectedCardId, filterQuery }) => ({
    listsVm: computed((): ListVm[] => {
      const listsValue = lists();
      const q = filterQuery().trim();
      const cardsValue = cards();

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
      const cardsValue = cards();
      return id ? cardsValue[id] ?? null : null;
    }),
  })),
  withMethods((store) => {
    const {cards, selectedCardId, lists} = store;

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
            cards: {
              ...state.cards,
              [targetId]: newCard,
            },
            lists: state.lists.map((l) =>
              l.id === listId ? {...l, cardIds: [...l.cardIds, targetId]} : l
            ),
          };
        });
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

          if (state.cards[cardId] !== undefined) {
            const { [cardId]: _removed, ...rest } = state.cards;
            updates.cards = rest;
          }

          if (nextLists !== state.lists) {
            updates.lists = nextLists;
          }

          if (shouldClearSelection) {
            updates.selectedCardId = null;
          }

          return updates;
        });
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
      /**
       * @param cardId
       * @param toListId
       * @param index
       */
      moveCard(cardId: Id, toListId: Id, index?: number): void {
        const listsValue = lists();
        const cardsValue = cards();
        const initialTarget = listById(toListId, listsValue);

        if (!initialTarget) return;

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
        patchState(store, (state) => ({
          lists: updatedLists,
          cards: {
            ...state.cards,
            [cardId]: {
              ...state.cards[cardId],
              lastUpdatedAt: Date.now()
            }
          }
        }));
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

        const updatedCard: Card = updateCardData(card, updates);

        if(updatedCard === card){
          return;
        }

        patchState(store, (state) => ({
          cards: {
            ...state.cards,
            [cardId]: updatedCard,
          }
        }))
      }
    }
  })
);
