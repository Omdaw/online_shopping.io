"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CheckoutPageOtpLoginComponent = void 0;
var core_1 = require("@angular/core");
var ApplicationConstants_1 = require("src/ApplicationConstants");
var CheckoutPageOtpLoginComponent = /** @class */ (function () {
    function CheckoutPageOtpLoginComponent(flagsService, commonService, _router, socialSignupService, signupService, emailandphonenumberverifiationService, configService, referenceMethodsService, userProfileService) {
        this.flagsService = flagsService;
        this.commonService = commonService;
        this._router = _router;
        this.socialSignupService = socialSignupService;
        this.signupService = signupService;
        this.emailandphonenumberverifiationService = emailandphonenumberverifiationService;
        this.configService = configService;
        this.referenceMethodsService = referenceMethodsService;
        this.userProfileService = userProfileService;
        this.sendOtpPart = true;
        this.enterOtpPart = false;
        this.mobileOtp = "";
    }
    CheckoutPageOtpLoginComponent.prototype.ngOnInit = function () {
        this.commonService.sendMessage("hideFM");
        this.flagsService.hideHeader();
        this.flagsService.hideFooter();
        this.flagsService.hideHeaderFooter();
        this.userProfileService.loginCallFromCheckoutPage = 1;
        // if (this.userProfileService.loggedIn) this.showDeliveryAddress();
    };
    CheckoutPageOtpLoginComponent.prototype.makeOtpCheckInRequestObjectObject = function () {
        this.otpCheckInRequestObject = {
            APPLICATION_ID: this.commonService.applicationId,
            SUBSCRIBER_FIRST_NAME: this.otpFirstname,
            SUBSCRIBER_STATUS_CODE: ApplicationConstants_1.ApplicationConstants.SUBSCRIBER_STATUS_CODE_ACTIVATED,
            PROVIDER_CODE: ApplicationConstants_1.ApplicationConstants.PROVIDER_CODE_OTP_CHECK_IN,
            TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            TEMP_SUBSCRIBER_FLAG: 1,
            PROFILE_ID: ApplicationConstants_1.ApplicationConstants.DEFAULT_SUBSCRIBER_PROFILE_ID,
            STORE_ID: this.configService.getStoreID(),
            SUBSCRIBER_MOBILE_NR: this.otpMobileNumber
        };
        console.log("make ends");
    };
    CheckoutPageOtpLoginComponent.prototype.otpCheckIn = function () {
        var _this = this;
        this.makeOtpCheckInRequestObjectObject();
        this.signupService.subscriberRegistrationAPI(this.otpCheckInRequestObject)
            .subscribe(function (data) { return _this.handleOtpCheckInSuccess(data); }, function (error) { return error; });
    };
    CheckoutPageOtpLoginComponent.prototype.handleOtpCheckInSuccess = function (data) {
        if (data.STATUS == "OK") {
            this.emailandphonenumberverifiationService.deleteTempSubsReqObjectThroughOtp = {
                TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
                SUBSCRIBER_MOBILE_NR: this.otpMobileNumber,
                STORE_ID: this.configService.getStoreID()
            };
            this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
            this.emailandphonenumberverifiationService.subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
            // this._router.navigate(['mobile-otp']);
            this.sendOtpPart = false;
            this.enterOtpPart = true;
            this.referenceMethodsService.referralFlag = false;
        }
    };
    // OTP CheckIn Logic Ends 
    CheckoutPageOtpLoginComponent.prototype.verifyMobileOtp = function () {
        this.emailandphonenumberverifiationService.mobileOtp = this.mobileOtp;
        this.emailandphonenumberverifiationService.verifyMobileOtp();
    };
    CheckoutPageOtpLoginComponent = __decorate([
        core_1.Component({
            selector: 'app-checkout-page-otp-login',
            templateUrl: './checkout-page-otp-login.component.html',
            styleUrls: ['./checkout-page-otp-login.component.css']
        })
    ], CheckoutPageOtpLoginComponent);
    return CheckoutPageOtpLoginComponent;
}());
exports.CheckoutPageOtpLoginComponent = CheckoutPageOtpLoginComponent;
