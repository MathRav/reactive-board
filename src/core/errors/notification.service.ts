import {ErrorHandler, inject, Injectable, signal} from '@angular/core';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly _messageService = inject(MessageService);
  private readonly _errorHandler = inject(ErrorHandler);

  error(msg: string,  exception: unknown): void {
    this._messageService.add({ severity: 'error', summary: msg });
    if(exception){
      this._errorHandler.handleError(exception);
    }
  }
}
