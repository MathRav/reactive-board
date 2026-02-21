import {Component, input} from '@angular/core';
import {FieldState} from '@angular/forms/signals';
import {Message} from 'primeng/message';

@Component({
  selector: 'error-message',
  imports: [
    Message
  ],
  templateUrl: 'error-message.html',
  host: {
    class: 'w-full'
  }
})
export class ErrorMessage {
  control = input.required<FieldState<unknown>>();
}
