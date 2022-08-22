import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiConstants } from 'src/ApiConstants';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})

export class HomePageService {
  
  constructor(private configService : ConfigService,
              private _http: HttpClient) { }

  fetchBannerByStoreIdAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.fetchBannerByStoreIdAPI, requestObject).pipe(map(data => data, error => error))
    // return this._http.post<any>(this.configService.getBaseURL() + ApiConstants.FetchBannerByInputId, requestObject).pipe(map(data => data, error => error))
  }
 
  fetchReviewAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FETCH_REVIEW_API, requestObject).pipe(map(data => data, error => error))
  }

  fetchStoreByIdAPI(pStoreId):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FetchStore, {STORE_ID:pStoreId}).pipe(map(data => data, error => error))
  }
}
