import {signalStoreFeature, withProps} from '@ngrx/signals';
import {inject} from '@angular/core';
import {NotificationService} from '@core/errors/notification.service';

export function withNotifications() {
  return signalStoreFeature(
    withProps(() => ({
      _notificationService: inject(NotificationService)
    }))
  );
}
