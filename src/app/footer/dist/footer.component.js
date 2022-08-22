"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FooterComponent = void 0;
var core_1 = require("@angular/core");
var ApplicationConstants_1 = require("src/ApplicationConstants");
var FooterComponent = /** @class */ (function () {
    function FooterComponent(configService, _router, route, footerService, flagsService, homeService, subscriberService, commonService) {
        this.configService = configService;
        this._router = _router;
        this.route = route;
        this.footerService = footerService;
        this.flagsService = flagsService;
        this.homeService = homeService;
        this.subscriberService = subscriberService;
        this.commonService = commonService;
        //Variables Used in this Component
        this.processBar = false;
        this.fetchQuickLinksRequestObject = {};
        this.quickLinksArray = [];
        this.blogsArray = [];
        this.pagesArray = [];
        this.currentYear = 0;
        this.currentDate = new Date();
        this.subscriberId = 0;
        // Social Media
        this.fetchSocialMediaRequestObject = {};
        this.socialMediaDetailsArray = [];
        this.vendorId = 0;
        this.storeId = 0;
        this.applicationTypeCode = 0;
        this.storeName = "";
        this.storeAddress = "";
        this.storeContactNumber = "";
        this.storeEmailAddress = "";
        this.store_privacy_policy_url = "";
        this.store_terms_and_conditions_url = "";
        this.wabiz_domain_url = "";
        this.customerNewsletterEmailID = "";
        this.newsletterDisplayStatus = true;
        this.newsletterSuccessMsg = "";
    }
    FooterComponent.prototype.ngOnInit = function () {
        this.checkSubscriberId();
        this.currentYear = this.currentDate.getFullYear();
    };
    FooterComponent.prototype.checkSubscriberId = function () {
        if (this.commonService.lsSubscriberId())
            this.subscriberId = +this.commonService.lsSubscriberId();
        if (this.subscriberId == 0) {
            this.temporarySubscriberLogin();
        }
        else {
            this.loadDefaultMethods();
        }
    };
    FooterComponent.prototype.temporarySubscriberLogin = function () {
        var _this = this;
        this.subscriberService.tempSubscriberLogin().subscribe(function (data) { return _this.handleTemporarySubscriberLoginSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    FooterComponent.prototype.handleTemporarySubscriberLoginSuccess = function (data) {
        if (data.STATUS == "OK") {
            var authToken = data.SUBSCRIBER.AUTHENTICATION_TOKEN;
            var subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
            var tempSubscriberFlag = 1;
            var transactionId = 0;
            this.commonService.addStoreData(authToken, subscriberId, tempSubscriberFlag, transactionId);
            this.loadDefaultMethods();
        }
    };
    FooterComponent.prototype.loadDefaultMethods = function () {
        this.fetchQuickLinks();
        this.fetchSocialMedia();
        this.fetchBlogs();
        this.fetchPages();
        this.fetchStoreDetails();
    };
    FooterComponent.prototype.makeFetchQuickLinksRequestObject = function () {
        this.fetchQuickLinksRequestObject = {
            STORE_ID: this.configService.getStoreID(),
            CLIENT_APP_VERSION_CODE: this.configService.getClientAppVersionCode(),
            CLIENT_APP_VERSION_NAME: this.configService.getClientAppVersionName(),
            BUILD_CONFIGURATION_TYPE: this.configService.getBuildConfigurationType(),
            STATUS_CODE: ApplicationConstants_1.ApplicationConstants.STATUS_CODE_ENABLE,
            BY_DATE: true
        };
    };
    FooterComponent.prototype.makeFetchBlogsRequestObject = function () {
        var blogsRequestObj = {
            BLOG_TYPE: ApplicationConstants_1.ApplicationConstants.PARENT_BLOG_TYPE_ID,
            STORE_ID: this.configService.getStoreID(),
            CLIENT_APP_VERSION_CODE: this.configService.getClientAppVersionCode(),
            CLIENT_APP_VERSION_NAME: this.configService.getClientAppVersionName(),
            BUILD_CONFIGURATION_TYPE: this.configService.getBuildConfigurationType(),
            STATUS_CODE: ApplicationConstants_1.ApplicationConstants.STATUS_CODE_ENABLE,
            BY_DATE: true
        };
        return blogsRequestObj;
    };
    FooterComponent.prototype.makeFetchPagesRequestObject = function () {
        var pagesRequestObj = {
            STORE_ID: this.configService.getStoreID(),
            CLIENT_APP_VERSION_CODE: this.configService.getClientAppVersionCode(),
            CLIENT_APP_VERSION_NAME: this.configService.getClientAppVersionName(),
            BUILD_CONFIGURATION_TYPE: this.configService.getBuildConfigurationType(),
            STATUS_CODE: ApplicationConstants_1.ApplicationConstants.STATUS_CODE_ENABLE,
            BY_DATE: true
        };
        return pagesRequestObj;
    };
    FooterComponent.prototype.fetchQuickLinks = function () {
        var _this = this;
        this.processBar = true;
        this.makeFetchQuickLinksRequestObject();
        this.footerService.fetchQuickLinks(this.fetchQuickLinksRequestObject).subscribe(function (data) { return _this.handleFetchQuickLinksSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    FooterComponent.prototype.handleFetchQuickLinksSuccess = function (pData) {
        var _this = this;
        this.quickLinksArray.length = 0;
        if (pData.STATUS = 'OK') {
            pData.QUICK_LINK.forEach(function (element) {
                if (new Date(element.QUICK_LINK_END_DATE) >= new Date && element.QUICK_LINK_STATUS_CODE == ApplicationConstants_1.ApplicationConstants.STATUS_CODE_ENABLE) {
                    _this.quickLinksArray.push(element);
                }
            });
        }
        this.processBar = false;
    };
    FooterComponent.prototype.fetchBlogs = function () {
        var _this = this;
        this.processBar = true;
        this.footerService.fetchParentBlogs(this.makeFetchBlogsRequestObject())
            .subscribe(function (data) { return _this.handleFetchBlogsSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    FooterComponent.prototype.handleFetchBlogsSuccess = function (pData) {
        var _this = this;
        this.blogsArray.length = 0;
        if (pData.STATUS == 'OK') {
            pData.BLOG.forEach(function (element) {
                if (element.BLOG_STATUS_CODE == ApplicationConstants_1.ApplicationConstants.STATUS_CODE_ENABLE) {
                    _this.blogsArray.push(element);
                }
            });
        }
        this.processBar = false;
    };
    FooterComponent.prototype.fetchPages = function () {
        var _this = this;
        this.processBar = true;
        this.footerService.fetchPages(this.makeFetchPagesRequestObject())
            .subscribe(function (data) { return _this.handleFetchPagesSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    FooterComponent.prototype.handleFetchPagesSuccess = function (pData) {
        var _this = this;
        this.pagesArray.length = 0;
        if (pData.STATUS = 'OK') {
            pData.PAGE.forEach(function (element) {
                if (new Date(element.PAGE_END_DATE) >= new Date && element.PAGE_STATUS_CODE == ApplicationConstants_1.ApplicationConstants.STATUS_CODE_ENABLE) {
                    _this.pagesArray.push(element);
                }
            });
        }
        this.processBar = false;
    };
    FooterComponent.prototype.handleError = function (error) {
    };
    FooterComponent.prototype.makeFetchSocialMediaRequestObject = function () {
        this.fetchSocialMediaRequestObject = {
            STORE_ID: this.configService.getStoreID()
        };
    };
    FooterComponent.prototype.fetchSocialMedia = function () {
        var _this = this;
        this.processBar = true;
        this.makeFetchSocialMediaRequestObject();
        this.footerService.fetchSocialMediaAPI(this.fetchSocialMediaRequestObject).subscribe(function (data) { return _this.handleFetchSocialMediaSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    FooterComponent.prototype.handleFetchSocialMediaSuccess = function (pData) {
        if (pData.STATUS = 'OK') {
            this.socialMediaDetailsArray = pData.SOCIAL_MEDIA;
        }
        // stop the progress bar
        this.processBar = false;
    };
    // Social Media end
    FooterComponent.prototype.fetchStoreDetails = function () {
        var _this = this;
        this.homeService.fetchStoreByIdAPI(this.configService.getStoreID()).subscribe(function (data) { return _this.handleStoreData(data); }, function (error) { return _this.handleError(error); });
    };
    FooterComponent.prototype.handleStoreData = function (pData) {
        this.processBar = false;
        if (pData.STATUS == 'OK') {
            var storeData = pData.STORE[0];
            var addressLine1 = "";
            var addressLine2 = "";
            var addressPincode = "";
            if (storeData.STORE_ADDRESS_LINE1 != "")
                addressLine1 = storeData.STORE_ADDRESS_LINE1;
            if (storeData.STORE_ADDRESS_LINE2 != "")
                addressLine2 = storeData.STORE_ADDRESS_LINE2;
            if (storeData.STORE_ADDRESS_PINCODE != "")
                addressPincode = storeData.STORE_ADDRESS_PINCODE;
            // this.storeAddress       = addressLine1 +" "+ addressLine2 +" "+ addressPincode;
            this.storeAddress = addressLine1;
            this.storeContactNumber = storeData.STORE_PRIMARY_CONTACT_MOBILE_NR;
            localStorage.setItem("storeContactNo", this.storeContactNumber);
            this.storeEmailAddress = storeData.STORE_PRIMARY_CONTACT_EMAIL_ID;
            this.store_privacy_policy_url = storeData.STORE_PRIVACY_POLICY_URL;
            this.store_terms_and_conditions_url = storeData.STORE_TERMS_AND_CONDITIONS_URL;
            this.wabiz_domain_url = storeData.WABIZ_DOMAIN_URL;
            this.storeName = storeData.STORE_NAME;
            this.applicationTypeCode = storeData.APPLICATION_TYPE_CODE;
            this.vendorId = storeData.VENDOR_ID;
            this.storeId = storeData.STORE_ID;
        }
    };
    FooterComponent.prototype.sellOnUsUrl = function () {
        return this.configService.getFrontEndURL() + "sell-online/" + this.vendorId + "/" + this.storeId;
    };
    FooterComponent.prototype.sellOnlinButtonDisplayStatus = function () {
        var displayFlag = false;
        //Here if Application type code is equals to market place then only we have to show sell online button
        if (this.applicationTypeCode == ApplicationConstants_1.ApplicationConstants.APPLICATION_TYPE_MARKET_PLACE_WITH_MULTI_VENDOR_CODE)
            displayFlag = true;
        return displayFlag;
    };
    FooterComponent.prototype.createNewsletterAPI = function () {
        var _this = this;
        if (this.customerNewsletterEmailID != "") {
            var requestObject = {
                STORE_ID: this.configService.getStoreID(),
                CUSTOMER_EMAIL_ID: this.customerNewsletterEmailID
            };
            this.footerService.createNewsletterAPI(requestObject).subscribe(function (data) { return _this.handleCreateNewsletterAPISuccess(data); }, function (error) { return _this.handleCreateNewsletterAPIFailure(error); });
        }
    };
    FooterComponent.prototype.handleCreateNewsletterAPISuccess = function (data) {
        if (data.STATUS == "OK") {
            this.customerNewsletterEmailID = "";
            this.newsletterDisplayStatus = false;
            this.newsletterSuccessMsg = data.MESSAGE;
        }
        else if (data.STATUS == "FAIL") {
            this.customerNewsletterEmailID = "";
            this.newsletterDisplayStatus = false;
            this.newsletterSuccessMsg = data.ERROR_MSG;
        }
    };
    FooterComponent.prototype.handleCreateNewsletterAPIFailure = function (data) {
    };
    // Footer logic 
    FooterComponent.prototype.getFooterAddressAndFollowUsDivClass = function () {
        var className = "col-md-3 col-sm-5 col-12";
        var numberOfCols = this.getNumberOfColumnsToBeDisplayedInFooter();
        if (numberOfCols == 3)
            className = "col-md-4 col-sm-6 col-12";
        if (numberOfCols == 2)
            className = "col-md-6 col-sm-6 col-12";
        if (numberOfCols == 1)
            className = "col-md-12 col-sm-12 col-12";
        return className;
    };
    FooterComponent.prototype.getFooterQuickLinkAndBlogAndPagesDivClass = function () {
        var className = "col-md-2 col-sm-3 col-12";
        var numberOfCols = this.getNumberOfColumnsToBeDisplayedInFooter();
        if (numberOfCols == 4)
            className = "col-md-3 col-sm-3 col-12";
        if (numberOfCols == 3)
            className = "col-md-4 col-sm-3 col-12";
        if (numberOfCols == 2)
            className = "col-md-6 col-sm-6 col-12";
        if (numberOfCols == 1)
            className = "col-md-12 col-sm-12 col-12";
        return className;
    };
    FooterComponent.prototype.getNumberOfColumnsToBeDisplayedInFooter = function () {
        var numberOfColumns = 0;
        if (this.isThisStringHasValue(this.storeAddress) || this.isThisStringHasValue(this.storeContactNumber) || this.isThisStringHasValue(this.storeEmailAddress))
            numberOfColumns++;
        if (this.socialMediaDetailsArray.length > 0)
            numberOfColumns++;
        if (this.quickLinksArray.length > 0)
            numberOfColumns++;
        if (this.blogsArray.length > 0)
            numberOfColumns++;
        if (this.pagesArray.length > 0)
            numberOfColumns++;
        return numberOfColumns;
    };
    FooterComponent.prototype.isThisStringHasValue = function (pString) {
        var flag = false;
        if (pString && pString != "null" && pString != null)
            flag = true;
        return flag;
    };
    FooterComponent = __decorate([
        core_1.Component({
            selector: 'app-footer',
            templateUrl: './footer.component.html',
            styleUrls: ['./footer.component.css']
        })
    ], FooterComponent);
    return FooterComponent;
}());
exports.FooterComponent = FooterComponent;
