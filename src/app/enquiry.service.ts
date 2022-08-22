import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiConstants } from 'src/ApiConstants';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  constructor(private configService : ConfigService,private _http: HttpClient) { }
  
  sendEMailAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.SEND_EMAIL_API, requestObject).pipe(map(data => data, error => error));
  }

  sendAppLinkSMSAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.SEND_APP_LINK_SMS_API, requestObject).pipe(map(data => data, error => error));
  }

  fetchAppLinkAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FETCH_APP_LINK_API, requestObject).pipe(map(data => data, error => error));
  }
}
