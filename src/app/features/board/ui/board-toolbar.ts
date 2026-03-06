import {Component, input, output} from '@angular/core';
import {Button} from 'primeng/button';

@Component({
  selector: 'board-toolbar',
  templateUrl: 'board-toolbar.html',
  imports: [
    Button
  ],
  host: {
    class: 'flex gap-1'
  }
})
export class BoardToolbar {
  readonly onUndo = output();
  readonly onRedo = output();

  readonly canUndo = input.required<boolean>();
  readonly canRedo = input.required<boolean>();
}
