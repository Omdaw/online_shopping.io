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
exports.DialogOverviewExampleDialog = exports.MainNavComponent = void 0;
var core_1 = require("@angular/core");
var ApplicationConstants_1 = require("src/ApplicationConstants");
var dialog_1 = require("@angular/material/dialog");
var $ = require("jquery");
var products_component_1 = require("../products/products.component");
var MainNavComponent = /** @class */ (function () {
    function MainNavComponent(configService, _router, headerService, userProfileService, transactionService, subscriberService, footerService, SearchService, flagsService, walletMethodsService, commonService, referenceMethodsService, dialog, productMidLayerService, productService) {
        this.configService = configService;
        this._router = _router;
        this.headerService = headerService;
        this.userProfileService = userProfileService;
        this.transactionService = transactionService;
        this.subscriberService = subscriberService;
        this.footerService = footerService;
        this.SearchService = SearchService;
        this.flagsService = flagsService;
        this.walletMethodsService = walletMethodsService;
        this.commonService = commonService;
        this.referenceMethodsService = referenceMethodsService;
        this.dialog = dialog;
        this.productMidLayerService = productMidLayerService;
        this.productService = productService;
        this.foods = [
            { value: 'steak-0', viewValue: 'Steak' },
            { value: 'pizza-1', viewValue: 'Pizza' },
            { value: 'tacos-2', viewValue: 'Tacos' }
        ];
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
        this.loggedInUserName = "";
        this.hideWAHeader = "";
        this.displayWAHeader = true;
        this.isSticky = false;
        this.showSearchField = false;
        this.showSearchIcon = true;
        this.onClicked = 0;
        this.displaySearchInput = false;
        this.subscriberId = 0;
        this.googleTagManagerId = "";
        //Store Details 
        this.storeLogo = "";
        this.storeName = "";
        this.storeStatusTitleAndDesc = "";
        this.storeStatus = 0;
        this.storeLogoForMobile = "";
        this.processBarLogo = false;
        this.searchedProductsArray = [];
        this.searchCategoryId = 0;
        this.searchText1 = "";
        this.showsearch = false;
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
        // Transaction Review
        this.orderStatusCode = 0;
        this.comments = "";
    }
    MainNavComponent.prototype.openDialog = function () {
        var dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
            width: '600px'
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log('The dialog was closed');
        });
    };
    // Dialog ends
    // Dialog
    MainNavComponent.prototype.openVarianceDialog = function (pProductDetail) {
        var dialogRef = this.dialog.open(products_component_1.VarianceDialog, {
            width: '600px',
            height: '500px',
            data: pProductDetail
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log('The dialog was closed');
        });
    };
    MainNavComponent.prototype.openCustomizationConfirmationPopup = function (pTransactionDetailsObject) {
        var dialogRef = this.dialog.open(products_component_1.CustomizationConfirmationDialog, {
            width: '700px',
            data: pTransactionDetailsObject
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log('The dialog was closed');
        });
    };
    //Variance/AddOns ends
    MainNavComponent.prototype.fetchProduct = function (pTransactionDetailObject) {
        var _this = this;
        var requestObject = {
            STORE_ID: this.configService.getStoreID(),
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            PRODUCT_ID: pTransactionDetailObject.PRODUCT_ID
        };
        this.productService.fetchProductByProductId(requestObject).subscribe(function (data) { return _this.handleFetchProduct(data, pTransactionDetailObject); }, function (error) { return error; });
    };
    MainNavComponent.prototype.handleFetchProduct = function (pData, pTransactionDetailObject) {
        if (pData.STATUS == "OK") {
            var productArray = pData.PRODUCT;
            if (pTransactionDetailObject != undefined)
                productArray[0].TRANSACTION_DETAIL = pTransactionDetailObject;
            this.openVarianceDialog(productArray[0]);
        }
    };
    MainNavComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.commonService.hideWAHeader.subscribe(function (message) {
            _this.hideWAHeader = message;
            _this.callforVertDrop();
        });
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
    MainNavComponent.prototype.callforVertDrop = function () {
        if (this.hideWAHeader == "hideFM") {
            this.displayWAHeader = false;
        }
        else {
            this.displayWAHeader = true;
        }
    };
    MainNavComponent.prototype.checkScroll = function () {
        this.isSticky = window.pageYOffset >= 1;
        if ((window.pageYOffset) >= 1) {
        }
        else {
        }
    };
    MainNavComponent.prototype.showSearch = function () {
        var _this = this;
        this.showSearchField = true;
        this.showSearchIcon = false;
        this.onClicked = 1;
        setTimeout(function () {
            _this.onClicked = 0;
        }, 50);
    };
    MainNavComponent.prototype.clickout = function (event) {
        if (this.webSearchDiv.nativeElement.contains(event.target)) {
            this.showSearchField = true;
            this.showSearchIcon = false;
            this.onClicked = 0;
        }
        else {
            if (this.onClicked == 0) {
                this.showSearchField = false;
                this.showSearchIcon = true;
            }
        }
    };
    MainNavComponent.prototype.toggleSearchInput = function () {
        this.displaySearchInput = !this.displaySearchInput;
    };
    MainNavComponent.prototype.secondaryHeader = function () {
        var flag = true;
        if (this.commonService.getComponentName() == '/store-coming-soon')
            flag = false;
        return flag;
    };
    MainNavComponent.prototype.checkSubscriberId = function () {
        if (this.commonService.lsSubscriberId())
            this.subscriberId = +this.commonService.lsSubscriberId();
        if (this.subscriberId == 0) {
            this.temporarySubscriberLogin();
        }
        else {
            this.loadDefaultMethods();
        }
    };
    MainNavComponent.prototype.loadDefaultMethods = function () {
        this.fetchStore();
        this.commonService.fetchStoreParams(); //Checklist-2
        this.fetchCartInProgress();
        this.fetchSocialMedia();
        this.fetchGoogleTagManagerAPI();
        this.checkTransactionReviewPending();
        this.walletMethodsService.fetchWalletMoneyBySubscriberIdAPI();
    };
    MainNavComponent.prototype.fetchGoogleTagManagerAPI = function () {
        var _this = this;
        var requestObject = {
            STORE_ID: this.configService.getStoreID()
        };
        this.subscriberService.fetchGoogleTagManagerAPI(requestObject).subscribe(function (data) { return _this.handlefetchGoogleTagManagerAPISuccess(data); }, function (error) { return _this.handleError(error); });
    };
    MainNavComponent.prototype.handlefetchGoogleTagManagerAPISuccess = function (data) {
        if (data.STATUS == "OK") {
            var tempArray = data.GOOGLE_TAG_MANAGER;
            if (tempArray[0])
                this.googleTagManagerId = tempArray[0].GOOGLE_TAG_MANAGER_ID;
        }
    };
    MainNavComponent.prototype.temporarySubscriberLogin = function () {
        var _this = this;
        this.subscriberService.tempSubscriberLogin().subscribe(function (data) { return _this.handleTemporarySubscriberLoginSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    MainNavComponent.prototype.handleTemporarySubscriberLoginSuccess = function (data) {
        if (data.STATUS == "OK") {
            var authToken = data.SUBSCRIBER.AUTHENTICATION_TOKEN;
            var subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
            var tempSubscriberFlag = 1;
            var transactionId = 0;
            this.commonService.addStoreData(authToken, subscriberId, tempSubscriberFlag, transactionId);
            this.loadDefaultMethods();
        }
    };
    MainNavComponent.prototype.handleError = function (error) {
    };
    MainNavComponent.prototype.makeFetchStoreRequestObject = function () {
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
    MainNavComponent.prototype.fetchStore = function () {
        var _this = this;
        this.processBarLogo = true;
        this.makeFetchStoreRequestObject();
        this.headerService.fetchStore(this.fetchStoreRequest).subscribe(function (data) { return _this.handleFetchStoreResponse(data); }, function (error) { return _this.handleError(error); });
    };
    MainNavComponent.prototype.handleFetchStoreResponse = function (pData) {
        if (pData.STATUS == "OK") {
            this.storeDetailsObject = pData.STORE[0];
            this.commonService.storeObject = pData.STORE[0];
            this.commonService.STORE_CURRENCY_SYMBOL = pData.STORE[0].STORE_CURRENCY_SYMBOL;
            this.storeStatus = pData.STORE[0].STORE_STATUS_CODE;
            this.storeName = pData.STORE[0].STORE_NAME;
            this.storeLogo = pData.STORE[0].STORE_LOGO_URL;
            this.commonService.storeLogo = pData.STORE[0].STORE_LOGO_URL;
            this.commonService.applicationId = pData.STORE[0].APPLICATION_ID;
            this.storeLogoForMobile = pData.STORE[0].MOBILE_LOGO_IMAGE_URL;
            $("#faviconLink").attr("href", pData.STORE[0].STORE_FAV_ICON_IMAGE_URL); //checklist-2
            document.documentElement.style.setProperty("--theme-color", pData.STORE[0].STORE_THEME_HEX_COLOR_CODE); //checklist-2
            this.storeStatusTitleAndDesc = "";
            if (pData.STORE[0].STORE_STATUS_TITLE && pData.STORE[0].STORE_STATUS_TITLE != 'null')
                this.storeStatusTitleAndDesc = pData.STORE[0].STORE_STATUS_TITLE;
            if (pData.STORE[0].STORE_STATUS_DESC && pData.STORE[0].STORE_STATUS_DESC != 'null')
                this.storeStatusTitleAndDesc = this.storeStatusTitleAndDesc + " " + pData.STORE[0].STORE_STATUS_DESC;
            this.commonService.setDocTitle(pData.STORE[0].PAGE_TITLE + " " + pData.STORE[0].PAGE_DESCRIPTION); //checklist-2
            this.flashMessage = "";
            this.flashMessageStatusCode = 0;
            if (pData.STORE[0].FLASH_MESSAGE && pData.STORE[0].FLASH_MESSAGE != 'null')
                this.flashMessage = pData.STORE[0].FLASH_MESSAGE;
            if (pData.STORE[0].FLASH_MESSAGE_STATUS_CODE && pData.STORE[0].FLASH_MESSAGE_STATUS_CODE != 'null')
                this.flashMessageStatusCode = pData.STORE[0].FLASH_MESSAGE_STATUS_CODE;
        }
        this.processBarLogo = false;
    };
    // Search Start
    MainNavComponent.prototype.makeFetchSearchObject = function () {
        this.fetchSearchRequest = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            PRODUCT_SEARCH_TEXT: this.searchText,
            STORE_ID: this.configService.getStoreID(),
            LIMIT: ApplicationConstants_1.ApplicationConstants.DEFAULT_LIMIT,
            OFFSET: ApplicationConstants_1.ApplicationConstants.DEFAULT_OFFSET
        };
    };
    MainNavComponent.prototype.fetchSearch = function () {
        var _this = this;
        this.processBar = true;
        this.makeFetchSearchObject();
        this.headerService.searchProductByInputId(this.fetchSearchRequest).subscribe(function (data) { return _this.handleFetchSearchResponse(data); }, function (error) { return _this.handleError(error); });
    };
    MainNavComponent.prototype.handleFetchSearchResponse = function (pData) {
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
    // Search End
    MainNavComponent.prototype.checkProductExistsInTransaction = function (index) {
        var _this = this;
        this.transactionService.transactionDetailsArray.forEach(function (element) {
            if (_this.searchedProductsArray[index].PRODUCT_DETAIL[0].PRODUCT_DETAIL_ID == element.PRODUCT_DETAIL_ID) {
                _this.searchedProductsArray[index].showAddToCart = 0;
                _this.searchedProductsArray[index].selectedQuantity = element.PRODUCT_QUANTITY;
                _this.searchedProductsArray[index].PRODUCT_DETAIL[0].transactionDetailsId = element.TRANSACTION_DETAIL_ID;
            }
        });
    };
    MainNavComponent.prototype.searchProductsList = function () {
        if (this.searchText1 != '') {
            this.hidesearch();
            this._router.navigate(['/AllCollections/search', this.searchText1]);
            this.searchText1 = ""; //<!-- Final Checklist -->
        }
    };
    MainNavComponent.prototype.hidesearch = function () {
        this.searchText1 = "";
        this.showsearch = false;
    };
    MainNavComponent.prototype.searchProducts = function () {
        if (this.searchText != '') {
            this._router.navigate(['/AllCollections/search', this.searchText]);
            this.SearchService.displaySearch = false;
            this.searchText = "";
        }
    };
    MainNavComponent.prototype.logout = function () {
        this.commonService.addTransactionIdTols();
        this.commonService.addSubscriberIdTols(0);
        this.commonService.addTempSubscriberFlagTols(0);
        this.commonService.addLoggedInUsernameTols("");
        if (this.flagsService.inDeliveryPageFlag) {
            this._router.navigate(['/']);
            // window.location.reload();
        }
        else {
            this._router.navigate(['/']);
            setTimeout(function () {
                window.location.reload();
            }, 1000);
        }
    };
    MainNavComponent.prototype.showSerach = function () {
        if (this.searchText.length > 0) {
            this.SearchService.displaySearch = true;
        }
        else {
            this.SearchService.displaySearch = false;
        }
    };
    MainNavComponent.prototype.hideSerach = function () {
        this.SearchService.displaySearch = false;
    };
    MainNavComponent.prototype.showMinicart = function () {
        if (this.userProfileService.numberOfProductsInCart != this.transactionService.transactionDetailsArray.length)
            this.fetchCartInProgress();
        this.displayMinicart = true;
    };
    MainNavComponent.prototype.hideMinicart = function () {
        this.displayMinicart = false;
    };
    MainNavComponent.prototype.makeFetchCartInProgressObject = function () {
        var tempObj = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID()
        };
        this.fetchCartInProgressRequestObject = tempObj;
    };
    MainNavComponent.prototype.fetchCartInProgress = function () {
        var _this = this;
        this.processBar = true;
        this.makeFetchCartInProgressObject();
        this.subscriberService.fetchCartInProgressTransactionsBySubscriberIdAPI(this.fetchCartInProgressRequestObject)
            .subscribe(function (data) { return _this.handleFetchCartInProgressResponse(data); }, function (error) { return _this.handleError(error); });
    };
    MainNavComponent.prototype.handleFetchCartInProgressResponse = function (data) {
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
    MainNavComponent.prototype.refreshCartAmountDetail = function () {
        // console.log("Refresh");
        // console.log(this.transactionService.transactionArray);
        // console.log(this.transactionService.transactionDetailsArray);
        var data = this.transactionService.transactionArray[0];
        this.invoiceAmount = data.INVOICE_AMOUNT;
        this.invoiceDiscountAmount = data.INVOICE_DISCOUNT_AMOUNT;
        this.invoiceTotal = data.INVOICE_FINAL_AMOUNT;
        this.userProfileService.invoiceTotal = data.INVOICE_FINAL_AMOUNT;
    };
    MainNavComponent.prototype.calculateInvoiceDetail = function (data) {
        this.invoiceAmount = data.INVOICE_AMOUNT;
        this.invoiceDiscountAmount = data.INVOICE_DISCOUNT_AMOUNT;
        this.invoiceTotal = data.INVOICE_FINAL_AMOUNT;
        this.userProfileService.invoiceAmount = this.invoiceAmount;
        this.userProfileService.invoiceDiscount = this.invoiceDiscountAmount;
        this.userProfileService.invoiceTotal = this.invoiceTotal;
    };
    MainNavComponent.prototype.maketransactionArray = function (data) {
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
    MainNavComponent.prototype.reduceQuantity = function (index) {
        this.selectedIndex = index;
        this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY = this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY - 1;
        if (this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY == 0) {
            this.deleteCart();
        }
        this.updateCart();
    };
    MainNavComponent.prototype.increaseQuantity = function (index) {
        this.selectedIndex = index;
        this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY = this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY + 1;
        this.updateCart();
    };
    MainNavComponent.prototype.removeFromCart = function (index) {
        this.processBar = true;
        this.selectedIndex = index;
        this.deleteCart();
    };
    MainNavComponent.prototype.makeUpdateCartRequestObject = function () {
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
    MainNavComponent.prototype.updateCart = function () {
        var _this = this;
        this.processBar = true;
        this.makeUpdateCartRequestObject();
        this.subscriberService.updateCart(this.updateCartRequestObject).subscribe(function (data) { return _this.handleUpdateCartResponse(data); }, function (error) { return _this.handleError(error); });
    };
    MainNavComponent.prototype.handleUpdateCartResponse = function (data) {
        this.processBar = false;
        if (data.STATUS == "OK") {
            this.calculateInvoiceDetail(data.TRANSACTION[0]);
            this.maketransactionArray(data);
            this.transactionService.transactionArray = data.TRANSACTION;
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.checkOnlyTransactions();
        }
    };
    MainNavComponent.prototype.makeDeleteCartRequestObject = function () {
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
    MainNavComponent.prototype.deleteCart = function () {
        var _this = this;
        this.makeDeleteCartRequestObject();
        this.subscriberService.removeFromCart(this.deleteCartRequestObject).subscribe(function (data) { return _this.handleDeleteCartResponse(data); }, function (error) { return _this.handleError(error); });
    };
    MainNavComponent.prototype.handleDeleteCartResponse = function (data) {
        if (data.STATUS == "OK") {
            this.transactionService.transactionDetailsArray.splice(this.selectedIndex, 1);
            this.calculateInvoiceDetail(data.TRANSACTION[0]);
            this.maketransactionArray(data);
            this.processBar = false;
            this.transactionService.transactionArray = data.TRANSACTION;
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.checkOnlyTransactions();
        }
    };
    //Add To Cart
    MainNavComponent.prototype.makeAddToCartRequestObject = function (productObject) {
        var transactionId = 0;
        if (this.commonService.lsTransactionId() && this.commonService.lsTransactionId() != 0 && this.commonService.lsTransactionId() != null)
            transactionId = +this.commonService.lsTransactionId();
        var productDetailObject = productObject.PRODUCT_DETAIL[0];
        var transactionDetails = {
            TRANSACTION_DETAIL_ID: this.transactionDetailsId,
            TRANSACTION_ID: transactionId,
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
            TRANSACTION_ID: transactionId,
            TRANSACTION_DETAIL: transactionDetails
        };
        this.addToCartRequestObject = addToCartObject;
    };
    MainNavComponent.prototype.addToCart = function (productObject, index) {
        var _this = this;
        this.processBar = true;
        this.selectedProductIndex = index;
        this.makeAddToCartRequestObject(productObject);
        this.subscriberService.addToCart(this.addToCartRequestObject).subscribe(function (data) { return _this.handleAddToCartResponse(data, index); }, function (error) { return _this.handleError(error); });
    };
    MainNavComponent.prototype.handleAddToCartResponse = function (data, index) {
        if (data.STATUS == "OK") {
            this.searchedProductsArray[this.selectedProductIndex].showAddToCart = 0;
            this.setPorductDetailId(index, data.TRANSACTION[0].TRANSACTION_DETAIL);
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.transactionService.transactionArray = data.TRANSACTION;
            if (this.transactionService.transactionDetailsArray.length > 0) {
                this.commonService.addTransactionIdTols();
            }
            this.checkOnlyTransactions();
        }
        this.processBar = false;
    };
    MainNavComponent.prototype.setPorductDetailId = function (index, transactionArray) {
        var _this = this;
        var productDetailsId = this.searchedProductsArray[index].PRODUCT_DETAIL[0].PRODUCT_DETAIL_ID;
        transactionArray.forEach(function (element) {
            if (productDetailsId == element.PRODUCT_DETAIL_ID) {
                _this.searchedProductsArray[index].PRODUCT_DETAIL[0].transactionDetailsId = element.TRANSACTION_DETAIL_ID;
            }
        });
    };
    //Add To Cart Ends
    MainNavComponent.prototype.checkOnlyTransactions = function () {
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
    MainNavComponent.prototype.refreshCart = function () {
        this.userProfileService.numberOfProductsInCart = this.transactionService.transactionDetailsArray.length;
    };
    //Update Cart
    MainNavComponent.prototype.makeUpdateSearchedProductsCartRequestObject = function (productObject, index, selectedQty) {
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
    MainNavComponent.prototype.updateSearchedProductsCart = function (productObject, index, selectedQty, method) {
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
    MainNavComponent.prototype.handleUpdateSearchedProductsCartResponse = function (data, index, selectedQty) {
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
    MainNavComponent.prototype.makeDeleteSearchedProductsCartRequestObject = function (transactionDetailId) {
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
    MainNavComponent.prototype.deleteSearchedProductsCart = function (transactionDetailId, index) {
        var _this = this;
        this.processBar = true;
        this.makeDeleteSearchedProductsCartRequestObject(transactionDetailId);
        this.subscriberService.removeFromCart(this.deleteCartRequestObject).subscribe(function (data) { return _this.handleDeleteSearchedProductsCartResponse(data, index); }, function (error) { return _this.handleError(error); });
    };
    MainNavComponent.prototype.handleDeleteSearchedProductsCartResponse = function (data, index) {
        if (data.STATUS == "OK") {
            this.searchedProductsArray[index].showAddToCart = 1;
            this.searchedProductsArray[index].selectedQuantity = 1;
            this.searchedProductsArray[index].transactionDetailId = 0;
            this.fetchCartInProgress();
        }
        this.processBar = false;
    };
    //Delete Cart Ends
    MainNavComponent.prototype.getProductImageName = function (object) {
        var imageName = "";
        if (object.PRODUCT_DETAIL[0] && object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0] && object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH != 'undefined')
            imageName = object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH;
        return imageName;
    };
    MainNavComponent.prototype.getProductUnit = function (object) {
        var unit = "";
        if (object.PRODUCT_DETAIL[0] && object.PRODUCT_DETAIL[0].UNIT != 'undefined')
            unit = object.PRODUCT_DETAIL[0].UNIT;
        return this.commonService.checkIfNull(unit);
    };
    MainNavComponent.prototype.getProductUnitTypeName = function (object) {
        var unitTypeName = "";
        if (object.PRODUCT_DETAIL[0] && object.PRODUCT_DETAIL[0].UNIT_TYPE_NAME != 'undefined')
            unitTypeName = object.PRODUCT_DETAIL[0].UNIT_TYPE_NAME;
        return this.commonService.checkIfNull(unitTypeName);
    };
    MainNavComponent.prototype.getProductSellingPrice = function (object) {
        var price = 0;
        if (object.PRODUCT_DETAIL[0] && object.PRODUCT_DETAIL[0].SELLING_PRICE != 'undefined')
            price = object.PRODUCT_DETAIL[0].SELLING_PRICE;
        return price.toFixed(2);
    };
    MainNavComponent.prototype.makeFetchSocialMediaRequestObject = function () {
        this.fetchSocialMediaRequestObject = {
            STORE_ID: this.configService.getStoreID()
        };
    };
    MainNavComponent.prototype.fetchSocialMedia = function () {
        var _this = this;
        this.processBar = true;
        this.makeFetchSocialMediaRequestObject();
        this.footerService.fetchSocialMediaAPI(this.fetchSocialMediaRequestObject).subscribe(function (data) { return _this.handleFetchSocialMediaSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    MainNavComponent.prototype.handleFetchSocialMediaSuccess = function (pData) {
        if (pData.STATUS = 'OK') {
            this.socialMediaDetailsArray = pData.SOCIAL_MEDIA;
        }
        // stop the progress bar
        this.processBar = false;
    };
    // Social Media end
    // checkoutAPI(){
    //   let tempSubscriberFlag = 0;
    //   if(this.commonService.lsTempSubscriberFlag()){ tempSubscriberFlag = + this.commonService.lsTempSubscriberFlag();}
    //   if(tempSubscriberFlag > 0){
    //     this.userProfileService.loginCallFromCheckoutPage = 1;
    //     this._router.navigate(['login']);
    //   }else{
    //     this._router.navigate(['delivery-and-payments']);
    //   }
    // }
    MainNavComponent.prototype.checkoutAPI = function () {
        this._router.navigate(['/collections/checkout-new']);
        // let tempSubscriberFlag = 0;
        // if(this.commonService.lsTempSubscriberFlag()){ tempSubscriberFlag = + this.commonService.lsTempSubscriberFlag();}
        // if(tempSubscriberFlag > 0){
        //   this.userProfileService.loginCallFromCheckoutPage = 1;
        //   this._router.navigate(['login']);
        // }else{
        //   this._router.navigate(['delivery-and-payments']);
        // }
    };
    MainNavComponent.prototype.continueShopping = function () {
        if (this.flagsService.continueShoppingCallFromInvoice)
            this._router.navigate(['/']); // This will take u to Homepage
    };
    MainNavComponent.prototype.updateOrderStatus = function (orderStatusCode) {
        this.orderStatusCode = orderStatusCode;
        // this.flagsService.orderStatusCodePopUp  = false;
    };
    MainNavComponent.prototype.checkTransactionReviewPending = function () {
        this.transactionService.checkTransactionReviewPending();
    };
    MainNavComponent.prototype.insertTransactionReview = function () {
        this.transactionService.insertTransactionReviewRequestObject = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            TRANSACTION_ID: this.transactionService.transactionReviewTransactionId,
            RATING: this.orderStatusCode,
            COMMENTS: this.comments
        };
        if (this.orderStatusCode > 0) {
            this.transactionService.insertTransactionReview();
            this.flagsService.orderStatusCodePopUp = false;
        }
    };
    MainNavComponent.prototype.rateLater = function () {
        this.flagsService.orderStatusCodePopUp = false;
    };
    // Transaction Review ends
    MainNavComponent.prototype.updateSelectedBackgroundColor = function (param) {
        var color = "#fff";
        if (param == this.orderStatusCode)
            color = "#6573b8";
        return color;
    };
    MainNavComponent.prototype.inviteToMyApplication = function () {
        this.referenceMethodsService.fetchReferralURLBySubscriberId();
    };
    MainNavComponent.prototype.isStoreInTestingMode = function () {
        var testingFlag = false;
        if (this.storeStatus == ApplicationConstants_1.ApplicationConstants.STORE_STATUS_CODE_TESTING)
            testingFlag = true;
        return testingFlag;
    };
    MainNavComponent.prototype.getProductFinalPrice = function (transactionDetailObject) {
        var productPrice = transactionDetailObject.PRODUCT_QUANTITY * transactionDetailObject.PRODUCT_FINAL_PRICE;
        var addOnPrice = 0;
        if (transactionDetailObject.ADD_ON_DETAIL && transactionDetailObject.ADD_ON_DETAIL.length > 0) {
            transactionDetailObject.ADD_ON_DETAIL.forEach(function (addOnProduct) {
                addOnPrice += (addOnProduct.PRODUCT_FINAL_PRICE * addOnProduct.PRODUCT_QUANTITY);
            });
        }
        return productPrice + addOnPrice;
    };
    __decorate([
        core_1.HostListener('window:scroll', ['$event'])
    ], MainNavComponent.prototype, "checkScroll");
    __decorate([
        core_1.ViewChild('webSearchDiv')
    ], MainNavComponent.prototype, "webSearchDiv");
    __decorate([
        core_1.HostListener('document:click', ['$event'])
    ], MainNavComponent.prototype, "clickout");
    MainNavComponent = __decorate([
        core_1.Component({
            selector: 'app-main-nav',
            templateUrl: './main-nav.component.html',
            styleUrls: ['./main-nav.component.css']
        })
    ], MainNavComponent);
    return MainNavComponent;
}());
exports.MainNavComponent = MainNavComponent;
var DialogOverviewExampleDialog = /** @class */ (function () {
    function DialogOverviewExampleDialog(configService, dialogRef, data, referenceMethodsService, flashMessagesService, commonService) {
        this.configService = configService;
        this.dialogRef = dialogRef;
        this.data = data;
        this.referenceMethodsService = referenceMethodsService;
        this.flashMessagesService = flashMessagesService;
        this.commonService = commonService;
    }
    /* To copy Text from Textbox */
    DialogOverviewExampleDialog.prototype.copyInputMessage = function (inputElement) {
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
        this.commonService.notifySuccessMessage(this.flashMessagesService, "Copied");
    };
    DialogOverviewExampleDialog.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    DialogOverviewExampleDialog.prototype.closeDialogue = function () {
        this.dialogRef.close();
    };
    DialogOverviewExampleDialog.prototype.copyLink = function () {
        this.commonService.notifySuccessMessage(this.flashMessagesService, "Copied");
    };
    DialogOverviewExampleDialog = __decorate([
        core_1.Component({
            selector: 'dialog-overview-example-dialog',
            templateUrl: './referel-dialog.html'
        }),
        __param(2, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], DialogOverviewExampleDialog);
    return DialogOverviewExampleDialog;
}());
exports.DialogOverviewExampleDialog = DialogOverviewExampleDialog;
// Dialog Code endstransactionService
