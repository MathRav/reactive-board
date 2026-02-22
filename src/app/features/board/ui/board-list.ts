import {Component, input, model, output} from '@angular/core';
import {ListVm} from '../store/board-state.types';
import {BoardCard} from './board-card';
import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import {Id} from '@core/store/entity-base.type';
import {Button} from 'primeng/button';
import {CreateCardInput} from '../store/board-actions.type';
import {Dialog} from 'primeng/dialog';
import {BoardCardFormModal} from './board-card-form-modal/board-card-form-modal';

@Component({
  selector: 'board-list,[board-list]',
  templateUrl: 'board-list.html',
  imports: [
    BoardCard,
    CdkDropList,
    Button,
    Dialog,
    BoardCardFormModal,
    CdkDrag,
  ],
  host: {
    class: 'w-[400px] max-w-[100vw] flex flex-col rounded-3xl p-4 w-80 shrink-0 h-full max-h-screen bg-slate-50/50 rounded-2xl border border-slate-200/60 shadow-sm'
  }
})
export class BoardList {
  readonly dropped = output<{cardId: Id,currentIndex: number}>();
  readonly addCard = output<CreateCardInput>();
  readonly removeCard = output<Id>();

  readonly list = input.required<ListVm>();

  readonly cardCreateModalVisible = model(false);

  internalDrop(event: CdkDragDrop<ListVm>): void {
    const cardId = event.previousContainer.data.cards[event.previousIndex].id;
    if(!cardId){
      if(ngDevMode){
        console.error('you are trying to move a card that does not exist , try to fix the code');
      }
      return;
    }
    this.dropped.emit({
      cardId,
      currentIndex: event.currentIndex,
    });
  }

  displayAddCardModal(): void {
    this.cardCreateModalVisible.set(true);
  }

  addCardAction(data: CreateCardInput): void {
    this.cardCreateModalVisible.set(false);
    this.addCard.emit(data);
  }
}
