import {Component, input, linkedSignal, output} from '@angular/core';
import {form, FormField} from '@angular/forms/signals';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';

@Component({
  selector: 'board-card-search',
  templateUrl: 'board-card-search.html',
  imports: [
    InputText,
    Button,
    FormField
  ],
  host: {
    class: 'w-full flex flex-col gap-1',
  }
})
export class BoardCardSearch {
  readonly keywordUpdated = output<string>();
  readonly initialValue = input<string>();
  readonly linkedKeyword = linkedSignal(() => this.initialValue() ||'');

  readonly searchForm = form(this.linkedKeyword);

  search(): void {
    this.keywordUpdated.emit(this.searchForm().value());
  }

  reset(): void {
    this.searchForm().setControlValue('');
    this.keywordUpdated.emit('');
  }
}
