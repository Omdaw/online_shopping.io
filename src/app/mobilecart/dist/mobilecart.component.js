"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MobilecartComponent = void 0;
var core_1 = require("@angular/core");
var ApplicationConstants_1 = require("src/ApplicationConstants");
var products_component_1 = require("../products/products.component");
var MobilecartComponent = /** @class */ (function () {
    function MobilecartComponent(configService, _router, route, headerService, userProfileService, transactionService, subscriberService, footerService, flagsService, commonService, productService, dialog) {
        this.configService = configService;
        this._router = _router;
        this.route = route;
        this.headerService = headerService;
        this.userProfileService = userProfileService;
        this.transactionService = transactionService;
        this.subscriberService = subscriberService;
        this.footerService = footerService;
        this.flagsService = flagsService;
        this.commonService = commonService;
        this.productService = productService;
        this.dialog = dialog;
        //Variance/AddOns ends
        //Variables Used in this Component
        this.processBar = false;
        this.companyLogo = "../assets/images/logo.png";
        this.companyLogoAltText = "Campion Software";
        this.prodctSearchInput = "";
        this.searchText = "";
        this.fetchStoreRequest = {};
        this.fetchSearchRequest = {};
        this.storeDetailsObject = {};
        this.loggedIn = 1;
        //transactionDetailsArray              = [];
        // numberOfProductsInCart        = this.userProfileService.numberOfProductsInCart;
        this.signUpName = "";
        this.displaySearch = false;
        this.loggedInUserName = "";
        this.subscriberId = 0;
        //Store Details 
        this.storeLogo = "";
        this.storeName = "";
        this.processBarLogo = false;
        this.searchedProductsArray = [];
        this.displayMinicart = false;
        this.fetchCartInProgressRequestObject = {};
        this.invoiceTotal = 0;
        this.invoiceAmount = 0;
        this.invoiceDiscountAmount = 0;
        this.deliveryCharge = 0;
        this.convenienceFee = 0;
        this.gst = 0;
        this.selectedIndex = 0;
        //Update Cart
        this.updateCartRequestObject = {};
        //Update Cart Ends
        //Delete Cart 
        this.deleteCartRequestObject = {};
        //Delete Cart Ends
        this.transactionDetailsId = 0;
        this.addToCartRequestObject = {};
        this.selectedProductIndex = 0;
        // Social Media
        this.fetchSocialMediaRequestObject = {};
        this.socialMediaDetailsArray = [];
    }
    // Dialog
    MobilecartComponent.prototype.openVarianceDialog = function (pProductDetail) {
        var dialogRef = this.dialog.open(products_component_1.VarianceDialog, {
            width: '600px',
            data: pProductDetail
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log('The dialog was closed');
        });
    };
    MobilecartComponent.prototype.openCustomizationConfirmationPopup = function (pTransactionDetailsObject) {
        var dialogRef = this.dialog.open(products_component_1.CustomizationConfirmationDialog, {
            width: '700px',
            data: pTransactionDetailsObject
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log('The dialog was closed');
        });
    };
    MobilecartComponent.prototype.ngOnInit = function () {
        //  this.flagsService.hideHeaderFooter();
        this.flagsService.showSearch();
        this.flagsService.showHeaderFooter();
        this.flagsService.hideFooter();
        window.scroll(0, 0);
        this.processBar = false;
        ;
        this.checkSubscriberId();
        this.commonService.isUserLoggedIn();
        if (this.commonService.lsTempSubscriberFlag() == 1 || this.commonService.lsSubscriberId() == 0) {
            this.loggedIn = 0;
        }
        this.loggedInUserName = "";
        if (this.commonService.lsLoggedInUserName() != "" && this.commonService.lsLoggedInUserName() != "null") {
            this.loggedInUserName = this.commonService.lsLoggedInUserName();
        }
    };
    MobilecartComponent.prototype.checkSubscriberId = function () {
        if (this.commonService.lsSubscriberId())
            this.subscriberId = +this.commonService.lsSubscriberId();
        if (this.subscriberId == 0) {
            this.temporarySubscriberLogin();
        }
        else {
            this.loadDefaultMethods();
        }
    };
    MobilecartComponent.prototype.loadDefaultMethods = function () {
        this.fetchStore();
        this.fetchCartInProgress();
        this.fetchSocialMedia();
    };
    MobilecartComponent.prototype.temporarySubscriberLogin = function () {
        var _this = this;
        this.subscriberService.tempSubscriberLogin().subscribe(function (data) { return _this.handleTemporarySubscriberLoginSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    MobilecartComponent.prototype.handleTemporarySubscriberLoginSuccess = function (data) {
        if (data.STATUS == "OK") {
            var authToken = data.SUBSCRIBER.AUTHENTICATION_TOKEN;
            var subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
            var tempSubscriberFlag = 1;
            var transactionId = 0;
            this.commonService.addStoreData(authToken, subscriberId, tempSubscriberFlag, transactionId);
            this.loadDefaultMethods();
        }
    };
    MobilecartComponent.prototype.handleError = function (error) {
    };
    MobilecartComponent.prototype.makeFetchStoreRequestObject = function () {
        this.fetchStoreRequest = {
            STORE_ID: this.configService.getStoreID(),
            LATITUDE: 0,
            LONGITUDE: 0,
            COUNTRY_ID: 0,
            STATE_ID: 0,
            CITY_ID: 0,
            AREA_ID: 0,
            // AREA_NAME                : "",
            CLIENT_APP_VERSION_CODE: this.configService.getClientAppVersionCode(),
            CLIENT_APP_VERSION_NAME: this.configService.getClientAppVersionName(),
            BUILD_CONFIGURATION_TYPE: this.configService.getBuildConfigurationType()
        };
    };
    MobilecartComponent.prototype.fetchStore = function () {
        var _this = this;
        this.processBarLogo = true;
        this.makeFetchStoreRequestObject();
        this.headerService.fetchStore(this.fetchStoreRequest).subscribe(function (data) { return _this.handleFetchStoreResponse(data); }, function (error) { return _this.handleError(error); });
    };
    MobilecartComponent.prototype.handleFetchStoreResponse = function (pData) {
        if (pData.STATUS == "OK") {
            this.storeDetailsObject = pData.STORE[0];
            //Required things
            this.storeName = pData.STORE[0].STORE_NAME;
            this.storeLogo = pData.STORE[0].STORE_LOGO_URL;
        }
        this.processBarLogo = false;
    };
    MobilecartComponent.prototype.makeFetchSearchObject = function () {
        this.fetchSearchRequest = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            PRODUCT_SEARCH_TEXT: this.searchText,
            STORE_ID: this.configService.getStoreID(),
            LIMIT: ApplicationConstants_1.ApplicationConstants.DEFAULT_LIMIT,
            OFFSET: ApplicationConstants_1.ApplicationConstants.DEFAULT_OFFSET
        };
    };
    MobilecartComponent.prototype.fetchSearch = function () {
        var _this = this;
        this.processBar = true;
        this.makeFetchSearchObject();
        this.headerService.searchProductByInputId(this.fetchSearchRequest).subscribe(function (data) { return _this.handleFetchSearchResponse(data); }, function (error) { return _this.handleError(error); });
    };
    MobilecartComponent.prototype.handleFetchSearchResponse = function (pData) {
        this.searchedProductsArray = [];
        if (pData.STATUS == "OK") {
            this.searchedProductsArray = pData.PRODUCT;
            for (var i = 0; i < this.searchedProductsArray.length; i++) {
                this.searchedProductsArray[i].showAddToCart = 1;
                this.searchedProductsArray[i].selectedQuantity = 1;
                this.checkProductExistsInTransaction(i);
            }
        }
        this.processBar = false;
    };
    MobilecartComponent.prototype.checkProductExistsInTransaction = function (index) {
        var _this = this;
        this.transactionService.transactionDetailsArray.forEach(function (element) {
            if (_this.searchedProductsArray[index].PRODUCT_DETAIL[0].PRODUCT_DETAIL_ID == element.PRODUCT_DETAIL_ID) {
                _this.searchedProductsArray[index].showAddToCart = 0;
                _this.searchedProductsArray[index].selectedQuantity = element.PRODUCT_QUANTITY;
                _this.searchedProductsArray[index].PRODUCT_DETAIL[0].transactionDetailsId = element.TRANSACTION_DETAIL_ID;
            }
        });
    };
    MobilecartComponent.prototype.searchProducts = function () {
        if (this.searchText != '') {
            this._router.navigate(['search', this.searchText]);
        }
    };
    MobilecartComponent.prototype.logout = function () {
        this.commonService.addTransactionIdTols();
        this.commonService.addSubscriberIdTols(0);
        this.commonService.addTempSubscriberFlagTols(0);
        this.commonService.addLoggedInUsernameTols("");
        if (this.flagsService.inDeliveryPageFlag) {
            this._router.navigate(['/']);
            // window.location.reload();
        }
        else {
            window.location.reload();
        }
    };
    MobilecartComponent.prototype.showSerach = function () {
        this.displaySearch = true;
    };
    MobilecartComponent.prototype.hideSerach = function () {
        this.displaySearch = false;
    };
    MobilecartComponent.prototype.showMinicart = function () {
        if (this.userProfileService.numberOfProductsInCart != this.transactionService.transactionDetailsArray.length)
            this.fetchCartInProgress();
        this.displayMinicart = true;
    };
    MobilecartComponent.prototype.hideMinicart = function () {
        this.displayMinicart = false;
    };
    MobilecartComponent.prototype.makeFetchCartInProgressObject = function () {
        var tempObj = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID()
        };
        this.fetchCartInProgressRequestObject = tempObj;
    };
    MobilecartComponent.prototype.fetchCartInProgress = function () {
        var _this = this;
        this.processBar = true;
        this.makeFetchCartInProgressObject();
        this.subscriberService.fetchCartInProgressTransactionsBySubscriberIdAPI(this.fetchCartInProgressRequestObject)
            .subscribe(function (data) { return _this.handleFetchCartInProgressResponse(data); }, function (error) { return _this.handleError(error); });
    };
    MobilecartComponent.prototype.handleFetchCartInProgressResponse = function (data) {
        if (data.STATUS == "OK") {
            this.processBar = false;
            if (data.TRANSACTION.length > 0) {
                this.transactionService.transactionArray = data.TRANSACTION;
                this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
                this.calculateInvoiceDetail(data.TRANSACTION[0]);
                this.maketransactionArray(data);
                if (data.TRANSACTION[0].TRANSACTION_DETAIL[0])
                    this.commonService.addTransactionIdTols();
            }
        }
    };
    MobilecartComponent.prototype.refreshCartAmountDetail = function () {
        console.log("Transaction Array");
        var data = this.transactionService.transactionArray[0];
        this.invoiceAmount = data.INVOICE_AMOUNT;
        this.invoiceDiscountAmount = data.INVOICE_DISCOUNT_AMOUNT;
        this.invoiceTotal = data.INVOICE_FINAL_AMOUNT;
    };
    MobilecartComponent.prototype.calculateInvoiceDetail = function (data) {
        this.invoiceAmount = data.INVOICE_AMOUNT;
        this.invoiceDiscountAmount = data.INVOICE_DISCOUNT_AMOUNT;
        this.invoiceTotal = data.INVOICE_FINAL_AMOUNT;
        this.userProfileService.invoiceAmount = this.invoiceAmount;
        this.userProfileService.invoiceDiscount = this.invoiceDiscountAmount;
        this.userProfileService.invoiceTotal = this.invoiceTotal;
    };
    MobilecartComponent.prototype.maketransactionArray = function (data) {
        var _this = this;
        this.gst = 0;
        this.deliveryCharge = 0;
        this.convenienceFee = 0; //Initialise
        this.transactionService.transactionDetailsArray = [];
        data.TRANSACTION[0].TRANSACTION_DETAIL.forEach(function (element) {
            if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PRODUCT) {
                _this.transactionService.transactionDetailsArray.push(element);
                _this.transactionService.transactionDetailsArray = _this.transactionService.transactionDetailsArray;
                _this.gst += element.PRODUCT_GST_AMOUNT * element.PRODUCT_QUANTITY;
            }
            if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_DELIVERY_CHAGE) {
                _this.deliveryCharge += element.PRODUCT_FINAL_PRICE;
            }
            if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_CONVENIENCE_FEE) {
                _this.convenienceFee += element.PRODUCT_FINAL_PRICE;
            }
        });
        this.userProfileService.numberOfProductsInCart = this.transactionService.transactionDetailsArray.length;
    };
    MobilecartComponent.prototype.reduceQuantity = function (index) {
        this.selectedIndex = index;
        this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY = this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY - 1;
        if (this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY == 0) {
            this.deleteCart();
        }
        this.updateCart();
    };
    MobilecartComponent.prototype.increaseQuantity = function (index) {
        this.selectedIndex = index;
        this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY = this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY + 1;
        this.updateCart();
    };
    MobilecartComponent.prototype.removeFromCart = function (index) {
        this.selectedIndex = index;
        this.deleteCart();
    };
    MobilecartComponent.prototype.makeUpdateCartRequestObject = function () {
        var transactionDetails = {
            TRANSACTION_DETAIL_ID: this.transactionService.transactionDetailsArray[this.selectedIndex].TRANSACTION_DETAIL_ID,
            PRODUCT_QUANTITY: this.transactionService.transactionDetailsArray[this.selectedIndex].PRODUCT_QUANTITY
        };
        var addToCartObject = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_ID: this.transactionService.transactionDetailsArray[this.selectedIndex].TRANSACTION_ID,
            TRANSACTION_DETAIL: transactionDetails
        };
        this.updateCartRequestObject = addToCartObject;
    };
    MobilecartComponent.prototype.updateCart = function () {
        var _this = this;
        this.processBar = true;
        this.makeUpdateCartRequestObject();
        this.subscriberService.updateCart(this.updateCartRequestObject).subscribe(function (data) { return _this.handleUpdateCartResponse(data); }, function (error) { return _this.handleError(error); });
    };
    MobilecartComponent.prototype.handleUpdateCartResponse = function (data) {
        this.processBar = false;
        if (data.STATUS == "OK") {
            this.calculateInvoiceDetail(data.TRANSACTION[0]);
            this.maketransactionArray(data);
            this.transactionService.transactionArray = data.TRANSACTION;
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.checkOnlyTransactions();
        }
    };
    MobilecartComponent.prototype.makeDeleteCartRequestObject = function () {
        var transactionDetails = {
            TRANSACTION_DETAIL_ID: this.transactionService.transactionDetailsArray[this.selectedIndex].TRANSACTION_DETAIL_ID
        };
        var tempObj = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_ID: this.transactionService.transactionDetailsArray[this.selectedIndex].TRANSACTION_ID,
            TRANSACTION_DETAIL: transactionDetails
        };
        this.deleteCartRequestObject = tempObj;
    };
    MobilecartComponent.prototype.deleteCart = function () {
        var _this = this;
        this.processBar = true;
        this.makeDeleteCartRequestObject();
        this.subscriberService.removeFromCart(this.deleteCartRequestObject).subscribe(function (data) { return _this.handleDeleteCartResponse(data); }, function (error) { return _this.handleError(error); });
    };
    MobilecartComponent.prototype.handleDeleteCartResponse = function (data) {
        this.processBar = false;
        if (data.STATUS == "OK") {
            this.transactionService.transactionDetailsArray.splice(this.selectedIndex, 1);
            this.calculateInvoiceDetail(data.TRANSACTION[0]);
            this.maketransactionArray(data);
        }
    };
    //Add To Cart
    MobilecartComponent.prototype.makeAddToCartRequestObject = function (productObject) {
        var productDetailObject = productObject.PRODUCT_DETAIL[0];
        var transactionDetails = {
            TRANSACTION_DETAIL_ID: this.transactionDetailsId,
            TRANSACTION_ID: this.commonService.lsTransactionId(),
            PRODUCT_DETAIL_ID: productDetailObject.PRODUCT_DETAIL_ID,
            PRODUCT_NAME: productObject.PRODUCT_NAME,
            PRODUCT_PRICE: productDetailObject.PRODUCT_PRICE,
            PRODUCT_FINAL_PRICE: productDetailObject.PRODUCT_FINAL_PRICE,
            PRODUCT_DISCOUNT_ID: productDetailObject.PRODUCT_DISCOUNT_ID,
            PRODUCT_DISCOUNT_AMOUNT: productDetailObject.PRODUCT_DISCOUNT_AMOUNT,
            PRODUCT_GST_PERCENTAGE: productDetailObject.PRODUCT_GST_PERCENTAGE,
            PRODUCT_GST_AMOUNT: productDetailObject.PRODUCT_GST_AMOUNT,
            PRODUCT_GST_ID: productDetailObject.PRODUCT_GST_ID,
            PRODUCT_GST_STATUS: productDetailObject.PRODUCT_GST_STATUS,
            PRODUCT_QUANTITY: 1,
            PRODUCT_MULTI_FLAG: productDetailObject.PRODUCT_MULTI_FLAG,
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_DETAIL_TYPE_CODE: 1
        };
        var addToCartObject = {
            SUBSCRIBER_ID: +this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_ID: this.commonService.lsTransactionId(),
            TRANSACTION_DETAIL: transactionDetails
        };
        this.addToCartRequestObject = addToCartObject;
    };
    MobilecartComponent.prototype.addToCart = function (productObject, index) {
        var _this = this;
        this.processBar = true;
        this.selectedProductIndex = index;
        this.makeAddToCartRequestObject(productObject);
        this.subscriberService.addToCart(this.addToCartRequestObject).subscribe(function (data) { return _this.handleAddToCartResponse(data, index); }, function (error) { return _this.handleError(error); });
    };
    MobilecartComponent.prototype.handleAddToCartResponse = function (data, index) {
        if (data.STATUS == "OK") {
            this.searchedProductsArray[this.selectedProductIndex].showAddToCart = 0;
            if (this.transactionService.transactionDetailsArray.length > 0) {
                this.commonService.addTransactionIdTols();
            }
            this.setPorductDetailId(index, data.TRANSACTION[0].TRANSACTION_DETAIL);
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.transactionService.transactionArray = data.TRANSACTION;
            this.checkOnlyTransactions();
        }
        this.processBar = false;
    };
    MobilecartComponent.prototype.setPorductDetailId = function (index, transactionArray) {
        var _this = this;
        var productDetailsId = this.searchedProductsArray[index].PRODUCT_DETAIL[0].PRODUCT_DETAIL_ID;
        transactionArray.forEach(function (element) {
            if (productDetailsId == element.PRODUCT_DETAIL_ID) {
                _this.searchedProductsArray[index].PRODUCT_DETAIL[0].transactionDetailsId = element.TRANSACTION_DETAIL_ID;
            }
        });
    };
    //Add To Cart Ends
    MobilecartComponent.prototype.checkOnlyTransactions = function () {
        var localTransactionArray = [];
        if (this.transactionService.transactionDetailsArray && this.transactionService.transactionDetailsArray.length > 0) {
            this.transactionService.transactionDetailsArray.forEach(function (element) {
                if (element.TRANSACTION_DETAIL_TYPE_CODE == 1) { //Because we are  also getting Delivery Charge and Convenience fee
                    localTransactionArray.push(element);
                }
            });
        }
        this.transactionService.transactionDetailsArray = [];
        this.transactionService.transactionDetailsArray = localTransactionArray;
        this.refreshCart();
    };
    MobilecartComponent.prototype.refreshCart = function () {
        this.userProfileService.numberOfProductsInCart = this.transactionService.transactionDetailsArray.length;
    };
    //Update Cart
    MobilecartComponent.prototype.makeUpdateSearchedProductsCartRequestObject = function (productObject, index, selectedQty) {
        var transactionDetails = {
            TRANSACTION_DETAIL_ID: productObject.PRODUCT_DETAIL[0].transactionDetailsId,
            PRODUCT_QUANTITY: selectedQty
        };
        var addToCartObject = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_ID: this.commonService.lsTransactionId(),
            TRANSACTION_DETAIL: transactionDetails
        };
        this.updateCartRequestObject = addToCartObject;
    };
    MobilecartComponent.prototype.updateSearchedProductsCart = function (productObject, index, selectedQty, method) {
        var _this = this;
        this.processBar = true;
        if (method == 1) {
            selectedQty = selectedQty + 1;
        }
        else {
            selectedQty = selectedQty - 1;
        }
        if (selectedQty == 0) {
            this.deleteSearchedProductsCart(productObject.PRODUCT_DETAIL[0].transactionDetailsId, index);
        }
        else {
            this.makeUpdateSearchedProductsCartRequestObject(productObject, index, selectedQty);
            this.subscriberService.updateCart(this.updateCartRequestObject).subscribe(function (data) { return _this.handleUpdateSearchedProductsCartResponse(data, index, selectedQty); }, function (error) { return _this.handleError(error); });
        }
    };
    MobilecartComponent.prototype.handleUpdateSearchedProductsCartResponse = function (data, index, selectedQty) {
        if (data.STATUS == "OK") {
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.transactionService.transactionArray = data.TRANSACTION;
            this.searchedProductsArray[index].selectedQuantity = selectedQty;
            this.checkOnlyTransactions();
        }
        this.processBar = false;
    };
    //Update Cart Ends
    //Delete Cart 
    MobilecartComponent.prototype.makeDeleteSearchedProductsCartRequestObject = function (transactionDetailId) {
        var transactionDetails = {
            TRANSACTION_DETAIL_ID: transactionDetailId
        };
        var addToCartObject = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_ID: this.commonService.lsTransactionId(),
            TRANSACTION_DETAIL: transactionDetails
        };
        this.deleteCartRequestObject = addToCartObject;
    };
    MobilecartComponent.prototype.deleteSearchedProductsCart = function (transactionDetailId, index) {
        var _this = this;
        this.processBar = true;
        this.makeDeleteSearchedProductsCartRequestObject(transactionDetailId);
        this.subscriberService.removeFromCart(this.deleteCartRequestObject).subscribe(function (data) { return _this.handleDeleteSearchedProductsCartResponse(data, index); }, function (error) { return _this.handleError(error); });
    };
    MobilecartComponent.prototype.handleDeleteSearchedProductsCartResponse = function (data, index) {
        if (data.STATUS == "OK") {
            this.searchedProductsArray[index].showAddToCart = 1;
            this.searchedProductsArray[index].selectedQuantity = 1;
            this.searchedProductsArray[index].transactionDetailId = 0;
            this.fetchCartInProgress();
        }
        this.processBar = false;
    };
    //Delete Cart Ends
    MobilecartComponent.prototype.getProductImageName = function (object) {
        var imageName = "";
        if (object.PRODUCT_DETAIL[0] && object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0] && object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH != 'undefined')
            imageName = object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH;
        return imageName;
    };
    MobilecartComponent.prototype.getProductUnit = function (object) {
        var unit = "";
        if (object.PRODUCT_DETAIL[0] && object.PRODUCT_DETAIL[0].UNIT != 'undefined')
            unit = object.PRODUCT_DETAIL[0].UNIT;
        return unit;
    };
    MobilecartComponent.prototype.getProductUnitTypeName = function (object) {
        var unitTypeName = "";
        if (object.PRODUCT_DETAIL[0] && object.PRODUCT_DETAIL[0].UNIT_TYPE_NAME != 'undefined')
            unitTypeName = object.PRODUCT_DETAIL[0].UNIT_TYPE_NAME;
        return unitTypeName;
    };
    MobilecartComponent.prototype.getProductSellingPrice = function (object) {
        var price = "";
        if (object.PRODUCT_DETAIL[0] && object.PRODUCT_DETAIL[0].SELLING_PRICE != 'undefined')
            price = object.PRODUCT_DETAIL[0].SELLING_PRICE;
        return price;
    };
    MobilecartComponent.prototype.makeFetchSocialMediaRequestObject = function () {
        this.fetchSocialMediaRequestObject = {
            STORE_ID: this.configService.getStoreID()
        };
    };
    MobilecartComponent.prototype.fetchSocialMedia = function () {
        var _this = this;
        this.processBar = true;
        this.makeFetchSocialMediaRequestObject();
        this.footerService.fetchSocialMediaAPI(this.fetchSocialMediaRequestObject).subscribe(function (data) { return _this.handleFetchSocialMediaSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    MobilecartComponent.prototype.handleFetchSocialMediaSuccess = function (pData) {
        if (pData.STATUS = 'OK') {
            this.socialMediaDetailsArray = pData.SOCIAL_MEDIA;
        }
        // stop the progress bar
        this.processBar = false;
    };
    // Social Media end
    MobilecartComponent.prototype.checkoutAPI = function () {
        if (window.innerWidth < 600) {
            if (this.commonService.isSubscriberLoggedIn()) {
                this._router.navigate(['/collections/checkout-new']);
            }
            else {
                this._router.navigate(['/collections/checkout-new-login']);
            }
        }
        else {
            this._router.navigate(['/collections/checkout-new']);
        }
    };
    MobilecartComponent.prototype.fetchProduct = function (pTransactionDetailObject) {
        var _this = this;
        var requestObject = {
            STORE_ID: this.configService.getStoreID(),
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            PRODUCT_ID: pTransactionDetailObject.PRODUCT_ID
        };
        this.productService.fetchProductByProductId(requestObject).subscribe(function (data) { return _this.handleFetchProduct(data, pTransactionDetailObject); }, function (error) { return error; });
    };
    MobilecartComponent.prototype.handleFetchProduct = function (pData, pTransactionDetailObject) {
        if (pData.STATUS == "OK") {
            var productArray = pData.PRODUCT;
            if (pTransactionDetailObject != undefined)
                productArray[0].TRANSACTION_DETAIL = pTransactionDetailObject;
            this.openVarianceDialog(productArray[0]);
        }
    };
    MobilecartComponent.prototype.getProductFinalPrice = function (transactionDetailObject) {
        var productPrice = transactionDetailObject.PRODUCT_QUANTITY * transactionDetailObject.PRODUCT_FINAL_PRICE;
        var addOnPrice = 0;
        if (transactionDetailObject.ADD_ON_DETAIL && transactionDetailObject.ADD_ON_DETAIL.length > 0) {
            transactionDetailObject.ADD_ON_DETAIL.forEach(function (addOnProduct) {
                addOnPrice += (addOnProduct.PRODUCT_FINAL_PRICE * addOnProduct.PRODUCT_QUANTITY);
            });
        }
        return productPrice + addOnPrice;
    };
    MobilecartComponent = __decorate([
        core_1.Component({
            selector: 'app-mobilecart',
            templateUrl: './mobilecart.component.html',
            styleUrls: ['./mobilecart.component.css']
        })
    ], MobilecartComponent);
    return MobilecartComponent;
}());
exports.MobilecartComponent = MobilecartComponent;
