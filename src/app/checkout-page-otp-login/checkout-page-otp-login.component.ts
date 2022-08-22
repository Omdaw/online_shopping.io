import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  selector: 'app-checkout-page-otp-login',
  templateUrl: './checkout-page-otp-login.component.html',
  styleUrls: ['./checkout-page-otp-login.component.css']
})
export class CheckoutPageOtpLoginComponent implements OnInit {

  sendOtpPart = true;
  enterOtpPart = false;
  otpFirstname: string;
  otpMobileNumber: number;
  otpCheckInRequestObject: any;
  mobileOtp = "";

  constructor(
    private flagsService: FlagsService,
    private commonService: CommonService,
    private _router: Router,
    public socialSignupService: SocialSignupService,
    public signupService: SignupService,
    public emailandphonenumberverifiationService: EmailandphonenumberverifiationService,
    public configService: ConfigService,
    public referenceMethodsService: ReferenceMethodsService,
    public userProfileService:UserProfileService
  ) { }

  ngOnInit(): void {
    this.commonService.sendMessage("hideFM");
    this.flagsService.hideHeader();
    this.flagsService.hideFooter();
    this.flagsService.hideHeaderFooter();

    this.userProfileService.loginCallFromCheckoutPage = 1;
    // if (this.userProfileService.loggedIn) this.showDeliveryAddress();
  }

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
    console.log("make ends");
  }
  otpCheckIn() {
    this.makeOtpCheckInRequestObjectObject();
    this.signupService.subscriberRegistrationAPI(this.otpCheckInRequestObject)
      .subscribe(data => this.handleOtpCheckInSuccess(data), error => error);
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

      // this._router.navigate(['mobile-otp']);
      this.sendOtpPart = false;
      this.enterOtpPart = true;

      this.referenceMethodsService.referralFlag = false;
    }
  }
  // OTP CheckIn Logic Ends 

  verifyMobileOtp() {
    this.emailandphonenumberverifiationService.mobileOtp = this.mobileOtp;
    this.emailandphonenumberverifiationService.verifyMobileOtp();
  }

}
