import { Injectable } from '@angular/core';
import { Storage } from  '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private accessTokenStorageName: string = "accessToken";

  constructor(private storage: Storage) { }

  public store(key: string, value): Promise<any> {
    return this.storage.set(key, value);
  }

  public retrieve(key: string): Promise<any> {
    return this.storage.get(key);
  }

  public getAccessTokenName(): string {
    return this.accessTokenStorageName;
  }

  public clean(): Promise<any> {
    return this.storage.clear();
  }
}
