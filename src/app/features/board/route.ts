import {Routes} from '@angular/router';
import {BOARD_ROUTES} from './route.constant';
import {BoardPage} from './page/board-page';

export const boardRoutes: Routes = [
  {
    path: BOARD_ROUTES.BOARD,
    component: BoardPage
  }
];
