import { Injectable } from '@angular/core';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { SubscriberService } from './subscriber.service';
import { TransactionsService } from './transactions.service';
import { UserProfileService } from './user-profile.service';
import { FiltersService } from './filters.service';
import { WalletService } from './wallet.service';
import { FlagsService } from './flags.service';
import { ConfigService } from './config.service';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class WalletMethodsService {

  constructor(private configService : ConfigService,
    private subscriberService   : SubscriberService,
    private transactionService  : TransactionsService,
    private userProfileService  : UserProfileService,
    private WalletService       : WalletService,
    private flagsService       : FlagsService,
    public commonService         : CommonService
  ) { }


  // Fetch Wallet Money API 
  fetchWalletMoneyBySubscriberIdAPIRequestObject = {};
  public subscriberWallerDetailsObject = {
    WALLET_MONEY : 0,
    CURRENCY     : "" 
  };
  makeFetchWalletMoneyBySubscriberIdAPIRequestObject(){
    this.fetchWalletMoneyBySubscriberIdAPIRequestObject = {
      SUBSCRIBER_ID  : this.commonService.lsSubscriberId(),
      STORE_ID       : this.configService.getStoreID()
    }
  }

  public fetchWalletMoneyBySubscriberIdAPI(){
    this.makeFetchWalletMoneyBySubscriberIdAPIRequestObject();
    this.WalletService.fetchWalletMoneyBySubscriberIdAPI(this.fetchWalletMoneyBySubscriberIdAPIRequestObject)
    .subscribe(data => this.fetchWalletMoneyBySubscriberIdAPISuccess(data), error => error);
  }  

  fetchWalletMoneyBySubscriberIdAPISuccess(data){
      this.subscriberWallerDetailsObject = data;
  }
// Fetch Wallet Money API ends 

// Apply Wallet Money API
  applyWalletMoneyAPIReqObject = {};
  makeApplyWalletMoneyAPIReqObject(){
    this.applyWalletMoneyAPIReqObject = {
      SUBSCRIBER_ID  : this.commonService.lsSubscriberId(),
      STORE_ID       : this.configService.getStoreID(),
      TRANSACTION_ID : this.commonService.lsTransactionId()
    }
  }

  applyWalletMoneyAPI(){
    this.makeApplyWalletMoneyAPIReqObject();
    this.WalletService.applyWalletMoneyAPI(this.applyWalletMoneyAPIReqObject)
    .subscribe(data => this.applyWalletMoneyAPISuccess(data), error => error);
  }  


  public walletPaymentGatewayType = 0;

  applyWalletMoneyAPISuccess(data){
    if(data.STATUS == "OK"){

      if(data.PAYMENT_GATEWAY_TYPE_CODE == ApplicationConstants.WALLET_PAYMENT_GATEWAY_TYPE_CODE) {
        this.flagsService.completelyWalletPaymentFlag = true; 
      }else{
        this.flagsService.completelyWalletPaymentFlag = false;
      }

      this.walletPaymentGatewayType = data.PAYMENT_TYPE_ID;

      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray        = data.TRANSACTION;

      this.transactionService.refreshCartAmountDetail();
      // this.checkOnlyTransactions();
    }
  }
// Apply Wallet Money API ends 

// Cancel Wallet Money API
cancelWalletMoneyAPIReqObj = {};
makeCancelWalletMoneyAPIReqObj(){
  this.cancelWalletMoneyAPIReqObj = {
    SUBSCRIBER_ID  : this.commonService.lsSubscriberId(),
    STORE_ID       : this.configService.getStoreID(),
    TRANSACTION_ID : this.commonService.lsTransactionId()
  }
}

cancelWalletMoneyAPI(){
  this.makeCancelWalletMoneyAPIReqObj();
  this.WalletService.cancelWalletMoneyAPI(this.cancelWalletMoneyAPIReqObj)
  .subscribe(data => this.cancelWalletMoneyAPISuccess(data), error => error);
}  

cancelWalletMoneyAPISuccess(data){
  if(data.STATUS == "OK"){
    this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray        = data.TRANSACTION;
      this.flagsService.completelyWalletPaymentFlag = false;
      this.transactionService.refreshCartAmountDetail();
  }
}
// Cancel Wallet Money API ends 
}
