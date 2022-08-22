import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConstants } from 'src/ApiConstants';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private configService : ConfigService,
              private _http         : HttpClient) { }


  createReviewAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.CREATE_REVIEW_API, requestObject)
                     .pipe(map(data => data, error => error));
  }

  updateReviewAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.UPDATE_REVIEW_API, requestObject)
                     .pipe(map(data => data, error => error));
  }

  fetchReviewAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FETCH_REVIEW_API, requestObject)
                     .pipe(map(data => data, error => error));
  }
}
