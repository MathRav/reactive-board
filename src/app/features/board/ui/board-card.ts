import {Component, input, output} from '@angular/core';
import {Card, StatusEnum} from '../store/board-state.types';
import {DatePipe, NgClass} from '@angular/common';
import {Button} from 'primeng/button';
import {BoardChip} from './board-chip/board-chip';
import {CdkDragPlaceholder} from '@angular/cdk/drag-drop';

@Component({
  selector: 'board-card',
  templateUrl: 'board-card.html',
  imports: [
    NgClass,
    DatePipe,
    Button,
    BoardChip,
    CdkDragPlaceholder,
  ],
  host: {
    class: 'rounded-md flex flex-col group relative overflow-hidden rounded-xl border border-slate-200 !bg-white !p-5 shadow-sm transition-[box-shadow,border-color] hover:shadow-md hover:border-blue-300'
  }
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
