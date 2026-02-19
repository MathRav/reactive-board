import {Card} from './board-state.types';

export type CreateCardInput = Omit<Card, 'id' | 'lastUpdatedAt'>;

export type CardUpdateInput = Partial<Omit<Card, 'id' | 'lastUpdatedAt'>>;
