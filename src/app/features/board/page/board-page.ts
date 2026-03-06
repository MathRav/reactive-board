import {Component, computed, inject, linkedSignal} from '@angular/core';
import {BoardStore} from '../store/board.store';
import {BoardList} from '../ui/board-list';
import {CdkDropListGroup} from '@angular/cdk/drag-drop';
import {BoardListAdd} from '../ui/board-list-add';
import {CardUpdateInput, CreateCardInput} from '../store/board-actions.type';
import {Id} from '@core/store/entity-base.type';
import {CdkScrollable} from '@angular/cdk/overlay';
import {BoardCardSearch} from '../ui/board-card-search';
import {ProgressSpinner} from 'primeng/progressspinner';
import {BoardCardFormModal} from '../ui/board-card-form-modal/board-card-form-modal';
import {Dialog} from 'primeng/dialog';
import {BoardToolbar} from '../ui/board-toolbar';

@Component({
  selector: 'board',
  templateUrl: 'board-page.html',
  providers: [BoardStore],
  imports: [
    BoardList,
    BoardListAdd,
    BoardCardSearch,
    ProgressSpinner,
    BoardCardFormModal,
    Dialog,
    BoardToolbar
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
  readonly loading = this.#store.loading;
  readonly selectedCard = this.#store.selectedCard;
  readonly canUndo = this.#store.canUndo;
  readonly canRedo = this.#store.canRedo;

  readonly hasSelectedCard = computed(() => Boolean(this.selectedCard()));

  createList({title}: {title: string}): void {
    this.#store.addList(title);
  }

  setKeyword(keyword: string): void {
    this.#store.setFilterQuery(keyword);
  }

  addCard(listId:Id, input: CreateCardInput): void {
    this.#store.addCard(listId,input);
  }

  moveCard(targetListId: Id, cardId: Id, newIndex: number): void {
    this.#store.moveCard(cardId, targetListId, newIndex);
  }

  removeCard(cardId: Id): void {
    this.#store.removeCard(cardId);
  }

  selectCard(cardId: Id | null): void {
    this.#store.selectCard(cardId);
  }

  updateCardAction(updateCardInput: CardUpdateInput): void {
    const selectedId = this.selectedCard()?.id;
    if(!selectedId){
      return;
    }
    this.#store.updateCard(selectedId, updateCardInput);
    this.#store.selectCard(null);
  }

  undo(): void {
    this.#store.undo();
  }

  redo(): void {
    this.#store.redo();
  }
}
