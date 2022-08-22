"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CustomerInvoiceComponent = void 0;
var core_1 = require("@angular/core");
var ApplicationConstants_1 = require("src/ApplicationConstants");
var CustomerInvoiceComponent = /** @class */ (function () {
    function CustomerInvoiceComponent(configService, _router, flagsService, route, _transactionListService, userProfileService, invoiceService, _location, commonService) {
        this.configService = configService;
        this._router = _router;
        this.flagsService = flagsService;
        this.route = route;
        this._transactionListService = _transactionListService;
        this.userProfileService = userProfileService;
        this.invoiceService = invoiceService;
        this._location = _location;
        this.commonService = commonService;
        this.processBar = false;
        this.currency = "Rs.";
        this.deliverySlotCharge = 0;
        this.invoiceDetails = [];
    }
    CustomerInvoiceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.flagsService.continueShoppingCallFromInvoice = 1;
        this.flagsService.inDeliveryPageFlag = 1;
        // this.flagsService.hideHeaderFooter();
        this.flagsService.showSearch();
        this.flagsService.showHeaderFooter();
        // http://noqsystem.com:50010/api/ols/paymentAPI?payment_id=MOJO9a10V05A88354966&payment_status=Credit&payment_request_id=ffbfea9b7e874d74b8eac17db6c19aa7
        this.route.queryParams.subscribe(function (params) {
            // console.log(params);
        });
        this.route.queryParams.subscribe(function (params) {
            if (params.payment_id != undefined) {
                _this.paymentId = params.payment_id;
            }
        });
        this.route.queryParams.subscribe(function (params) {
            if (params.payment_status != undefined) {
                _this.paymentStatus = params.payment_status;
            }
        });
        this.route.queryParams.subscribe(function (params) {
            if (params.payment_request_id != undefined) {
                _this.paymentRequestedId = params.payment_request_id;
            }
        });
        // console.log('**************PAYMENT-DATA*****************');
        // console.log(this.paymentId);
        // console.log(this.paymentStatus);
        // console.log(this.paymentRequestedId);
        // console.log('********************************************');
        if (this.paymentId != undefined && this.paymentRequestedId != undefined && this.paymentStatus != undefined) {
            if (this.paymentStatus == 'Failed') {
                var txt = "You have cancelled the payment.";
                if (confirm(txt)) {
                    this._router.navigate(['/'], { replaceUrl: true });
                }
                else {
                    this.backClicked();
                }
            }
            else if (this.paymentStatus == 'Credit') {
                this.processBar = true;
                this.invoiceService.fetchTransactionsByPaymentRequestIdAPI(this.paymentRequestedId).subscribe(function (data) { return _this.handleData(data); }, function (error) { return _this.handleError(error); });
            }
        }
        else {
            this.getTransactionIdByParam();
            this.loadData();
        }
    };
    CustomerInvoiceComponent.prototype.backClicked = function () {
        this._location.back();
    };
    CustomerInvoiceComponent.prototype.getTransactionIdByParam = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            if (params['id'] != undefined) {
                _this.transactionId = params['id'];
            }
        });
    };
    CustomerInvoiceComponent.prototype.loadData = function () {
        var _this = this;
        this._transactionListService.fetchTransactionsByID(this.transactionId).subscribe(function (data) { return _this.handleData(data); }, function (error) { return _this.handleError(error); });
    };
    CustomerInvoiceComponent.prototype.handleData = function (pData) {
        // check is there any failure ?
        // this.commonMethods.handleSuccessNoNavigation(pData, this._flashMessagesService);
        if (pData.STATUS = 'OK') {
            this.convertFromWebDataToFormData(pData);
            this.resetTemporaryData();
        }
        // stop the progress bar
        this.processBar = false;
    };
    CustomerInvoiceComponent.prototype.handleError = function (pError) {
        // this.commonMethods.handleError(pError, this._flashMessagesService);
        // stop the progress bar
        this.processBar = false;
    };
    // <!-- Final Checklist -->
    CustomerInvoiceComponent.prototype.convertFromWebDataToFormData = function (pData) {
        this.transactionDetailArrayObj = [];
        var arrayObj;
        if (pData.TRANSACTIONS != undefined && pData.TRANSACTIONS != null) {
            arrayObj = pData.TRANSACTIONS;
        }
        else if (pData.TRANSACTION != undefined && pData.TRANSACTION != null) {
            arrayObj = pData.TRANSACTION;
        }
        for (var i = 0; i < arrayObj.length; i++) {
            var data = arrayObj[i];
            this.transactionId = data.TRANSACTION_ID;
            this.transactionDate = data.TRANSACTION_DATE;
            this.subscriberId = data.SUBSCRIBER_ID;
            this.subscriberName = this.commonService.checkIfNull(data.SUBSCRIBER_FIRST_NAME) + ' ' + this.commonService.checkIfNull(data.SUBSCRIBER_LAST_NAME),
                this.subscriberFirstName = data.SUBSCRIBER_FIRST_NAME;
            this.subscriberLastName = data.SUBSCRIBER_LAST_NAME;
            this.subscriberMobileNr = this.commonService.checkIfNull(data.SUBSCRIBER_MOBILE_NR);
            this.subscriberEmailId = this.commonService.checkIfNull(data.SUBSCRIBER_EMAIL_ID);
            this.storeId = data.STORE_ID;
            this.vendorId = data.VENDOR_ID;
            this.storeName = data.STORE_NAME;
            this.storeAddressLine1 = this.commonService.checkIfNull(data.STORE_ADDRESS_LINE1);
            this.storeAddressLine2 = this.commonService.checkIfNull(data.STORE_ADDRESS_LINE2);
            this.storeAddressPincode = data.STORE_ADDRESS_PINCODE;
            this.storeAddressAreaId = data.STORE_ADDRESS_AREA_ID;
            this.storeAddressAreaName = data.STORE_ADDRESS_AREA_NAME;
            this.storeAddressCityId = data.STORE_ADDRESS_CITY_ID;
            this.storeAddressCityName = data.STORE_ADDRESS_CITY_NAME;
            this.storeAddressStateId = data.STORE_ADDRESS_STATE_ID;
            this.storeAddressStateName = data.STORE_ADDRESS_STATE_NAME;
            this.storeAddressCountryId = data.STORE_ADDRESS_COUNTRY_ID;
            this.storeAddressCountryName = data.STORE_ADDRESS_COUNTRY_NAME;
            this.storeLocationAltitude = data.STORE_LOCATION_ALTITUDE;
            this.storeLocationLatitude = data.STORE_LOCATION_LATITUDE;
            this.storeLocationLongitude = data.STORE_LOCATION_LONGITUDE;
            this.storeLocationRadius = data.STORE_LOCATION_RADIUS;
            this.storePrimaryContactMobileNr = data.STORE_PRIMARY_CONTACT_MOBILE_NR;
            this.storePrimaryContactEmailId = data.STORE_PRIMARY_CONTACT_EMAIL_ID;
            this.storeDeliveryMinimumTime = data.STORE_DELIVERY_MINIMUM_TIME;
            this.shoppingTypeCode = data.SHOPPING_TYPE_CODE;
            this.shoppingTypeName = data.SHOPPING_TYPE_NAME;
            this.cartNumber = data.CART_NUMBER;
            this.deliveryAddressId = data.DELIVERY_ADDRESS_ID;
            this.addressId = data.ADDRESS_ID;
            this.addressLine1 = this.commonService.checkIfNull(data.ADDRESS_LINE1);
            this.addressLine2 = this.commonService.checkIfNull(data.ADDRESS_LINE2);
            this.addressPincode = data.ADDRESS_PINCODE;
            this.addressAreaId = data.ADDRESS_AREA_ID;
            this.addressAreaName = data.ADDRESS_AREA_NAME;
            this.addressCityId = data.ADDRESS_CITY_ID;
            this.addressCityName = data.ADDRESS_CITY_NAME;
            this.addressStateId = data.ADDRESS_STATE_ID;
            this.addressStateName = data.ADDRESS_STATE_NAME;
            this.addressCountryId = data.ADDRESS_COUNTRY_ID;
            this.addressCountryName = data.ADDRESS_COUNTRY_NAME;
            this.addressLatitude = data.ADDRESS_LATITUDE;
            this.addressLongitude = data.ADDRESS_LONGITUDE;
            this.addressCreatedDate = data.ADDRESS_CREATED_DATE;
            this.addressLastModifiedDate = data.ADDRESS_LAST_MODIFIED_DATE;
            this.addressLabel = data.ADDRESS_LABEL;
            this.contactName = data.CONTACT_NAME;
            this.contactMobileNr = data.CONTACT_MOBILE_NR;
            this.invoiceId = data.INVOICE_ID;
            this.invoiceAmount = data.INVOICE_AMOUNT;
            this.invoiceDiscountAmount = data.INVOICE_DISCOUNT_AMOUNT;
            this.invoiceDiscountId = data.INVOICE_DISCOUNT_ID;
            this.invoiceFinalAmount = data.INVOICE_FINAL_AMOUNT;
            this.invoiceTotalDiscount = data.INVOICE_TOTAL_DISCOUNT;
            this.numberOfItems = data.NUMBER_OF_ITEMS;
            this.paymentRequestedId = data.PAYMENT_REQUESTED_ID;
            this.paymentStatusId = data.PAYMENT_STATUS_ID;
            this.cancellationStageId = data.CANCELLATION_STAGE_ID;
            this.cancellationFeeAmount = data.CANCELLATION_FEE_AMOUNT;
            this.cancellationFeePaymentRequestedId = data.CANCELLATION_FEE_PAYMENT_REQUESTED_ID;
            this.cancellationReasonId = data.CANCELLATION_REASON_ID;
            this.cancellationReasonComment = data.CANCELLATION_REASON_COMMENT;
            this.previousCancellationStageId = data.PREVIOUS_CANCELLATION_STAGE_ID;
            this.previousCancellationFeeAmount = data.PREVIOUS_CANCELLATION_FEE_AMOUNT;
            this.previousCancellationDate = data.PREVIOUS_CANCELLATION_DATE;
            this.previousCancellationFeePaymentRequestedId = data.PREVIOUS_CANCELLATION_FEE_PAYMENT_REQUESTED_ID;
            this.previousCancellationPaymentStatusId = data.PREVIOUS_CANCELLATION_PAYMENT_STATUS_ID;
            this.previousCancellationReasonId = data.PREVIOUS_CANCELLATION_REASON_ID;
            this.previousCancellationReasonComment = data.PREVIOUS_CANCELLATION_REASON_COMMENT;
            this.previousCancellationTransactionId = data.PREVIOUS_CANCELLATION_TRANSACTION_ID;
            this.paymentStatusName = data.PAYMENT_STATUS_NAME;
            this.paymentTypeId = data.PAYMENT_TYPE_ID;
            this.paymentTypeName = data.PAYMENT_TYPE_NAME;
            this.deliveryTypeId = data.DELIVERY_TYPE_ID;
            this.deliveryTypeName = data.DELIVERY_TYPE_NAME;
            this.deliveryStatusId = this.deliveryStatusId;
            this.deliveryStatusName = data.DELIVERY_STATUS_NAME;
            this.fromUserId = data.FROM_USER_ID;
            this.fromUserFirstName = data.FROM_USER_FIRST_NAME;
            this.fromUserLastName = data.FROM_USER_LAST_NAME;
            this.fromUserMobileNr = data.FROM_USER_MOBILE_NR;
            this.toUserId = data.TO_USER_ID;
            this.toUserFirstName = data.TO_USER_FIRST_NAME;
            this.toUserLastName = data.TO_USER_LAST_NAME;
            this.toUserMobileNr = data.TO_USER_MOBILE_NR;
            this.storeWebhookLink = data.STORE_WEBHOOK_LINK;
            this.storePurpose = data.STORE_PURPOSE;
            this.gstIncludedInTheProductPriceFlag = data.GST_INCLUDED_IN_THE_PRODUCT_PRICE_FLAG;
            this.updateAddressFlag = data.UPDATE_ADDRESS_FLAG;
            this.redirectUrlLink = data.REDIRECT_URL_LINK;
            this.webhookLink = data.WEBHOOK_LINK;
            this.cancellationWebhookLink = data.CANCELLATION_WEBHOOK_LINK;
            this.createdDate = data.CREATED_DATE;
            this.lastModifiedDate = data.LAST_MODIFIED_DATE;
            this.applicationId = data.APPLICATION_ID;
            this.scheduledDeliveryDateFlag = data.SCHEDULED_DELIVERY_DATE_FLAG;
            this.deliveryDateUIFormat = data.DELIVERY_DATE_UI_FORMAT;
            this.deliveryTimeUIFormat = data.DELIVERY_TIME_UI_FORMAT;
            this.orderPlacedDate = data.ORDER_PLACED_DATE;
            this.cancellationDate = data.CANCELLATION_DATE;
            this.deliveredDate = data.DELIVERED_DATE;
            this.deliveryDate = data.DELIVERY_DATE;
            this.options = '',
                this.color = '',
                this.statusColor = '';
            var transactionDetailArray = data.TRANSACTION_DETAIL;
            for (var i_1 = 0; i_1 < transactionDetailArray.length; i_1++) {
                var tDData = transactionDetailArray[i_1];
                if (tDData.PRODUCT_IMAGE_FILE_PATH == 'null') {
                    tDData.PRODUCT_IMAGE_FILE_PATH = './assets/images/image-not-found.jpg';
                }
                var transactionDetailObj = {
                    transactionDetailId: tDData.TRANSACTION_DETAIL_ID,
                    transactionId: tDData.TRANSACTION_ID,
                    storeId: tDData.STORE_ID,
                    vendorId: tDData.VENDOR_ID,
                    productId: tDData.PRODUCT_ID,
                    productDetailId: tDData.PRODUCT_DETAIL_ID,
                    productName: tDData.PRODUCT_NAME,
                    productPrice: tDData.PRODUCT_PRICE,
                    productDiscountId: tDData.PRODUCT_DISCOUNT_ID,
                    productDiscountAmount: tDData.PRODUCT_DISCOUNT_AMOUNT,
                    productFinalPrice: tDData.PRODUCT_FINAL_PRICE,
                    productGstId: tDData.PRODUCT_GST_ID,
                    productGstPercentage: tDData.PRODUCT_GST_PERCENTAGE,
                    productGstAmount: tDData.PRODUCT_GST_AMOUNT,
                    productGstStatus: tDData.PRODUCT_GST_STATUS,
                    productQuantity: tDData.PRODUCT_QUANTITY,
                    productMultiFlag: tDData.PRODUCT_MULTI_FLAG,
                    productImageFile: tDData.PRODUCT_IMAGE_FILE,
                    productImagePath: tDData.PRODUCT_IMAGE_PATH,
                    productImageFilePath: tDData.PRODUCT_IMAGE_FILE_PATH,
                    productUnitTypeCode: tDData.PRODUCT_UNIT_TYPE_CODE,
                    productUnit: tDData.PRODUCT_UNIT,
                    productUnitTypeName: tDData.PRODUCT_UNIT_TYPE_NAME,
                    productBrandId: tDData.PRODUCT_BRAND_ID,
                    productBrandName: tDData.PRODUCT_BRAND_NAME,
                    maxPurchaseQuantity: tDData.MAX_PURCHASE_QUANTITY,
                    transactionDetailTypeCode: tDData.TRANSACTION_DETAIL_TYPE_CODE,
                    promoCode: tDData.PROMO_CODE,
                    promoCodeDiscountAmount: tDData.PROMO_CODE_DISCOUNT_AMOUNT
                };
                this.transactionDetailArrayObj.push(transactionDetailObj);
            }
            if (this.paymentTypeId == 1) {
                this.color = 'green';
            }
            else {
                this.color = 'red';
            }
        }
        this.makeTransactionArray(this.transactionDetailArrayObj);
        // Status Names
        this.headerPaymentStatusName = this.paymentStatusName;
        this.headerDeliveryStatusName = this.deliveryStatusName;
    };
    CustomerInvoiceComponent.prototype.checkIfProduct = function (transactionDetail) {
        // console.log('*************************checkIfProduct()BEGIN****************************');
        // console.log(transactionDetail);
        if (transactionDetail.transactionDetailTypeCode == ApplicationConstants_1.ApplicationConstants.PRODUCT_CODE) {
            return true;
        }
        // console.log('*************************checkIfProduct()END****************************');
    };
    CustomerInvoiceComponent.prototype.checkIfNotProduct = function (transactionDetail) {
        // console.log('*************************checkIfNotProduct() BEGIN****************************');
        // console.log(transactionDetail);
        if (transactionDetail.transactionDetailTypeCode > ApplicationConstants_1.ApplicationConstants.PRODUCT_CODE) {
            return true;
        }
        // console.log('*************************checkIfNotProduct()END****************************');
    };
    CustomerInvoiceComponent.prototype.checkDeliveryAddress = function () {
        if (this.deliveryAddressId > 0) {
            return true;
        }
        else {
            return false;
        }
    };
    CustomerInvoiceComponent.prototype.makeTransactionArray = function (pData) {
        this.gst = 0;
        this.deliveryCharge = 0;
        this.convenienceFee = 0;
        this.promoCodeDiscountAmount = 0;
        this.invoiceDetails = [];
        this.transactionProductCount = 0;
        for (var index = 0; index < pData.length; index++) {
            if (pData[index].transactionDetailTypeCode == ApplicationConstants_1.ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PRODUCT) {
                this.invoiceDetails.push(pData[index]);
                this.gst += pData[index].productGstAmount * pData[index].productQuantity;
                this.transactionProductCount++;
            }
            if (pData[index].transactionDetailTypeCode == ApplicationConstants_1.ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_DELIVERY_CHAGE) {
                this.deliveryCharge += pData[index].productFinalPrice;
            }
            if (pData[index].transactionDetailTypeCode == ApplicationConstants_1.ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_CONVENIENCE_FEE) {
                this.convenienceFee += pData[index].productFinalPrice;
            }
            if (pData[index].transactionDetailTypeCode == ApplicationConstants_1.ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PROMO_CODE) {
                this.promoCodeDiscountAmount += pData[index].promoCodeDiscountAmount;
            }
            if (pData[index].transactionDetailTypeCode == ApplicationConstants_1.ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_DELIVERY_SLOT_CHARGE) {
                this.deliverySlotCharge += pData[index].productFinalPrice;
                this.deliverySlotCharge = this.deliverySlotCharge - pData[index].productGstAmount;
                this.gst += pData[index].productGstAmount;
            }
        }
        this.deliveryCharge = this.deliverySlotCharge;
    };
    CustomerInvoiceComponent.prototype.resetTemporaryData = function () {
        var objectName = "storeData" + this.configService.getStoreID();
        var storeDataObject = JSON.parse(localStorage.getItem(objectName));
        storeDataObject.transactionId = 0;
        localStorage.setItem(objectName, JSON.stringify(storeDataObject));
        this.userProfileService.numberOfProductsInCart = 0;
        this._transactionListService.transactionArray = [];
        this._transactionListService.transactionDetailsArray = [];
    };
    CustomerInvoiceComponent = __decorate([
        core_1.Component({
            selector: 'app-customer-invoice',
            templateUrl: './customer-invoice.component.html',
            styleUrls: ['./customer-invoice.component.css']
        })
    ], CustomerInvoiceComponent);
    return CustomerInvoiceComponent;
}());
exports.CustomerInvoiceComponent = CustomerInvoiceComponent;
