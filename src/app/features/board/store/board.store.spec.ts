import {describe, expect, vi} from 'vitest';
import {BoardState} from './board-state.types';
import {TestBed} from '@angular/core/testing';
import {BoardStore} from './board.store';
import {patchState} from '@ngrx/signals';
import {unprotected} from '@ngrx/signals/testing';
import {cardMockFactory, listMockFactory} from './board.mock';
import {CardUpdateInput, CreateCardInput} from './board-actions.type';

describe('BoardStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });


  const setup =  (
    {
      cards,
      lists
    }: {
      cards: BoardState['cards'],
      lists: BoardState['lists']
    }
  ) => {
    TestBed.configureTestingModule({
      providers: [
        BoardStore
      ],
    });

    const boardStore =  TestBed.inject(BoardStore);

    patchState(unprotected(boardStore), {
      cards,
      lists
    });

    return boardStore;
  }

  describe('addCard', () => {
    it('should add the card to the card list and to the corresponding list', () => {
      const card1 = cardMockFactory();
      const card2 = cardMockFactory();

      const list1= listMockFactory(`${card2.id}|${card1.id}`);
      const list2= listMockFactory();

      const cardElements = {
        [card1.id]: card1,
        [card2.id]: card2
      };

      const store = setup({
        lists: [list1,list2],
        cards: cardElements
      });

      const cardInput: CreateCardInput = {
        labels: [],
        dueDate: Date.now(),
        title: 'test',
        assignee: null,
        priority: null,
        status: 'TODO',
        description: ''
      };

      store.addCard(list2.id, cardInput);

      const secondListItems = store.lists()[1]?.cardIds;
      const newAddedCardId = Object.keys(store.cards()).find((cardId) => ![card1.id, card2.id].includes(cardId));
      if(!newAddedCardId){
        expect.fail('the card you tried to add does not exists in store.cards()');
      }
      const newAddedCard = store.cards()[newAddedCardId];

      expect(Object.keys(store.cards()).length, 'the card list size has not increased').toEqual(3);
      expect(secondListItems.length, 'the target list length has not increased').toEqual(1);
      expect(secondListItems[0], 'the added element in the target list is not the expected card').toEqual(newAddedCardId);
      expect(newAddedCard,  'the newly created card does not contain the elements you added').toEqual(expect.objectContaining(cardInput));
    })
  })
  describe('removeCard', () => {
    it('should remove the card from every card list', () => {
      const card1 = cardMockFactory();
      const card2 = cardMockFactory();

      const cardElements = {
        [card1.id]: card1,
        [card2.id]: card2
      };

      const store = setup({
        lists: [
          listMockFactory(`${card2.id}|${card1.id}`),
          listMockFactory(),
          listMockFactory(`${card2.id}`),
        ],
        cards: cardElements
      });

      store.removeCard(card2.id);
      expect(store.lists()).toEqual([
        expect.objectContaining({
          cardIds: [card1.id]
        }),
        expect.objectContaining({
          cardIds: []
        }),
        expect.objectContaining({
          cardIds: []
        })
      ])
    })
  })
  describe('updateCard', () => {
    it('should update the corresponding card', () => {
      const card1 = cardMockFactory();
      const card2 = cardMockFactory();

      const cardElements = {
        [card1.id]: card1,
        [card2.id]: card2
      };

      const update: CardUpdateInput = {
        status: 'DONE',
        description: 'description updated',
        priority: 1,
        title: 'titre',
        assignee: 'mathias',
        dueDate: null,
        labels: []
      }

      const store = setup({
        lists: [
          listMockFactory(`${card2.id}|${card1.id}`),
        ],
        cards: cardElements
      });

      const mockDate = new Date('2022-01-01T00:00:00Z');
      vi.setSystemTime(mockDate);

      store.updateCard(card1.id, update);

      expect(store.cards()[card1.id]).toEqual({
        ...card1,
        ...update,
        lastUpdatedAt: mockDate.getTime()
      })
    })
  })
  describe('moveCard', () =>  {
    it('should move the card to another list', () => {
      const card1 = cardMockFactory();
      const card2 = cardMockFactory();
      const card3 = cardMockFactory();
      const card4 = cardMockFactory();

      const cardElements = {
        [card1.id]: card1,
        [card2.id]: card2,
        [card3.id]: card3,
        [card4.id]: card4
      };

      const initialState = `${card2.id}|${card1.id}|${card4.id}`;

      const list1 = listMockFactory(initialState);
      const list2 =  listMockFactory(card3.id);

      const store = setup({
        lists: [
          list1,
          list2
        ],
        cards: cardElements
      });

      /** different list move / last position **/
      store.moveCard(card1.id,  list2.id);

      expect(store.lists()[1]?.cardIds.join('|')).toEqual(
        `${card3.id}|${card1.id}`
      );

      /** different list move / last position **/
      store.moveCard(card1.id,  list1.id);

      expect(store.lists()[0]?.cardIds.join('|')).toEqual(
        `${card2.id}|${card4.id}|${card1.id}`
      );

      /** different list move / first position **/
      store.moveCard(card1.id,  list2.id, 0);

      expect(store.lists()[1]?.cardIds.join('|')).toEqual(
        `${card1.id}|${card3.id}`
      );

      /** same list move / given position **/
      store.moveCard(card1.id,  list2.id, 1);

      expect(store.lists()[1]?.cardIds.join('|')).toEqual(
        `${card3.id}|${card1.id}`
      );

      /** same list move / last position **/
      store.moveCard(card1.id,  list2.id);

      expect(store.lists()[1]?.cardIds.join('|')).toEqual(
        `${card3.id}|${card1.id}`
      );
    })
  })
})
