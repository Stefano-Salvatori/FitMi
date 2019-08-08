import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { serverAddress, serverBaseUrl } from '../server-data';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  private baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = serverAddress + serverBaseUrl;
  }

  post(path, payload): Observable<any> {
    return this.httpClient.post(this.baseUrl + path, payload, httpOptions);
  }

  get(path)  {
    return this.httpClient.get(this.baseUrl + path, httpOptions);
  }
}
