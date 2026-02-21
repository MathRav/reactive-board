import {Component, inject, model, output} from '@angular/core';
import {BoardListAddModal} from './board-list-add-modal';
import {Dialog} from 'primeng/dialog';
import {Button} from 'primeng/button';
import {InViewDirective} from '../../../directives/in-view.directive';

@Component({
  selector: 'board-list-add',
  imports: [BoardListAddModal, Dialog, Button],
  hostDirectives: [InViewDirective],
  templateUrl: 'board-list-add.html',
  host: {
    class: 'h-full flex justify-center items-center p-4 rounded-3xl border-dashed'
  }
})
export class BoardListAdd {
  readonly visible = model(false);
  readonly listCreated = output<{title: string}>();
  readonly isInView = inject(InViewDirective).isInView;

  create(title: string): void {
    this.listCreated.emit({title});
    this.visible.set(false);
  }
}
