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
exports.__esModule = true;
exports.CancelOrderDialog = exports.MyordersComponent = void 0;
var core_1 = require("@angular/core");
var ApplicationConstants_1 = require("src/ApplicationConstants");
var dialog_1 = require("@angular/material/dialog");
var product_review_dialog_component_1 = require("../product-review-dialog/product-review-dialog.component");
var MyordersComponent = /** @class */ (function () {
    function MyordersComponent(configService, _router, route, subscriberService, userProfileService, flagsService, commonService, transactionsService, dialog) {
        this.configService = configService;
        this._router = _router;
        this.route = route;
        this.subscriberService = subscriberService;
        this.userProfileService = userProfileService;
        this.flagsService = flagsService;
        this.commonService = commonService;
        this.transactionsService = transactionsService;
        this.dialog = dialog;
        // Dialog ends (Cancel Orer )
        this.processBar = false;
        this.transactionRequestObject = {};
        this.ordersArray = [];
        this.showOrders = true;
        this.showOrderDetails = false;
        this.orderDetailsObject = {};
        this.transactionArray = [];
        this.invoiceTotal = 0;
        this.invoiceAmount = 0;
        this.invoiceDiscountAmount = 0;
        this.deliveryCharge = 0;
        this.convenienceFee = 0;
        this.gst = 0;
    }
    MyordersComponent.prototype.openDialog = function (pTransactionObject) {
        var _this = this;
        var dialogRef = this.dialog.open(CancelOrderDialog, {
            width: '600px',
            data: pTransactionObject
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.fetchMyOrders();
        });
    };
    MyordersComponent.prototype.ngOnInit = function () {
        this.flagsService.showSearch();
        this.flagsService.showHeaderFooter();
        // this.flagsService.hideHeader();
        this.flagsService.inDeliveryPageFlag = 1;
        this.processBar = true;
        this.fetchMyOrders();
        window.scroll(0, 0);
    };
    MyordersComponent.prototype.fetchCancellationFeeApi = function (rowObject) {
        var requestObject = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_ID: rowObject.TRANSACTION_ID
        };
        this.transactionsService.fetchCancellationFeeApi(requestObject).subscribe(function (data) { return data; }, function (error) { return error; });
    };
    MyordersComponent.prototype.cancelOrderByOrderId = function (rowObject) {
        var _this = this;
        this.processBar = true;
        var requestObject = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_ID: rowObject.TRANSACTION_ID,
            CANCELLATION_STAGE_ID: 1,
            CANCELLATION_FEE_AMOUNT: 20,
            CANCELLATION_FEE_PAYMENT_REQUESTED_ID: "8d78cd6eeaf34af4ae004658b6c2fbe2",
            CANCELLATION_AMOUNT_PAID_FLAG: "TRUE",
            CANCELLATION_REASON_ID: 1
        };
        this.transactionsService.cancelTransactionApi(requestObject).subscribe(function (data) { return _this.handleCancelOrder(data); }, function (error) { return error; });
    };
    MyordersComponent.prototype.handleCancelOrder = function (data) {
        if (data.STATUS == "OK") {
            this.fetchMyOrders();
        }
    };
    MyordersComponent.prototype.fetchMyOrders = function () {
        var _this = this;
        this.transactionRequestObject = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            LIMIT: 50,
            OFFSET: 0
        };
        this.userProfileService.fetchMyOrdersBySubscriberId(this.transactionRequestObject).subscribe(function (data) { return _this.handleFetchMyOrdersSuccess(data); }, function (error) { return error; });
    };
    MyordersComponent.prototype.handleFetchMyOrdersSuccess = function (data) {
        if (data.STATUS == "OK") {
            this.ordersArray = data.TRANSACTION;
        }
        this.processBar = false;
    };
    MyordersComponent.prototype.viewOrderDetails = function (object) {
        this.showOrderDetails = true;
        this.showOrders = false;
        this.orderDetailsObject = object;
        // this.transactionArray  = object.TRANSACTION_DETAIL;
        this.makeTransactionArray(object);
        this.calculateInvoiceDetail(object);
        window.scroll(0, 0);
    };
    MyordersComponent.prototype.goback = function () {
        this.showOrderDetails = false;
        this.showOrders = true;
        window.scroll(0, 0);
    };
    MyordersComponent.prototype.makeTransactionArray = function (data) {
        var _this = this;
        this.gst = 0;
        this.deliveryCharge = 0;
        this.convenienceFee = 0; //Initialise
        this.transactionArray = [];
        data.TRANSACTION_DETAIL.forEach(function (element) {
            if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PRODUCT) {
                _this.transactionArray.push(element);
                _this.gst += element.PRODUCT_GST_AMOUNT * element.PRODUCT_QUANTITY;
            }
            if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_DELIVERY_CHAGE) {
                _this.deliveryCharge += element.PRODUCT_FINAL_PRICE;
            }
            if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_CONVENIENCE_FEE) {
                _this.convenienceFee += element.PRODUCT_FINAL_PRICE;
            }
        });
        console.log("<============ this.transactionArray ============>");
        console.log(this.transactionArray);
        // this.userProfileService.numberOfProductsInCart = this.transactionArray.length;
    };
    MyordersComponent.prototype.calculateInvoiceDetail = function (data) {
        this.invoiceAmount = data.INVOICE_AMOUNT;
        this.invoiceDiscountAmount = data.INVOICE_DISCOUNT_AMOUNT;
        this.invoiceTotal = data.INVOICE_FINAL_AMOUNT;
    };
    MyordersComponent.prototype.openProductReviewDialog = function (pProductDetailId) {
        console.log("pProductDetailId => " + pProductDetailId);
        var dialogRef = this.dialog.open(product_review_dialog_component_1.ProductReviewDialogComponent, {
            data: {
                PRODUCT_DETAIL_ID: pProductDetailId
            },
            height: '80%',
            maxWidth: '100%'
        });
        dialogRef.afterClosed().subscribe(function (result) {
        });
    };
    MyordersComponent = __decorate([
        core_1.Component({
            selector: 'app-myorders',
            templateUrl: './myorders.component.html',
            styleUrls: ['./myorders.component.css']
        })
    ], MyordersComponent);
    return MyordersComponent;
}());
exports.MyordersComponent = MyordersComponent;
var CancelOrderDialog = /** @class */ (function () {
    function CancelOrderDialog(configService, dialogRef, data, commonService, transactionsService, _snackBar) {
        this.configService = configService;
        this.dialogRef = dialogRef;
        this.data = data;
        this.commonService = commonService;
        this.transactionsService = transactionsService;
        this._snackBar = _snackBar;
        this.cancellationReasonId = 0;
        this.cancellationReasonComment = "";
        this.transactionObject = data;
        this.fetchCancellationFeeApi();
    }
    CancelOrderDialog.prototype.openSnackBar = function (message) {
        this._snackBar.open(message, "", {
            duration: 2000,
            panelClass: ['snackbarStyle']
        });
    };
    CancelOrderDialog.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    CancelOrderDialog.prototype.closeDialogue = function () {
        this.dialogRef.close();
    };
    CancelOrderDialog.prototype.fetchCancellationFeeApi = function () {
        var _this = this;
        var requestObject = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_ID: this.transactionObject.TRANSACTION_ID
        };
        this.transactionsService.fetchCancellationFeeApi(requestObject).subscribe(function (data) { return _this.handleFetchCancellationFeeApi(data); }, function (error) { return error; });
    };
    CancelOrderDialog.prototype.handleFetchCancellationFeeApi = function (data) {
        // if(data.STATUS == "OK"){
        this.cancellationDetailsObject = data;
        // }
    };
    CancelOrderDialog.prototype.cancelOrder = function () {
        var _this = this;
        if (this.cancellationReasonId == 0) {
            this.openSnackBar("Please choose reason for cancelling the order.");
        }
        else if (this.cancellationReasonId == 1 && this.cancellationReasonComment == "") {
            this.openSnackBar("Please enter the reason for cancelling the order.");
        }
        else {
            var requestObject = {
                SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
                STORE_ID: this.configService.getStoreID(),
                TRANSACTION_ID: this.transactionObject.TRANSACTION_ID,
                CANCELLATION_STAGE_ID: this.cancellationDetailsObject.CANCELLATION_STAGE_ID,
                CANCELLATION_FEE_AMOUNT: this.cancellationDetailsObject.CANCELLATION_FEE_AMOUNT,
                // CANCELLATION_FEE_PAYMENT_REQUESTED_ID : "8d78cd6eeaf34af4ae004658b6c2fbe2",
                CANCELLATION_AMOUNT_PAID_FLAG: "FALSE",
                CANCELLATION_REASON_ID: this.cancellationReasonId
            };
            if (this.cancellationReasonId == 1)
                requestObject.CANCELLATION_REASON_COMMENT = this.cancellationReasonComment;
            this.transactionsService.cancelTransactionApi(requestObject).subscribe(function (data) { return _this.handleCancelOrder(data); }, function (error) { return error; });
        }
    };
    CancelOrderDialog.prototype.handleCancelOrder = function (data) {
        if (data.STATUS == "OK") {
            this.openSnackBar("Your Order " + this.transactionObject.INVOICE_ID + " has been Cancelled Successfully.");
            this.closeDialogue();
        }
    };
    CancelOrderDialog = __decorate([
        core_1.Component({
            selector: 'cancel-order-dialog',
            templateUrl: './cancel-order.html'
        }),
        __param(2, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], CancelOrderDialog);
    return CancelOrderDialog;
}());
exports.CancelOrderDialog = CancelOrderDialog;
// Dialog Code Ends (Cancel Order Dialog)
