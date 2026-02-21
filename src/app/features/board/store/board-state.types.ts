import {EntityBase, Id} from '@core/store/entity-base.type';

export const StatusEnum = {
  TODO:'TODO',
  DOING:'DOING',
  DONE: 'DONE'
} as const;

export type StatusEnum = typeof StatusEnum[keyof typeof StatusEnum];

export type Card = EntityBase & {
  title: string;
  description: string;
  priority: number | null;
  labels: string[];
  assignee: string | null;
  dueDate: number | null;
  status: StatusEnum;
  lastUpdatedAt: number;
};

export type List = EntityBase &  {
  title: string;
  cardIds: Id[];
};

export type ListVm = EntityBase & Pick<List, 'title'> & {
  cards: Card[]
}
export interface BoardState {
  lists: List[];
  cards: Record<Id, Card>;
  boardId: Id | null;
  selectedCardId: Id | null;
  filterQuery: string;
}

