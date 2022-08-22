"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LoginService = void 0;
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var ApiConstants_1 = require("src/ApiConstants");
var LoginService = /** @class */ (function () {
    function LoginService(configService, _http, ProductsMidLayerService, transactionService, commonService) {
        this.configService = configService;
        this._http = _http;
        this.ProductsMidLayerService = ProductsMidLayerService;
        this.transactionService = transactionService;
        this.commonService = commonService;
        this.inDeliveryPageFlag = 0;
        this.displayGuestCheckIn = false;
    }
    LoginService.prototype.showGuestCheckIn = function () {
        this.displayGuestCheckIn = true;
    };
    LoginService.prototype.hideGuestCheckIn = function () {
        this.displayGuestCheckIn = false;
    };
    LoginService.prototype.subscriberLoginAPI = function (requestObject) {
        return this._http.post(this.configService.getBaseURL() + ApiConstants_1.ApiConstants.subscriberLoginAPI, requestObject).pipe(operators_1.map(function (data) { return data; }, function (error) { return error; }));
    };
    LoginService.prototype.deleteTemporarySubscriberAndLogInAPI = function (requestObject) {
        return this._http.post(this.configService.getBaseURL() + ApiConstants_1.ApiConstants.deleteTemporarySubscriberAndLogInAPI, requestObject).pipe(operators_1.map(function (data) { return data; }, function (error) { return error; }));
    };
    LoginService.prototype.checkTransactionArrayAndUpdate = function (data) {
        if (data.TRANSACTION && data.TRANSACTION[0] && data.TRANSACTION[0].TRANSACTION_DETAIL[0].TRANSACTION_ID > 0) {
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.transactionService.transactionArray = data.TRANSACTION;
            this.ProductsMidLayerService.checkOnlyTransactions();
            this.commonService.addTransactionIdTols();
        }
    };
    LoginService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], LoginService);
    return LoginService;
}());
exports.LoginService = LoginService;
