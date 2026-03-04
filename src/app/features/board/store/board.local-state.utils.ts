import {BoardState} from './board-state.types';

export const BOARD_LOCAL_STATE_KEY = 'BOARD_STATE';


export type BoardLocalState = Pick<BoardState, 'cards' | 'lists' | 'filterQuery'>;
