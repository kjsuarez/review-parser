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

  getAppStoreApps(keyword, region = 'us'){
    let params = new HttpParams();
    params = params.append('region', region);
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

  getPlayStoreApps(keyword, region = 'us'){
    let params = new HttpParams();
    params = params.append('region', region);
    console.log("region: " + region)
    return this.httpClient.get(BACKEND_URL + 'play-store-api/play-store-search/' + keyword, { params })
    .pipe(
      map((response: any) => {
        return response.obj;
      })
    )
  }

  getAppStoreReviews(id, region = 'us'){
    let params = new HttpParams();
    params = params.append('region', region)
    return this.httpClient.get(BACKEND_URL + 'app-store-api/reviews/' + id, { params })
    .pipe(
      map((response: any) => {
        return response.obj;
      })
    )
  }

  getAppStoreReviewStats(id, region = 'us'){
    let params = new HttpParams();
    params = params.append('region', region)
    return this.httpClient.get(BACKEND_URL + 'app-store-api/review-breackdown/' + id, { params })
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

  getPlayStoreReviewStats(id, region = 'en'){
    let params = new HttpParams();
    params = params.append('language', region)
    return this.httpClient.get(BACKEND_URL + 'play-store-api/review-breackdown/' + id, { params })
    .pipe(
      map((response: any) => {
        return response.obj;
      })
    )
  }
}
