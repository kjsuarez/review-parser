import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
    let params = new HttpParams();
    params = params.append('keyword', keyword);
    console.log("url: " + BACKEND_URL + 'app-store-api/itunes-affiliate-search/' + keyword)
    return this.httpClient.get(BACKEND_URL + 'app-store-api/itunes-affiliate-search/' + keyword, { params })
    .pipe(
      map((response: any) => {
        return response.obj;
      })
    )
  }

  mockAppStoreApps(id){
    return [{id: 1, name: "meep"},{id: 2, name: "morp"},{id: 3, name: "meepmorp"},{id: 4, name: "sheepshmorp"}]
  }

  getPlayStoreApps(keyword){
    let params = new HttpParams();
    params = params.append('keyword', keyword);
    console.log("url: " + BACKEND_URL + 'play-store-api/play-store-search/' + keyword)
    return this.httpClient.get(BACKEND_URL + 'play-store-api/play-store-search/' + keyword, { params })
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

  getAppStoreReviewStats(id){
    return this.httpClient.get(BACKEND_URL + 'app-store-api/review-breackdown/' + id)
    .pipe(
      map((response: any) => {
        return response.obj;
      })
    )
  }

  mockAppStoreReviewStats(id){
    return {
      badReviewCount: 100,
      badReviewPercentage: 30,
      powerCount: 10,
      powerPercentage: 10,
      performanceCount: 20,
      performancePercentage: 20
    }
  }

  getPlayStoreReviewStats(id){
    return this.httpClient.get(BACKEND_URL + 'play-store-api/review-breackdown/' + id)
    .pipe(
      map((response: any) => {
        return response.obj;
      })
    )
  }
}
