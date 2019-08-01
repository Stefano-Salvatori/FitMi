import { Injectable } from '@angular/core';
import { Observable } from  'rxjs';
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

  post(url, payload): Observable<any> {
    return this.httpClient.post(this.baseUrl + url, payload, httpOptions);
  }
}
