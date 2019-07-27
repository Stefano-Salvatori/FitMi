import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  private baseUrlPrefix: string = "http://";
  private baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = 'http://' + serverAddress + serverBaseUrl;
  }
}
