import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiConstants } from 'src/ApiConstants';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})

export class SignupService {

  constructor(private configService : ConfigService,
              private _http: HttpClient) { }

  subscriberRegistrationAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.subscriberRegistrationAPI, requestObject).pipe(map(data => data, error => error));
  }

  verifyEmailIdAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.verifyEmailIdAPI, requestObject).pipe(map(data => data, error => error));
  }

  verifyMobileNumberAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.verifyMobileNrAPI, requestObject).pipe(map(data => data, error => error));
  }

  resendOtpToEmail(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.resendOTPToEmailIdAPI, requestObject).pipe(map(data => data, error => error));
  }

  resendOTPToMobileNumber(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.resendOTPToMobileNrAPI, requestObject).pipe(map(data => data, error => error));
  }
}
