import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { CommonService } from '../common.service';
import { ConfigService } from '../config.service';
import { EmailandphonenumberverifiationService } from '../emailandphonenumberverifiation.service';
import { FlagsService } from '../flags.service';
import { ReferenceMethodsService } from '../reference-methods.service';
import { SignupService } from '../signup.service';
import { SocialSignupService } from '../social-signup.service';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { UserProfileService } from '../user-profile.service';


@Component({
  selector: 'app-checkout-page-signup',
  templateUrl: './checkout-page-signup.component.html',
  styleUrls: ['./checkout-page-signup.component.css']
})
export class CheckoutPageSignupComponent implements OnInit {

  // Sign Up 
  signupRequestObject = {};
  loginEmail = "";
  loginPassword = "";
  referralCode = "";
  fName = "";
  lName = "";
  subscriberMobileNo = "";
  signupEmail = "";
  signupPassword = "";
  confirmPassword="";
  pwdMatchError = false;
  
  constructor(
    private flagsService: FlagsService,
    public commonService: CommonService,
    private _router: Router,
    public socialSignupService: SocialSignupService,
    public signupService:SignupService,
    public emailandphonenumberverifiationService:EmailandphonenumberverifiationService,
    public configService:ConfigService,
    public referenceMethodsService:ReferenceMethodsService,
    public flashMessagesService:FlashMessagesService,
    public userProfileService:UserProfileService
  ) { }

  ngOnInit(): void {
    this.commonService.sendMessage("hideFM");
    this.flagsService.hideHeader();
    this.flagsService.hideFooter();
    this.flagsService.hideHeaderFooter();
  }

  onValueIn() {
    this.userProfileService.referralCode = this.referralCode;
  }

  validatePassAndConfirmPassword() { // here we have the 'passwords' group
  let pass        = this.signupPassword;
  let confirmPass = this.confirmPassword;
  this.pwdMatchError = false;

   if(pass != "" && confirmPass != "" && pass != confirmPass){
    this.pwdMatchError = true;
  }
}

  makeSignupRequestObject() {
    let tempSubscriberId = 0;
    tempSubscriberId = +this.commonService.lsSubscriberId();

    this.signupRequestObject = {
      APPLICATION_ID           : this.commonService.applicationId,
      STORE_ID: this.configService.getStoreID(),
      SUBSCRIBER_FIRST_NAME: this.fName,
      SUBSCRIBER_LAST_NAME: this.lName,
      SUBSCRIBER_EMAIL_ID: this.signupEmail,
      SUBSCRIBER_PASSWORD: this.signupPassword,
      SUBSCRIBER_TOKEN: "",
      SUBSCRIBER_MOBILE_NR: this.subscriberMobileNo,
      SUBSCRIBER_STATUS_CODE: ApplicationConstants.SUBSCRIBER_STATUS_CODE_PENDING,
      PROVIDER_CODE: ApplicationConstants.PROVIDER_CODE_PERSONAL,
      TEMP_SUBSCRIBER_ID: tempSubscriberId,
      TEMP_SUBSCRIBER_FLAG: this.commonService.lsTempSubscriberFlag(),
      PROFILE_ID: ApplicationConstants.DEFAULT_SUBSCRIBER_PROFILE_ID,
      REFERRAL_FLAG: this.userProfileService.referralFlag(),
      REFERRAL_CODE: this.userProfileService.referralCode,
    }
  }
  signup() {
      this.makeSignupRequestObject();
      this.signupService.subscriberRegistrationAPI(this.signupRequestObject).subscribe(data => this.handleSignupSuccess(data), error => this.handleError(error));
  }
  handleError(error) {
  }

  handleSignupSuccess(data) {
    if (data.STATUS == "OK") {

      this.emailandphonenumberverifiationService.deleteTempSubsReqObject = {
        APPLICATION_ID       : this.commonService.applicationId,
        TEMP_SUBSCRIBER_ID   : this.commonService.lsSubscriberId(),
        SUBSCRIBER_EMAIL_ID  : this.signupEmail,
        SUBSCRIBER_PASSWORD  : this.signupPassword,
        STORE_ID             : this.configService.getStoreID(),
      }

      this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
      this.emailandphonenumberverifiationService.subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;

      this.referenceMethodsService.referralFlag = false;

      this.afterSuccessfulSignUp();

    } else {
      this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
    }
  }
  // Sign Up ends

  afterSuccessfulSignUp() {
    (async () => {
      this.commonService.notifySuccessMessage(this.flashMessagesService, "User Registered Successfully.");
      await this.commonService.delay(2000);
      this._router.navigate(['/collections/otp']);
    })();
  }
  validateSignUp() {
    let disabledValue = true;

    if (this.fName != "" && this.subscriberMobileNo != "" && this.loginEmail != "" && this.loginPassword != "") disabledValue = false;

    return disabledValue;
  }

  ngOnDestroy() {
    this.commonService.sendMessage("showFM");
  }

}
