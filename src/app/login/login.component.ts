
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { UserProfileService } from '../user-profile.service';
import { CommonService } from '../common.service';
import { LoginService } from '../login.service';
import { SocialSignupService } from '../social-signup.service';
import { FlagsService } from '../flags.service';
import { SignupService } from '../signup.service';
import { EmailandphonenumberverifiationService } from '../emailandphonenumberverifiation.service';
import { ReferenceMethodsService } from '../reference-methods.service';
import { WalletMethodsService } from '../wallet-methods.service';
import { ConfigService } from '../config.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private configService : ConfigService,
    private _router                                         : Router, 
    private _route                                          : ActivatedRoute, 
    public  loginservice                                    : LoginService,
    private userProfileService                              : UserProfileService,
    private flashMessagesService                            : FlashMessagesService,
    private commonService                                   : CommonService,
    public  socialSignupService                             : SocialSignupService,
    public  flagsService                                    : FlagsService,
    public  signupService                                   : SignupService,
    public  emailandphonenumberverifiationService           : EmailandphonenumberverifiationService,
    public  referenceMethodsService                         : ReferenceMethodsService,
    public  walletMethodsService                            : WalletMethodsService,
  ) { }

  ngOnInit() {
    this.flagsService.mobileOtpVerficationCallFromUpdateMobile = false;
    this.referralCode = this.userProfileService.referralCode;
    this.commonService.checkLoggedIn();
    // this.flagsService.hideHeaderFooter();

    this.flagsService.showSearch();
    this.flagsService.showHeaderFooter();
    if(window.innerWidth < 600){
      this.flagsService.hideFooter();
    }
    
    window.scroll(0, 0);
    this.GetEncodedSubscriberIdByParam();
  }

  loginEmail          = "";
  loginPassword       = "";
  formInvalid         = true;
  referralFlag        = false;

  loginRequestObject = {};

  GetEncodedSubscriberIdByParam(){
    this._route.params.subscribe(params => {
      if(params['subscriberId'] != undefined){
        this.referenceMethodsService.encodedSubscriberId  = params['subscriberId'];
        this.referenceMethodsService.referralFlag         = true;
        this.referenceMethodsService.referralUrl          = this._router.url;
      }
    });

    console.log(this._router.url);
  }

  makeLoginRequestObject(){
    this.loginRequestObject = {
      SUBSCRIBER_EMAIL_ID      : this.loginEmail,
      SUBSCRIBER_PASSWORD      : this.loginPassword,
    }
  }

  makeDeleteTempSubscriberRequestObject(){
    this.loginRequestObject = {
      TEMP_SUBSCRIBER_ID       : this.commonService.lsSubscriberId(),
      SUBSCRIBER_EMAIL_ID      : this.loginEmail,
      SUBSCRIBER_PASSWORD      : this.loginPassword,
      STORE_ID                 : this.configService.getStoreID(),
      REFERRAL_FLAG            : this.referenceMethodsService.referralFlag,
      REFERRAL_URL             : this.referenceMethodsService.referralUrl,
    }
  }

  login(){
    if(this.formInvalid == false){
      let tempSubscriberFlag = 0;
      tempSubscriberFlag = +this.commonService.lsTempSubscriberFlag();
      if(tempSubscriberFlag > 0) {
        this.makeDeleteTempSubscriberRequestObject();
        this.loginservice.deleteTemporarySubscriberAndLogInAPI(this.loginRequestObject).subscribe(data => this.handleTempSubscriberLoginSuccess(data), error => this.handleError(error));
      }else{
        this.makeLoginRequestObject();
        this.loginservice.subscriberLoginAPI(this.loginRequestObject).subscribe(data => this.handleLoginSuccess(data), error => this.handleError(error));
      }
    }
  }

  handleLoginSuccess(data){
    if(data.STATUS == "OK") {
      
      this.commonService.notifyMessage(this.flashMessagesService, "User Login Success.");

      this.commonService.addSubscriberIdTols(data.SUBSCRIBER.SUBSCRIBER_ID)
      this.commonService.addLoggedInUsernameTols(data.SUBSCRIBER.SUBSCRIBER_FIRST_NAME + data.SUBSCRIBER.SUBSCRIBER_LAST_NAME);
      this.commonService.addTempSubscriberFlagTols(0);
      this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
      this.commonService.isUserLoggedIn();
      this.afterSuccessfullLogin();
      
    }else{
      this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
    }
  }

  handleTempSubscriberLoginSuccess(data){
    if(data.STATUS == "OK") {
      if(data.SUBSCRIBER.SUBSCRIBER_EMAIL_OTP_STATUS == 1){ // this means otp is verified

        let authToken             = data.SUBSCRIBER.AUTHENTICATION_TOKEN;
        let subscriberId          = data.SUBSCRIBER.SUBSCRIBER_ID;
        let tempSubscriberFlag    = 0;
        let transactionId         = 0;
        this.commonService.addStoreData(authToken, subscriberId, tempSubscriberFlag, transactionId);

        let subscriberObject = {
          name    : data.SUBSCRIBER.SUBSCRIBER_FIRST_NAME + " " + this.commonService.checkIfNull(data.SUBSCRIBER.SUBSCRIBER_LAST_NAME),
          email   : data.SUBSCRIBER.SUBSCRIBER_EMAIL_ID,
          mobile  : data.SUBSCRIBER.SUBSCRIBER_MOBILE_NR
        }

        this.commonService.addSubscriberObjectTols(subscriberObject);

        
        this.loginservice.checkTransactionArrayAndUpdate(data);

        this.afterSuccessfullLogin();
        this.commonService.isUserLoggedIn();
      }else{

        this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);


        this.emailandphonenumberverifiationService.deleteTempSubsReqObject = {
          APPLICATION_ID           : this.commonService.applicationId,
          TEMP_SUBSCRIBER_ID       : this.commonService.lsSubscriberId(),
          SUBSCRIBER_EMAIL_ID      : this.loginEmail,
          SUBSCRIBER_PASSWORD      : this.loginPassword,
          STORE_ID                 : this.configService.getStoreID()
        }
        
        this.emailandphonenumberverifiationService.subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;

        this._router.navigate(['/collections/otp']);

      }

      this.walletMethodsService.fetchWalletMoneyBySubscriberIdAPI();

      this.referenceMethodsService.referralFlag = false;

    }else {
      if(data.ERROR_MSG == 'Invalid Email Id'){
        this.commonService.notifyMessage(this.flashMessagesService, "The Email is not registered with us");
      } else {
        this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
      }
      
    }
  }



  afterSuccessfullLogin(){
    if(this.userProfileService.loginCallFromCheckoutPage==1) {
      this.userProfileService.loginCallFromCheckoutPage = 0;
      this.commonService.handleSuccessWithNavigation("User Login Success.", this.flashMessagesService, '/');
    } else {
      this.commonService.handleSuccessWithNavigation("User Login Success.", this.flashMessagesService, '/');
    }
  }

  handleError(error){

  }

  clearSignupForm(){
    this.loginEmail            = "";
    this.loginPassword         = "";
  }

  validateForm(ngObject){
    this.formInvalid = true;
    if(ngObject._parent.form.status == "VALID"){
      this.formInvalid = false;
    }
  }

  /** Guest CheckIn */
  guestCheckInFormInValid = true;
  validateGuestCheckInForm(ngObject){
    this.guestCheckInFormInValid = true;
    if(ngObject._parent.form.status == "VALID"){
      this.guestCheckInFormInValid = false;
    }
  }

  guestName           = "";
  guestEmail          = "";
  guestMobileNumber   : any;
  guestCheckIn(){
    if(this.guestCheckInFormInValid == false){
      this.makeGuestCheckInRequestObjectObject();
      this.signupService.subscriberRegistrationAPI(this.guestCheckInRequestObject).
      subscribe(data => this.socialSignupService.handleGuestCheckInSuccess(data), error => error);
    }
  }

  guestCheckInRequestObject = {};
  makeGuestCheckInRequestObjectObject(){
    this.guestCheckInRequestObject = {
      APPLICATION_ID           : this.commonService.applicationId,
      SUBSCRIBER_FIRST_NAME    : this.guestName,
      SUBSCRIBER_EMAIL_ID      : this.guestEmail,
      SUBSCRIBER_TOKEN         : "",
      SUBSCRIBER_STATUS_CODE   : ApplicationConstants.SUBSCRIBER_STATUS_CODE_ACTIVATED,
      PROVIDER_CODE            : ApplicationConstants.PROVIDER_CODE_GUEST_CHECK_IN,
      TEMP_SUBSCRIBER_ID       : this.commonService.lsSubscriberId(),
      TEMP_SUBSCRIBER_FLAG     : 1,
      PROFILE_ID               : ApplicationConstants.DEFAULT_SUBSCRIBER_PROFILE_ID,
      STORE_ID                 : this.configService.getStoreID(),
      SUBSCRIBER_MOBILE_NR     : this.guestMobileNumber,
      REFERRAL_FLAG            : this.referenceMethodsService.referralFlag,
      // REFERRAL_URL             : this.referenceMethodsService.referralUrl,// Checklist-3
    }
  }

  handleGuestCheckInSuccess(data){

  }
  /** Guest CheckIn ends */


  // Referral Logic 
  referralCode = "";
  onValueIn() {
    this.userProfileService.referralCode = this.referralCode;
  }
  // Referral Logic ends

  // OTP CheckIn Logic Starts 

  displayOtpCheckIn = false;

  otpCheckInFormInValid = true;
  validateOtpCheckInForm(ngObject) {
    this.otpCheckInFormInValid = true;
    if (ngObject._parent.form.status == "VALID") {
      this.otpCheckInFormInValid = false;
    }
  }

  otpCheckInRequestObject: any;
  otpFirstname: string;
  otpMobileNumber: number;
  makeOtpCheckInRequestObjectObject() {
    this.otpCheckInRequestObject = {
      APPLICATION_ID: this.commonService.applicationId,
      SUBSCRIBER_FIRST_NAME: this.otpFirstname,
      SUBSCRIBER_STATUS_CODE: ApplicationConstants.SUBSCRIBER_STATUS_CODE_ACTIVATED,
      PROVIDER_CODE: ApplicationConstants.PROVIDER_CODE_OTP_CHECK_IN,
      TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      TEMP_SUBSCRIBER_FLAG: 1,
      PROFILE_ID: ApplicationConstants.DEFAULT_SUBSCRIBER_PROFILE_ID,
      STORE_ID: this.configService.getStoreID(),
      SUBSCRIBER_MOBILE_NR: this.otpMobileNumber
    };
  }
  otpCheckIn() {
    if (!this.otpCheckInFormInValid) {
      this.makeOtpCheckInRequestObjectObject();
      this.signupService.subscriberRegistrationAPI(this.otpCheckInRequestObject)
        .subscribe(data => this.handleOtpCheckInSuccess(data), error => error);
    }
  }

  handleOtpCheckInSuccess(data) {
    if (data.STATUS == "OK") {
      this.emailandphonenumberverifiationService.deleteTempSubsReqObjectThroughOtp = {
        TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
        SUBSCRIBER_MOBILE_NR: this.otpMobileNumber,
        STORE_ID: this.configService.getStoreID(),
      }

      this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
      this.emailandphonenumberverifiationService.subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;

      this._router.navigate(['/collections/mobile-otp']);

      this.referenceMethodsService.referralFlag = false;


    }
  }
 // OTP CheckIn Logic Ends


}
