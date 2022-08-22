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

export class PaymentService {

  constructor(private configService : ConfigService,
              private _http: HttpClient) { }

  updatePaymentTypeAPI(requestObject):Observable<any>{
    
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.updatePaymentTypeAPI, 
                                requestObject).pipe(map(data => data, error => error));

  }

  createAPaymentRequestAPI(STORE_ID, SUBSCRIBER_ID, TRANSACTION_ID){    
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.createAPaymentRequestAPI, 
                                {
                                  STORE_ID       : STORE_ID,
                                  SUBSCRIBER_ID  : SUBSCRIBER_ID,
                                  TRANSACTION_ID : TRANSACTION_ID
                                }).pipe(map(data => data, error => error));
  }
  
  // RazorpayPayment
  razorpayOrderRequestAPI(requestObject){    
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.RAZORPAY_ORDER_REQUEST_API, 
    requestObject).pipe(map(data => data, error => error));
  }
  
  updateRazorPayResposeAPI(requestObject){    
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.UPDATE_RAZORPAY_RESPOSE_API, 
    requestObject).pipe(map(data => data, error => error));
  }
}
