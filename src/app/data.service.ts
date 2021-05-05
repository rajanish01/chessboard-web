import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse  } from '@angular/common/http';

import {  Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Move } from './domain/Move';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  baseURL: string = "http://localhost:3000/";

  constructor(private httpClient: HttpClient) { }

  public sendGetRequest(): Observable<any>{
    return this.httpClient.get(this.baseURL).pipe(retry(3),catchError(this.handleError));;
  }

  public sendPostRequest(move:Move): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    const body = JSON.stringify(move);
    console.log(body);
    return this.httpClient.post(this.baseURL,body,{'headers':headers}).pipe(retry(3),catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

}
