import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; 
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiConstants } from 'src/ApiConstants';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})

export class InvoiceService {

  constructor(private configService : ConfigService,private _http: HttpClient) {}

  fetchTransactionsByTransactionIdAPI(requestObject):Observable<any> {
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.fetchTransactionsByTransactionIdAPI, requestObject).pipe(map(data => data, error => error));
  }

  fetchTransactionsByPaymentRequestIdAPI(PAYMENT_REQUESTED_ID):Observable<any> {
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.fetchTransactionsByPaymentRequestIdAPI, 
                                {PAYMENT_REQUESTED_ID: PAYMENT_REQUESTED_ID}).pipe(map(data => data, error => error));
  }
}
