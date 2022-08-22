
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { UserProfileService } from '../user-profile.service';
import { SignupService } from '../signup.service';
import { CommonService } from '../common.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FlagsService } from '../flags.service';
import { EmailandphonenumberverifiationService } from '../emailandphonenumberverifiation.service';
import { ReferenceMethodsService } from '../reference-methods.service';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  validatePassAndConfirmPassword() { // here we have the 'passwords' group
    let pass        = this.password;
    let confirmPass = this.confirmPassword;
    this.pwdMatchError = false;

     if(pass != "" && confirmPass != "" && pass != confirmPass){
      this.pwdMatchError = true;
    }

  }

  constructor(private configService : ConfigService,
    private _router                                         : Router, 
    private signupService                                   : SignupService,
    private userProfileService                              : UserProfileService,
    private flashMessagesService                            : FlashMessagesService,
    public  commonService                                   : CommonService,
    private flagsService                                    : FlagsService,
    private emailandphonenumberverifiationService           : EmailandphonenumberverifiationService,
    private referenceMethodsService                         : ReferenceMethodsService,
  ) { }

  ngOnInit() {
    this.commonService.checkLoggedIn();
    // this.flagsService.hideHeaderFooter();
    this.flagsService.showSearch();
    this.flagsService.showHeaderFooter();
    if(window.innerWidth < 600){
      this.flagsService.hideFooter();
    }
    this.referralCode = this.userProfileService.referralCode;
  }

  firstname       = "";
  lastname        = "";
  email           = "";
  password        = "";
  confirmPassword = "";
  mobileNumber    = null;

  signupRequestObject = {};
  formInvalid = true;
  pwdMatchError = false;

  makeSignupRequestObject(){
    let tempSubscriberId = 0;
    tempSubscriberId = +this.commonService.lsSubscriberId();

    this.signupRequestObject = {
      STORE_ID                 : this.configService.getStoreID(),
      APPLICATION_ID           : this.commonService.applicationId,
      SUBSCRIBER_FIRST_NAME    : this.firstname,
      SUBSCRIBER_LAST_NAME     : this.lastname,
      SUBSCRIBER_EMAIL_ID      : this.email,
      SUBSCRIBER_PASSWORD      : this.password,
      SUBSCRIBER_TOKEN         : "",
      SUBSCRIBER_MOBILE_NR     : this.mobileNumber,
      SUBSCRIBER_STATUS_CODE   : ApplicationConstants.SUBSCRIBER_STATUS_CODE_PENDING,
      PROVIDER_CODE            : ApplicationConstants.PROVIDER_CODE_PERSONAL,
      TEMP_SUBSCRIBER_ID       : tempSubscriberId,
      TEMP_SUBSCRIBER_FLAG     : this.commonService.lsTempSubscriberFlag(),
      PROFILE_ID               : ApplicationConstants.DEFAULT_SUBSCRIBER_PROFILE_ID,
      REFERRAL_FLAG            : this.userProfileService.referralFlag(),
      REFERRAL_CODE            : this.userProfileService.referralCode,
    }
  }

  signup(){
    if(this.formInvalid == false && this.pwdMatchError == false){
      this.makeSignupRequestObject();
      this.signupService.subscriberRegistrationAPI(this.signupRequestObject).subscribe(data => this.handleSignupSuccess(data), error => this.handleError(error));
    }
  }

  handleSignupSuccess(data){
    if(data.STATUS == "OK") {
      // this.commonService.notifyMessage(this.flashMessagesService, "User Registered Successfully.");

      this.emailandphonenumberverifiationService.deleteTempSubsReqObject = {
        APPLICATION_ID         : this.commonService.applicationId,
        TEMP_SUBSCRIBER_ID     : this.commonService.lsSubscriberId(),
        SUBSCRIBER_EMAIL_ID    : this.email,
        SUBSCRIBER_PASSWORD    : this.password,
        STORE_ID               : this.configService.getStoreID(),
      }

      this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
      this.emailandphonenumberverifiationService.subscriberId =  data.SUBSCRIBER.SUBSCRIBER_ID;


      this._router.navigate(['/collections/otp']);

      this.referenceMethodsService.referralFlag = false;

    }else{
      this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
    }
  }

  handleError(error){

  }

  clearSignupForm(){
    this.firstname            = "";
    this.lastname             = "";
    this.email                = "";
    this.password             = "";
    this.confirmPassword      = "";
  }

  validateForm(ngObject){
    this.formInvalid = true;
    if(ngObject._parent.form.status == "VALID"){
      this.formInvalid = false;
    }
  }

  referralCode = "";
  onValueIn(){
    this.userProfileService.referralCode = this.referralCode;
  }
}
