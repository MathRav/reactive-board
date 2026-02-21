import {Component, input, output} from '@angular/core';
import {Card, StatusEnum} from '../store/board-state.types';
import {DatePipe, NgClass} from '@angular/common';
import {CdkDrag} from '@angular/cdk/drag-drop';
import {Button} from 'primeng/button';
import {BoardChip} from './board-chip/board-chip';

@Component({
  selector: 'board-card',
  templateUrl: 'board-card.html',
  imports: [
    NgClass,
    DatePipe,
    Button,
    BoardChip,
  ],
  host: {
    class: 'rounded-md group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-300'
  },
  hostDirectives: [CdkDrag]
})
export class BoardCard {
  onDelete = output();
  card = input.required<Card>();

  statusClasses: Record<string, string> = {
    [StatusEnum.TODO]: 'bg-slate-100 text-slate-700 border-slate-200',
    [StatusEnum.DOING]: 'bg-blue-100 text-blue-700 border-blue-200',
    [StatusEnum.DONE]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };
}
