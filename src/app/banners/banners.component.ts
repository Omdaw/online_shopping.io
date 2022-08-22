import { Component, OnInit } from '@angular/core';
import { BannerService } from '../banner.service';
import { CommonService } from '../common.service';
import { ProductsMidLayerService } from '../products-mid-layer.service';
import { TransactionsService } from '../transactions.service';
import * as $ from 'jquery';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { isObject } from 'util';
import { ProductBannerCartService } from '../product-banner-cart.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MyWishlistService } from '../my-wishlist.service';
import { FetchingproductsService } from '../fetchingproducts.service';


@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.css']
})
export class BannersComponent implements OnInit {

  checkIfYouTubeVideo(pUrl) {

    if (pUrl.includes('youtu.be')) {

      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var match = pUrl.match(regExp);

      let videoURL = "";

      if (match && match[2].length == 11) {
        videoURL = "https://www.youtube.com/embed/" + match[2];
      }
      return videoURL;
    }
    return pUrl;
  }

  headersHeight: number;
  screenResolution: number;

  constructor(
    public bannerService: BannerService,
    public productBannerCartService: ProductBannerCartService,
    public commonService: CommonService,
    public productMidLayerService: ProductsMidLayerService,
    public FetchingproductsService: FetchingproductsService,
    public transactionService: TransactionsService,
    public sanitizer: DomSanitizer,
    public myWishlistService: MyWishlistService,
  ) {
    this.screenResolution = window.innerWidth;
  }

  ngOnInit() {
    this.headersHeight = this.getHeadersHeight();
    this.myWishlistService.fetchMyWishList();
  }

  getArrowMargin(obj) {

    if (window.innerWidth > 600) {
      let deviceWidthInPx = window.innerWidth;
      let bannerWidthInPx = (obj.SECTION_WIDTH_IN_PERCENTAGE * deviceWidthInPx) / 100;

      return (deviceWidthInPx - bannerWidthInPx) * 0.5;
    } else {
      return null;
    }
  }

  getHeadersHeight() {
    let headerHeight = 0;
    let secondHeaderheight = 0;
    let additionalHeight = 0;
    if (window.innerWidth < 600) {
      let headerDomObject = document.getElementById("mobileHeader");
      let headerObject = window.getComputedStyle(headerDomObject);
      headerHeight = +headerObject.height.replace('px', '');
    } else {
      let headerDomObject = document.getElementById("firstHeader");
      let headerObject = window.getComputedStyle(headerDomObject);
      headerHeight = +headerObject.height.replace('px', '');

      let secondHeaderDomObject = document.getElementById("secondHeader");
      let secondHeaderObject = window.getComputedStyle(secondHeaderDomObject);
      secondHeaderheight = +secondHeaderObject.height.replace('px', '');

      additionalHeight = 80;
    }


    return (headerHeight + secondHeaderheight + additionalHeight);
  }

  getHeaderBannerClassName(index) {
    let className = "";
    if (index == 0) className = 'active';
    return className;
  }

  // Hero Banner 
  getHeroBannerHeightInPixels(heightInPercentage) {
    if (heightInPercentage > 0) {
      let availableHeight = screen.availHeight - this.headersHeight;
      return (heightInPercentage * availableHeight) / 100;
    } else {
      return null; // this is when adopt to image is selected
    }
  }

  // Full and Half Banners
  getBannerHeightInPixels(rowObject) {
    if (rowObject.SECTION_HEIGHT_IN_PERCENTAGE > 0) {

      // image with text banner can have max 80% height in mobile 
      if (window.innerWidth <= 600
        && rowObject.BANNER_TYPE_CODE == ApplicationConstants.IMAGE_WITH_TEXT_BANNER_REFERENCE_TYPE_CODE
        && rowObject.SECTION_HEIGHT_IN_PERCENTAGE > 80) {
        rowObject.SECTION_HEIGHT_IN_PERCENTAGE = 80;
      }

      let availableHeight = screen.availHeight;
      let height = (rowObject.SECTION_HEIGHT_IN_PERCENTAGE * availableHeight) / 100;

      //in mobile , half banners height will be 50% 
      if (window.innerWidth <= 600
        && rowObject.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.HALF_BANNER_DISPLAY_TYPE_CODE) {
        height = height / 2;
      }



      return height;
    } else {
      return null; // this is when adopt to image is selected
    }
  }

  getBannerWidthInPercentage(rowObject) {

    if (rowObject.SECTION_HEIGHT_IN_PERCENTAGE > 0) {
      if (window.innerWidth <= 600) return 100; // In Mobile all banners will have 100% width
      return rowObject.SECTION_WIDTH_IN_PERCENTAGE;
    } else {
      return null; // this is when adopt to image is selected
    }
  }


  getProdBanFontSize(noOfProdInRow: number) {
    let fontSizeClass = "";
    if (window.innerWidth <= 600) {
      if (noOfProdInRow > 2) {
        fontSizeClass = "mobSmallFontSize";
      } else {
        fontSizeClass = "mobBigFontSize"
      }
    }
    else {
      if (noOfProdInRow > 4) {
        fontSizeClass = "webSmallFontSize";
      } else {
        fontSizeClass = "webBigFontSize"
      }
    }

    return fontSizeClass;
  }

  getImageHeight(id) {
    if (document.getElementById(id) != null) return document.getElementById(id).offsetWidth;
  }

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


  getHeight(containerId, rowObject, index) {

    let extraContainerWith = 10; // this one i am keeping just like that 
    let paddingOnEachShell = 10; //5px on each side of the shell so 10 px padding   

    let deviceWidth = window.innerWidth - extraContainerWith;
    let containerWidth = deviceWidth * (rowObject.SECTION_WIDTH_IN_PERCENTAGE / 100)
    let singleShellWidth = (containerWidth / rowObject.NO_OF_BANNERS_IN_ROW) - paddingOnEachShell;
    let height = (singleShellWidth / rowObject.ASPECT_RATIO_WIDTH) * rowObject.ASPECT_RATIO_HEIGHT;

    return height;
  }

  getClassForHalfBanner(bannerIndex) {
    let className = "float-right";
    if (bannerIndex % 2) className = "float-left";
    return className;
  }

  getProductImageName(object) {
    let imageName = "";
    if (object.PRODUCT_DETAIL[0] && object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0] && object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH != 'undefined') imageName = object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH;
    return imageName;
  }

  getBannerContainerClassName(index) {
    let className = "carousel-item";
    if (index == 0) className = "carousel-item active"
    return className;
  }

  getFloatValueForImage(rowObject) {
    let floatValue = "left";
    if (rowObject.IMAGE_DIRECTION == ApplicationConstants.IMAGE_DIRECTION_TYPE_RIGHT_TO_LEFT) floatValue = "right";
    return floatValue;
  }

  getFloatValueForContent(rowObject) {
    let floatValue = "right";
    if (rowObject.IMAGE_DIRECTION == ApplicationConstants.IMAGE_DIRECTION_TYPE_RIGHT_TO_LEFT) floatValue = "left";
    return floatValue;
  }

  getContainerWidthInPercentageForMoreThan2BannersInRow(rowIbject) {
    let containerWidth = 100;
    if (rowIbject.SECTION_WIDTH_IN_PERCENTAGE != undefined && rowIbject.SECTION_WIDTH_IN_PERCENTAGE > 0) {
      containerWidth = rowIbject.SECTION_WIDTH_IN_PERCENTAGE;
      if (window.innerWidth <= 600) containerWidth = 100;// In Mobile all banners will have 100% width
    }
    return containerWidth;
  }

  getMarginForContainerShowingMoreThan2BannersInRow(rowIbject) {
    let margin = 0;
    if (rowIbject.SECTION_WIDTH_IN_PERCENTAGE != undefined && rowIbject.SECTION_WIDTH_IN_PERCENTAGE > 0) {
      margin = (100 - rowIbject.SECTION_WIDTH_IN_PERCENTAGE) / 2;
      if (window.innerWidth <= 600) margin = 0;
    }
    return margin;
  }

  getMarginLeftForHalfBanner(rowObject, halfBannerIndex) {
    let marginLeft = 0;
    if (halfBannerIndex % 2 == 0 && this.getBannerWidthInPercentage(rowObject) != null) marginLeft = (100 - this.getBannerWidthInPercentage(rowObject));
    return marginLeft;
  }

  getMarginLeftForTitle(rowObject) {
    let marginLeft = null;
    if (this.getBannerWidthInPercentage(rowObject)) marginLeft = 0.5 * (100 - this.getBannerWidthInPercentage(rowObject))
    return marginLeft;
  }

  getLimit() {
    let limit = 40;
    if (window.innerWidth <= 600) limit = 20;
    return limit;
  }

  getURL(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getDescriptionLimit(numberOfBannersInRow) {
    let limit = 80;
    if (window.innerWidth > 600) limit = 200;
    return limit / numberOfBannersInRow;
  }

  onScrollDown(ev) {
    console.log('scrolled down!!', ev);

    let tempOffset = this.FetchingproductsService.productOffset;
    if (tempOffset == 0) tempOffset = this.FetchingproductsService.productLimit;
    if (this.productMidLayerService.productsArray.length == tempOffset) {
      this.FetchingproductsService.callFromScroll = 1;

      // if(this.isFilterSelected()) {
      //   this.fetchFilteredProducts()
      // }else{
      this.FetchingproductsService.fetchProductsOnScroll();
      // }
    }
  }
  sortby;
  onsortbychange() {
    this.productMidLayerService.onFilterSelectionChangeSortBy
      (this.sortby.REFERENCE_CODE_NAME, this.sortby.REFERENCE_CODE_LABEL)
  }

}
