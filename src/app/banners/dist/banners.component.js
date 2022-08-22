"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BannersComponent = void 0;
var core_1 = require("@angular/core");
var ApplicationConstants_1 = require("src/ApplicationConstants");
var BannersComponent = /** @class */ (function () {
    function BannersComponent(bannerService, productBannerCartService, commonService, productMidLayerService, FetchingproductsService, transactionService, sanitizer, myWishlistService) {
        this.bannerService = bannerService;
        this.productBannerCartService = productBannerCartService;
        this.commonService = commonService;
        this.productMidLayerService = productMidLayerService;
        this.FetchingproductsService = FetchingproductsService;
        this.transactionService = transactionService;
        this.sanitizer = sanitizer;
        this.myWishlistService = myWishlistService;
        this.screenResolution = window.innerWidth;
    }
    BannersComponent.prototype.checkIfYouTubeVideo = function (pUrl) {
        if (pUrl.includes('youtu.be')) {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = pUrl.match(regExp);
            var videoURL = "";
            if (match && match[2].length == 11) {
                videoURL = "https://www.youtube.com/embed/" + match[2];
            }
            return videoURL;
        }
        return pUrl;
    };
    BannersComponent.prototype.ngOnInit = function () {
        this.headersHeight = this.getHeadersHeight();
        this.myWishlistService.fetchMyWishList();
    };
    BannersComponent.prototype.getArrowMargin = function (obj) {
        if (window.innerWidth > 600) {
            var deviceWidthInPx = window.innerWidth;
            var bannerWidthInPx = (obj.SECTION_WIDTH_IN_PERCENTAGE * deviceWidthInPx) / 100;
            return (deviceWidthInPx - bannerWidthInPx) * 0.5;
        }
        else {
            return null;
        }
    };
    BannersComponent.prototype.getHeadersHeight = function () {
        var headerHeight = 0;
        var secondHeaderheight = 0;
        var additionalHeight = 0;
        if (window.innerWidth < 600) {
            var headerDomObject = document.getElementById("mobileHeader");
            var headerObject = window.getComputedStyle(headerDomObject);
            headerHeight = +headerObject.height.replace('px', '');
        }
        else {
            var headerDomObject = document.getElementById("firstHeader");
            var headerObject = window.getComputedStyle(headerDomObject);
            headerHeight = +headerObject.height.replace('px', '');
            var secondHeaderDomObject = document.getElementById("secondHeader");
            var secondHeaderObject = window.getComputedStyle(secondHeaderDomObject);
            secondHeaderheight = +secondHeaderObject.height.replace('px', '');
            additionalHeight = 80;
        }
        return (headerHeight + secondHeaderheight + additionalHeight);
    };
    BannersComponent.prototype.getHeaderBannerClassName = function (index) {
        var className = "";
        if (index == 0)
            className = 'active';
        return className;
    };
    // Hero Banner 
    BannersComponent.prototype.getHeroBannerHeightInPixels = function (heightInPercentage) {
        if (heightInPercentage > 0) {
            var availableHeight = screen.availHeight - this.headersHeight;
            return (heightInPercentage * availableHeight) / 100;
        }
        else {
            return null; // this is when adopt to image is selected
        }
    };
    // Full and Half Banners
    BannersComponent.prototype.getBannerHeightInPixels = function (rowObject) {
        if (rowObject.SECTION_HEIGHT_IN_PERCENTAGE > 0) {
            // image with text banner can have max 80% height in mobile 
            if (window.innerWidth <= 600
                && rowObject.BANNER_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.IMAGE_WITH_TEXT_BANNER_REFERENCE_TYPE_CODE
                && rowObject.SECTION_HEIGHT_IN_PERCENTAGE > 80) {
                rowObject.SECTION_HEIGHT_IN_PERCENTAGE = 80;
            }
            var availableHeight = screen.availHeight;
            var height = (rowObject.SECTION_HEIGHT_IN_PERCENTAGE * availableHeight) / 100;
            //in mobile , half banners height will be 50% 
            if (window.innerWidth <= 600
                && rowObject.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.HALF_BANNER_DISPLAY_TYPE_CODE) {
                height = height / 2;
            }
            return height;
        }
        else {
            return null; // this is when adopt to image is selected
        }
    };
    BannersComponent.prototype.getBannerWidthInPercentage = function (rowObject) {
        if (rowObject.SECTION_HEIGHT_IN_PERCENTAGE > 0) {
            if (window.innerWidth <= 600)
                return 100; // In Mobile all banners will have 100% width
            return rowObject.SECTION_WIDTH_IN_PERCENTAGE;
        }
        else {
            return null; // this is when adopt to image is selected
        }
    };
    BannersComponent.prototype.getProdBanFontSize = function (noOfProdInRow) {
        var fontSizeClass = "";
        if (window.innerWidth <= 600) {
            if (noOfProdInRow > 2) {
                fontSizeClass = "mobSmallFontSize";
            }
            else {
                fontSizeClass = "mobBigFontSize";
            }
        }
        else {
            if (noOfProdInRow > 4) {
                fontSizeClass = "webSmallFontSize";
            }
            else {
                fontSizeClass = "webBigFontSize";
            }
        }
        return fontSizeClass;
    };
    BannersComponent.prototype.getImageHeight = function (id) {
        if (document.getElementById(id) != null)
            return document.getElementById(id).offsetWidth;
    };
    // getHeight(containerId, rowObject, index) {
    //   let height = 0;
    //   let obj = document.getElementById(containerId + index);
    //   if (isObject(obj)) {
    //     let containerStyle = window.getComputedStyle(obj);
    //     let a = +containerStyle.paddingLeft.replace('px', '');
    //     let b = +containerStyle.paddingRight.replace('px', '');
    //     let paddingLeftAndRight: number = a + b;
    //     let signleShellWidth = obj.offsetWidth / rowObject.NO_OF_BANNERS_IN_ROW;
    //     height = ((signleShellWidth / rowObject.ASPECT_RATIO_WIDTH) * rowObject.ASPECT_RATIO_HEIGHT) - paddingLeftAndRight;
    //   }
    //   return height;
    // }
    BannersComponent.prototype.getHeight = function (containerId, rowObject, index) {
        var extraContainerWith = 10; // this one i am keeping just like that 
        var paddingOnEachShell = 10; //5px on each side of the shell so 10 px padding   
        var deviceWidth = window.innerWidth - extraContainerWith;
        var containerWidth = deviceWidth * (rowObject.SECTION_WIDTH_IN_PERCENTAGE / 100);
        var singleShellWidth = (containerWidth / rowObject.NO_OF_BANNERS_IN_ROW) - paddingOnEachShell;
        var height = (singleShellWidth / rowObject.ASPECT_RATIO_WIDTH) * rowObject.ASPECT_RATIO_HEIGHT;
        return height;
    };
    BannersComponent.prototype.getClassForHalfBanner = function (bannerIndex) {
        var className = "float-right";
        if (bannerIndex % 2)
            className = "float-left";
        return className;
    };
    BannersComponent.prototype.getProductImageName = function (object) {
        var imageName = "";
        if (object.PRODUCT_DETAIL[0] && object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0] && object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH != 'undefined')
            imageName = object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH;
        return imageName;
    };
    BannersComponent.prototype.getBannerContainerClassName = function (index) {
        var className = "carousel-item";
        if (index == 0)
            className = "carousel-item active";
        return className;
    };
    BannersComponent.prototype.getFloatValueForImage = function (rowObject) {
        var floatValue = "left";
        if (rowObject.IMAGE_DIRECTION == ApplicationConstants_1.ApplicationConstants.IMAGE_DIRECTION_TYPE_RIGHT_TO_LEFT)
            floatValue = "right";
        return floatValue;
    };
    BannersComponent.prototype.getFloatValueForContent = function (rowObject) {
        var floatValue = "right";
        if (rowObject.IMAGE_DIRECTION == ApplicationConstants_1.ApplicationConstants.IMAGE_DIRECTION_TYPE_RIGHT_TO_LEFT)
            floatValue = "left";
        return floatValue;
    };
    BannersComponent.prototype.getContainerWidthInPercentageForMoreThan2BannersInRow = function (rowIbject) {
        var containerWidth = 100;
        if (rowIbject.SECTION_WIDTH_IN_PERCENTAGE != undefined && rowIbject.SECTION_WIDTH_IN_PERCENTAGE > 0) {
            containerWidth = rowIbject.SECTION_WIDTH_IN_PERCENTAGE;
            if (window.innerWidth <= 600)
                containerWidth = 100; // In Mobile all banners will have 100% width
        }
        return containerWidth;
    };
    BannersComponent.prototype.getMarginForContainerShowingMoreThan2BannersInRow = function (rowIbject) {
        var margin = 0;
        if (rowIbject.SECTION_WIDTH_IN_PERCENTAGE != undefined && rowIbject.SECTION_WIDTH_IN_PERCENTAGE > 0) {
            margin = (100 - rowIbject.SECTION_WIDTH_IN_PERCENTAGE) / 2;
            if (window.innerWidth <= 600)
                margin = 0;
        }
        return margin;
    };
    BannersComponent.prototype.getMarginLeftForHalfBanner = function (rowObject, halfBannerIndex) {
        var marginLeft = 0;
        if (halfBannerIndex % 2 == 0 && this.getBannerWidthInPercentage(rowObject) != null)
            marginLeft = (100 - this.getBannerWidthInPercentage(rowObject));
        return marginLeft;
    };
    BannersComponent.prototype.getMarginLeftForTitle = function (rowObject) {
        var marginLeft = null;
        if (this.getBannerWidthInPercentage(rowObject))
            marginLeft = 0.5 * (100 - this.getBannerWidthInPercentage(rowObject));
        return marginLeft;
    };
    BannersComponent.prototype.getLimit = function () {
        var limit = 40;
        if (window.innerWidth <= 600)
            limit = 20;
        return limit;
    };
    BannersComponent.prototype.getURL = function (url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    };
    BannersComponent.prototype.getDescriptionLimit = function (numberOfBannersInRow) {
        var limit = 80;
        if (window.innerWidth > 600)
            limit = 200;
        return limit / numberOfBannersInRow;
    };
    BannersComponent.prototype.onScrollDown = function (ev) {
        console.log('scrolled down!!', ev);
        var tempOffset = this.FetchingproductsService.productOffset;
        if (tempOffset == 0)
            tempOffset = this.FetchingproductsService.productLimit;
        if (this.productMidLayerService.productsArray.length == tempOffset) {
            this.FetchingproductsService.callFromScroll = 1;
            // if(this.isFilterSelected()) {
            //   this.fetchFilteredProducts()
            // }else{
            this.FetchingproductsService.fetchProductsOnScroll();
            // }
        }
    };
    BannersComponent.prototype.onsortbychange = function () {
        this.productMidLayerService.onFilterSelectionChangeSortBy(this.sortby.REFERENCE_CODE_NAME, this.sortby.REFERENCE_CODE_LABEL);
    };
    BannersComponent = __decorate([
        core_1.Component({
            selector: 'app-banners',
            templateUrl: './banners.component.html',
            styleUrls: ['./banners.component.css']
        })
    ], BannersComponent);
    return BannersComponent;
}());
exports.BannersComponent = BannersComponent;
