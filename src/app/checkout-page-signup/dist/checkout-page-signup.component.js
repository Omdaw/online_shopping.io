"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.CheckoutPageSignupComponent = void 0;
var core_1 = require("@angular/core");
var ApplicationConstants_1 = require("src/ApplicationConstants");
var CheckoutPageSignupComponent = /** @class */ (function () {
    function CheckoutPageSignupComponent(flagsService, commonService, _router, socialSignupService, signupService, emailandphonenumberverifiationService, configService, referenceMethodsService, flashMessagesService, userProfileService) {
        this.flagsService = flagsService;
        this.commonService = commonService;
        this._router = _router;
        this.socialSignupService = socialSignupService;
        this.signupService = signupService;
        this.emailandphonenumberverifiationService = emailandphonenumberverifiationService;
        this.configService = configService;
        this.referenceMethodsService = referenceMethodsService;
        this.flashMessagesService = flashMessagesService;
        this.userProfileService = userProfileService;
        // Sign Up 
        this.signupRequestObject = {};
        this.loginEmail = "";
        this.loginPassword = "";
        this.referralCode = "";
        this.fName = "";
        this.lName = "";
        this.subscriberMobileNo = "";
        this.signupEmail = "";
        this.signupPassword = "";
        this.confirmPassword = "";
        this.pwdMatchError = false;
    }
    CheckoutPageSignupComponent.prototype.ngOnInit = function () {
        this.commonService.sendMessage("hideFM");
        this.flagsService.hideHeader();
        this.flagsService.hideFooter();
        this.flagsService.hideHeaderFooter();
    };
    CheckoutPageSignupComponent.prototype.onValueIn = function () {
        this.userProfileService.referralCode = this.referralCode;
    };
    CheckoutPageSignupComponent.prototype.validatePassAndConfirmPassword = function () {
        var pass = this.signupPassword;
        var confirmPass = this.confirmPassword;
        this.pwdMatchError = false;
        if (pass != "" && confirmPass != "" && pass != confirmPass) {
            this.pwdMatchError = true;
        }
    };
    CheckoutPageSignupComponent.prototype.makeSignupRequestObject = function () {
        var tempSubscriberId = 0;
        tempSubscriberId = +this.commonService.lsSubscriberId();
        this.signupRequestObject = {
            APPLICATION_ID: this.commonService.applicationId,
            STORE_ID: this.configService.getStoreID(),
            SUBSCRIBER_FIRST_NAME: this.fName,
            SUBSCRIBER_LAST_NAME: this.lName,
            SUBSCRIBER_EMAIL_ID: this.signupEmail,
            SUBSCRIBER_PASSWORD: this.signupPassword,
            SUBSCRIBER_TOKEN: "",
            SUBSCRIBER_MOBILE_NR: this.subscriberMobileNo,
            SUBSCRIBER_STATUS_CODE: ApplicationConstants_1.ApplicationConstants.SUBSCRIBER_STATUS_CODE_PENDING,
            PROVIDER_CODE: ApplicationConstants_1.ApplicationConstants.PROVIDER_CODE_PERSONAL,
            TEMP_SUBSCRIBER_ID: tempSubscriberId,
            TEMP_SUBSCRIBER_FLAG: this.commonService.lsTempSubscriberFlag(),
            PROFILE_ID: ApplicationConstants_1.ApplicationConstants.DEFAULT_SUBSCRIBER_PROFILE_ID,
            REFERRAL_FLAG: this.userProfileService.referralFlag(),
            REFERRAL_CODE: this.userProfileService.referralCode
        };
    };
    CheckoutPageSignupComponent.prototype.signup = function () {
        var _this = this;
        this.makeSignupRequestObject();
        this.signupService.subscriberRegistrationAPI(this.signupRequestObject).subscribe(function (data) { return _this.handleSignupSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    CheckoutPageSignupComponent.prototype.handleError = function (error) {
    };
    CheckoutPageSignupComponent.prototype.handleSignupSuccess = function (data) {
        if (data.STATUS == "OK") {
            this.emailandphonenumberverifiationService.deleteTempSubsReqObject = {
                APPLICATION_ID: this.commonService.applicationId,
                TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
                SUBSCRIBER_EMAIL_ID: this.signupEmail,
                SUBSCRIBER_PASSWORD: this.signupPassword,
                STORE_ID: this.configService.getStoreID()
            };
            this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
            this.emailandphonenumberverifiationService.subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
            this.referenceMethodsService.referralFlag = false;
            this.afterSuccessfulSignUp();
        }
        else {
            this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
        }
    };
    // Sign Up ends
    CheckoutPageSignupComponent.prototype.afterSuccessfulSignUp = function () {
        var _this = this;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.commonService.notifySuccessMessage(this.flashMessagesService, "User Registered Successfully.");
                        return [4 /*yield*/, this.commonService.delay(2000)];
                    case 1:
                        _a.sent();
                        this._router.navigate(['/collections/otp']);
                        return [2 /*return*/];
                }
            });
        }); })();
    };
    CheckoutPageSignupComponent.prototype.validateSignUp = function () {
        var disabledValue = true;
        if (this.fName != "" && this.subscriberMobileNo != "" && this.loginEmail != "" && this.loginPassword != "")
            disabledValue = false;
        return disabledValue;
    };
    CheckoutPageSignupComponent.prototype.ngOnDestroy = function () {
        this.commonService.sendMessage("showFM");
    };
    CheckoutPageSignupComponent = __decorate([
        core_1.Component({
            selector: 'app-checkout-page-signup',
            templateUrl: './checkout-page-signup.component.html',
            styleUrls: ['./checkout-page-signup.component.css']
        })
    ], CheckoutPageSignupComponent);
    return CheckoutPageSignupComponent;
}());
exports.CheckoutPageSignupComponent = CheckoutPageSignupComponent;
