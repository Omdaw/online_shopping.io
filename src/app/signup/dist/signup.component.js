"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SignupComponent = void 0;
var core_1 = require("@angular/core");
var ApplicationConstants_1 = require("src/ApplicationConstants");
var SignupComponent = /** @class */ (function () {
    function SignupComponent(configService, _router, signupService, userProfileService, flashMessagesService, commonService, flagsService, emailandphonenumberverifiationService, referenceMethodsService) {
        this.configService = configService;
        this._router = _router;
        this.signupService = signupService;
        this.userProfileService = userProfileService;
        this.flashMessagesService = flashMessagesService;
        this.commonService = commonService;
        this.flagsService = flagsService;
        this.emailandphonenumberverifiationService = emailandphonenumberverifiationService;
        this.referenceMethodsService = referenceMethodsService;
        this.name = "";
        this.email = "";
        this.password = "";
        this.confirmPassword = "";
        this.mobileNumber = null;
        this.signupRequestObject = {};
        this.formInvalid = true;
        this.pwdMatchError = false;
        this.referralCode = "";
    }
    SignupComponent.prototype.validatePassAndConfirmPassword = function () {
        var pass = this.password;
        var confirmPass = this.confirmPassword;
        this.pwdMatchError = false;
        if (pass != "" && confirmPass != "" && pass != confirmPass) {
            this.pwdMatchError = true;
        }
    };
    SignupComponent.prototype.ngOnInit = function () {
        this.commonService.checkLoggedIn();
        // this.flagsService.hideHeaderFooter();
        this.flagsService.showSearch();
        this.flagsService.showHeaderFooter();
        if (window.innerWidth < 600) {
            this.flagsService.hideFooter();
        }
        this.referralCode = this.userProfileService.referralCode;
    };
    SignupComponent.prototype.makeSignupRequestObject = function () {
        var tempSubscriberId = 0;
        tempSubscriberId = +this.commonService.lsSubscriberId();
        this.signupRequestObject = {
            STORE_ID: this.configService.getStoreID(),
            APPLICATION_ID: this.commonService.applicationId,
            SUBSCRIBER_FIRST_NAME: this.name,
            SUBSCRIBER_LAST_NAME: "",
            SUBSCRIBER_EMAIL_ID: this.email,
            SUBSCRIBER_PASSWORD: this.password,
            SUBSCRIBER_TOKEN: "",
            SUBSCRIBER_MOBILE_NR: this.mobileNumber,
            SUBSCRIBER_STATUS_CODE: ApplicationConstants_1.ApplicationConstants.SUBSCRIBER_STATUS_CODE_PENDING,
            PROVIDER_CODE: ApplicationConstants_1.ApplicationConstants.PROVIDER_CODE_PERSONAL,
            TEMP_SUBSCRIBER_ID: tempSubscriberId,
            TEMP_SUBSCRIBER_FLAG: this.commonService.lsTempSubscriberFlag(),
            PROFILE_ID: ApplicationConstants_1.ApplicationConstants.DEFAULT_SUBSCRIBER_PROFILE_ID,
            REFERRAL_FLAG: this.userProfileService.referralFlag(),
            REFERRAL_CODE: this.userProfileService.referralCode
        };
    };
    SignupComponent.prototype.signup = function () {
        var _this = this;
        if (this.formInvalid == false && this.pwdMatchError == false) {
            this.makeSignupRequestObject();
            this.signupService.subscriberRegistrationAPI(this.signupRequestObject).subscribe(function (data) { return _this.handleSignupSuccess(data); }, function (error) { return _this.handleError(error); });
        }
    };
    SignupComponent.prototype.handleSignupSuccess = function (data) {
        if (data.STATUS == "OK") {
            // this.commonService.notifyMessage(this.flashMessagesService, "User Registered Successfully.");
            this.emailandphonenumberverifiationService.deleteTempSubsReqObject = {
                APPLICATION_ID: this.commonService.applicationId,
                TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
                SUBSCRIBER_EMAIL_ID: this.email,
                SUBSCRIBER_PASSWORD: this.password,
                STORE_ID: this.configService.getStoreID()
            };
            this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
            this.emailandphonenumberverifiationService.subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
            this._router.navigate(['/collections/otp']);
            this.referenceMethodsService.referralFlag = false;
        }
        else {
            this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
        }
    };
    SignupComponent.prototype.handleError = function (error) {
    };
    SignupComponent.prototype.clearSignupForm = function () {
        this.name = "";
        this.email = "";
        this.password = "";
        this.confirmPassword = "";
    };
    SignupComponent.prototype.validateForm = function (ngObject) {
        this.formInvalid = true;
        if (ngObject._parent.form.status == "VALID") {
            this.formInvalid = false;
        }
    };
    SignupComponent.prototype.onValueIn = function () {
        this.userProfileService.referralCode = this.referralCode;
    };
    SignupComponent = __decorate([
        core_1.Component({
            selector: 'app-signup',
            templateUrl: './signup.component.html',
            styleUrls: ['./signup.component.css']
        })
    ], SignupComponent);
    return SignupComponent;
}());
exports.SignupComponent = SignupComponent;
