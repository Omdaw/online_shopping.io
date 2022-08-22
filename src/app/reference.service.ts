import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiConstants } from 'src/ApiConstants';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {

  constructor(private configService : ConfigService,
              private _http: HttpClient) { }

  public fetchReferralURLBySubscriberIdAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.fetchReferralURLBySubscriberIdAPI, requestObject).pipe(map(data => data, error => error));
  }

  public updateSubscriberReferralAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.updateSubscriberReferralAPI, requestObject).pipe(map(data => data, error => error));
  }

  public genarateReferralCodeApi(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.GENERATE_REFERRAL_CODE_API, requestObject).pipe(map(data => data, error => error));
  }

}
