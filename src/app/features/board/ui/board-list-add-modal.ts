import {Component, output, signal} from '@angular/core';
import {IftaLabel} from 'primeng/iftalabel';
import {InputText} from 'primeng/inputtext';
import {form, FormField, required} from '@angular/forms/signals';
import {Button} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ErrorMessage} from '../../../forms/ui/error-message';

@Component({
  selector: 'board-list-add-modal',
  imports: [
    IftaLabel,
    InputText,
    FormField,
    Button,
    FormsModule,
    ErrorMessage,
  ],
  templateUrl: 'board-list-add-modal.html',
  host: {
    class: 'w-full flex flex-col p-4 gap-4',
  },
})
export class BoardListAddModal {
  readonly created = output<{title: string}>();
  readonly closed = output<void>();
  readonly hasAttemptedSubmit = signal(false);

  readonly listAddFormModel = signal<{title: string}>({
    title: ''
  });

  readonly loginForm = form(this.listAddFormModel, (schemaPath) => {
    required(schemaPath.title, {message: 'The field title is required'});
  });

  create(): void {
    this.hasAttemptedSubmit.set(true);
    this.loginForm.title().markAsTouched();
    if(this.loginForm().invalid()){
      return;
    }
    this.created.emit(this.listAddFormModel());
  }

  close(): void {
    this.closed.emit();
  }
}
