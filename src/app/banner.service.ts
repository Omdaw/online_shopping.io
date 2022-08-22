import { Injectable } from '@angular/core';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { ConfigService } from './config.service';
import { HomePageService } from './home-page.service';
import { TransactionsService } from './transactions.service';
import { FetchingproductsService } from './fetchingproducts.service';
import { CommonService } from './common.service';
import { SubscriberService } from './subscriber.service';
import { UserProfileService } from './user-profile.service';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(
    private configService: ConfigService,
    private commonService: CommonService,
    private subscriberService: SubscriberService,
    private userProfileService: UserProfileService,
    private homeService: HomePageService,
    private transactionService: TransactionsService
  ) { }

  headerBanners               = [];
  processBar                  = false;
  bannerCallFromPageCode      = 0;
  displayBanner               = true;
  toalNumberOfBanners         : number; // new-checklist-soln-empty-homepage // this count is to check how many banners are configured, if there are no banners then we will show a static banner in Home page 

  makeFetchHeroBannerByStoreIdRequestObject(bannerVisibilityTypeCode, productCategoryId) {

    // this.displayBanner = false;

    let bannerDisplayDeviceTypeCode = ApplicationConstants.BANNER_DISPLAY_TYPE_CODE_WEB;

    if (window.innerWidth < 600) bannerDisplayDeviceTypeCode = ApplicationConstants.BANNER_DISPLAY_TYPE_CODE_MOBILE;

    this.fetchBannerByStoreIdRequest = {
      STORE_ID                         : this.configService.getStoreID(),
      OFFSET                           : 0,
      LIMIT                            : 1,
      SCREEN_HEIGHT                    : window.innerHeight,
      SCREEN_WIDTH                     : window.innerWidth,
      BANNER_DISPLAY_DEVICE_TYPE_CODE  : bannerDisplayDeviceTypeCode,
      BANNER_VISIBILITY_TYPE_CODE      : bannerVisibilityTypeCode
    }

    if(productCategoryId > 0) { // Means this is from category page 
      this.fetchBannerByStoreIdRequest.PRODUCT_CATEGORY_ID = productCategoryId;
    } 
  }

  FetchHeroBannerByStoreId(bannerVisibilityTypeCode, productCategoryId) {
    this.toalNumberOfBanners      = undefined; //new-checklist-soln-empty-homepage
    this.processBar               = true;
    this.makeFetchHeroBannerByStoreIdRequestObject(bannerVisibilityTypeCode, productCategoryId);
    this.homeService.fetchBannerByStoreIdAPI(this.fetchBannerByStoreIdRequest).subscribe(data => this.handleFetchHeroBannerByStoreId(data), error => error);
  }


  handleFetchHeroBannerByStoreId(pData) {

    if (pData.STATUS = 'OK') {

      let responseArray = [];
      
      // new-checklist-soln-empty-homepage
      if(pData.PARENT_BANNER && pData.PARENT_BANNER.length > 0) {
        responseArray = pData.PARENT_BANNER;
      }

      this.toalNumberOfBanners = pData.PARENT_BANNER.length;

      this.allBannersArray        = [];
      this.allBannersArray.length = 0;
      this.headerBanners          = [];
      this.headerBanners.length   = 0;

      if(responseArray.length == 0) this.displayBanner = false;

      responseArray.forEach(element => {
        if (element.BANNER_DISPLAY_SEQ_NR == ApplicationConstants.HERO_BANNER_DISPLAY_SEQ_NR) {

            // this.displayBanner = true;

            let SECTION_HEIGHT_IN_PERCENTAGE = element.SECTION_HEIGHT_IN_PERCENTAGE;
            let SECTION_WIDTH_IN_PERCENTAGE = element.SECTION_WIDTH_IN_PERCENTAGE;
            element.CHILD_BANNER.forEach(element => {
              if (element.BANNER_STATUS_CODE == ApplicationConstants.STATUS_CODE_ENABLE) {
                element.SECTION_HEIGHT_IN_PERCENTAGE = SECTION_HEIGHT_IN_PERCENTAGE;
                element.SECTION_WIDTH_IN_PERCENTAGE = SECTION_WIDTH_IN_PERCENTAGE;
                this.headerBanners.push(element);
              }
            });

        } // if hero banner 
      }); // for loop

      this.processBar = false;
    } // success
  }

  public fetchBannerByStoreIdRequest;
  public calledOnScroll   = false; // this should be enable only if user scrolls in Homepage 

  makeFetchBannerByStoreIdRequestObject(bannerVisibilityTypeCode, productCategoryId, offset, limit) {

    let bannerDisplayDeviceTypeCode = ApplicationConstants.BANNER_DISPLAY_TYPE_CODE_WEB;

    if (window.innerWidth < 600) bannerDisplayDeviceTypeCode = ApplicationConstants.BANNER_DISPLAY_TYPE_CODE_MOBILE;

    this.fetchBannerByStoreIdRequest = {
      STORE_ID                          :   this.configService.getStoreID(),
      OFFSET                            :   0,
      SCREEN_HEIGHT                     :   window.innerHeight,
      SCREEN_WIDTH                      :   window.innerWidth,
      BANNER_DISPLAY_DEVICE_TYPE_CODE   :   bannerDisplayDeviceTypeCode,
      BANNER_VISIBILITY_TYPE_CODE       :   bannerVisibilityTypeCode
    }

    if(this.bannerCallFromPageCode == ApplicationConstants.CALL_FROM_CATEGORY_PAGE) { // Means this is from category page 
      this.fetchBannerByStoreIdRequest.PRODUCT_CATEGORY_ID = productCategoryId;
      this.fetchBannerByStoreIdRequest.LIMIT = 10;
    } 
    else { // this is from home page 
      this.fetchBannerByStoreIdRequest.OFFSET = offset;
      this.fetchBannerByStoreIdRequest.LIMIT = limit;
    }
  }

  FetchBannerByStoreId(bannerVisibilityTypeCode, productCategoryId, offset = 0, limit = 0) {
    this.displayBanner = true;
    this.processBar = true;
    this.makeFetchBannerByStoreIdRequestObject(bannerVisibilityTypeCode, productCategoryId, offset, limit);
    this.homeService.fetchBannerByStoreIdAPI(this.fetchBannerByStoreIdRequest).subscribe(data => this.handleFetchBannerByStoreId(data), error => error);
  }

  fullImageBanners = [];
  halfImageBanners = [];
  imageBannersMoreThanTwoInRow = [];

  fullTextBanners = [];
  halfTextBanners = [];
  textBannersMoreThanTwoInRow = [];

  fullImageWithTextBanners = [];
  halfImageWithTextBanners = [];
  imageWithTextBannersMoreThanTwoInRow = [];

  videoBannersMoreThanTwoInRow = [];
  halfVideoBanners = [];
  fullVideoBanners = [];

  quarterCategoryBanners = [];
  halfCategoryBanners = [];
  fullCategoryBanners = [];
  categoryBannersMoreThanTwoInRow = [];

  quarterBrandBanners = [];
  halfBrandBanners = [];
  fullBrandBanners = [];
  brandBannersMoreThanTwoInRow = [];

  productsMoreThanOneInRow = [];

  allBannersArray = [];

  handleFetchBannerByStoreId(pData) {

    if (pData.STATUS = 'OK') {

      let responseArray = [];

      // new-checklist-soln-empty-homepage
      if(pData.PARENT_BANNER && pData.PARENT_BANNER.length > 0) {
        responseArray             =  pData.PARENT_BANNER;
      }

      this.toalNumberOfBanners  += pData.PARENT_BANNER.length;

      this.allBannersArray        = [];
      this.allBannersArray.length = 0;

      if(responseArray.length == 0) this.displayBanner = false;

      responseArray.forEach(element => {

        let tempObject: any;

        tempObject = {};

        if (element.BANNER_DISPLAY_SEQ_NR != ApplicationConstants.HERO_BANNER_DISPLAY_SEQ_NR) { // Display Seq number 1 is always Header/Hero Banner

          // this.displayBanner = true;

          //if mobile than show maximum of 3 banners in a row so this following logic
          if (window.innerWidth < 600 && element.NO_OF_BANNERS_IN_ROW > 3) element.NO_OF_BANNERS_IN_ROW = 3;


          tempObject = element;


          if (window.innerWidth <= 600 && element.BANNER_MOBILE_DISPLAY_TYPE_CODE && element.NO_OF_MOBILE_BANNERS_IN_ROW) {
            element.NO_OF_BANNERS_IN_ROW = element.NO_OF_MOBILE_BANNERS_IN_ROW;
            element.BANNER_DISPLAY_TYPE_CODE = element.BANNER_MOBILE_DISPLAY_TYPE_CODE;
          }

          let SECTION_HEIGHT_IN_PERCENTAGE = element.SECTION_HEIGHT_IN_PERCENTAGE;
          let SECTION_WIDTH_IN_PERCENTAGE = element.SECTION_WIDTH_IN_PERCENTAGE;
          let NO_OF_BANNERS_IN_ROW = element.NO_OF_BANNERS_IN_ROW;
          let BANNER_DISPLAY_TYPE_CODE = element.BANNER_DISPLAY_TYPE_CODE;
          let BANNER_TYPE_CODE = element.BANNER_TYPE_CODE;
          let BANNER_STYLE_TYPE_CODE = element.BANNER_STYLE_TYPE_CODE;

          if (element.BANNER_TITLE && element.BANNER_TITLE == "null") element.BANNER_TITLE = "";


          element.CHILD_BANNER.forEach(element => {

            element.SECTION_HEIGHT_IN_PERCENTAGE = SECTION_HEIGHT_IN_PERCENTAGE;
            element.SECTION_WIDTH_IN_PERCENTAGE = SECTION_WIDTH_IN_PERCENTAGE;
            element.NO_OF_BANNERS_IN_ROW = NO_OF_BANNERS_IN_ROW;
            element.BANNER_DISPLAY_TYPE_CODE = BANNER_DISPLAY_TYPE_CODE;
            element.BANNER_TYPE_CODE = BANNER_TYPE_CODE;
            element.BANNER_STYLE_TYPE_CODE = BANNER_STYLE_TYPE_CODE;

            /*************/

            if (element.BANNER_TYPE_CODE == ApplicationConstants.IMAGE_BANNER_REFERENCE_TYPE_CODE) {

              if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.FULL_BANNER_DISPLAY_TYPE_CODE) this.fullImageBanners.push(element);

              if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.HALF_BANNER_DISPLAY_TYPE_CODE) {
                this.halfImageBanners.push(element);
              }

              if (element.NO_OF_BANNERS_IN_ROW > 2) this.imageBannersMoreThanTwoInRow.push(element);

            }
            /*************/
            /*************/

            if (element.BANNER_TYPE_CODE == ApplicationConstants.TEXT_BANNER_REFERENCE_TYPE_CODE) {

              if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.FULL_BANNER_DISPLAY_TYPE_CODE) {
                this.fullTextBanners.push(element);
              }

              if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.HALF_BANNER_DISPLAY_TYPE_CODE) {
                this.halfTextBanners.push(element);
              }

              if (element.NO_OF_BANNERS_IN_ROW > 2) {
                this.textBannersMoreThanTwoInRow.push(element);
              }

            }
            /*************/
            /*************/

            if (element.BANNER_TYPE_CODE == ApplicationConstants.IMAGE_WITH_TEXT_BANNER_REFERENCE_TYPE_CODE) {

              if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.FULL_BANNER_DISPLAY_TYPE_CODE) this.fullImageWithTextBanners.push(element);

              if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.HALF_BANNER_DISPLAY_TYPE_CODE) this.halfImageWithTextBanners.push(element);

              // if (element.NO_OF_BANNERS_IN_ROW > 2) this.imageWithTextBannersMoreThanTwoInRow.push(element);

            }
            /*************/

            if (element.BANNER_TYPE_CODE == ApplicationConstants.VIDEO_BANNER_REFERENCE_TYPE_CODE) {

              //Video Banners // BANNER_TYPE_CODE = 2; // BANNER_DISPLAY_TYPE_CODE = 3 // FULL BANNER

              if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.FULL_BANNER_DISPLAY_TYPE_CODE) this.fullVideoBanners.push(element);

              //Video Banners // BANNER_TYPE_CODE = 2; // BANNER_DISPLAY_TYPE_CODE = 2 // HALF BANNER

              if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.HALF_BANNER_DISPLAY_TYPE_CODE) this.halfVideoBanners.push(element);

              //Video Banners // BANNER_TYPE_CODE = 2; // BANNER_DISPLAY_TYPE_CODE = 1 // QUARTER BANNER

              if (element.NO_OF_BANNERS_IN_ROW > 2) this.videoBannersMoreThanTwoInRow.push(element);

            }
            /*************/

            if (element.BANNER_TYPE_CODE == ApplicationConstants.CATEGORY_BANNER_REFERENCE_TYPE_CODE) {

              //Category Banners // BANNER_TYPE_CODE = 3; // BANNER_DISPLAY_TYPE_CODE = 3 // FULL BANNER
              if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.FULL_BANNER_DISPLAY_TYPE_CODE) this.fullCategoryBanners.push(element);

              //Category Banners // BANNER_TYPE_CODE = 3; // BANNER_DISPLAY_TYPE_CODE = 2 // HALF BANNER
              if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.HALF_BANNER_DISPLAY_TYPE_CODE) this.halfCategoryBanners.push(element);

              if (element.NO_OF_BANNERS_IN_ROW > 2) this.categoryBannersMoreThanTwoInRow.push(element);

            }

            /*************/
            if (element.BANNER_TYPE_CODE == ApplicationConstants.BRAND_BANNER_REFERENCE_TYPE_CODE) {

              //Brand Banners // BANNER_TYPE_CODE = 4; // BANNER_DISPLAY_TYPE_CODE = 3 // FULL BANNER
              if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.FULL_BANNER_DISPLAY_TYPE_CODE) this.fullBrandBanners.push(element);

              //Brand Banners // BANNER_TYPE_CODE = 4; // BANNER_DISPLAY_TYPE_CODE = 2 // HALF BANNER
              if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.HALF_BANNER_DISPLAY_TYPE_CODE) this.halfBrandBanners.push(element);

              if (element.NO_OF_BANNERS_IN_ROW > 2) this.brandBannersMoreThanTwoInRow.push(element);
            }
            /*************/

            if (element.BANNER_TYPE_CODE == ApplicationConstants.PRODUCTS_BANNER_REFERENCE_TYPE_CODE) {

              this.productsMoreThanOneInRow.push(element);

            }



            /*************/

          });
        }


        // Half Image Banner    
        if (element.BANNER_TYPE_CODE == ApplicationConstants.IMAGE_BANNER_REFERENCE_TYPE_CODE &&
          element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.HALF_BANNER_DISPLAY_TYPE_CODE &&
          element.BANNER_STYLE_TYPE_CODE == ApplicationConstants.BANNER_STYLE_TYPE_CODE_SCROLL
          && this.halfImageBanners.length > 0) {
          let formatedArray = this.makeNDataInEachShellOfBannerArray(this.halfImageBanners, element.NO_OF_BANNERS_IN_ROW);
          this.halfImageBanners = formatedArray;
        }

        if (element.BANNER_TYPE_CODE == ApplicationConstants.IMAGE_BANNER_REFERENCE_TYPE_CODE &&
          element.NO_OF_BANNERS_IN_ROW > 2 &&
          element.BANNER_STYLE_TYPE_CODE == ApplicationConstants.BANNER_STYLE_TYPE_CODE_SCROLL
          && this.imageBannersMoreThanTwoInRow.length > 0) {
          let formatedArray = this.makeNDataInEachShellOfBannerArray(this.imageBannersMoreThanTwoInRow, element.NO_OF_BANNERS_IN_ROW);
          this.imageBannersMoreThanTwoInRow = [];
          this.imageBannersMoreThanTwoInRow = formatedArray;
        }

        // Half text Banner    
        if (element.BANNER_TYPE_CODE == ApplicationConstants.TEXT_BANNER_REFERENCE_TYPE_CODE &&
          element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.HALF_BANNER_DISPLAY_TYPE_CODE &&
          element.BANNER_STYLE_TYPE_CODE == ApplicationConstants.BANNER_STYLE_TYPE_CODE_SCROLL
          && this.halfTextBanners.length > 0) {
          let formatedArray = this.makeNDataInEachShellOfBannerArray(this.halfTextBanners, element.NO_OF_BANNERS_IN_ROW);
          this.halfTextBanners = formatedArray;
        }

        if (element.BANNER_TYPE_CODE == ApplicationConstants.TEXT_BANNER_REFERENCE_TYPE_CODE &&
          element.NO_OF_BANNERS_IN_ROW > 2 &&
          element.BANNER_STYLE_TYPE_CODE == ApplicationConstants.BANNER_STYLE_TYPE_CODE_SCROLL
          && this.textBannersMoreThanTwoInRow.length > 0) {
          let formatedArray = this.makeNDataInEachShellOfBannerArray(this.textBannersMoreThanTwoInRow, element.NO_OF_BANNERS_IN_ROW);
          this.textBannersMoreThanTwoInRow = [];
          this.textBannersMoreThanTwoInRow = formatedArray;
        }

        // Half Category Banner 
        if (element.BANNER_TYPE_CODE == ApplicationConstants.CATEGORY_BANNER_REFERENCE_TYPE_CODE &&
          element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.HALF_BANNER_DISPLAY_TYPE_CODE &&
          element.BANNER_STYLE_TYPE_CODE == ApplicationConstants.BANNER_STYLE_TYPE_CODE_SCROLL &&
          this.halfCategoryBanners.length > 0) {
          let formatedArray = this.makeNDataInEachShellOfBannerArray(this.halfCategoryBanners[0].PRODUCT_CATEGORY, element.NO_OF_BANNERS_IN_ROW);
          this.halfCategoryBanners[0].PRODUCT_CATEGORY = formatedArray;
        }

        if (element.BANNER_TYPE_CODE == ApplicationConstants.CATEGORY_BANNER_REFERENCE_TYPE_CODE &&
          element.NO_OF_BANNERS_IN_ROW > 2 &&
          element.BANNER_STYLE_TYPE_CODE == ApplicationConstants.BANNER_STYLE_TYPE_CODE_SCROLL
          && this.categoryBannersMoreThanTwoInRow.length > 0) {
          let formatedArray = this.makeNDataInEachShellOfBannerArray(this.categoryBannersMoreThanTwoInRow[0].PRODUCT_CATEGORY, element.NO_OF_BANNERS_IN_ROW);
          this.categoryBannersMoreThanTwoInRow[0].PRODUCT_CATEGORY = formatedArray;
        }

        // Half Brand Banner 
        if (element.BANNER_TYPE_CODE == ApplicationConstants.BRAND_BANNER_REFERENCE_TYPE_CODE &&
          element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.HALF_BANNER_DISPLAY_TYPE_CODE &&
          element.BANNER_STYLE_TYPE_CODE == ApplicationConstants.BANNER_STYLE_TYPE_CODE_SCROLL
          && this.halfBrandBanners.length > 0) {
          let formatedArray = this.makeNDataInEachShellOfBannerArray(this.halfBrandBanners[0].BRAND, element.NO_OF_BANNERS_IN_ROW);
          this.halfBrandBanners[0].BRAND = formatedArray;
        }

        if (element.BANNER_TYPE_CODE == ApplicationConstants.BRAND_BANNER_REFERENCE_TYPE_CODE &&
          element.NO_OF_BANNERS_IN_ROW > 2 &&
          element.BANNER_STYLE_TYPE_CODE == ApplicationConstants.BANNER_STYLE_TYPE_CODE_SCROLL
          && this.brandBannersMoreThanTwoInRow.length > 0) {
          let formatedArray = this.makeNDataInEachShellOfBannerArray(this.brandBannersMoreThanTwoInRow[0].BRAND, element.NO_OF_BANNERS_IN_ROW);
          this.brandBannersMoreThanTwoInRow[0].BRAND = formatedArray;
        }

        // let lProductsMoreThanOneInRow = [];
        if (this.productsMoreThanOneInRow.length > 0) {
          this.productsMoreThanOneInRow = this.structureProducts(this.productsMoreThanOneInRow);
        }

        //product more than one 
        if (element.BANNER_TYPE_CODE == ApplicationConstants.PRODUCTS_BANNER_REFERENCE_TYPE_CODE &&
          element.NO_OF_BANNERS_IN_ROW > 0 
          // && element.BANNER_STYLE_TYPE_CODE == ApplicationConstants.BANNER_STYLE_TYPE_CODE_SCROLL
          && this.productsMoreThanOneInRow.length > 0) {
          let formatedArray = this.makeNDataInEachShellOfBannerArray(this.productsMoreThanOneInRow[0].PRODUCT, element.NO_OF_BANNERS_IN_ROW);
          this.productsMoreThanOneInRow[0].PRODUCT = formatedArray;

        }


        // Video Banner 
        if (element.BANNER_TYPE_CODE == ApplicationConstants.VIDEO_BANNER_REFERENCE_TYPE_CODE &&
          element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.HALF_BANNER_DISPLAY_TYPE_CODE &&
          element.BANNER_STYLE_TYPE_CODE == ApplicationConstants.BANNER_STYLE_TYPE_CODE_SCROLL &&
          this.halfVideoBanners.length > 0) {
          let formatedArray = this.makeNDataInEachShellOfBannerArray(this.halfVideoBanners, element.NO_OF_BANNERS_IN_ROW);
          this.halfVideoBanners = formatedArray;
        }

        if (element.BANNER_TYPE_CODE == ApplicationConstants.VIDEO_BANNER_REFERENCE_TYPE_CODE &&
          element.NO_OF_BANNERS_IN_ROW > 2 &&
          element.BANNER_STYLE_TYPE_CODE == ApplicationConstants.BANNER_STYLE_TYPE_CODE_SCROLL
          && this.videoBannersMoreThanTwoInRow.length > 0) {
          let formatedArray = this.makeNDataInEachShellOfBannerArray(this.videoBannersMoreThanTwoInRow, element.NO_OF_BANNERS_IN_ROW);
          this.videoBannersMoreThanTwoInRow = formatedArray;
        }

        // if (element.BANNER_TYPE_CODE == ApplicationConstants.PRODUCTS_BANNER_REFERENCE_TYPE_CODE
        //   && this.productsMoreThanOneInRow.length > 0
        //   && this.productsMoreThanOneInRow[0].NO_OF_BANNERS_IN_ROW == 1) this.productsMoreThanOneInRow[0].NO_OF_BANNERS_IN_ROW = 2;

        tempObject.FULL_TEXT_BANNERS = this.fullTextBanners;
        tempObject.HALF_TEXT_BANNERS = this.halfTextBanners;
        tempObject.TEXT_BANNERS_MORE_THAN_TWO_IN_ROW = this.textBannersMoreThanTwoInRow;

        tempObject.FULL_IMAGE_BANNERS = this.fullImageBanners;
        tempObject.HALF_IMAGE_BANNERS = this.halfImageBanners;
        tempObject.IMAGE_BANNERS_MORE_THAN_TWO_IN_ROW = this.imageBannersMoreThanTwoInRow;

        tempObject.FULL_IMAGE_WITH_TEXT_BANNERS = this.fullImageWithTextBanners;
        tempObject.HALF_IMAGE_WITH_TEXT_BANNERS = this.halfImageWithTextBanners;
        tempObject.IMAGE_WITH_TEXT_BANNERS_MORE_THAN_TWO_IN_ROW = this.imageWithTextBannersMoreThanTwoInRow;

        tempObject.FULL_VIDEO_BANNERS = this.fullVideoBanners;
        tempObject.HALF_VIDEO_BANNERS = this.halfVideoBanners;
        tempObject.VIDEO_BANNERS_MORE_THAN_TWO_IN_ROW = this.videoBannersMoreThanTwoInRow;

        tempObject.FULL_CATEGORIES = this.fullCategoryBanners;
        tempObject.HALF_CATEGORIES = this.halfCategoryBanners;
        tempObject.QUARTER_CATEGORIES = this.quarterCategoryBanners;
        tempObject.CATEGORY_BANNERS_MORE_THAN_TWO_IN_ROW = this.categoryBannersMoreThanTwoInRow;

        tempObject.FULL_BRANDS = this.fullBrandBanners;
        tempObject.HALF_BRANDS = this.halfBrandBanners;
        tempObject.QUARTER_BRANDS = this.quarterBrandBanners;
        tempObject.BRAND_BANNERS_MORE_THAN_TWO_IN_ROW = this.brandBannersMoreThanTwoInRow

        // let lProductsMoreThanOneInRow = [];
        // if (this.productsMoreThanOneInRow.length > 0) {
        //   lProductsMoreThanOneInRow = this.structureProducts(this.productsMoreThanOneInRow);
        // }

        tempObject.PRODUCTS_MORE_THAN_ONE_IN_ROW = this.productsMoreThanOneInRow;

        this.allBannersArray.push(tempObject);

        this.fullImageBanners = [];
        this.halfImageBanners = [];
        this.imageBannersMoreThanTwoInRow = [];

        this.fullTextBanners = [];
        this.halfTextBanners = [];
        this.textBannersMoreThanTwoInRow = [];

        this.fullImageWithTextBanners = [];
        this.halfImageWithTextBanners = [];
        this.imageWithTextBannersMoreThanTwoInRow = [];


        this.fullVideoBanners = [];
        this.halfVideoBanners = [];
        this.videoBannersMoreThanTwoInRow = [];

        this.fullCategoryBanners = [];
        this.halfCategoryBanners = [];
        this.quarterCategoryBanners = [];
        this.categoryBannersMoreThanTwoInRow = [];

        this.fullBrandBanners = [];
        this.halfBrandBanners = [];
        this.quarterBrandBanners = [];
        this.brandBannersMoreThanTwoInRow = [];

        this.productsMoreThanOneInRow = [];

        
      });
      this.processBar = false;


    }
  }

  structureProducts(tempArray) {

    let tempFooterBannerProducts = tempArray;
    tempArray = [];


    tempFooterBannerProducts.forEach(element => {
      let tempObject: any;
      tempObject = element;
      let productsArray = []

      element.PRODUCT.forEach(element => {
        element.showAddToCart = 1;
        element.selectedQuantity = 1;

        this.transactionService.transactionDetailsArray.forEach(transaction => {
          if (element.PRODUCT_DETAIL && element.PRODUCT_DETAIL.length > 0 && element.PRODUCT_DETAIL[0] && element.PRODUCT_DETAIL[0].PRODUCT_DETAIL_ID == transaction.PRODUCT_DETAIL_ID) {
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
  }

  makeNDataInEachShellOfBannerArray(pArray, noOfItemsInRow) {


    


    let mainArray = [];
    let sourceProductsArray = [];
    let mArray = pArray;


    if (pArray.length > 0) sourceProductsArray = pArray;


    if (sourceProductsArray.length <= noOfItemsInRow) { //If Array has upto 4 items ;
      mainArray.push(sourceProductsArray);
    } else {
      let arrayLength = sourceProductsArray.length / noOfItemsInRow;
      let mod = sourceProductsArray.length % noOfItemsInRow;
      if (mod > 0) arrayLength = arrayLength + 1;

      let prodArrayIndex = 0;

      for (let i = 0; i < arrayLength; i++) {
        let tempProArray = [];
        for (let j = 0; j < noOfItemsInRow; j++) {
          if (sourceProductsArray[prodArrayIndex]) tempProArray.push(sourceProductsArray[prodArrayIndex]);
          prodArrayIndex++;
        }
        if (tempProArray.length > 0) mainArray.push(tempProArray);
      }
    }

    mArray = mainArray;
    return mArray;
  }

  //Add To Cart
  addToCartRequestObject = {};
  transactionDetailsId = 0;
  makeAddToCartRequestObject(productObject) {
    let transactionId = 0;
    if (this.commonService.lsTransactionId()) { transactionId = + this.commonService.lsTransactionId(); }
    let productDetailObject = productObject.PRODUCT_DETAIL[0];
    let transactionDetails = {
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
      STORE_ID: productDetailObject.STORE_ID,//this.configService.getStoreID(),
      TRANSACTION_DETAIL_TYPE_CODE: 1,
    }

    let addToCartObject = {
      SUBSCRIBER_ID: + this.commonService.lsSubscriberId(),
      STORE_ID: productDetailObject.STORE_ID,//this.configService.getStoreID(),
      TRANSACTION_ID: transactionId,
      TRANSACTION_DETAIL: transactionDetails
    }

    this.addToCartRequestObject = addToCartObject;

  }

  addToCart(productObject, allBannersIndex, productBannerArrayIndex, productsArrayIndex) {

    this.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex].progressBar = true;

    this.makeAddToCartRequestObject(productObject);
    this.subscriberService.addToCart(this.addToCartRequestObject)
      .subscribe(data => this.handleAddToCartResponse(data, allBannersIndex, productBannerArrayIndex, productsArrayIndex),
        error => this.handleError(error));
  }

  handleAddToCartResponse(data, allBannersIndex, productBannerArrayIndex, productsArrayIndex) {
    if (data.STATUS == "OK") {
      this.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex].showAddToCart = 0;

      this.putTransactionDetailsIdInProductDetailsArray
        (allBannersIndex, productBannerArrayIndex, productsArrayIndex, data.TRANSACTION[0].TRANSACTION_DETAIL);
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.checkOnlyTransactions();

      if (this.transactionService.transactionDetailsArray.length > 0) {
        this.commonService.addTransactionIdTols();
      }

      this.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex].progressBar = false;
    }
  }

  putTransactionDetailsIdInProductDetailsArray(allBannersIndex, productBannerArrayIndex, productsArrayIndex, transactionArray) {
    let productDetailsId = 0;
    


    
    if(this.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT != undefined && this.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT.length > 0 && this.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex].PRODUCT_DETAIL != undefined && this.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex].PRODUCT_DETAIL.length > 0) this.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex].PRODUCT_DETAIL[0].PRODUCT_DETAIL_ID;
    transactionArray.forEach(element => {
      if (productDetailsId == element.PRODUCT_DETAIL_ID) {
        this.allBannersArray[allBannersIndex]
        .PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex]
        .PRODUCT[productsArrayIndex]
        .PRODUCT_DETAIL[0]
        .transactionDetailsId = element.TRANSACTION_DETAIL_ID;
      }
    });
  }

  checkOnlyTransactions() { //This will return only Products 
    let localTransactionArray = [];
    if (this.transactionService.transactionDetailsArray && this.transactionService.transactionDetailsArray.length > 0) {
      this.transactionService.transactionDetailsArray.forEach(element => {
        if (element.TRANSACTION_DETAIL_TYPE_CODE == 1) { //Because we are  also getting Delivery Charge and Convenience fee
          localTransactionArray.push(element);
        }
      });
    }
    this.transactionService.transactionDetailsArray = [];
    this.transactionService.transactionDetailsArray = localTransactionArray;
    this.refreshCart();
  }

  refreshCart() {
    this.userProfileService.numberOfProductsInCart = this.transactionService.transactionDetailsArray.length;
  }

  handleError(e) {

  }
  //Add To Cart Ends

  //Update Cart
  updateCartRequestObject = {};
  makeUpdateCartRequestObject(productObject, selectedQty) {

    

    let transactionDetails = {
      TRANSACTION_DETAIL_ID: productObject.PRODUCT_DETAIL[0].transactionDetailsId,
      PRODUCT_QUANTITY: selectedQty
    }

    let addToCartObject = {
      SUBSCRIBER_ID: +this.commonService.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
      TRANSACTION_ID: this.commonService.lsTransactionId(),
      TRANSACTION_DETAIL: transactionDetails
    }

    this.updateCartRequestObject = addToCartObject;

  }

  updateCart(productObject, allBannersIndex, productBannerArrayIndex, productsArrayIndex, selectedQty, method) {
    
    this.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex].progressBar = true;
    if (method == 1) {
      selectedQty = selectedQty + 1;
    } else {
      selectedQty = selectedQty - 1;
    }


    if (selectedQty == 0) {
      this.deleteCart(productObject.PRODUCT_DETAIL[0].transactionDetailsId, allBannersIndex, productBannerArrayIndex, productsArrayIndex);
    } else {
      this.makeUpdateCartRequestObject(productObject, selectedQty)
      this.subscriberService.updateCart(this.updateCartRequestObject).subscribe(data => this.handleUpdateCartResponse(data, allBannersIndex, productBannerArrayIndex, productsArrayIndex, selectedQty), error => this.handleError(error))
    }
  }

  handleUpdateCartResponse(data, allBannersIndex, productBannerArrayIndex, productsArrayIndex, selectedQty) {
    if (data.STATUS == "OK") {
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex].selectedQuantity = selectedQty;

      this.checkOnlyTransactions();
    }
    this.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex].progressBar = false;
  }
  //Update Cart Ends

  //Delete Cart 
  deleteCartRequestObject = {};
  makeDeleteCartRequestObject(transactionDetailId) {

    let transactionDetails = {
      TRANSACTION_DETAIL_ID: transactionDetailId,
    }

    let addToCartObject = {
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
      TRANSACTION_ID: this.commonService.lsTransactionId(),
      TRANSACTION_DETAIL: transactionDetails
    }

    this.deleteCartRequestObject = addToCartObject;

  }

  deleteCart(transactionDetailId, allBannersIndex, productBannerArrayIndex, productsArrayIndex) {
    this.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex].progressBar = true;
    this.makeDeleteCartRequestObject(transactionDetailId)

    this.subscriberService.removeFromCart(this.deleteCartRequestObject)
      .subscribe(data => this.handleDeleteCartResponse(data, allBannersIndex, productBannerArrayIndex, productsArrayIndex), error => this.handleError(error))
  }

  handleDeleteCartResponse(data, allBannersIndex, productBannerArrayIndex, productsArrayIndex) {
    if (data.STATUS == "OK") {
      this.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex].showAddToCart = 1;
      this.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex].selectedQuantity = 1;
      this.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex].transactionDetailId = 0;

      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;

      this.checkOnlyTransactions();
    }
    this.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex].progressBar = false;
  }
  //Delete Cart Ends

  emptyBannerList(){
    this.displayBanner            = false;
    this.headerBanners.length     = 0;
    this.allBannersArray.length   = 0;
    this.headerBanners            = [];
    this.allBannersArray          = [];
  }
}
