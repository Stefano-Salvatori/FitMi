import { Injectable } from '@angular/core';
import { Storage } from  '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private accessTokenStorageName: string = "accessToken";

  constructor(private storage: Storage) { }

  public store(key: string, value) {
    this.storage.set(key, value);
  }

  public retrieve(key: string) {
//this.storage.clear();
    return this.storage.get(key);
  }

  public getAccessTokenName(): string {
    return this.accessTokenStorageName;
  }
}
