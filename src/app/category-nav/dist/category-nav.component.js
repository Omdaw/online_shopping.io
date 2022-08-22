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
exports.InviteDialogForMobile = exports.CategoryNavComponent = void 0;
var core_1 = require("@angular/core");
var ApplicationConstants_1 = require("src/ApplicationConstants");
var dialog_1 = require("@angular/material/dialog");
var $ = require("jquery");
var CategoryNavComponent = /** @class */ (function () {
    function CategoryNavComponent(configService, _router, headerService, userProfileService, subscriberService, transactionService, flagsService, walletMethodsService, commonService, dialog, referenceMethodsService, SearchService, productMidLayerService) {
        this.configService = configService;
        this._router = _router;
        this.headerService = headerService;
        this.userProfileService = userProfileService;
        this.subscriberService = subscriberService;
        this.transactionService = transactionService;
        this.flagsService = flagsService;
        this.walletMethodsService = walletMethodsService;
        this.commonService = commonService;
        this.dialog = dialog;
        this.referenceMethodsService = referenceMethodsService;
        this.SearchService = SearchService;
        this.productMidLayerService = productMidLayerService;
        // Dialog ends
        //variables
        this.processBar = false;
        this.categoriesArray = [];
        this.mobileCategoriesArray = []; //final checklist
        this.selectedTopLevelCategory = { SUB_CATEGORY: [] };
        this.searchText = "";
        this.hideWAHeader = "";
        // showBotViewCart = false;
        // showBotViewCartFun() {
        //   if (this.showBotViewCartValue == 'true') {
        //     this.showBotViewCart = true;
        //   } else {
        //     this.showBotViewCart = false;
        //   }
        // }
        this.displayWAHeader = true;
        this.isSticky = false;
        this.categoriesShadow = "";
        this.subscriberId = 0;
        this.searchDisplayFlag = true;
        this.fetchCategoriesRequest = {};
        this.moreCategories = [];
        // showMobileSubCategory(i) {
        //   if (this.mobileCategoriesArray[i].showHide == 1) this.mobileCategoriesArray[i].showHide = 0; else this.mobileCategoriesArray[i].showHide = 1;
        // }
        this.invoiceTotal = 0;
        this.invoiceAmount = 0;
        this.invoiceDiscountAmount = 0;
        this.deliveryCharge = 0;
        this.convenienceFee = 0;
        this.gst = 0;
        //Store Details 
        this.fetchStoreRequest = {};
        this.storeDetailsObject = {};
        this.storeLogo = "";
        this.storeName = "";
        this.storeStatusTitleAndDesc = "";
        this.storeStatusTitle = "";
        this.storeStatusDesc = "";
        this.storeStatus = 0;
        this.storeLogoForMobile = "";
        this.processBarLogo = false;
        // Hide/Show Mobile Sub Menu
        this.showMobileSubMenu = [];
        this.hideMobileSubMenu = [];
        this.searchCategoryId = 0;
        this.searchText1 = "";
        this.hideClass = "";
        this.selectedCateIndex = -1;
        this.selectedSubCateIndex = -1;
        this.showsearch = false;
        this.displayMoresSubCategory = false;
    }
    // Dialog
    CategoryNavComponent.prototype.openDialog = function () {
        // this._router.navigate(['/']);
        var dialogRef = this.dialog.open(InviteDialogForMobile, {
            width: '600px'
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log('The dialog was closed');
        });
    };
    // showBotViewCartValue = "";
    CategoryNavComponent.prototype.ngOnInit = function () {
        var _this = this;
        // this.showBotViewCartValue = localStorage.getItem("showBotViewCart");
        this.commonService.hideWAHeader.subscribe(function (message) {
            _this.hideWAHeader = message;
            _this.callforVertDrop();
        });
        this.checkSubscriberId();
    };
    CategoryNavComponent.prototype.callforVertDrop = function () {
        if (this.hideWAHeader == "hideFM") {
            this.displayWAHeader = false;
        }
        else {
            this.displayWAHeader = true;
        }
    };
    CategoryNavComponent.prototype.checkScroll = function () {
        this.isSticky = window.pageYOffset >= 1;
        if ((window.pageYOffset) >= 1) {
            this.categoriesShadow = "categoriesShadow";
        }
        else {
            this.categoriesShadow = "";
        }
    };
    CategoryNavComponent.prototype.checkSubscriberId = function () {
        if (this.commonService.lsSubscriberId())
            this.subscriberId = +this.commonService.lsSubscriberId();
        if (this.subscriberId == 0) {
            this.temporarySubscriberLogin();
        }
        else {
            this.loadDefaultMethods();
        }
    };
    CategoryNavComponent.prototype.loadDefaultMethods = function () {
        this.fetchCategories();
        this.fetchStore();
    };
    CategoryNavComponent.prototype.temporarySubscriberLogin = function () {
        var _this = this;
        this.subscriberService.tempSubscriberLogin().subscribe(function (data) { return _this.handleTemporarySubscriberLoginSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    CategoryNavComponent.prototype.handleTemporarySubscriberLoginSuccess = function (data) {
        if (data.STATUS == "OK") {
            var authToken = data.SUBSCRIBER.AUTHENTICATION_TOKEN;
            var subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
            var tempSubscriberFlag = 1;
            var transactionId = 0;
            this.commonService.addStoreData(authToken, subscriberId, tempSubscriberFlag, transactionId);
            this.loadDefaultMethods();
        }
    };
    CategoryNavComponent.prototype.showSubCat = function (object) {
        this.selectedTopLevelCategory = object;
        if (this.selectedTopLevelCategory.SUB_CATEGORY.length > 0) {
            this.userProfileService.displaySubMenu = true;
        }
        else {
            this.userProfileService.displaySubMenu = false;
        }
    };
    CategoryNavComponent.prototype.makeFetchCategoriesRequestObject = function () {
        this.fetchCategoriesRequest = {
            STORE_ID: this.configService.getStoreID()
        };
    };
    CategoryNavComponent.prototype.fetchCategories = function () {
        var _this = this;
        this.processBar = true;
        this.makeFetchCategoriesRequestObject();
        this.headerService.fetchProductCategoryAPI(this.fetchCategoriesRequest)
            .subscribe(function (data) { return _this.handleFetchCategoriesSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    CategoryNavComponent.prototype.handleFetchCategoriesSuccess = function (pData) {
        if (pData.STATUS = 'OK') {
            var tempCategoryArray = pData.PRODUCT_CATEGORY;
            this.mobileCategoriesArray = pData.PRODUCT_CATEGORY;
            var maxItemsToShow = this.numberOfItemsToDisplayInMenu(tempCategoryArray);
            var arrayLength = maxItemsToShow;
            if (maxItemsToShow >= tempCategoryArray.length) {
                arrayLength = tempCategoryArray.length;
            }
            else {
                for (var i = maxItemsToShow; i < tempCategoryArray.length; i++) {
                    this.moreCategories.push(tempCategoryArray[i]);
                }
            }
            for (var i = 0; i < arrayLength; i++) {
                this.categoriesArray.push(tempCategoryArray[i]);
            }
            this.makeMobileShowHide();
        }
        // stop the progress bar
        this.processBar = false;
    };
    CategoryNavComponent.prototype.numberOfItemsToDisplayInMenu = function (tempCategoryArray) {
        console.log(window.innerWidth);
        var maxCharsWeToShow = 52;
        var numberOfChars = 0;
        var arrayIndex = 1;
        maxCharsWeToShow = this.getMaxCharsForCurrentScreen();
        tempCategoryArray.forEach(function (element) {
            numberOfChars += element.PRODUCT_CATEGORY_NAME.length;
            if (numberOfChars >= maxCharsWeToShow)
                return arrayIndex;
            arrayIndex++;
        });
        return arrayIndex;
    };
    CategoryNavComponent.prototype.getMaxCharsForCurrentScreen = function () {
        var windowWidth = window.innerWidth;
        if (windowWidth <= 834)
            return 8;
        if (windowWidth <= 1600)
            return 52;
        if (windowWidth > 1600)
            return 60;
    };
    CategoryNavComponent.prototype.makeMobileShowHide = function () {
        var _this = this;
        this.mobileCategoriesArray.forEach(function (element) {
            element.showHide = 0;
            _this.showMobileSubMenu.push(false);
        });
    };
    CategoryNavComponent.prototype.handleError = function (error) {
        console.log("Error", error);
    };
    CategoryNavComponent.prototype.refreshCartAmountDetail = function () {
        var data = this.transactionService.transactionArray[0];
        this.invoiceAmount = data.INVOICE_AMOUNT;
        this.invoiceDiscountAmount = data.INVOICE_DISCOUNT_AMOUNT;
        this.invoiceTotal = data.INVOICE_FINAL_AMOUNT;
    };
    CategoryNavComponent.prototype.makeFetchStoreRequestObject = function () {
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
    CategoryNavComponent.prototype.fetchStore = function () {
        var _this = this;
        this.processBarLogo = true;
        this.makeFetchStoreRequestObject();
        this.headerService.fetchStore(this.fetchStoreRequest).subscribe(function (data) { return _this.handleFetchStoreResponse(data); }, function (error) { return _this.handleError(error); });
    };
    CategoryNavComponent.prototype.handleFetchStoreResponse = function (pData) {
        if (pData.STATUS == "OK") {
            this.storeDetailsObject = pData.STORE[0];
            if (pData.STORE[0].STORE_CHECK_PINCODE_AT_CHECKOUT_FLAG == 1) {
                this.commonService.STORE_CHECK_PINCODE_AT_CHECKOUT_FLAG = true;
            }
            //Required things
            this.storeStatus = pData.STORE[0].STORE_STATUS_CODE;
            this.storeName = pData.STORE[0].STORE_NAME;
            this.storeLogo = pData.STORE[0].STORE_LOGO_URL;
            this.commonService.storeLogo = pData.STORE[0].STORE_LOGO_URL;
            this.storeLogoForMobile = pData.STORE[0].MOBILE_LOGO_IMAGE_URL;
            $("#faviconLink").attr("href", pData.STORE[0].STORE_FAV_ICON_IMAGE_URL); //checklist-2
            document.documentElement.style.setProperty("--theme-color", pData.STORE[0].STORE_THEME_HEX_COLOR_CODE); //checklist-2
            this.storeStatusTitleAndDesc = "";
            this.storeStatusTitle = "";
            this.storeStatusDesc = "";
            if (pData.STORE[0].STORE_STATUS_TITLE && pData.STORE[0].STORE_STATUS_TITLE != 'null')
                this.storeStatusTitle = pData.STORE[0].STORE_STATUS_TITLE;
            if (pData.STORE[0].STORE_STATUS_DESC && pData.STORE[0].STORE_STATUS_DESC != 'null')
                this.storeStatusDesc = pData.STORE[0].STORE_STATUS_DESC;
            this.flashMessage = "";
            this.flashMessageStatusCode = 0;
            if (pData.STORE[0].FLASH_MESSAGE && pData.STORE[0].FLASH_MESSAGE != 'null')
                this.flashMessage = pData.STORE[0].FLASH_MESSAGE;
            if (pData.STORE[0].FLASH_MESSAGE_STATUS_CODE && pData.STORE[0].FLASH_MESSAGE_STATUS_CODE != 'null')
                this.flashMessageStatusCode = pData.STORE[0].FLASH_MESSAGE_STATUS_CODE;
            // if (pData.STORE[0].STORE_STATUS_TITLE && pData.STORE[0].STORE_STATUS_TITLE != 'null') this.storeStatusTitleAndDesc = pData.STORE[0].STORE_STATUS_TITLE;
            // if (pData.STORE[0].STORE_STATUS_DESC && pData.STORE[0].STORE_STATUS_DESC != 'null') this.storeStatusTitleAndDesc = this.storeStatusTitleAndDesc + " " + pData.STORE[0].STORE_STATUS_DESC;
        }
        this.processBarLogo = false;
    };
    CategoryNavComponent.prototype.showMobileSubMenuFunction = function (index) {
        var _this = this;
        this.showMobileSubMenu.length = 0;
        this.mobileCategoriesArray.forEach(function (element) {
            _this.showMobileSubMenu.push(false);
        });
        this.showMobileSubMenu[index] = true;
    };
    CategoryNavComponent.prototype.hideMobileSubMenuFunction = function (index) {
        this.showMobileSubMenu[index] = false;
    };
    // Hide/Show Mobile Sub Menu ends 
    CategoryNavComponent.prototype.searchProducts = function () {
        this.showsearch = false;
        if (this.searchText != '') {
            this._router.navigate(['/AllCollections/search', this.searchText]);
            this.SearchService.displaySearch = false;
            this.searchText = "";
        }
    };
    CategoryNavComponent.prototype.searchProductsList = function () {
        if (this.searchText1 != '') {
            this.hidesearch();
            this._router.navigate(['search', this.searchText1]);
            this.searchText1 = ""; //<!-- Final Checklist -->
        }
    };
    CategoryNavComponent.prototype.hideClassName = function () {
        return this.hideClass;
    };
    CategoryNavComponent.prototype.hideDropdownContent = function () {
        // window.location.reload();
    };
    // selectedCateIndex = -1;
    CategoryNavComponent.prototype.getClassNameForButton = function (mainIndex) {
        var className = "";
        if (mainIndex == this.selectedCateIndex)
            className = "underlineCategory";
        return className;
    };
    CategoryNavComponent.prototype.addClassName = function (mainIndex) {
        this.selectedCateIndex = mainIndex;
    };
    CategoryNavComponent.prototype.removeClassName = function () {
        this.selectedCateIndex = -1;
    };
    CategoryNavComponent.prototype.getClassForHighlightingSelectedCategory = function (categoryId, rightIndex) {
        var classname = "";
        if (categoryId == this.productMidLayerService.productCategoryId) {
            var categoryIdKey = localStorage.getItem("categoryIdKey");
            if (categoryIdKey == "1") {
                classname = "highlightCategory";
            }
            else {
                classname = '';
            }
            return classname;
        }
    };
    CategoryNavComponent.prototype.getClassForHighlightingSelectedSubCategory = function (subCategoryId) {
        var classname = "";
        if (subCategoryId == this.productMidLayerService.productCategoryId) {
            var subCategoryIdKey = localStorage.getItem("subCategoryIdKey");
            if (subCategoryIdKey == "1") {
                classname = "highlightSubCategory";
            }
            else {
                classname = '';
            }
            return classname;
        }
    };
    CategoryNavComponent.prototype.displaysearch = function () {
        this.showsearch = true;
    };
    CategoryNavComponent.prototype.hidesearch = function () {
        this.searchText1 = "";
        this.showsearch = false;
    };
    CategoryNavComponent.prototype.getMobileBar = function () {
        var componentName = this.commonService.getComponentName();
        var display = false;
        if (componentName == '/')
            display = true;
        return display;
    };
    CategoryNavComponent.prototype.showMoresSubCategory = function () {
        this.displayMoresSubCategory = true;
    };
    CategoryNavComponent.prototype.hideMoresSubCategory = function () {
        this.displayMoresSubCategory = false;
    };
    CategoryNavComponent.prototype.logout = function () {
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
    CategoryNavComponent.prototype.getClassName = function (productCategoryId) {
        var border_bottom = "";
        if (this.commonService.currentPageCategoruId == productCategoryId)
            border_bottom = "activeli";
        return border_bottom;
    };
    CategoryNavComponent.prototype.isStoreInTestingMode = function () {
        var testingFlag = false;
        if (this.storeStatus == ApplicationConstants_1.ApplicationConstants.STORE_STATUS_CODE_TESTING)
            testingFlag = true;
        return testingFlag;
    };
    CategoryNavComponent.prototype.inviteToMyApplication = function () {
        this.referenceMethodsService.fetchReferralURLBySubscriberId();
    };
    CategoryNavComponent.prototype.showcategory = function () {
        var flag = false;
        var componentName = this.commonService.getComponentName();
        var parts = componentName.split("/");
        if (parts[1] == "" || parts[1] == "product" || parts[1] == "product-view" || parts[1] == "banner-products") {
            flag = true;
        }
        return flag;
    };
    CategoryNavComponent.prototype.hideLogo = function () {
        var flag = true;
        var componentName = this.commonService.getComponentName();
        var parts = componentName.split("/");
        if (parts[1] == "banner-products") {
            flag = false;
        }
        return flag;
    };
    CategoryNavComponent.prototype.getClassnameForHighlightingCategory = function (productCategoryId) {
        var classname = "";
        var componentName = this.commonService.getComponentName();
        var parts = componentName.split("/");
        if (parts[1] == "product") {
            if (productCategoryId == parts[2]) {
                classname = "HighlightCategory";
            }
        }
        return classname;
    };
    __decorate([
        core_1.HostListener('window:scroll', ['$event'])
    ], CategoryNavComponent.prototype, "checkScroll");
    CategoryNavComponent = __decorate([
        core_1.Component({
            selector: 'app-category-nav',
            templateUrl: './category-nav.component.html',
            styleUrls: ['./category-nav.component.css']
        })
    ], CategoryNavComponent);
    return CategoryNavComponent;
}());
exports.CategoryNavComponent = CategoryNavComponent;
var InviteDialogForMobile = /** @class */ (function () {
    function InviteDialogForMobile(configService, dialogRef, data, referenceMethodsService, flashMessagesService, commonService) {
        this.configService = configService;
        this.dialogRef = dialogRef;
        this.data = data;
        this.referenceMethodsService = referenceMethodsService;
        this.flashMessagesService = flashMessagesService;
        this.commonService = commonService;
    }
    /* To copy Text from Textbox */
    InviteDialogForMobile.prototype.copyInputMessage = function (inputElement) {
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
        this.commonService.notifySuccessMessage(this.flashMessagesService, "Copied");
    };
    InviteDialogForMobile.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    InviteDialogForMobile.prototype.closeDialogue = function () {
        this.dialogRef.close();
    };
    InviteDialogForMobile.prototype.copyLink = function () {
        this.commonService.notifySuccessMessage(this.flashMessagesService, "Copied");
    };
    InviteDialogForMobile = __decorate([
        core_1.Component({
            selector: 'invite-dialog-for-mobile',
            templateUrl: './referel-dialog.html'
        }),
        __param(2, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], InviteDialogForMobile);
    return InviteDialogForMobile;
}());
exports.InviteDialogForMobile = InviteDialogForMobile;
// Dialog Code ends
