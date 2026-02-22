import {Component, inject} from '@angular/core';
import {BoardStore} from '../store/board.store';
import {BoardList} from '../ui/board-list';
import {CdkDropListGroup} from '@angular/cdk/drag-drop';
import {BoardListAdd} from '../ui/board-list-add';
import {CreateCardInput} from '../store/board-actions.type';
import {Id} from '@core/store/entity-base.type';
import {CdkScrollable} from '@angular/cdk/overlay';

@Component({
  selector: 'board',
  templateUrl: 'board-page.html',
  providers: [BoardStore],
  imports: [
    BoardList,
    BoardListAdd
  ],
  host: {
    class: 'flex gap-2 min-w-full h-[100vh] p-4 bg-slate-200 pb-25',
  },
  hostDirectives: [CdkDropListGroup, CdkScrollable]
})
export class BoardPage {
  readonly #store = inject(BoardStore);
  readonly lists = this.#store.listsVm;

  createList({title}: {title: string}): void {
    this.#store.addList(title);
  }

  addCard(listId:Id, input: CreateCardInput): void {
    this.#store.addCard(listId,input);
  }

  moveCard(targetListId: Id, cardId: Id, newIndex: number): void {
    this.#store.moveCard(cardId, targetListId, newIndex);
  }
}
