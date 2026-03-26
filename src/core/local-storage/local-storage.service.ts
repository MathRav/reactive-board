import {inject, Injectable} from '@angular/core';
import {LOCAL_STORAGE} from '@core/local-storage/local-storage.token';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly localStorage = inject(LOCAL_STORAGE);

  set(key: string, value: unknown): void {
    this.localStorage.setItem(key, JSON.stringify(value));
  }

  get<T>(key: string): T | null {
    const item = this.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  remove(key: string){
    this.localStorage.removeItem(key);
  }
}
