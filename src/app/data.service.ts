import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse  } from '@angular/common/http';

import {  Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Game } from './domain/Game';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseURL: string = "/chessweb/"

  constructor(private httpClient: HttpClient) { }

  public getNewGame(newGameConfig:Game): Observable<Game>{
    return this.postRequest(this.baseURL + "game",newGameConfig);
  }

  public getNextMove(game:Game): Observable<any>{
    return this.postRequest(this.baseURL + "game/next",game);
  }

  private postRequest(url:string,body:any): Observable<any>{
    const headers = { 'content-type': 'application/json'}  
    body = JSON.stringify(body);
    console.log(body);
    return this.httpClient.post(url,body,{'headers':headers}).pipe(catchError(this.handleError));   
  }

  private handleError(error: HttpErrorResponse) {
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
