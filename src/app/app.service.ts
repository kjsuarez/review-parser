import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map } from "rxjs/operators";

import { environment } from '../environments/environment';
const BACKEND_URL = environment.apiUrl + "/";

@Injectable({
  providedIn: 'root'
})

export class AppService {
  constructor(private http: Http, private httpClient: HttpClient){}

  getAppStoreApps(keyword){
    console.log("url: " + BACKEND_URL + 'app-store-api/itunes-affiliate-serch/' + keyword)
    return this.httpClient.get(BACKEND_URL + 'app-store-api/itunes-affiliate-serch/' + keyword)
    .pipe(
      map((response: any) => {
        return response.obj;
      })
    )
  }

  getAppStoreReviews(id){
    return this.httpClient.get(BACKEND_URL + 'app-store-api/reviews/' + id)
    .pipe(
      map((response: any) => {
        return response.obj;
      })
    )
  }
}
