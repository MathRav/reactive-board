import {signalStoreFeature, StateSignals, withHooks, withMethods, withProps} from '@ngrx/signals';
import {effect, inject} from '@angular/core';
import {LocalStorageService} from '@core/local-storage/local-storage.service';
import {NotificationService} from '@core/errors/notification.service';


export function withPersistence<State extends object, T extends object>(
  key: string,
  select: (state: StateSignals<State>) => T,
  version: number = 1
) {
  return signalStoreFeature(
    withProps(() => ({
      _localStorage: inject(LocalStorageService),
    })),
    withMethods(({_localStorage}) => ({
      getPersistedState: (): T | null => {
        try{
          const data = _localStorage.get<{ data: T , version: number}>(key);
          if(data && data?.data && version === data.version){
            return data.data;
          } else {
            _localStorage.remove(key);
            return null;
          }
        }
        catch (error){
          if(ngDevMode){
            console.log("Error parsing local storage data");
          }
          return null;
        }
      }
    })),
    withHooks({
      onInit(store){
        const notificationService = inject(NotificationService);
        const {_localStorage, ...state} = store;

        effect(() => {
          try{
            const data = select(state as unknown as StateSignals<State>) as T;
            _localStorage.set(key, {
              data,
              version
            });
          }
          catch (error){
            notificationService.error('An error occured when saving data to local storage', error);
          }
        });
      }
    })
  );
}
