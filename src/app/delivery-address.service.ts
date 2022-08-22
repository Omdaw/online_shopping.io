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
export class DeliveryAddressService {
  constructor(private configService : ConfigService,private _http: HttpClient) { }

  createSubscriberAddress(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.createSubscriberAddressAPI, requestObject).pipe(map(data => data, error => error));
  }

  updateSubscriberAddress(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.updateSubscriberAddressAPI, requestObject).pipe(map(data => data, error => error));
  }

  fetchSubscriberAddress(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.fetchSubscriberAddressAPI, requestObject).pipe(map(data => data, error => error));
  }

  deleteSubscriberAddress(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.deleteSubscriberAddressAPI, requestObject).pipe(map(data => data, error => error));
  }

  updateDeliveryAddressInTransaction(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.updateTransactionAPI, requestObject).pipe(map(data => data, error => error));
  }

  updateTransaction(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.updateTransactionAPI, requestObject).pipe(map(data => data, error => error));
  }

  fetchPaymentGatewayByStoreIdAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.fetchPaymentGatewayByStoreIdAPI, requestObject).pipe(map(data => data, error => error));
  }

  fetchPaymentGatewayCredentialsByStoreId(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.fetchPaymentGatewayCredentialsAPI, requestObject).pipe(map(data => data, error => error));
  }

  createPaymentGatewayHistoryAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.createPaymentGatewayHistoryAPI, requestObject).pipe(map(data => data, error => error));
  }

  createPaymentAPILogAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.createPaymentAPILogAPI, requestObject).pipe(map(data => data, error => error));
  }
  
  updatePaymentAPILogAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.updatePaymentAPILogAPI, requestObject).pipe(map(data => data, error => error));
  }

  //  new-checklist-1-soln-6 
  getCityIdAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.GET_CITY_ID_API, requestObject).pipe(map(data => data, error => error));
  }
  
  //  new-checklist-1-soln-6 
  getStateIdAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.GET_STATE_ID_API, requestObject).pipe(map(data => data, error => error));
  }
  
  //  new-checklist-1-soln-6 
  getCountryIdAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.GET_COUNTRY_ID_API, requestObject).pipe(map(data => data, error => error));
  }
}
