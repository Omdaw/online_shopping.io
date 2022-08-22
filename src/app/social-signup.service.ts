import { Injectable } from '@angular/core';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { SignupService } from './signup.service';
import { CommonService } from './common.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { UserProfileService } from './user-profile.service';
import { Router } from '@angular/router';
import { SubscriberService } from './subscriber.service';
import { TransactionsService } from './transactions.service';
import { FetchingproductsService } from './fetchingproducts.service';
import { ReferenceMethodsService } from './reference-methods.service';
import { WalletMethodsService } from './wallet-methods.service';
import { ConfigService } from './config.service';
import { LoginService } from './login.service';
import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class SocialSignupService {

  user: any;
  constructor(private configService : ConfigService,
    private _router                 : Router, 
    private _socioAuthServ          : SocialAuthService,
    private signupService           : SignupService,
    private commonService           : CommonService,
    private flashMessagesService    : FlashMessagesService,
    private userProfileService      : UserProfileService,
    private subscriberService       : SubscriberService,
    private transactionService      : TransactionsService,
    private fetchingproductsService : FetchingproductsService,
    private referenceMethodsService : ReferenceMethodsService,
    private walletMethodsService    : WalletMethodsService,
    private loginservice            : LoginService,
  ) { }

    requestFrom = "";

  // Method to sign in with google/facebook
  singIn(platform : string): void {
    
    if(platform == "Google"){
      platform = GoogleLoginProvider.PROVIDER_ID;
      this.requestFrom = "Google";
    }else if(platform == "Facebook"){
      this.requestFrom = "Facebook";
      platform = FacebookLoginProvider.PROVIDER_ID;
    }
    
    
    this._socioAuthServ.signIn(platform).then(
      (response) => {
        console.log(platform + " logged in user data is= " , response);
        this.user = response;
        
        if(this.requestFrom == "Google") this.makeGoogleLoginRequestObject(response);
        if(this.requestFrom == "Facebook") this.makeFacebookLoginRequestObject(response);
        
        this.googleSignup();
      }
    );
  }

  googleLoginRequestObject = {};
  makeGoogleLoginRequestObject(data){
    this.googleLoginRequestObject = {
      APPLICATION_ID           : this.commonService.applicationId,
      SUBSCRIBER_FIRST_NAME    : data.name,
      SUBSCRIBER_EMAIL_ID      : data.email,
      SUBSCRIBER_TOKEN         : data.authToken,
      SUBSCRIBER_STATUS_CODE   : ApplicationConstants.SUBSCRIBER_STATUS_CODE_ACTIVATED,
      PROVIDER_CODE            : ApplicationConstants.PROVIDER_CODE_GOOGLE,
      TEMP_SUBSCRIBER_ID       : this.commonService.lsSubscriberId(),
      TEMP_SUBSCRIBER_FLAG     : 1,
      PROFILE_ID               : ApplicationConstants.DEFAULT_SUBSCRIBER_PROFILE_ID,
      STORE_ID                 : this.configService.getStoreID(),
      REFERRAL_FLAG            : this.userProfileService.referralFlag(),
      REFERRAL_CODE             : this.userProfileService.referralCode,
    }
  }

  makeFacebookLoginRequestObject(data){
    this.googleLoginRequestObject = {
      APPLICATION_ID           : this.commonService.applicationId,
      SUBSCRIBER_FIRST_NAME    : data.name,
      SUBSCRIBER_EMAIL_ID      : data.email,
      SUBSCRIBER_TOKEN         : data.authToken,
      SUBSCRIBER_STATUS_CODE   : ApplicationConstants.SUBSCRIBER_STATUS_CODE_ACTIVATED,
      PROVIDER_CODE            : ApplicationConstants.PROVIDER_CODE_FACEBOOK,
      TEMP_SUBSCRIBER_ID       : this.commonService.lsSubscriberId(),
      TEMP_SUBSCRIBER_FLAG     : 1,
      PROFILE_ID               : ApplicationConstants.DEFAULT_SUBSCRIBER_PROFILE_ID,
      STORE_ID                 : this.configService.getStoreID(),
      REFERRAL_FLAG            :  this.userProfileService.referralFlag(),
      REFERRAL_CODE             : this.userProfileService.referralCode,
    }
  }

  googleSignup(){
    this.signupService.subscriberRegistrationAPI(this.googleLoginRequestObject).subscribe(data => this.handleGoogleSignupSuccess(data), error => error);
  }

  public handleGoogleSignupSuccess(data){

    if(data.STATUS == "OK") {
      this.commonService.openAlertBar("User Registered Successfully.");
      
      this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
      this.commonService.addSubscriberIdTols(data.SUBSCRIBER.SUBSCRIBER_ID);
      this.commonService.addTempSubscriberFlagTols(0);
      this.commonService.addLoggedInUsernameTols(data.SUBSCRIBER.SUBSCRIBER_FIRST_NAME + "  " + data.SUBSCRIBER.SUBSCRIBER_LAST_NAME);

      this.subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;

      let subscriberObject = {
        name    : data.SUBSCRIBER.SUBSCRIBER_FIRST_NAME + " " + data.SUBSCRIBER.SUBSCRIBER_LAST_NAME,
        email   : data.SUBSCRIBER.SUBSCRIBER_EMAIL_ID,
        mobile  : data.SUBSCRIBER.SUBSCRIBER_MOBILE_NR
      }

      this.commonService.addSubscriberObjectTols(subscriberObject);

      this.loginservice.checkTransactionArrayAndUpdate(data);

      this.walletMethodsService.fetchWalletMoneyBySubscriberIdAPI();

      this.fetchCartInProgress();

      this.referenceMethodsService.referralFlag = false;

    }else{
      this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
    }
  }

  public handleGuestCheckInSuccess(data){

    if(data.STATUS == "OK") {
      this.commonService.openAlertBar("Logged in as Guest successfully");
      
      this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
      this.commonService.addSubscriberIdTols(data.SUBSCRIBER.SUBSCRIBER_ID);
      this.commonService.addTempSubscriberFlagTols(0);
      this.commonService.addLoggedInUsernameTols(data.SUBSCRIBER.SUBSCRIBER_FIRST_NAME + "  " + data.SUBSCRIBER.SUBSCRIBER_LAST_NAME);

      this.subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;

      let subscriberObject = {
        name    : data.SUBSCRIBER.SUBSCRIBER_FIRST_NAME + " " + data.SUBSCRIBER.SUBSCRIBER_LAST_NAME,
        email   : data.SUBSCRIBER.SUBSCRIBER_EMAIL_ID,
        mobile  : data.SUBSCRIBER.SUBSCRIBER_MOBILE_NR
      }

      this.commonService.addSubscriberObjectTols(subscriberObject);

      this.loginservice.checkTransactionArrayAndUpdate(data);

      this.walletMethodsService.fetchWalletMoneyBySubscriberIdAPI();

      this.fetchCartInProgress();

      this.referenceMethodsService.referralFlag = false;

    }else{
      this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
    }
  }

    // fetch cart in progress 
    fetchCartInProgressRequestObject  = {};
    subscriberId                      = 0;
    makeFetchCartInProgressObject(){
      let tempObj = {
      SUBSCRIBER_ID       : this.subscriberId,
      STORE_ID            : this.configService.getStoreID(),
      }
  
      this.fetchCartInProgressRequestObject = tempObj;
    }
    
    fetchCartInProgress(){
      this.makeFetchCartInProgressObject()
    
      this.subscriberService.fetchCartInProgressTransactionsBySubscriberIdAPI(this.fetchCartInProgressRequestObject)
      .subscribe(data => this.handleFetchCartInProgressResponse(data), error => error)
    }
      
    handleFetchCartInProgressResponse(data){
      if(data.STATUS == "OK"){
    
        this.transactionService.transactionDetailsArray = [];
        if(data.TRANSACTION && data.TRANSACTION.length > 0){
          data.TRANSACTION[0].TRANSACTION_DETAIL.forEach(element => {
            if(element.TRANSACTION_DETAIL_TYPE_CODE == 1){ //Because we are  also getting Delivery Charge and Convenience fee
              this.transactionService.transactionDetailsArray.push(element);
            }
          });
          this.fetchingproductsService.checkOnlyTransactions();
        }
    
        if(this.transactionService.transactionDetailsArray.length > 0){
          this.commonService.addTransactionIdTols();
        }

        this.afterSuccessfullLogin();
        this.commonService.isUserLoggedIn();
    
      }
    }
  
    // fetch cart in progress ends

  afterSuccessfullLogin(){
    if(this.userProfileService.loginCallFromCheckoutPage==1) {
      this.userProfileService.loginCallFromCheckoutPage = 0;
      // this._router.navigate(['checkout-new']);
        location.reload();
    } 
    else {
      this._router.navigate(['/']);
    }

  }

  // Method to log out from google.
  signOut(): void {
    this._socioAuthServ.signOut();
    this.user = null;
    console.log('User signed out.');
  }

  ngOnInit() {
    
  }
}
