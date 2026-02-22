import {Component, inject} from '@angular/core';
import {BoardStore} from '../store/board.store';
import {BoardList} from '../ui/board-list';
import {CdkDropListGroup} from '@angular/cdk/drag-drop';
import {BoardListAdd} from '../ui/board-list-add';
import {CreateCardInput} from '../store/board-actions.type';
import {Id} from '@core/store/entity-base.type';
import {CdkScrollable} from '@angular/cdk/overlay';
import {BoardCardSearch} from '../ui/board-card-search';

@Component({
  selector: 'board',
  templateUrl: 'board-page.html',
  providers: [BoardStore],
  imports: [
    BoardList,
    BoardListAdd,
    BoardCardSearch
  ],
  host: {
    class: 'flex flex-col gap-2 min-w-full h-[100vh] bg-slate-200 pb-25',
  },
  hostDirectives: [CdkDropListGroup, CdkScrollable]
})
export class BoardPage {
  readonly #store = inject(BoardStore);
  readonly lists = this.#store.listsVm;
  readonly keyword=  this.#store.filterQuery;

  createList({title}: {title: string}): void {
    this.#store.addList(title);
  }

  setKeyword(keyword: string): void {
    console.log({
      keyword
    })
    this.#store.setFilterQuery(keyword);
  }

  addCard(listId:Id, input: CreateCardInput): void {
    this.#store.addCard(listId,input);
  }

  moveCard(targetListId: Id, cardId: Id, newIndex: number): void {
    this.#store.moveCard(cardId, targetListId, newIndex);
  }
}
