"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LoginComponent = void 0;
var core_1 = require("@angular/core");
var ApplicationConstants_1 = require("src/ApplicationConstants");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(configService, _router, _route, loginservice, userProfileService, flashMessagesService, commonService, socialSignupService, flagsService, signupService, emailandphonenumberverifiationService, referenceMethodsService, walletMethodsService) {
        this.configService = configService;
        this._router = _router;
        this._route = _route;
        this.loginservice = loginservice;
        this.userProfileService = userProfileService;
        this.flashMessagesService = flashMessagesService;
        this.commonService = commonService;
        this.socialSignupService = socialSignupService;
        this.flagsService = flagsService;
        this.signupService = signupService;
        this.emailandphonenumberverifiationService = emailandphonenumberverifiationService;
        this.referenceMethodsService = referenceMethodsService;
        this.walletMethodsService = walletMethodsService;
        this.loginEmail = "";
        this.loginPassword = "";
        this.formInvalid = true;
        this.referralFlag = false;
        this.loginRequestObject = {};
        /** Guest CheckIn */
        this.guestCheckInFormInValid = true;
        this.guestName = "";
        this.guestEmail = "";
        this.guestCheckInRequestObject = {};
        /** Guest CheckIn ends */
        // Referral Logic 
        this.referralCode = "";
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.referralCode = this.userProfileService.referralCode;
        this.commonService.checkLoggedIn();
        // this.flagsService.hideHeaderFooter();
        this.flagsService.showSearch();
        this.flagsService.showHeaderFooter();
        if (window.innerWidth < 600) {
            this.flagsService.hideFooter();
        }
        window.scroll(0, 0);
        this.GetEncodedSubscriberIdByParam();
    };
    LoginComponent.prototype.GetEncodedSubscriberIdByParam = function () {
        var _this = this;
        this._route.params.subscribe(function (params) {
            if (params['subscriberId'] != undefined) {
                _this.referenceMethodsService.encodedSubscriberId = params['subscriberId'];
                _this.referenceMethodsService.referralFlag = true;
                _this.referenceMethodsService.referralUrl = _this._router.url;
            }
        });
        console.log(this._router.url);
    };
    LoginComponent.prototype.makeLoginRequestObject = function () {
        this.loginRequestObject = {
            SUBSCRIBER_EMAIL_ID: this.loginEmail,
            SUBSCRIBER_PASSWORD: this.loginPassword
        };
    };
    LoginComponent.prototype.makeDeleteTempSubscriberRequestObject = function () {
        this.loginRequestObject = {
            TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            SUBSCRIBER_EMAIL_ID: this.loginEmail,
            SUBSCRIBER_PASSWORD: this.loginPassword,
            STORE_ID: this.configService.getStoreID(),
            REFERRAL_FLAG: this.referenceMethodsService.referralFlag,
            REFERRAL_URL: this.referenceMethodsService.referralUrl
        };
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        if (this.formInvalid == false) {
            var tempSubscriberFlag = 0;
            tempSubscriberFlag = +this.commonService.lsTempSubscriberFlag();
            if (tempSubscriberFlag > 0) {
                this.makeDeleteTempSubscriberRequestObject();
                this.loginservice.deleteTemporarySubscriberAndLogInAPI(this.loginRequestObject).subscribe(function (data) { return _this.handleTempSubscriberLoginSuccess(data); }, function (error) { return _this.handleError(error); });
            }
            else {
                this.makeLoginRequestObject();
                this.loginservice.subscriberLoginAPI(this.loginRequestObject).subscribe(function (data) { return _this.handleLoginSuccess(data); }, function (error) { return _this.handleError(error); });
            }
        }
    };
    LoginComponent.prototype.handleLoginSuccess = function (data) {
        if (data.STATUS == "OK") {
            this.commonService.notifyMessage(this.flashMessagesService, "User Login Success.");
            this.commonService.addSubscriberIdTols(data.SUBSCRIBER.SUBSCRIBER_ID);
            this.commonService.addLoggedInUsernameTols(data.SUBSCRIBER.SUBSCRIBER_FIRST_NAME + data.SUBSCRIBER.SUBSCRIBER_LAST_NAME);
            this.commonService.addTempSubscriberFlagTols(0);
            this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
            this.commonService.isUserLoggedIn();
            this.afterSuccessfullLogin();
        }
        else {
            this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
        }
    };
    LoginComponent.prototype.handleTempSubscriberLoginSuccess = function (data) {
        if (data.STATUS == "OK") {
            if (data.SUBSCRIBER.SUBSCRIBER_EMAIL_OTP_STATUS == 1) { // this means otp is verified
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
                this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
                this.emailandphonenumberverifiationService.deleteTempSubsReqObject = {
                    APPLICATION_ID: this.commonService.applicationId,
                    TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
                    SUBSCRIBER_EMAIL_ID: this.loginEmail,
                    SUBSCRIBER_PASSWORD: this.loginPassword,
                    STORE_ID: this.configService.getStoreID()
                };
                this.emailandphonenumberverifiationService.subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID; // Checklist-3 otp issue fix
                this._router.navigate(['/collections/otp']);
            }
            this.walletMethodsService.fetchWalletMoneyBySubscriberIdAPI();
            this.referenceMethodsService.referralFlag = false;
        }
        else {
            this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
        }
    };
    LoginComponent.prototype.afterSuccessfullLogin = function () {
        if (this.userProfileService.loginCallFromCheckoutPage == 1) {
            this.userProfileService.loginCallFromCheckoutPage = 0;
            this.commonService.handleSuccessWithNavigation("User Login Success.", this.flashMessagesService, '/');
        }
        else {
            this.commonService.handleSuccessWithNavigation("User Login Success.", this.flashMessagesService, '/');
        }
    };
    LoginComponent.prototype.handleError = function (error) {
    };
    LoginComponent.prototype.clearSignupForm = function () {
        this.loginEmail = "";
        this.loginPassword = "";
    };
    LoginComponent.prototype.validateForm = function (ngObject) {
        this.formInvalid = true;
        if (ngObject._parent.form.status == "VALID") {
            this.formInvalid = false;
        }
    };
    LoginComponent.prototype.validateGuestCheckInForm = function (ngObject) {
        this.guestCheckInFormInValid = true;
        if (ngObject._parent.form.status == "VALID") {
            this.guestCheckInFormInValid = false;
        }
    };
    LoginComponent.prototype.guestCheckIn = function () {
        var _this = this;
        if (this.guestCheckInFormInValid == false) {
            this.makeGuestCheckInRequestObjectObject();
            this.signupService.subscriberRegistrationAPI(this.guestCheckInRequestObject).
                subscribe(function (data) { return _this.socialSignupService.handleGuestCheckInSuccess(data); }, function (error) { return error; });
        }
    };
    LoginComponent.prototype.makeGuestCheckInRequestObjectObject = function () {
        this.guestCheckInRequestObject = {
            APPLICATION_ID: this.commonService.applicationId,
            SUBSCRIBER_FIRST_NAME: this.guestName,
            SUBSCRIBER_EMAIL_ID: this.guestEmail,
            SUBSCRIBER_TOKEN: "",
            SUBSCRIBER_STATUS_CODE: ApplicationConstants_1.ApplicationConstants.SUBSCRIBER_STATUS_CODE_ACTIVATED,
            PROVIDER_CODE: ApplicationConstants_1.ApplicationConstants.PROVIDER_CODE_GUEST_CHECK_IN,
            TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            TEMP_SUBSCRIBER_FLAG: 1,
            PROFILE_ID: ApplicationConstants_1.ApplicationConstants.DEFAULT_SUBSCRIBER_PROFILE_ID,
            STORE_ID: this.configService.getStoreID(),
            SUBSCRIBER_MOBILE_NR: this.guestMobileNumber,
            REFERRAL_FLAG: this.referenceMethodsService.referralFlag
        };
    };
    LoginComponent.prototype.handleGuestCheckInSuccess = function (data) {
    };
    LoginComponent.prototype.onValueIn = function () {
        this.userProfileService.referralCode = this.referralCode;
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.css']
        })
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
