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
export class WalletService {

  constructor(private configService : ConfigService,private _http: HttpClient) { }

  fetchWalletMoneyBySubscriberIdAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.fetchWalletMoneyBySubscriberIdAPI, requestObject).pipe(map(data => data, error => error));
  }

  applyWalletMoneyAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.applyWalletMoneyAPI, requestObject).pipe(map(data => data, error => error));
  }

  cancelWalletMoneyAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.cancelWalletMoneyAPI, requestObject).pipe(map(data => data, error => error));
  }



}
