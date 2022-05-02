import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { stat } from "fs";
import { catchError, Subscriber, tap, throwError } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { Status } from "../enum/status.enums";
import { CustomResponse } from "../interface/custom-response";
import { Server } from "../interface/server";

@Injectable({ providedIn: 'root'})
export class ServerService {

    // with the injection of the HttpClient (which comes from the HttpClientModule from the app.module.ts)
    // we can make a call to the backend service to retrieve data and map data to our application
    constructor(private http: HttpClient) {}

    // this is a one way to declare a observable
    /* getServers(): Observable<CustomResponse> {
        return this.http.get<CustomResponse>(`http://localhost:8080/server/list`);
    }*/

    // get a list of servers
    private readonly apiUrl = 'http://localhost:8080';
    servers$ = this.http.get<CustomResponse>(`${this.apiUrl}/server/list`)
    .pipe(
        tap(console.log),
        catchError(this.handleError)
    );
    
    // save a server
    // the post request needs a request body (which will be the server)
    // so this Observable will take a server of type Server as a parameter
    // and with the arrow function => we make the Observable itself
    save$ = (server: Server) => this.http.post<CustomResponse>(`${this.apiUrl}/server/save`, server)
    .pipe(
        tap(console.log),
        catchError(this.handleError)
    );

    // ping a server
    ping$ = (ipAdress: string) => this.http.get<CustomResponse>(`${this.apiUrl}/server/ping/${ipAdress}`)
    .pipe(
        tap(console.log),
        catchError(this.handleError)
    );

    // delete a server
    delete$ = (serverId: number) => this.http.delete<CustomResponse>(`${this.apiUrl}/server/delete/${serverId}`)
    .pipe(
        tap(console.log),
        catchError(this.handleError)
    );

    // filter a server
    filter$ = (status: Status, response: CustomResponse) => new Observable<CustomResponse>(
        subscriber => { 
            console.log(response);
            subscriber.next(
                // if the status is ALL we return the first message
                // if it is someting else we return the message from line 62 to 72
                status === Status.ALL ? { ...response, message: `Servers filtered by ${status} status`} : 
                {
                    ...response, 
                    message: response.data.servers
                    .filter(server => server.status === status).length > 0 ?
                    `Server filtered by ${status === Status.SERVER_UP ? 'SERVER UP' : 'SERVER DOWN'} status` :
                    `No servers of ${status} found`,
                    data: { servers: response.data.servers.filter(server => server.status === status)}
                }
            );
            subscriber.complete();
        }
    )
    .pipe(
        tap(console.log),
        catchError(this.handleError)
    );

    private handleError(error: HttpErrorResponse): Observable<never> {
        console.log(error);
       return throwError(`An error occured - Error code: ${error.status}`);
    }
}