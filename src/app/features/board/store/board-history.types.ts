import {Id} from '@core/store/entity-base.type';

export type MoveRecord = {
  cardId: Id;
  fromListId: Id;
  fromIndex: number;
  toListId: Id;
  toIndex: number;
}

export type MoveHistory = {
  history: MoveRecord[];
  future: MoveRecord[];
}
