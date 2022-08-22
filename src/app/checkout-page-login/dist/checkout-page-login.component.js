"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.UnavailableProductsDialog = exports.CheckoutPageLoginComponent = void 0;
var core_1 = require("@angular/core");
var ApplicationConstants_1 = require("src/ApplicationConstants");
var dialog_1 = require("@angular/material/dialog");
var CheckoutPageLoginComponent = /** @class */ (function () {
    function CheckoutPageLoginComponent(flagsService, commonService, _router, socialSignupService, configService, referenceMethodsService, loginservice, flashMessagesService, emailandphonenumberverifiationService, walletMethodsService, transactionsService, dialog) {
        this.flagsService = flagsService;
        this.commonService = commonService;
        this._router = _router;
        this.socialSignupService = socialSignupService;
        this.configService = configService;
        this.referenceMethodsService = referenceMethodsService;
        this.loginservice = loginservice;
        this.flashMessagesService = flashMessagesService;
        this.emailandphonenumberverifiationService = emailandphonenumberverifiationService;
        this.walletMethodsService = walletMethodsService;
        this.transactionsService = transactionsService;
        this.dialog = dialog;
        this.loginEmail = "";
        this.loginPassword = "";
        this.loginRequestObject = {};
    }
    CheckoutPageLoginComponent.prototype.ngOnInit = function () {
        this.commonService.sendMessage("hideFM");
        this.flagsService.hideHeader();
        this.flagsService.hideFooter();
        this.flagsService.hideHeaderFooter();
    };
    CheckoutPageLoginComponent.prototype.makeLoginRequestObject = function () {
        this.loginRequestObject = {
            APPLICATION_ID: this.commonService.applicationId,
            SUBSCRIBER_EMAIL_ID: this.loginEmail,
            SUBSCRIBER_PASSWORD: this.loginPassword
        };
    };
    CheckoutPageLoginComponent.prototype.makeDeleteTempSubscriberRequestObject = function () {
        this.loginRequestObject = {
            APPLICATION_ID: this.commonService.applicationId,
            TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            SUBSCRIBER_EMAIL_ID: this.loginEmail,
            SUBSCRIBER_PASSWORD: this.loginPassword,
            STORE_ID: this.configService.getStoreID(),
            REFERRAL_FLAG: this.referenceMethodsService.referralFlag,
            REFERRAL_URL: this.referenceMethodsService.referralUrl
        };
    };
    CheckoutPageLoginComponent.prototype.login = function () {
        var _this = this;
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
    };
    CheckoutPageLoginComponent.prototype.handleError = function (error) {
    };
    CheckoutPageLoginComponent.prototype.handleLoginSuccess = function (data) {
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
    CheckoutPageLoginComponent.prototype.handleTempSubscriberLoginSuccess = function (data) {
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
                this._router.navigate(['/collections/otp']);
            }
            this.walletMethodsService.fetchWalletMoneyBySubscriberIdAPI();
            this.referenceMethodsService.referralFlag = false;
        }
        else {
            this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
        }
    };
    CheckoutPageLoginComponent.prototype.afterSuccessfullLogin = function () {
        var _this = this;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.transactionsService.checkoutApi();
                        this.commonService.notifySuccessMessage(this.flashMessagesService, "User Login Success.");
                        return [4 /*yield*/, this.delay(ApplicationConstants_1.ApplicationConstants.notification_display_time)];
                    case 1:
                        _a.sent();
                        this._router.navigate(['/collections/checkout-new'], { replaceUrl: true });
                        (function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.commonService.delay(ApplicationConstants_1.ApplicationConstants.wait_time)];
                                    case 1:
                                        _a.sent();
                                        if (this.transactionsService.unavailableProductsArray.length > 0) {
                                            this.openDialog();
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); })();
                        return [2 /*return*/];
                }
            });
        }); })();
    };
    CheckoutPageLoginComponent.prototype.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    CheckoutPageLoginComponent.prototype.openDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(UnavailableProductsDialog, {
            width: '1200px'
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.transactionsService.checkCartItems();
        });
    };
    // Dialog ends
    CheckoutPageLoginComponent.prototype.ngOnDestroy = function () {
        this.commonService.sendMessage("showFM");
    };
    CheckoutPageLoginComponent = __decorate([
        core_1.Component({
            selector: 'app-checkout-page-login',
            templateUrl: './checkout-page-login.component.html',
            styleUrls: ['./checkout-page-login.component.css']
        })
    ], CheckoutPageLoginComponent);
    return CheckoutPageLoginComponent;
}());
exports.CheckoutPageLoginComponent = CheckoutPageLoginComponent;
var UnavailableProductsDialog = /** @class */ (function () {
    function UnavailableProductsDialog(configService, unavailableProdDialog, data, transactionsService) {
        this.configService = configService;
        this.unavailableProdDialog = unavailableProdDialog;
        this.data = data;
        this.transactionsService = transactionsService;
    }
    /* To copy Text from Textbox */
    UnavailableProductsDialog.prototype.copyInputMessage = function (inputElement) {
        console.log("Hello");
        console.log(inputElement);
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
    };
    UnavailableProductsDialog.prototype.onNoClick = function () {
        this.unavailableProdDialog.close();
    };
    UnavailableProductsDialog.prototype.closeDialogue = function () {
        this.unavailableProdDialog.close();
    };
    UnavailableProductsDialog = __decorate([
        __param(2, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], UnavailableProductsDialog);
    return UnavailableProductsDialog;
}());
exports.UnavailableProductsDialog = UnavailableProductsDialog;
