import { Injectable } from '@angular/core';

import * as sha512 from 'js-sha512';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() { }

  sha512(plain: string): string {
    return sha512.sha512(plain);
  }
}
