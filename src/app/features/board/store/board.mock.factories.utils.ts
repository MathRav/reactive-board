import {Card, List} from './board-state.types';

export const listMockFactory = (
  cardIds?: string,
  title?: string
): List => ({
  id:  crypto.randomUUID(),
  cardIds: cardIds?.split('|') ?? [],
  title: title ?? 'mock list'
})

export const cardMockFactory = (
  cardId = crypto.randomUUID(),
  lastUpdatedAtFactory = Date.now,
  title?: string
): Card => ({
  id: cardId,
  title: title || `card ${cardId}`,
  lastUpdatedAt: lastUpdatedAtFactory(),
  status: "TODO",
  description: 'test card',
  priority: null,
  assignee: null,
  dueDate: Date.now(),
  labels: []
});
