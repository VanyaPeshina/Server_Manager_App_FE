import { Component } from '@angular/core';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from './enum/data-state.enum';
import { AppState } from './interface/app-state';
import { CustomResponse } from './interface/custom-response';
import { ServerService } from './service/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  appState$: Observable<AppState<CustomResponse>> | undefined;
  constructor(private serverService: ServerService) {}

  ngOnInit(): void {
    this.appState$ = this.serverService.servers$
      .pipe(
        // it will take time to get the response from the BE
        // so we provide the startWith while the return statement is ready
        map(response => {
          return { dataState: DataState.LOADED_STATE, appData: response }
        }),
        // the starttWIth will provide the LOADING_STATE dataState
        // while we're waiting for the response
        startWith({ dataState: DataState.LOADING_STATE }),
        // whenever we get an error
        catchError((error: string) => {
          // if we catch an error we will return an Observable 
          // (of({Object}) is a short way to return an Observable)
          return of({ dataState: DataState.ERROR_STATE, error })
        })
      )
  }
}
