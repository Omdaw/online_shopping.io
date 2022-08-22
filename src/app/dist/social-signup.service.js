"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SocialSignupService = void 0;
var core_1 = require("@angular/core");
var ApplicationConstants_1 = require("src/ApplicationConstants");
var angularx_social_login_1 = require("angularx-social-login");
var SocialSignupService = /** @class */ (function () {
    function SocialSignupService(configService, _router, _socioAuthServ, signupService, commonService, flashMessagesService, userProfileService, subscriberService, transactionService, fetchingproductsService, referenceMethodsService, walletMethodsService, loginservice) {
        this.configService = configService;
        this._router = _router;
        this._socioAuthServ = _socioAuthServ;
        this.signupService = signupService;
        this.commonService = commonService;
        this.flashMessagesService = flashMessagesService;
        this.userProfileService = userProfileService;
        this.subscriberService = subscriberService;
        this.transactionService = transactionService;
        this.fetchingproductsService = fetchingproductsService;
        this.referenceMethodsService = referenceMethodsService;
        this.walletMethodsService = walletMethodsService;
        this.loginservice = loginservice;
        this.requestFrom = "";
        this.googleLoginRequestObject = {};
        // fetch cart in progress 
        this.fetchCartInProgressRequestObject = {};
        this.subscriberId = 0;
    }
    // Method to sign in with google/facebook
    SocialSignupService.prototype.singIn = function (platform) {
        var _this = this;
        if (platform == "Google") {
            platform = angularx_social_login_1.GoogleLoginProvider.PROVIDER_ID;
            this.requestFrom = "Google";
        }
        else if (platform == "Facebook") {
            this.requestFrom = "Facebook";
            platform = angularx_social_login_1.FacebookLoginProvider.PROVIDER_ID;
        }
        this._socioAuthServ.signIn(platform).then(function (response) {
            console.log(platform + " logged in user data is= ", response);
            _this.user = response;
            if (_this.requestFrom == "Google")
                _this.makeGoogleLoginRequestObject(response);
            if (_this.requestFrom == "Facebook")
                _this.makeFacebookLoginRequestObject(response);
            _this.googleSignup();
        });
    };
    SocialSignupService.prototype.makeGoogleLoginRequestObject = function (data) {
        this.googleLoginRequestObject = {
            APPLICATION_ID: this.commonService.applicationId,
            SUBSCRIBER_FIRST_NAME: data.name,
            SUBSCRIBER_EMAIL_ID: data.email,
            SUBSCRIBER_TOKEN: data.authToken,
            SUBSCRIBER_STATUS_CODE: ApplicationConstants_1.ApplicationConstants.SUBSCRIBER_STATUS_CODE_ACTIVATED,
            PROVIDER_CODE: ApplicationConstants_1.ApplicationConstants.PROVIDER_CODE_GOOGLE,
            TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            TEMP_SUBSCRIBER_FLAG: 1,
            PROFILE_ID: ApplicationConstants_1.ApplicationConstants.DEFAULT_SUBSCRIBER_PROFILE_ID,
            STORE_ID: this.configService.getStoreID(),
            REFERRAL_FLAG: this.userProfileService.referralFlag(),
            REFERRAL_CODE: this.userProfileService.referralCode
        };
    };
    SocialSignupService.prototype.makeFacebookLoginRequestObject = function (data) {
        this.googleLoginRequestObject = {
            APPLICATION_ID: this.commonService.applicationId,
            SUBSCRIBER_FIRST_NAME: data.name,
            SUBSCRIBER_EMAIL_ID: data.email,
            SUBSCRIBER_TOKEN: data.authToken,
            SUBSCRIBER_STATUS_CODE: ApplicationConstants_1.ApplicationConstants.SUBSCRIBER_STATUS_CODE_ACTIVATED,
            PROVIDER_CODE: ApplicationConstants_1.ApplicationConstants.PROVIDER_CODE_FACEBOOK,
            TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            TEMP_SUBSCRIBER_FLAG: 1,
            PROFILE_ID: ApplicationConstants_1.ApplicationConstants.DEFAULT_SUBSCRIBER_PROFILE_ID,
            STORE_ID: this.configService.getStoreID(),
            REFERRAL_FLAG: this.userProfileService.referralFlag(),
            REFERRAL_CODE: this.userProfileService.referralCode
        };
    };
    SocialSignupService.prototype.googleSignup = function () {
        var _this = this;
        this.signupService.subscriberRegistrationAPI(this.googleLoginRequestObject).subscribe(function (data) { return _this.handleGoogleSignupSuccess(data); }, function (error) { return error; });
    };
    SocialSignupService.prototype.handleGoogleSignupSuccess = function (data) {
        if (data.STATUS == "OK") {
            this.commonService.openAlertBar("User Registered Successfully.");
            this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
            this.commonService.addSubscriberIdTols(data.SUBSCRIBER.SUBSCRIBER_ID);
            this.commonService.addTempSubscriberFlagTols(0);
            this.commonService.addLoggedInUsernameTols(data.SUBSCRIBER.SUBSCRIBER_FIRST_NAME + "  " + data.SUBSCRIBER.SUBSCRIBER_LAST_NAME);
            this.subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
            var subscriberObject = {
                name: data.SUBSCRIBER.SUBSCRIBER_FIRST_NAME + " " + data.SUBSCRIBER.SUBSCRIBER_LAST_NAME,
                email: data.SUBSCRIBER.SUBSCRIBER_EMAIL_ID,
                mobile: data.SUBSCRIBER.SUBSCRIBER_MOBILE_NR
            };
            this.commonService.addSubscriberObjectTols(subscriberObject);
            this.loginservice.checkTransactionArrayAndUpdate(data);
            this.walletMethodsService.fetchWalletMoneyBySubscriberIdAPI();
            this.fetchCartInProgress();
            this.referenceMethodsService.referralFlag = false;
        }
        else {
            this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
        }
    };
    SocialSignupService.prototype.handleGuestCheckInSuccess = function (data) {
        if (data.STATUS == "OK") {
            this.commonService.openAlertBar("Logged in as Guest successfully");
            this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
            this.commonService.addSubscriberIdTols(data.SUBSCRIBER.SUBSCRIBER_ID);
            this.commonService.addTempSubscriberFlagTols(0);
            this.commonService.addLoggedInUsernameTols(data.SUBSCRIBER.SUBSCRIBER_FIRST_NAME + "  " + data.SUBSCRIBER.SUBSCRIBER_LAST_NAME);
            this.subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
            var subscriberObject = {
                name: data.SUBSCRIBER.SUBSCRIBER_FIRST_NAME + " " + data.SUBSCRIBER.SUBSCRIBER_LAST_NAME,
                email: data.SUBSCRIBER.SUBSCRIBER_EMAIL_ID,
                mobile: data.SUBSCRIBER.SUBSCRIBER_MOBILE_NR
            };
            this.commonService.addSubscriberObjectTols(subscriberObject);
            this.loginservice.checkTransactionArrayAndUpdate(data);
            this.walletMethodsService.fetchWalletMoneyBySubscriberIdAPI();
            this.fetchCartInProgress();
            this.referenceMethodsService.referralFlag = false;
        }
        else {
            this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
        }
    };
    SocialSignupService.prototype.makeFetchCartInProgressObject = function () {
        var tempObj = {
            SUBSCRIBER_ID: this.subscriberId,
            STORE_ID: this.configService.getStoreID()
        };
        this.fetchCartInProgressRequestObject = tempObj;
    };
    SocialSignupService.prototype.fetchCartInProgress = function () {
        var _this = this;
        this.makeFetchCartInProgressObject();
        this.subscriberService.fetchCartInProgressTransactionsBySubscriberIdAPI(this.fetchCartInProgressRequestObject)
            .subscribe(function (data) { return _this.handleFetchCartInProgressResponse(data); }, function (error) { return error; });
    };
    SocialSignupService.prototype.handleFetchCartInProgressResponse = function (data) {
        var _this = this;
        if (data.STATUS == "OK") {
            this.transactionService.transactionDetailsArray = [];
            if (data.TRANSACTION && data.TRANSACTION.length > 0) {
                data.TRANSACTION[0].TRANSACTION_DETAIL.forEach(function (element) {
                    if (element.TRANSACTION_DETAIL_TYPE_CODE == 1) { //Because we are  also getting Delivery Charge and Convenience fee
                        _this.transactionService.transactionDetailsArray.push(element);
                    }
                });
                this.fetchingproductsService.checkOnlyTransactions();
            }
            if (this.transactionService.transactionDetailsArray.length > 0) {
                this.commonService.addTransactionIdTols();
            }
            this.afterSuccessfullLogin();
            this.commonService.isUserLoggedIn();
        }
    };
    // fetch cart in progress ends
    SocialSignupService.prototype.afterSuccessfullLogin = function () {
        if (this.userProfileService.loginCallFromCheckoutPage == 1) {
            this.userProfileService.loginCallFromCheckoutPage = 0;
            // this._router.navigate(['checkout-new']);
            location.reload();
        }
        else {
            this._router.navigate(['/']);
        }
    };
    // Method to log out from google.
    SocialSignupService.prototype.signOut = function () {
        this._socioAuthServ.signOut();
        this.user = null;
        console.log('User signed out.');
    };
    SocialSignupService.prototype.ngOnInit = function () {
    };
    SocialSignupService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], SocialSignupService);
    return SocialSignupService;
}());
exports.SocialSignupService = SocialSignupService;
