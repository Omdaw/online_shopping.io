"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HomepageComponent = void 0;
var animations_1 = require("./../animations");
var core_1 = require("@angular/core");
var ApplicationConstants_1 = require("src/ApplicationConstants");
var HomepageComponent = /** @class */ (function () {
    function HomepageComponent(configService, _router, homeService, subscriberService, transactionService, userProfileService, flagsService, productMidLayerService, myWishlistService, commonService, bannerService) {
        this.configService = configService;
        this._router = _router;
        this.homeService = homeService;
        this.subscriberService = subscriberService;
        this.transactionService = transactionService;
        this.userProfileService = userProfileService;
        this.flagsService = flagsService;
        this.productMidLayerService = productMidLayerService;
        this.myWishlistService = myWishlistService;
        this.commonService = commonService;
        this.bannerService = bannerService;
        this.loadBannersOnScrollFlag = false;
        this.imagesUrl = [];
        //Variables
        this.processBar = false;
        this.headerBanners = [];
        this.quarterFooterBanners = [];
        this.halfFooterBanners = [];
        this.fullFooterBanners = [];
        this.footerBannerProducts = [];
        this.categoryBanners = [];
        this.brandBanners = [];
        this.productBanners = [];
        this.fetchBannerByStoreIdRequest = {};
        this.subscriberId = 0;
        this.fullImageBanners = [];
        this.halfImageBanners = [];
        this.imageBannersMoreThanTwoInRow = [];
        this.fullImageWithTextBanners = [];
        this.halfImageWithTextBanners = [];
        this.imageWithTextBannersMoreThanTwoInRow = [];
        this.quarterVideoBanners = [];
        this.halfVideoBanners = [];
        this.fullVideoBanners = [];
        this.quarterCategoryBanners = [];
        this.halfCategoryBanners = [];
        this.fullCategoryBanners = [];
        this.categoryBannersMoreThanTwoInRow = [];
        this.quarterBrandBanners = [];
        this.halfBrandBanners = [];
        this.fullBrandBanners = [];
        this.brandBannersMoreThanTwoInRow = [];
        this.productsMoreThanOneInRow = [];
        this.allBannersArray = [];
        this.fetchReviewsRequestObject = {};
        this.reviewsArray = [];
        this.reviewImagesArray = [];
        //Fetch Cart In Progress 
        this.fetchCartInProgressRequestObject = {};
        //Add To Cart
        this.addToCartRequestObject = {};
        this.transactionDetailsId = 0;
        //Add To Cart Ends
        //Update Cart
        this.updateCartRequestObject = {};
        //Update Cart Ends
        //Delete Cart 
        this.deleteCartRequestObject = {};
        //Delete Cart Ends
        // Reviews Rating 
        this.ratingArr = [];
        this.starCount = 5;
    }
    HomepageComponent.prototype.myFunction = function () {
        if (this.bannerService.calledOnScroll && !this.loadBannersOnScrollFlag && (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200)) {
            this.loadBannersOnScrollFlag = true;
            this.bannerService.FetchBannerByStoreId(ApplicationConstants_1.ApplicationConstants.BANNER_VISIBILITY_TYPE_CODE_HOME_PAGE, 0, 0, 30);
        }
    };
    HomepageComponent.prototype.ngOnInit = function () {
        // localStorage.setItem("showBotViewCart","true")
        var _this = this;
        this.bannerService.calledOnScroll = true;
        window.onscroll = function () { return _this.myFunction(); };
        this.flagsService.showSearch();
        this.flagsService.showHeaderFooter();
        if (this.flagsService.inDeliveryPageFlag) { // If user signout from delivery page then this will happen.
            window.location.reload();
        }
        this.processBar = true;
        this.checkSubscriberId();
        this.transactionService.updateTransactionIfCheckOutApiIsCalled();
        this.fetchReviewAPI();
    };
    HomepageComponent.prototype.checkStoreStatus = function () {
        var _this = this;
        this.processBar = true;
        this.homeService.fetchStoreByIdAPI(this.configService.getStoreID()).subscribe(function (data) { return _this.handleStoreData(data); }, function (error) { return _this.handleError(error); });
    };
    // ngOnDestroy(){
    //   localStorage.setItem("showBotViewCart","false");
    // }
    HomepageComponent.prototype.handleStoreData = function (pData) {
        this.processBar = false;
        if (pData.STATUS == 'OK') {
            var storeData = pData.STORE[0];
            this.statusCode = storeData.STORE_STATUS_CODE;
            if (this.statusCode != ApplicationConstants_1.ApplicationConstants.STORE_STATUS_CODE_ACTIVE &&
                this.statusCode != ApplicationConstants_1.ApplicationConstants.STORE_STATUS_CODE_TESTING) {
                this._router.navigate(['store-coming-soon']);
            }
            else {
                // Previous functionality in the ngOnInit()
                // this.FetchHeroBannerByStoreId();
                // Rating
                for (var index = 0; index < this.starCount; index++) {
                    this.ratingArr.push(index);
                }
                this.flagsService.resetFlags();
            }
        }
        else {
            this.handleError("Please reload the page.");
        }
    };
    HomepageComponent.prototype.checkSubscriberId = function () {
        if (this.commonService.lsSubscriberId())
            this.subscriberId = +this.commonService.lsSubscriberId();
        if (this.subscriberId == 0) {
            this.temporarySubscriberLogin();
        }
        else {
            this.loadDefaultMethods();
        }
    };
    HomepageComponent.prototype.temporarySubscriberLogin = function () {
        var _this = this;
        this.processBar = true;
        this.subscriberService.tempSubscriberLogin().subscribe(function (data) { return _this.handleTemporarySubscriberLoginSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    HomepageComponent.prototype.handleTemporarySubscriberLoginSuccess = function (data) {
        if (data.STATUS == "OK") {
            var authToken = data.SUBSCRIBER.AUTHENTICATION_TOKEN;
            var subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
            var tempSubscriberFlag = 1;
            var transactionId = 0;
            this.commonService.addStoreData(authToken, subscriberId, tempSubscriberFlag, transactionId);
            this.loadDefaultMethods();
        }
    };
    HomepageComponent.prototype.loadDefaultMethods = function () {
        this.checkStoreStatus();
        this.myWishlistService.fetchMyWishList();
        //Banner changes 
        this.bannerService.bannerCallFromPageCode = ApplicationConstants_1.ApplicationConstants.BANNER_CALL_FROM_HOME_PAGE;
        this.bannerService.FetchHeroBannerByStoreId(ApplicationConstants_1.ApplicationConstants.BANNER_VISIBILITY_TYPE_CODE_HOME_PAGE, 0);
        this.bannerService.FetchBannerByStoreId(ApplicationConstants_1.ApplicationConstants.BANNER_VISIBILITY_TYPE_CODE_HOME_PAGE, 0, 0, 3);
    };
    HomepageComponent.prototype.makeFetchHeroBannerByStoreIdRequestObject = function () {
        this.fetchBannerByStoreIdRequest = {
            STORE_ID: this.configService.getStoreID(),
            OFFSET: 0,
            LIMIT: 2,
            SCREEN_HEIGHT: window.innerHeight,
            SCREEN_WIDTH: window.innerWidth
        };
    };
    HomepageComponent.prototype.FetchHeroBannerByStoreId = function () {
        var _this = this;
        this.makeFetchHeroBannerByStoreIdRequestObject();
        this.homeService.fetchBannerByStoreIdAPI(this.fetchBannerByStoreIdRequest).subscribe(function (data) { return _this.handleFetchHeroBannerByStoreId(data); }, function (error) { return _this.handleError(error); });
    };
    HomepageComponent.prototype.handleFetchHeroBannerByStoreId = function (pData) {
        var _this = this;
        if (pData.STATUS = 'OK') {
            var responseArray = pData.PARENT_BANNER;
            this.allBannersArray = [];
            this.headerBanners = []; //Final Checklist
            responseArray.forEach(function (element) {
                var tempObject;
                tempObject = {};
                if (element.BANNER_DISPLAY_SEQ_NR == ApplicationConstants_1.ApplicationConstants.HERO_BANNER_DISPLAY_SEQ_NR) { // Display Seq number 1 is always Header/Hero Banner
                    var SECTION_HEIGHT_IN_PERCENTAGE_1 = element.SECTION_HEIGHT_IN_PERCENTAGE;
                    var SECTION_WIDTH_IN_PERCENTAGE_1 = element.SECTION_WIDTH_IN_PERCENTAGE;
                    element.CHILD_BANNER.forEach(function (element) {
                        if (element.BANNER_STATUS_CODE == ApplicationConstants_1.ApplicationConstants.STATUS_CODE_ENABLE) {
                            element.SECTION_HEIGHT_IN_PERCENTAGE = SECTION_HEIGHT_IN_PERCENTAGE_1;
                            element.SECTION_WIDTH_IN_PERCENTAGE = SECTION_WIDTH_IN_PERCENTAGE_1;
                            _this.headerBanners.push(element);
                        }
                    });
                }
            });
            this.FetchBannerByStoreId();
        }
        this.processBar = false;
    };
    HomepageComponent.prototype.makeFetchBannerByStoreIdRequestObject = function () {
        this.fetchBannerByStoreIdRequest = {
            STORE_ID: this.configService.getStoreID(),
            OFFSET: 1,
            LIMIT: 50,
            SCREEN_HEIGHT: window.innerHeight,
            SCREEN_WIDTH: window.innerWidth
        };
    };
    HomepageComponent.prototype.FetchBannerByStoreId = function () {
        var _this = this;
        this.makeFetchBannerByStoreIdRequestObject();
        this.homeService.fetchBannerByStoreIdAPI(this.fetchBannerByStoreIdRequest).subscribe(function (data) { return _this.handleFetchBannerByStoreId(data); }, function (error) { return _this.handleError(error); });
    };
    HomepageComponent.prototype.handleFetchBannerByStoreId = function (pData) {
        var _this = this;
        if (pData.STATUS = 'OK') {
            var responseArray = pData.PARENT_BANNER;
            this.allBannersArray = [];
            responseArray.forEach(function (element) {
                var tempObject;
                tempObject = {};
                console.log("element.BANNER_VISIBILITY_TYPE_CODE", element.BANNER_VISIBILITY_TYPE_CODE);
                if (element.BANNER_DISPLAY_SEQ_NR == ApplicationConstants_1.ApplicationConstants.HERO_BANNER_DISPLAY_SEQ_NR) { // Display Seq number 1 is always Header/Hero Banner
                }
                else if (element.BANNER_VISIBILITY_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.BANNER_VISIBILITY_TYPE_CODE_HOME_PAGE ||
                    element.BANNER_VISIBILITY_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.BANNER_VISIBILITY_TYPE_CODE_ALL_PAGES) { //else means other than Hero Banners i.e Footer Banners 
                    tempObject = element;
                    var SECTION_HEIGHT_IN_PERCENTAGE_2 = element.SECTION_HEIGHT_IN_PERCENTAGE;
                    var SECTION_WIDTH_IN_PERCENTAGE_2 = element.SECTION_WIDTH_IN_PERCENTAGE;
                    var NO_OF_BANNERS_IN_ROW_1 = element.NO_OF_BANNERS_IN_ROW;
                    var BANNER_DISPLAY_TYPE_CODE_1 = element.BANNER_DISPLAY_TYPE_CODE;
                    var BANNER_TYPE_CODE_1 = element.BANNER_TYPE_CODE;
                    element.CHILD_BANNER.forEach(function (element) {
                        element.SECTION_HEIGHT_IN_PERCENTAGE = SECTION_HEIGHT_IN_PERCENTAGE_2;
                        element.SECTION_WIDTH_IN_PERCENTAGE = SECTION_WIDTH_IN_PERCENTAGE_2;
                        element.NO_OF_BANNERS_IN_ROW = NO_OF_BANNERS_IN_ROW_1;
                        element.BANNER_DISPLAY_TYPE_CODE = BANNER_DISPLAY_TYPE_CODE_1;
                        element.BANNER_TYPE_CODE = BANNER_TYPE_CODE_1;
                        /*************/
                        if (element.BANNER_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.IMAGE_BANNER_REFERENCE_TYPE_CODE) {
                            if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.FULL_BANNER_DISPLAY_TYPE_CODE)
                                _this.fullImageBanners.push(element);
                            if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.HALF_BANNER_DISPLAY_TYPE_CODE)
                                _this.halfImageBanners.push(element);
                            if (element.NO_OF_BANNERS_IN_ROW > 2)
                                _this.imageBannersMoreThanTwoInRow.push(element);
                        }
                        /*************/
                        /*************/
                        if (element.BANNER_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.IMAGE_WITH_TEXT_BANNER_REFERENCE_TYPE_CODE) {
                            console.log("element", element.BANNER_DISPLAY_TYPE_CODE);
                            if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.FULL_BANNER_DISPLAY_TYPE_CODE)
                                _this.fullImageWithTextBanners.push(element);
                            if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.HALF_BANNER_DISPLAY_TYPE_CODE)
                                _this.halfImageWithTextBanners.push(element);
                            if (element.NO_OF_BANNERS_IN_ROW > 2)
                                _this.imageWithTextBannersMoreThanTwoInRow.push(element);
                        }
                        /*************/
                        if (element.BANNER_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.VIDEO_BANNER_REFERENCE_TYPE_CODE) {
                            //Video Banners // BANNER_TYPE_CODE = 2; // BANNER_DISPLAY_TYPE_CODE = 3 // FULL BANNER
                            if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.FULL_BANNER_DISPLAY_TYPE_CODE)
                                _this.fullVideoBanners.push(element);
                            //Video Banners // BANNER_TYPE_CODE = 2; // BANNER_DISPLAY_TYPE_CODE = 2 // HALF BANNER
                            if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.HALF_BANNER_DISPLAY_TYPE_CODE)
                                _this.halfVideoBanners.push(element);
                            //Video Banners // BANNER_TYPE_CODE = 2; // BANNER_DISPLAY_TYPE_CODE = 1 // QUARTER BANNER
                            if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.QUATER_BANNER_DISPLAY_TYPE_CODE)
                                _this.quarterVideoBanners.push(element);
                        }
                        /*************/
                        if (element.BANNER_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.CATEGORY_BANNER_REFERENCE_TYPE_CODE) {
                            //Category Banners // BANNER_TYPE_CODE = 3; // BANNER_DISPLAY_TYPE_CODE = 3 // FULL BANNER
                            if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.FULL_BANNER_DISPLAY_TYPE_CODE)
                                _this.fullCategoryBanners.push(element);
                            //Category Banners // BANNER_TYPE_CODE = 3; // BANNER_DISPLAY_TYPE_CODE = 2 // HALF BANNER
                            if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.HALF_BANNER_DISPLAY_TYPE_CODE)
                                _this.halfCategoryBanners.push(element);
                            if (element.NO_OF_BANNERS_IN_ROW > 2)
                                _this.categoryBannersMoreThanTwoInRow.push(element);
                        }
                        /*************/
                        if (element.BANNER_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.BRAND_BANNER_REFERENCE_TYPE_CODE) {
                            //Brand Banners // BANNER_TYPE_CODE = 4; // BANNER_DISPLAY_TYPE_CODE = 3 // FULL BANNER
                            if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.FULL_BANNER_DISPLAY_TYPE_CODE)
                                _this.fullBrandBanners.push(element);
                            //Brand Banners // BANNER_TYPE_CODE = 4; // BANNER_DISPLAY_TYPE_CODE = 2 // HALF BANNER
                            if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.HALF_BANNER_DISPLAY_TYPE_CODE)
                                _this.halfBrandBanners.push(element);
                            if (element.NO_OF_BANNERS_IN_ROW > 2)
                                _this.brandBannersMoreThanTwoInRow.push(element);
                        }
                        /*************/
                        if (element.BANNER_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.PRODUCTS_BANNER_REFERENCE_TYPE_CODE) {
                            _this.productsMoreThanOneInRow.push(element);
                        }
                        /*************/
                    });
                }
                // tempObject.CHILD_BANNER = [];
                tempObject.FULL_IMAGE_BANNERS = _this.fullImageBanners;
                tempObject.HALF_IMAGE_BANNERS = _this.halfImageBanners;
                tempObject.IMAGE_BANNERS_MORE_THAN_TWO_IN_ROW = _this.imageBannersMoreThanTwoInRow;
                tempObject.FULL_IMAGE_WITH_TEXT_BANNERS = _this.fullImageWithTextBanners;
                tempObject.HALF_IMAGE_WITH_TEXT_BANNERS = _this.halfImageWithTextBanners;
                tempObject.IMAGE_WITH_TEXT_BANNERS_MORE_THAN_TWO_IN_ROW = _this.imageWithTextBannersMoreThanTwoInRow;
                tempObject.FULL_VIDEO_BANNERS = _this.fullVideoBanners;
                tempObject.HALF_VIDEO_BANNERS = _this.halfVideoBanners;
                tempObject.QUARTER_VIDEO_BANNERS = _this.quarterVideoBanners;
                tempObject.FULL_CATEGORIES = _this.fullCategoryBanners;
                tempObject.HALF_CATEGORIES = _this.halfCategoryBanners;
                tempObject.QUARTER_CATEGORIES = _this.quarterCategoryBanners;
                tempObject.CATEGORY_BANNERS_MORE_THAN_TWO_IN_ROW = _this.categoryBannersMoreThanTwoInRow;
                tempObject.FULL_BRANDS = _this.fullBrandBanners;
                tempObject.HALF_BRANDS = _this.halfBrandBanners;
                tempObject.QUARTER_BRANDS = _this.quarterBrandBanners;
                tempObject.BRAND_BANNERS_MORE_THAN_TWO_IN_ROW = _this.brandBannersMoreThanTwoInRow;
                var lProductsMoreThanOneInRow = [];
                if (_this.productsMoreThanOneInRow.length > 0) {
                    lProductsMoreThanOneInRow = _this.structureProducts(_this.productsMoreThanOneInRow);
                }
                // let array = [];
                // if(window.innerWidth <= 600) {
                //   array = this.make4DataInEachShellOfArray(quarterProducts, 2);
                // } else if(window.innerWidth >= 768 && window.innerWidth < 1024 ){
                //   array = this.make4DataInEachShellOfArray(quarterProducts, 3);
                // } else if (window.innerWidth >= 1024 && window.innerWidth < 1365 ){
                //   array = this.make4DataInEachShellOfArray(quarterProducts, 5);
                // }else {
                //   array = this.make4DataInEachShellOfArray(quarterProducts, 5);
                // }
                // console.log("Banner Products");
                // console.log(array);
                // tempObject.QUARTER_PRODUCTS  = lProductsMoreThanOneInRow;
                tempObject.PRODUCTS_MORE_THAN_ONE_IN_ROW = lProductsMoreThanOneInRow;
                _this.allBannersArray.push(tempObject);
                _this.fullImageBanners = [];
                _this.halfImageBanners = [];
                _this.imageBannersMoreThanTwoInRow = [];
                _this.fullImageWithTextBanners = [];
                _this.halfImageWithTextBanners = [];
                _this.imageWithTextBannersMoreThanTwoInRow = [];
                _this.fullVideoBanners = [];
                _this.halfVideoBanners = [];
                _this.quarterVideoBanners = [];
                _this.fullCategoryBanners = [];
                _this.halfCategoryBanners = [];
                _this.quarterCategoryBanners = [];
                _this.categoryBannersMoreThanTwoInRow = [];
                _this.fullBrandBanners = [];
                _this.halfBrandBanners = [];
                _this.quarterBrandBanners = [];
                _this.brandBannersMoreThanTwoInRow = [];
                _this.productsMoreThanOneInRow = [];
            });
        }
        this.processBar = false;
    };
    HomepageComponent.prototype.handleError = function (errorData) {
    };
    HomepageComponent.prototype.makeFetchReviewAPIRequestObject = function () {
        this.fetchReviewsRequestObject = {
            STORE_ID: this.configService.getStoreID()
        };
    };
    HomepageComponent.prototype.fetchReviewAPI = function () {
        var _this = this;
        this.makeFetchReviewAPIRequestObject();
        this.homeService.fetchReviewAPI(this.fetchReviewsRequestObject).subscribe(function (data) { return _this.handleFetchReviewAPISuccess(data); }, function (error) { return _this.handleError(error); });
    };
    HomepageComponent.prototype.handleFetchReviewAPISuccess = function (pData) {
        this.reviewImagesArray = [];
        if (pData.STATUS = 'OK') {
            var reviews_1 = [];
            if (pData.REVIEW && pData.REVIEW.length > 0) {
                pData.REVIEW.forEach(function (element) {
                    if (element.REVIEW_FILE && element.REVIEW_FILE.length > 0 && element.REVIEW_FILE[0].REVIEW_IMAGE_FILE_PATH) {
                        element.REVIEW_IMAGE_FILE_PATH = element.REVIEW_FILE[0].REVIEW_IMAGE_FILE_PATH;
                    }
                    reviews_1.push(element);
                });
            }
            var testreviewsArray = [];
            if (reviews_1.length > 0) {
                if (window.innerWidth < 601)
                    testreviewsArray = this.make4DataInEachShellOfBannerArray(reviews_1, 1);
                if (window.innerWidth > 600 && window.innerWidth < 1023)
                    testreviewsArray = this.make4DataInEachShellOfBannerArray(reviews_1, 3);
                if (window.innerWidth > 1023 && window.innerWidth < 1300)
                    testreviewsArray = this.make4DataInEachShellOfBannerArray(reviews_1, 3);
                if (window.innerWidth > 1299)
                    testreviewsArray = this.make4DataInEachShellOfBannerArray(reviews_1, 3);
            }
            this.reviewsArray = testreviewsArray;
        }
        this.processBar = false;
    };
    HomepageComponent.prototype.make4DataInEachShellOfBannerArray = function (pArray, noOfItemsInRow) {
        var mainArray = [];
        var sourceProductsArray = [];
        var mArray = pArray;
        if (pArray.length > 0)
            sourceProductsArray = pArray;
        if (sourceProductsArray.length <= noOfItemsInRow) { //If Array has upto 4 items ;
            mainArray.push(sourceProductsArray);
        }
        else {
            var arrayLength = sourceProductsArray.length / noOfItemsInRow;
            var mod = sourceProductsArray.length % noOfItemsInRow;
            if (mod > 0)
                arrayLength = arrayLength + 1;
            var prodArrayIndex = 0;
            for (var i = 0; i < arrayLength; i++) {
                var tempProArray = [];
                for (var j = 0; j < noOfItemsInRow; j++) {
                    if (sourceProductsArray[prodArrayIndex])
                        tempProArray.push(sourceProductsArray[prodArrayIndex]);
                    prodArrayIndex++;
                }
                if (tempProArray.length > 0)
                    mainArray.push(tempProArray);
            }
        }
        mArray = mainArray;
        return mArray;
    };
    HomepageComponent.prototype.getProductImageName = function (object) {
        var imageName = "";
        if (object.PRODUCT_DETAIL[0] && object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0] && object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH != 'undefined')
            imageName = object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH;
        return imageName;
    };
    HomepageComponent.prototype.makeFetchCartInProgressObject = function () {
        var tempObj = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID()
        };
        this.fetchCartInProgressRequestObject = tempObj;
    };
    HomepageComponent.prototype.fetchCartInProgress = function () {
        var _this = this;
        this.makeFetchCartInProgressObject();
        this.subscriberService.fetchCartInProgressTransactionsBySubscriberIdAPI(this.fetchCartInProgressRequestObject)
            .subscribe(function (data) { return _this.handleFetchCartInProgressResponse(data); }, function (error) { return _this.handleError(error); });
    };
    HomepageComponent.prototype.handleFetchCartInProgressResponse = function (data) {
        var _this = this;
        if (data.STATUS == "OK") {
            this.transactionService.transactionDetailsArray = [];
            if (data.TRANSACTION && data.TRANSACTION.length > 0) {
                data.TRANSACTION[0].TRANSACTION_DETAIL.forEach(function (element) {
                    if (element.TRANSACTION_DETAIL_TYPE_CODE == 1) { //Because we are  also getting Delivery Charge and Convenience fee
                        _this.transactionService.transactionDetailsArray.push(element);
                    }
                });
                this.checkOnlyTransactions();
            }
            if (this.transactionService.transactionDetailsArray.length > 0) {
                this.commonService.addTransactionIdTols();
            }
            this.FetchHeroBannerByStoreId();
        }
        this.processBar = false;
    };
    HomepageComponent.prototype.checkOnlyTransactions = function () {
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
    HomepageComponent.prototype.refreshCart = function () {
        this.userProfileService.numberOfProductsInCart = this.transactionService.transactionDetailsArray.length;
    };
    //Fetch Cart In Progress ends 
    HomepageComponent.prototype.structureProducts = function (tempArray) {
        var _this = this;
        var tempFooterBannerProducts = tempArray;
        tempArray = [];
        tempFooterBannerProducts.forEach(function (element) {
            var tempObject;
            tempObject = element;
            var productsArray = [];
            element.PRODUCT.forEach(function (element) {
                element.showAddToCart = 1;
                element.selectedQuantity = 1;
                _this.transactionService.transactionDetailsArray.forEach(function (transaction) {
                    if (element.PRODUCT_DETAIL[0] && element.PRODUCT_DETAIL[0].PRODUCT_DETAIL_ID == transaction.PRODUCT_DETAIL_ID) {
                        element.showAddToCart = 0;
                        element.selectedQuantity = transaction.PRODUCT_QUANTITY;
                        element.PRODUCT_DETAIL[0].transactionDetailsId = transaction.TRANSACTION_DETAIL_ID;
                        element.progressBar = false;
                    }
                });
                productsArray.push(element);
            });
            tempObject.PRODUCT = productsArray;
            tempArray.push(tempObject);
        });
        return tempArray;
    };
    HomepageComponent.prototype.makeAddToCartRequestObject = function (productObject) {
        var transactionId = 0;
        if (this.commonService.lsTransactionId()) {
            transactionId = +this.commonService.lsTransactionId();
        }
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
            STORE_ID: productDetailObject.STORE_ID,
            TRANSACTION_DETAIL_TYPE_CODE: 1
        };
        var addToCartObject = {
            SUBSCRIBER_ID: +this.commonService.lsSubscriberId(),
            STORE_ID: productDetailObject.STORE_ID,
            TRANSACTION_ID: transactionId,
            TRANSACTION_DETAIL: transactionDetails
        };
        this.addToCartRequestObject = addToCartObject;
    };
    HomepageComponent.prototype.addToCart = function (productObject, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex) {
        var _this = this;
        this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].progressBar = true;
        this.makeAddToCartRequestObject(productObject);
        this.subscriberService.addToCart(this.addToCartRequestObject)
            .subscribe(function (data) { return _this.handleAddToCartResponse(data, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex); }, function (error) { return _this.handleError(error); });
    };
    HomepageComponent.prototype.handleAddToCartResponse = function (data, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex) {
        if (data.STATUS == "OK") {
            this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].showAddToCart = 0;
            this.putTransactionDetailsIdInProductDetailsArray(allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex, data.TRANSACTION[0].TRANSACTION_DETAIL);
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.transactionService.transactionArray = data.TRANSACTION;
            this.checkOnlyTransactions();
            if (this.transactionService.transactionDetailsArray.length > 0) {
                this.commonService.addTransactionIdTols();
            }
            this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].progressBar = false;
        }
    };
    HomepageComponent.prototype.putTransactionDetailsIdInProductDetailsArray = function (allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex, transactionArray) {
        var _this = this;
        var productDetailsId = this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].PRODUCT_DETAIL[0].PRODUCT_DETAIL_ID;
        transactionArray.forEach(function (element) {
            if (productDetailsId == element.PRODUCT_DETAIL_ID) {
                _this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].PRODUCT_DETAIL[0].transactionDetailsId = element.TRANSACTION_DETAIL_ID;
            }
        });
    };
    HomepageComponent.prototype.makeUpdateCartRequestObject = function (productObject, selectedQty) {
        var transactionDetails = {
            TRANSACTION_DETAIL_ID: productObject.PRODUCT_DETAIL[0].transactionDetailsId,
            PRODUCT_QUANTITY: selectedQty
        };
        var addToCartObject = {
            SUBSCRIBER_ID: +this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_ID: this.commonService.lsTransactionId(),
            TRANSACTION_DETAIL: transactionDetails
        };
        this.updateCartRequestObject = addToCartObject;
    };
    HomepageComponent.prototype.updateCart = function (productObject, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex, selectedQty, method) {
        var _this = this;
        this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].progressBar = true;
        if (method == 1) {
            selectedQty = selectedQty + 1;
        }
        else {
            selectedQty = selectedQty - 1;
        }
        if (selectedQty == 0) {
            this.deleteCart(productObject.PRODUCT_DETAIL[0].transactionDetailsId, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex);
        }
        else {
            this.makeUpdateCartRequestObject(productObject, selectedQty);
            this.subscriberService.updateCart(this.updateCartRequestObject).subscribe(function (data) { return _this.handleUpdateCartResponse(data, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex, selectedQty); }, function (error) { return _this.handleError(error); });
        }
    };
    HomepageComponent.prototype.handleUpdateCartResponse = function (data, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex, selectedQty) {
        if (data.STATUS == "OK") {
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.transactionService.transactionArray = data.TRANSACTION;
            this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].selectedQuantity = selectedQty;
            this.checkOnlyTransactions();
        }
        this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].progressBar = false;
    };
    HomepageComponent.prototype.makeDeleteCartRequestObject = function (transactionDetailId) {
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
    HomepageComponent.prototype.deleteCart = function (transactionDetailId, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex) {
        var _this = this;
        this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].progressBar = true;
        this.makeDeleteCartRequestObject(transactionDetailId);
        this.subscriberService.removeFromCart(this.deleteCartRequestObject)
            .subscribe(function (data) { return _this.handleDeleteCartResponse(data, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex); }, function (error) { return _this.handleError(error); });
    };
    HomepageComponent.prototype.handleDeleteCartResponse = function (data, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex) {
        if (data.STATUS == "OK") {
            this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].showAddToCart = 1;
            this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].selectedQuantity = 1;
            this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].transactionDetailId = 0;
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.transactionService.transactionArray = data.TRANSACTION;
            this.checkOnlyTransactions();
        }
        this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].progressBar = false;
    };
    HomepageComponent.prototype.showIcon = function (ratings, index) {
        if (ratings >= index + 1) {
            return 'star';
        }
        else {
            return 'star_border';
        }
    };
    HomepageComponent.prototype.getColor = function (ratings, index) {
        if (ratings >= index + 1) {
            return 'blue';
        }
        else {
            return '#FFCC36';
        }
    };
    // Reviews Rating ends
    HomepageComponent.prototype.make4DataInEachShellOfArray = function (pArray, noOfItemsInRow) {
        var mainArray = [];
        var sourceProductsArray = [];
        var mArray = pArray;
        if (pArray[0] && pArray[0].PRODUCT)
            sourceProductsArray = pArray[0].PRODUCT;
        if (sourceProductsArray.length <= noOfItemsInRow) { //If Array has upto 4 items ;
            mainArray.push(sourceProductsArray);
        }
        else {
            var arrayLength = sourceProductsArray.length / noOfItemsInRow;
            var mod = sourceProductsArray.length % noOfItemsInRow;
            if (mod > 0)
                arrayLength = arrayLength + 1;
            var prodArrayIndex = 0;
            for (var i = 0; i < arrayLength; i++) {
                var tempProArray = [];
                for (var j = 0; j < noOfItemsInRow; j++) {
                    if (sourceProductsArray[prodArrayIndex])
                        tempProArray.push(sourceProductsArray[prodArrayIndex]);
                    prodArrayIndex++;
                }
                if (tempProArray.length > 0)
                    mainArray.push(tempProArray);
            }
        }
        if (mArray[0] && mArray[0].PRODUCT)
            mArray[0].PRODUCT = mainArray;
        return mArray;
    };
    HomepageComponent.prototype.getClassName = function (index) {
        var className = "item";
        if (index == 0)
            className = "item active";
        return className;
    };
    HomepageComponent.prototype.getQutClassName = function (index) {
        var className = "carousel-item";
        if (index == 0)
            className = "carousel-item active";
        return className;
    };
    HomepageComponent.prototype.getCarosuelIndicatorClass = function (index) {
        var className = "";
        if (index == 0)
            className = "active";
        return className;
    };
    HomepageComponent.prototype.getProductClassName = function (index) {
        var className = "carousel-item";
        if (index == 0)
            className = "carousel-item active";
        return className;
    };
    HomepageComponent.prototype.getCarouselClass = function () {
        var carouselClass = 'carouel';
        if (this.statusCode == ApplicationConstants_1.ApplicationConstants.STORE_STATUS_CODE_TESTING)
            carouselClass = 'carouel-test';
        return carouselClass;
    };
    HomepageComponent.prototype.getHeaderBannerClassName = function (index) {
        var className = "";
        if (index == 0)
            className = 'active';
        return className;
    };
    HomepageComponent.prototype.getBannerHeightInPixels = function (heightInPercentage) {
        return (heightInPercentage * screen.availHeight) / 100;
    };
    HomepageComponent.prototype.getImageHeight = function (id) {
        console.log("id", id);
        if (document.getElementById(id) != null)
            return document.getElementById(id).offsetWidth;
    };
    HomepageComponent.prototype.getHeight = function (containerId, numberOfBannersInRow) {
        var obj = document.getElementById(containerId);
        var containerStyle = window.getComputedStyle(obj);
        var a = +containerStyle.paddingLeft.replace('px', '');
        var b = +containerStyle.paddingRight.replace('px', '');
        var paddingLeftAndRight = a + b;
        return (document.getElementById(containerId).offsetWidth / numberOfBannersInRow) - paddingLeftAndRight;
    };
    HomepageComponent.prototype.getClassForHalfBanner = function (bannerIndex) {
        var className = "float-right";
        if (bannerIndex % 2)
            className = "float-left";
        return className;
    };
    HomepageComponent.prototype.getClassNameForBannerTitleContainer = function (element) {
        var className = "";
        if (element.NO_OF_BANNERS_IN_ROW > 2)
            className = "container";
        return className;
    };
    HomepageComponent.prototype.getTestClassName = function (index) {
        var className = "carousel-item";
        if (index == 0)
            className = "carousel-item active";
        return className;
    };
    __decorate([
        core_1.Input('rating')
    ], HomepageComponent.prototype, "rating");
    __decorate([
        core_1.Input('starCount')
    ], HomepageComponent.prototype, "starCount");
    HomepageComponent = __decorate([
        core_1.Component({
            selector: 'app-homepage',
            templateUrl: './homepage.component.html',
            styleUrls: ['./homepage.component.css'],
            animations: [
                animations_1.slide
            ]
        })
    ], HomepageComponent);
    return HomepageComponent;
}());
exports.HomepageComponent = HomepageComponent;
