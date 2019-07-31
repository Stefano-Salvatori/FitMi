import { Injectable } from '@angular/core';

import { Storage } from  '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }

  public store(key: string, value) {
    this.storage.set(key, value);
  }

  public retrieve(key: string): Promise<string> {
    return this.storage.get(key);
  }
}
