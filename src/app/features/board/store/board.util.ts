import {Id} from '@core/store/entity-base.type';
import {BoardState, Card, List} from './board-state.types';
import {CardUpdateInput} from './board-actions.type';

export const cardById =  (id: Id, cards: BoardState['cards']): Card | null => cards[id] ?? null;
export const listById =  (id: Id,lists: BoardState['lists']): List | null => lists.find((list) => list.id === id) ?? null;
export const listByCardId =  (cardId: Id, lists: BoardState['lists']): List | null => lists.find((list) => list.cardIds.includes(cardId)) ?? null;

export const removeCardInList = (cardId: Id, list: List): List => {
  if(!list.cardIds.includes(cardId)){
    return list;
  }

  return {
    ...list,
    cardIds: list.cardIds.filter((cardIdInFilter) => cardIdInFilter !== cardId)
  };
}

export const removeCardInLists = (cardId: Id, lists: BoardState['lists']): BoardState['lists'] => {
  let changed = false;

  const newList = lists.map((listInMap) => {
      const updatedList = removeCardInList(cardId, listInMap);
      if(updatedList !== listInMap){
        changed = true;
      }
      return updatedList;
  });

  return changed ? newList : lists;
};

export const moveCardInList = (
  cardId: Id,
  targetList: List,
  index?: number
): List => {
  const source = targetList.cardIds;
  const result: Id[] = [];

  const clampedIndex =
    index == null || index > source.length
      ? source.length
      : index;

  let inserted = false;

  for (let i = 0; i < source.length; i++) {
    if (i === clampedIndex && !inserted) {
      result.push(cardId);
      inserted = true;
    }

    const current = source[i];
    if (current !== cardId) {
      result.push(current);
    }
  }

  // insert at end if needed
  if (!inserted) {
    result.push(cardId);
  }

  // structural equality check
  if (
    result.length === source.length &&
    result.every((id, i) => id === source[i])
  ) {
    return targetList; // preserve reference
  }

  return {
    ...targetList,
    cardIds: result,
  };
};


export const updateListElement = (listToUpdate: List, lists: BoardState['lists']): BoardState['lists'] => lists.map((listInMap) => listInMap.id === listToUpdate.id ? listToUpdate : listInMap);

export const updateCardData = (
  card: Card, updates: CardUpdateInput, now = Date.now): Card => {
  let changed = false;
  const clean = {} as Partial<Pick<Card, keyof CardUpdateInput>>;

  for (const k of Object.keys(updates) as (keyof CardUpdateInput)[]) {
    const v = updates[k];
    if (v === undefined) continue;
    if (card[k] !== v) changed = true;
    (clean as Record<string, unknown>)[k] = v;
  }

  if (!changed) return card;

  return {
    ...card,
    ...clean,
    lastUpdatedAt: now(),
  };
};
