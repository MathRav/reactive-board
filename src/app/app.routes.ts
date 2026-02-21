import { Routes } from '@angular/router';
import {boardRoutes} from './features/board/route';
import {ROUTES} from './routes';

export const routes: Routes = [
  ...boardRoutes,
  {
    path: '',
    redirectTo: ROUTES .BOARD,
    pathMatch: 'full'
  }
];
