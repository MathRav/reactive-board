import {Component, inject} from '@angular/core';
import {BoardStore} from '../store/board.store';
import {BoardList} from '../ui/board-list';
import {CdkDropListGroup} from '@angular/cdk/drag-drop';
import {BoardListAdd} from '../ui/board-list-add';

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
  hostDirectives: [CdkDropListGroup]
})
export class BoardPage {
  readonly #store = inject(BoardStore);
  readonly lists = this.#store.listsVm;

  createList({title}: {title: string}): void {
    this.#store.addList(title);
  }
}
