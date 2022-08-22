import { Injectable } from '@angular/core';
import { SignupService } from './signup.service';
import { LoginService } from './login.service';
import { CommonService } from './common.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { UserProfileService } from './user-profile.service';
import { Router } from '@angular/router';
import { FlagsService } from './flags.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class EmailandphonenumberverifiationService {

  constructor(
    private signupService: SignupService,
    private loginservice: LoginService,
    private commonService: CommonService,
    private flashMessagesService: FlashMessagesService,
    private userProfileService: UserProfileService,
    private _router: Router,
    private flagsService: FlagsService,
    private configService: ConfigService,
  ) { }

  public progressBar = false;
  public otp = "";
  public subscriberId = 0;
  public otpResultObject = { STATUS: "" };
  public otpError = { STATUS: "" };

  public verifyOtp() {
    this.progressBar = true;
    let requestObject = {
      SUBSCRIBER_ID: this.subscriberId,
      SUBSCRIBER_EMAIL_OTP_CODE: this.otp
    }
    this.signupService.verifyEmailIdAPI(requestObject).subscribe(data => this.handleVerifyOtpSuccess(data), error => error)
  }

  handleVerifyOtpSuccess(data) {
    if (data.STATUS == "OK") {
      this.progressBar = false;
      this.otpResultObject = data;
      this.afterEmailVerification();
    } else {
      this.commonService.notifyMessage(this.flashMessagesService, "Otp is invalid");
    }
  }

  deleteTempSubsReqObject = {
    APPLICATION_ID: 0,
    TEMP_SUBSCRIBER_ID: 0,
    SUBSCRIBER_EMAIL_ID: "",
    SUBSCRIBER_PASSWORD: "",
    STORE_ID: undefined
  }

  afterEmailVerification() {
    let tempSubscriberFlag = 0;
    tempSubscriberFlag = +this.commonService.lsTempSubscriberFlag();

    if (tempSubscriberFlag > 0) {

      this.loginservice.deleteTemporarySubscriberAndLogInAPI(this.deleteTempSubsReqObject)
        .subscribe(data => this.handleDeleteTempSubscriberSuccess(data), error => this.handleError(error));
    }

    this.commonService.addSubscriberIdTols(this.subscriberId);
  }

  // Temp Subscriber Management

  handleDeleteTempSubscriberSuccess(data) {
    if (data.STATUS == "OK") {
      // this.commonService.notifyMessage(this.flashMessagesService, "User Login Success.");

      let authToken = data.SUBSCRIBER.AUTHENTICATION_TOKEN;
      let subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
      let tempSubscriberFlag = 0;
      let transactionId = 0;
      this.commonService.addStoreData(authToken, subscriberId, tempSubscriberFlag, transactionId);

      let subscriberObject = {
        name: data.SUBSCRIBER.SUBSCRIBER_FIRST_NAME + " " + this.commonService.checkIfNull(data.SUBSCRIBER.SUBSCRIBER_LAST_NAME),
        email: data.SUBSCRIBER.SUBSCRIBER_EMAIL_ID,
        mobile: data.SUBSCRIBER.SUBSCRIBER_MOBILE_NR
      }

      this.commonService.addSubscriberObjectTols(subscriberObject);

      this.loginservice.checkTransactionArrayAndUpdate(data);

      this.afterSuccessfullLogin();
      this.commonService.isUserLoggedIn();
    } else {
      this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
    }
  }

  // Temp Subscriber Management ends

  handleError(error) {

  }


  resendOtpToEmail() {

    let tempObject = {
      SUBSCRIBER_ID: this.subscriberId
    }
    this.signupService.resendOtpToEmail(tempObject).subscribe(data => this.handleResendOtpSuccess(data), error => error)
  }

  handleResendOtpSuccess(data) {
    if (data.STATUS == "OK") {
      this.commonService.notifySuccessMessage(this.flashMessagesService, "OTP has been resent.");
    }
  }


  //Send OTP tp Mobile
  resendOtpToMobileNumber() {

    let tempObject = {
      SUBSCRIBER_ID: this.subscriberId
    }
    this.signupService.resendOTPToMobileNumber(tempObject).subscribe(data => this.handleResendOtpToMobileNumberSuccess(data), error => error)
  }

  handleResendOtpToMobileNumberSuccess(data) {
    if (data.STATUS == "OK") {
      this.commonService.notifySuccessMessage(this.flashMessagesService, "OTP has been resent.");
    }
  }

  afterSuccessfullLogin() {
    if (this.userProfileService.loginCallFromCheckoutPage == 1) {
      this.userProfileService.loginCallFromCheckoutPage = 0;
      this._router.navigate(['/collections/checkout-new'], { replaceUrl: true });
    }
    else {
      this._router.navigate(['/'], { replaceUrl: true });
    }
  }

  //OTP CheckIn Starts here 
  public mobileOtp = "";
  public verifyMobileOtp() {
    this.progressBar = true;
    let requestObject = {
      SUBSCRIBER_ID           : this.subscriberId,
      SUBSCRIBER_SMS_OTP_CODE : this.mobileOtp,
      TEMP_SUBSCRIBER_ID      : this.commonService.lsSubscriberId(),
      STORE_ID                : this.configService.getStoreID()
    }
    this.signupService.verifyMobileNumberAPI(requestObject).subscribe(data => this.handleVerifyMobileOtpSuccess(data), error => error)
  }

  handleVerifyMobileOtpSuccess(data) {
    if (data.STATUS == "OK") {
      this.progressBar = false;
      // if(this.flagsService.mobileOtpVerficationCallFromUpdateMobile){
      //   this.flagsService.mobileOtpVerficationCallFromUpdateMobile = false;
      //   this.commonService.openAlertBar("Your Mobile Number has been updated succussfully.");
      // } else {
      this.otpResultObject = data;
      this.afterMobileNumberVerification();
      // }
    } else {
      this.commonService.notifyMessage(this.flashMessagesService, "Otp is invalid");
    }
  }

  deleteTempSubsReqObjectThroughOtp = {
    TEMP_SUBSCRIBER_ID: 0,
    SUBSCRIBER_MOBILE_NR: 0,
    STORE_ID: undefined
  }

  afterMobileNumberVerification() {

    let tempSubscriberFlag = 0;
    tempSubscriberFlag = +this.commonService.lsTempSubscriberFlag();

    if (tempSubscriberFlag > 0) {

      this.loginservice.deleteTemporarySubscriberAndLogInAPI(this.deleteTempSubsReqObjectThroughOtp)
        .subscribe(data => this.handleDeleteTempSubscriberSuccess(data), error => this.handleError(error));
    }

    this.commonService.addSubscriberIdTols(this.subscriberId);

      // this._router.navigate(['/collections/checkout-new'], { replaceUrl: true });
  }
  //OTP CheckIn Ends here 


}
