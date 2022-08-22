"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EmailandphonenumberverifiationService = void 0;
var core_1 = require("@angular/core");
var EmailandphonenumberverifiationService = /** @class */ (function () {
    function EmailandphonenumberverifiationService(signupService, loginservice, commonService, flashMessagesService, userProfileService, _router, flagsService) {
        this.signupService = signupService;
        this.loginservice = loginservice;
        this.commonService = commonService;
        this.flashMessagesService = flashMessagesService;
        this.userProfileService = userProfileService;
        this._router = _router;
        this.flagsService = flagsService;
        this.progressBar = false;
        this.otp = "";
        this.subscriberId = 0;
        this.otpResultObject = { STATUS: "" };
        this.otpError = { STATUS: "" };
        this.deleteTempSubsReqObject = {
            APPLICATION_ID: 0,
            TEMP_SUBSCRIBER_ID: 0,
            SUBSCRIBER_EMAIL_ID: "",
            SUBSCRIBER_PASSWORD: "",
            STORE_ID: undefined
        };
        //OTP CheckIn Starts here 
        this.mobileOtp = "";
        this.deleteTempSubsReqObjectThroughOtp = {
            TEMP_SUBSCRIBER_ID: 0,
            SUBSCRIBER_MOBILE_NR: 0,
            STORE_ID: undefined
        };
    }
    EmailandphonenumberverifiationService.prototype.verifyOtp = function () {
        var _this = this;
        this.progressBar = true;
        var requestObject = {
            SUBSCRIBER_ID: this.subscriberId,
            SUBSCRIBER_EMAIL_OTP_CODE: this.otp
        };
        this.signupService.verifyEmailIdAPI(requestObject).subscribe(function (data) { return _this.handleVerifyOtpSuccess(data); }, function (error) { return error; });
    };
    EmailandphonenumberverifiationService.prototype.handleVerifyOtpSuccess = function (data) {
        if (data.STATUS == "OK") {
            this.progressBar = false;
            this.otpResultObject = data;
            this.afterEmailVerification();
        }
        else {
            this.commonService.notifyMessage(this.flashMessagesService, "Otp is invalid");
        }
    };
    EmailandphonenumberverifiationService.prototype.afterEmailVerification = function () {
        var _this = this;
        var tempSubscriberFlag = 0;
        tempSubscriberFlag = +this.commonService.lsTempSubscriberFlag();
        if (tempSubscriberFlag > 0) {
            this.loginservice.deleteTemporarySubscriberAndLogInAPI(this.deleteTempSubsReqObject)
                .subscribe(function (data) { return _this.handleDeleteTempSubscriberSuccess(data); }, function (error) { return _this.handleError(error); });
        }
        this.commonService.addSubscriberIdTols(this.subscriberId);
    };
    // Temp Subscriber Management
    EmailandphonenumberverifiationService.prototype.handleDeleteTempSubscriberSuccess = function (data) {
        if (data.STATUS == "OK") {
            // this.commonService.notifyMessage(this.flashMessagesService, "User Login Success.");
            var authToken = data.SUBSCRIBER.AUTHENTICATION_TOKEN;
            var subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
            var tempSubscriberFlag = 0;
            var transactionId = 0;
            this.commonService.addStoreData(authToken, subscriberId, tempSubscriberFlag, transactionId);
            var subscriberObject = {
                name: data.SUBSCRIBER.SUBSCRIBER_FIRST_NAME + " " + this.commonService.checkIfNull(data.SUBSCRIBER.SUBSCRIBER_LAST_NAME),
                email: data.SUBSCRIBER.SUBSCRIBER_EMAIL_ID,
                mobile: data.SUBSCRIBER.SUBSCRIBER_MOBILE_NR
            };
            this.commonService.addSubscriberObjectTols(subscriberObject);
            this.loginservice.checkTransactionArrayAndUpdate(data);
            this.afterSuccessfullLogin();
            this.commonService.isUserLoggedIn();
        }
        else {
            this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
        }
    };
    // Temp Subscriber Management ends
    EmailandphonenumberverifiationService.prototype.handleError = function (error) {
    };
    EmailandphonenumberverifiationService.prototype.resendOtpToEmail = function () {
        var _this = this;
        var tempObject = {
            SUBSCRIBER_ID: this.subscriberId
        };
        this.signupService.resendOtpToEmail(tempObject).subscribe(function (data) { return _this.handleResendOtpSuccess(data); }, function (error) { return error; });
    };
    EmailandphonenumberverifiationService.prototype.handleResendOtpSuccess = function (data) {
        if (data.STATUS == "OK") {
            this.commonService.notifySuccessMessage(this.flashMessagesService, "OTP has been resent.");
        }
    };
    //Send OTP tp Mobile
    EmailandphonenumberverifiationService.prototype.resendOtpToMobileNumber = function () {
        var _this = this;
        var tempObject = {
            SUBSCRIBER_ID: this.subscriberId
        };
        this.signupService.resendOTPToMobileNumber(tempObject).subscribe(function (data) { return _this.handleResendOtpToMobileNumberSuccess(data); }, function (error) { return error; });
    };
    EmailandphonenumberverifiationService.prototype.handleResendOtpToMobileNumberSuccess = function (data) {
        if (data.STATUS == "OK") {
            this.commonService.notifySuccessMessage(this.flashMessagesService, "OTP has been resent.");
        }
    };
    EmailandphonenumberverifiationService.prototype.afterSuccessfullLogin = function () {
        if (this.userProfileService.loginCallFromCheckoutPage == 1) {
            this.userProfileService.loginCallFromCheckoutPage = 0;
            this._router.navigate(['/collections/checkout-new'], { replaceUrl: true });
        }
        else {
            this._router.navigate(['/'], { replaceUrl: true });
        }
    };
    EmailandphonenumberverifiationService.prototype.verifyMobileOtp = function () {
        var _this = this;
        this.progressBar = true;
        var requestObject = {
            SUBSCRIBER_ID: this.subscriberId,
            SUBSCRIBER_SMS_OTP_CODE: this.mobileOtp
        };
        this.signupService.verifyMobileNumberAPI(requestObject).subscribe(function (data) { return _this.handleVerifyMobileOtpSuccess(data); }, function (error) { return error; });
    };
    EmailandphonenumberverifiationService.prototype.handleVerifyMobileOtpSuccess = function (data) {
        if (data.STATUS == "OK") {
            this.progressBar = false;
            // if(this.flagsService.mobileOtpVerficationCallFromUpdateMobile){
            //   this.flagsService.mobileOtpVerficationCallFromUpdateMobile = false;
            //   this.commonService.openAlertBar("Your Mobile Number has been updated succussfully.");
            // } else {
            this.otpResultObject = data;
            this.afterMobileNumberVerification();
            // }
        }
        else {
            this.commonService.notifyMessage(this.flashMessagesService, "Otp is invalid");
        }
    };
    EmailandphonenumberverifiationService.prototype.afterMobileNumberVerification = function () {
        var _this = this;
        var tempSubscriberFlag = 0;
        tempSubscriberFlag = +this.commonService.lsTempSubscriberFlag();
        if (tempSubscriberFlag > 0) {
            this.loginservice.deleteTemporarySubscriberAndLogInAPI(this.deleteTempSubsReqObjectThroughOtp)
                .subscribe(function (data) { return _this.handleDeleteTempSubscriberSuccess(data); }, function (error) { return _this.handleError(error); });
        }
        this.commonService.addSubscriberIdTols(this.subscriberId);
        // this._router.navigate(['/collections/checkout-new'], { replaceUrl: true });
    };
    EmailandphonenumberverifiationService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], EmailandphonenumberverifiationService);
    return EmailandphonenumberverifiationService;
}());
exports.EmailandphonenumberverifiationService = EmailandphonenumberverifiationService;
