import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Http, Response, Headers } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map } from "rxjs/operators";
import { catchError } from 'rxjs/operators';

import { environment } from '../environments/environment';
const BACKEND_URL = environment.apiUrl + "/";
const HS_FORMS_URL = environment.hsFormsApiUrl;



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

  getRelevantAppStoreReviews(id, region = 'us') {
    let params = new HttpParams();
    params = params.append('region', region)
    return this.httpClient.get(BACKEND_URL + 'app-store-api/relevant-reviews/' + id, { params })
    .pipe(
      map((response: any) => {
        return response.obj;
      })
    )
  }

  getPlayStoreReviews(id, region = 'us'){
    let params = new HttpParams();
    params = params.append('region', region)
    return this.httpClient.get(BACKEND_URL + 'play-store-api/reviews/' + id, { params })
    .pipe(
      map((response: any) => {
        return response.obj;
      })
    )
  }

  getRelevantPlayStoreReviews(id, region = 'us') {
    let params = new HttpParams();
    params = params.append('region', region)
    return this.httpClient.get(BACKEND_URL + 'play-store-api/relevant-reviews/' + id, { params })
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
        // for touching db
        // this.saveAppStoreReviews(id).subscribe(response => { console.log(response) })
        return response.obj;
      })
    )
  }

  saveAppStoreReviews(appId, region='us') {
    let params = new HttpParams();
    params = params.append('region', region)
    return this.httpClient.post(BACKEND_URL + 'review-saver/update-reviews/' + appId + '/app', { params })
    .pipe(
      map((response: any) => {
        return response;
      })
    )
  }

  savePlayStoreReviews(appId, region='us') {
    let params = new HttpParams();
    params = params.append('region', region)
    return this.httpClient.post(BACKEND_URL + 'review-saver/update-reviews/' + appId + '/play', { params })
    .pipe(
      map((response: any) => {
        return response;
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
        // for touching db
        // this.savePlayStoreReviews(id).subscribe(response => { console.log(response) })
        return response.obj;
      })
    )
  }

  sendEmail(email) {
    const formUrl = HS_FORMS_URL;
    return this.http.post(formUrl, {fields: [{ name: "email", value: email}]})
  }

  wakeServer() {
    return this.httpClient.get(BACKEND_URL)
    .pipe(
      map((response: any) => {
        return "awake";
      }),
      catchError((response: any) => {
        console.log("error touching backend:")
        console.log(response)
        if(response.status >= 400 && response.status < 500) {
          return of("awake")
        } else {
          return of('error')
        }
      })
    )
  }
}
