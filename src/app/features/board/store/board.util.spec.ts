import {describe, expect, it} from 'vitest';
import {listMockFactory} from './board.mock';
import {moveCardInList} from './board.util';

describe('BoardUtil', () => {
  describe('moveCardInList', () => {
    describe(
      `
       * given the card is already in the list
      `,
      () => {
        describe('but there is only one element', () => {
          describe(`with no given index`, () => {
            const cardId = '1';
            const list = listMockFactory(`${cardId}`);

            it('should move the card', () => {
              expect(moveCardInList(cardId, list)).toEqual(expect.objectContaining({
                cardIds: list.cardIds
              }));
            })
          })

          describe(`but there is only one element with an index 0`, () => {
            const cardId = '1';
            const list = listMockFactory(`${cardId}`);

            it('should move the card', () => {
              expect(moveCardInList(cardId, list, 0)).toEqual(expect.objectContaining({
                cardIds: list.cardIds
              }));
            })
          })

          describe(`but there is only one element with an index superior to the list index`, () => {
            const cardId = '1';
            const list = listMockFactory(`${cardId}`);

            it('should move the card', () => {
              expect(moveCardInList(cardId, list)).toEqual(expect.objectContaining({
                cardIds: list.cardIds
              }));
            })
          })

          describe(`but there is only one element with an index at the end of the list `, () => {
            const cardId = '1';
            const list = listMockFactory(`${cardId}`);

            it('should move the card', () => {
              expect(moveCardInList(cardId, list, 1)).toEqual(expect.objectContaining({
                cardIds: list.cardIds
              }));
            })
          })
        })

        describe('and there is more than one element',() => {
          describe(`with no given index`, () => {
            const cardId = '1';
            const list = listMockFactory(`${cardId}|2|3|4`);

            it('should move the card', () => {
              expect(moveCardInList(cardId, list)).toEqual(expect.objectContaining({
                cardIds: '2-3-4-1'.split('-')
              }));
            })
          })
        })
      }
    )
  })
})
