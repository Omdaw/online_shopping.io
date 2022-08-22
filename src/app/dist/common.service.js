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
exports.CommonService = void 0;
var core_1 = require("@angular/core");
var ApplicationConstants_1 = require("src/ApplicationConstants");
var rxjs_1 = require("rxjs");
var CommonService = /** @class */ (function () {
    function CommonService(configService, userProfileService, _router, titleService, headerService, _snackBar, transactionsService) {
        this.configService = configService;
        this.userProfileService = userProfileService;
        this._router = _router;
        this.titleService = titleService;
        this.headerService = headerService;
        this._snackBar = _snackBar;
        this.transactionsService = transactionsService;
        this.STORE_CURRENCY_SYMBOL = "₹";
        this.INR_SYMBOL = "₹";
        this.storeLogo = "";
        this.applicationId = 0;
        this.currentPageCategoruId = 0;
        this.hideWAHeaderSource = new rxjs_1.Subject();
        this.hideWAHeader = this.hideWAHeaderSource.asObservable();
        this.mobNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$"; // this can be implemented like this (in HTML Page) ====>>> [pattern]="mobNumberPattern"
        this.pinCodePattern = "^((\\+91-?)|0)?[0-9]{6}$"; // this can be implemented like this (in HTML Page) ====>>> [pattern]="mobNumberPattern"
        this.STORE_CHECK_PINCODE_AT_CHECKOUT_FLAG = false; //assigned value from mainnav component
        this.addToCartButtonText = "Add to cart"; //Done //Done
        this.poweredByText = ""; //Done //Done
        this.showPartyOrBulkOrder = false; //Done //Done
        this.showDownloadApp = false; //Done //Done
        this.showGoogleSignIn = false; //Done //Done
        this.showFacebookLogin = false; //Done //Done
        this.showWallet = false; //Done //Done
        this.showGuestCheckIn = false; //Done //Done
        this.showPersonalEmailLogin = false; //Done //Done
        this.deliverySlotFlag = false; //Done //Done
        this.imagePathForNoImageForProduct = "assets/images/noProductToShowInThisCategory.jpg"; //Pending 
        this.imagePathForNoProductsInCategory = "assets/images/empty.png"; //Done //Done
    }
    CommonService.prototype.sendMessage = function (message) {
        this.hideWAHeaderSource.next(message);
    };
    CommonService.prototype.notifyMessage = function (ngflashMessage, msgToBeDisplayed) {
        // ngflashMessage.show(msgToBeDisplayed, { cssClass: 'alert-danger', timeout: ApplicationConstants.notification_display_time });
        this.openAlertBar(msgToBeDisplayed);
    };
    CommonService.prototype.notifySuccessMessage = function (ngflashMessage, msgToBeDisplayed) {
        // ngflashMessage.show(msgToBeDisplayed, { cssClass: 'alert-success', timeout: ApplicationConstants.notification_display_time });
        this.openAlertBar(msgToBeDisplayed);
    };
    CommonService.prototype.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    CommonService.prototype.numberOnly = function (event) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    };
    CommonService.prototype.checkLoggedIn = function () {
        if (this.lsTempSubscriberFlag() == 0 && this.lsSubscriberId())
            this._router.navigate(['']);
    };
    CommonService.handleSuccessNoNavigation = function (data, _flashMessagesService) {
        if (data.STATUS == "FAIL") {
            this.handleError(data.ERROR_MSG, _flashMessagesService);
        }
    };
    CommonService.handleError = function (error, _flashMessagesService) {
        _flashMessagesService.show(error, { cssClass: 'alert-danger', timeout: ApplicationConstants_1.ApplicationConstants.notification_display_time });
    };
    CommonService.prototype.handleSuccessWithNavigation = function (message, flashMessageService, navigationComponent) {
        var _this = this;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        flashMessageService.show(message, { cssClass: 'alert-success', timeout: ApplicationConstants_1.ApplicationConstants.notification_display_time });
                        return [4 /*yield*/, this.delay(ApplicationConstants_1.ApplicationConstants.notification_display_time)];
                    case 1:
                        _a.sent();
                        this._router.navigate([navigationComponent]);
                        return [2 /*return*/];
                }
            });
        }); })();
    };
    CommonService.prototype.isSubscriberLoggedIn = function () {
        var value = false;
        var subscriberId = this.lsSubscriberId();
        var tempUserFlag = this.lsTempSubscriberFlag();
        if (subscriberId > 0 && tempUserFlag == 0)
            value = true;
        return value;
    };
    CommonService.prototype.getComponentName = function () {
        return this._router.url;
    };
    CommonService.prototype.openAlertBar = function (message) {
        var action = "x";
        this._snackBar.open(message, action, {
            duration: 2000,
            panelClass: ['mat-snackbar-alert-class'],
            verticalPosition: 'top'
        });
    };
    CommonService.prototype.checkIfNull = function (param1) {
        var value = "";
        if (param1 != null &&
            param1 != "null" &&
            param1 != "undefined" &&
            param1 != "Undefined") {
            value = param1;
        }
        return value;
    };
    // checklist-2 from here 
    CommonService.prototype.setDocTitle = function (title) {
        this.titleService.setTitle(title);
    };
    CommonService.prototype.fetchStoreParams = function () {
        var _this = this;
        var tempObject = { STORE_ID: this.configService.getStoreID(), PARAMETER_TYPE: "STORE" };
        this.headerService.fetchStoreParameterAPI(tempObject).subscribe(function (data) { return _this.handleFetchStoreParams(data); }, function (error) { return error; });
    };
    CommonService.prototype.handleFetchStoreParams = function (data) {
        var _this = this;
        if (data.STATUS == "OK") {
            data.STORE_PARAMETER.forEach(function (element) {
                if (element.STORE_PARAMETER_KEY == "ADD_TO_CART_BUTTON_TEXT")
                    _this.addToCartButtonText = element.STORE_PARAMETER_VALUE;
                if (element.STORE_PARAMETER_KEY == "POWERED_BY_TEXT")
                    _this.poweredByText = element.STORE_PARAMETER_VALUE;
                if (element.STORE_PARAMETER_KEY == "EMPTY_LIST_IMAGE_PATH")
                    _this.imagePathForNoProductsInCategory = element.STORE_PARAMETER_VALUE;
                if (element.STORE_PARAMETER_KEY == "IMAGE_NOT_FOUND_FILE_NAME")
                    _this.imagePathForNoImageForProduct = element.STORE_PARAMETER_VALUE;
                if (element.STORE_PARAMETER_KEY == "ENABLE_PART_BULK_ORDER_FEATURE" && element.STORE_PARAMETER_VALUE == "1") {
                    _this.showPartyOrBulkOrder = true;
                }
                if (element.STORE_PARAMETER_KEY == "ENABLE_DOWNLOAD_APP_FEATURE" && element.STORE_PARAMETER_VALUE == "1") {
                    _this.showDownloadApp = true;
                }
                if (element.STORE_PARAMETER_KEY == "ENABLE_GOOGLE_SIGN_IN_FEATURE" && element.STORE_PARAMETER_VALUE == "1") {
                    _this.showGoogleSignIn = true;
                }
                if (element.STORE_PARAMETER_KEY == "ENABLE_FACEBOOK_LOGIN_FEATURE" && element.STORE_PARAMETER_VALUE == "1") {
                    _this.showFacebookLogin = true;
                }
                if (element.STORE_PARAMETER_KEY == "ENABLE_WALLET_FEATURE" && element.STORE_PARAMETER_VALUE == "1") {
                    _this.showWallet = true;
                }
                if (element.STORE_PARAMETER_KEY == "ENABLE_GUEST_CHECKIN_FEATURE" && element.STORE_PARAMETER_VALUE == "1") {
                    _this.showGuestCheckIn = true;
                }
                if (element.STORE_PARAMETER_KEY == "ENABLE_PERSONAL_EMAIL_FEATURE" && element.STORE_PARAMETER_VALUE == "1") {
                    _this.showPersonalEmailLogin = true;
                }
                if (element.STORE_PARAMETER_KEY == "DELIVERY_SLOT" && element.STORE_PARAMETER_VALUE == "1") {
                    _this.deliverySlotFlag = true;
                }
            });
        }
    };
    // checklist-2 till here 
    //Localstorage issues changes starts from here 
    CommonService.prototype.storeDataObject = function () {
        var objectName = "storeData" + this.configService.getStoreID();
        var storeDataObject = JSON.parse(localStorage.getItem(objectName));
        return storeDataObject;
    };
    CommonService.prototype.addStoreData = function (authToken, subscriberId, tempSubscriberFlag, transactionId) {
        var storeObject = {
            authToken: authToken,
            subscriberId: subscriberId,
            tempSubscriberFlag: tempSubscriberFlag,
            transactionId: transactionId
        };
        var objectName = "storeData" + this.configService.getStoreID();
        localStorage.setItem(objectName, JSON.stringify(storeObject));
    };
    CommonService.prototype.addSubscriberObjectTols = function (subscriberObject) {
        var objectName = "storeData" + this.configService.getStoreID();
        var storeDataObject = JSON.parse(localStorage.getItem(objectName));
        storeDataObject.subscriberObject = subscriberObject;
        localStorage.setItem(objectName, JSON.stringify(storeDataObject));
    };
    //transaction id 
    CommonService.prototype.addTransactionIdTols = function () {
        var objectName = "storeData" + this.configService.getStoreID();
        var storeDataObject = JSON.parse(localStorage.getItem(objectName));
        var transactionId = 0;
        if (this.transactionsService.transactionDetailsArray && this.transactionsService.transactionDetailsArray[0] && this.transactionsService.transactionDetailsArray[0].TRANSACTION_ID)
            transactionId = this.transactionsService.transactionDetailsArray[0].TRANSACTION_ID;
        storeDataObject.transactionId = transactionId;
        localStorage.setItem(objectName, JSON.stringify(storeDataObject));
    };
    //subcriber id 
    CommonService.prototype.addSubscriberIdTols = function (subscriberId) {
        var objectName = "storeData" + this.configService.getStoreID();
        var storeDataObject = JSON.parse(localStorage.getItem(objectName));
        storeDataObject.subscriberId = subscriberId;
        localStorage.setItem(objectName, JSON.stringify(storeDataObject));
    };
    //temp subscriber flag 
    CommonService.prototype.addTempSubscriberFlagTols = function (tempSubscriberFlag) {
        var objectName = "storeData" + this.configService.getStoreID();
        var storeDataObject = JSON.parse(localStorage.getItem(objectName));
        storeDataObject.tempSubscriberFlag = tempSubscriberFlag;
        localStorage.setItem(objectName, JSON.stringify(storeDataObject));
    };
    //logged in username
    CommonService.prototype.addLoggedInUsernameTols = function (loggedInUserName) {
        var objectName = "storeData" + this.configService.getStoreID();
        var storeDataObject = JSON.parse(localStorage.getItem(objectName));
        storeDataObject.loggedInUserName = loggedInUserName;
        localStorage.setItem(objectName, JSON.stringify(storeDataObject));
    };
    //Auth Token
    CommonService.prototype.addAuthTokenTols = function (authToken) {
        var objectName = "storeData" + this.configService.getStoreID();
        var storeDataObject = JSON.parse(localStorage.getItem(objectName));
        storeDataObject.authToken = authToken;
        localStorage.setItem(objectName, JSON.stringify(storeDataObject));
    };
    //get transaction id
    CommonService.prototype.lsTransactionId = function () {
        var transactionId = 0;
        var storeDataObject = this.storeDataObject();
        if (storeDataObject != null && storeDataObject.transactionId)
            transactionId = storeDataObject.transactionId;
        return transactionId;
    };
    //get subscriber id
    CommonService.prototype.lsSubscriberId = function () {
        var subscriberId = 0;
        var storeDataObject = this.storeDataObject();
        if (storeDataObject != null && storeDataObject.subscriberId)
            subscriberId = storeDataObject.subscriberId;
        return subscriberId;
    };
    //get temp subscriber flag
    CommonService.prototype.lsTempSubscriberFlag = function () {
        var tempSubscriberFlag = 0;
        var storeDataObject = this.storeDataObject();
        if (storeDataObject != null && storeDataObject.tempSubscriberFlag)
            tempSubscriberFlag = storeDataObject.tempSubscriberFlag;
        return tempSubscriberFlag;
    };
    //get loggedIn username
    CommonService.prototype.lsLoggedInUserName = function () {
        var loggedInUserName = "";
        var storeDataObject = this.storeDataObject();
        if (storeDataObject != null && storeDataObject.loggedInUserName)
            loggedInUserName = storeDataObject.loggedInUserName;
        return loggedInUserName;
    };
    CommonService.prototype.isUserLoggedIn = function () {
        this.userProfileService.loggedIn = 0;
        var subscriberId = 0;
        subscriberId = this.lsSubscriberId();
        if (this.lsTempSubscriberFlag() == 0 && subscriberId > 0) {
            this.userProfileService.loggedIn = 1;
        }
    };
    CommonService.prototype.getLoggedInNameFromLocalStorage = function () {
        var objectName = "storeData" + this.configService.getStoreID();
        var storeDataObject = JSON.parse(localStorage.getItem(objectName));
        var subsObject = storeDataObject.subscriberObject;
        return this.checkIfNull(subsObject.name);
    };
    CommonService.prototype.getLoggedInEmailFromLocalStorage = function () {
        var objectName = "storeData" + this.configService.getStoreID();
        var storeDataObject = JSON.parse(localStorage.getItem(objectName));
        var subsObject = storeDataObject.subscriberObject;
        return this.checkIfNull(subsObject.email);
    };
    CommonService.prototype.getLoggedInMobileFromLocalStorage = function () {
        var objectName = "storeData" + this.configService.getStoreID();
        var storeDataObject = JSON.parse(localStorage.getItem(objectName));
        var subsObject = storeDataObject.subscriberObject;
        return this.checkIfNull(subsObject.mobile);
    };
    //Localstorage issues changes ends here 
    CommonService.prototype.limitStringTo = function (str, sizeLimit) {
        return (str.length > sizeLimit) ? (str.substring(0, sizeLimit)) + '..' : (str);
    };
    CommonService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], CommonService);
    return CommonService;
}());
exports.CommonService = CommonService;
