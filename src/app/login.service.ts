import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiConstants } from 'src/ApiConstants';
import { ProductsMidLayerService } from './products-mid-layer.service';
import { TransactionsService } from './transactions.service';
import { ConfigService } from './config.service';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private configService : ConfigService,
    private   _http                   : HttpClient,
    private  ProductsMidLayerService  : ProductsMidLayerService,
    private  transactionService       : TransactionsService,
    public commonService         : CommonService
    ) { }

    public inDeliveryPageFlag = 0;
    public displayGuestCheckIn      = false;
  
  public showGuestCheckIn(){
    this.displayGuestCheckIn = true;
  } 
  
  public hideGuestCheckIn(){
    this.displayGuestCheckIn = false;
  } 

  subscriberLoginAPI(requestObject):Observable<any>{
      return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.subscriberLoginAPI, requestObject).pipe(map(data => data, error => error));
  }

  deleteTemporarySubscriberAndLogInAPI(requestObject){
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.deleteTemporarySubscriberAndLogInAPI, requestObject).pipe(map(data => data, error => error));
  }

  public checkTransactionArrayAndUpdate(data){

    if(data.TRANSACTION && 
      data.TRANSACTION.length > 0 && 
      data.TRANSACTION[0] && 
      data.TRANSACTION[0].TRANSACTION_DETAIL.length > 0 &&
      data.TRANSACTION[0].TRANSACTION_DETAIL[0].TRANSACTION_ID > 0){
      this.transactionService.transactionDetailsArray   = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray          = data.TRANSACTION;
      this.ProductsMidLayerService.checkOnlyTransactions();

      this.commonService.addTransactionIdTols();
    }
  }

  

}
