import { slide } from './../animations';
import { Component, OnInit, Input } from '@angular/core';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { Router } from '@angular/router';
import { HomePageService } from '../home-page.service';
import { SubscriberService } from '../subscriber.service';
import { TransactionsService } from '../transactions.service';
import { UserProfileService } from '../user-profile.service';
import { FlagsService } from '../flags.service';
import { ProductsMidLayerService } from '../products-mid-layer.service';
import { ConfigService } from '../config.service';
import { MyWishlistService } from '../my-wishlist.service';
import { CommonService } from '../common.service';
import { BannerService } from '../banner.service';
import { StoreService } from '../store.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  animations: [
    slide
  ]

})
export class HomepageComponent implements OnInit {
  

  constructor(
    private configService           :     ConfigService,
    private _router                 :     Router,
    private homeService             :     HomePageService,
    private subscriberService       :     SubscriberService,
    public transactionService       :     TransactionsService,
    public userProfileService       :     UserProfileService,
    private flagsService            :     FlagsService,
    public productMidLayerService   :     ProductsMidLayerService,
    public myWishlistService        :     MyWishlistService,
    public commonService            :     CommonService,
    public bannerService            :     BannerService,
    public storeService             :     StoreService,
  ) {
    
  }

  loadBannersOnScrollFlag = false;

  myFunction(){

    if( this.bannerService.calledOnScroll && !this.loadBannersOnScrollFlag && (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200)){
      this.loadBannersOnScrollFlag = true;
      this.bannerService.FetchBannerByStoreId(ApplicationConstants.BANNER_VISIBILITY_TYPE_CODE_HOME_PAGE, 0, 0, 30);
    }
  }

  imagesUrl = [];

  statusCode: number;
  storeNameByUrl : string; 

  ngOnInit() {

    this.headersHeight = this.getHeadersHeight(); // new-checklist-soln-empty-homepage

    this.storeNameByUrl = "Demo26";
    // localStorage.setItem("showBotViewCart","true")


    

    this.bannerService.calledOnScroll = true;
    window.onscroll =()=>  this.myFunction();

    this.flagsService.showSearch();
    this.flagsService.showHeaderFooter();
    if (this.flagsService.inDeliveryPageFlag) { // If user signout from delivery page then this will happen.
      window.location.reload();
    }
    this.processBar = true;
    this.checkSubscriberId();

    this.transactionService.updateTransactionIfCheckOutApiIsCalled();

    this.fetchReviewAPI();
    this.transactionService.cancelDeliverySlot();
    this.transactionService.cancelDeliverySlot();
  }

  ngAfterViewInit() {
    window.scroll(0,0);
  }


  checkStoreStatus() {

    this.processBar = true;

    this.homeService.fetchStoreByIdAPI(this.configService.getStoreID()).subscribe(data => this.handleStoreData(data),
      error => this.handleError(error));
  }

  // ngOnDestroy(){
  //   localStorage.setItem("showBotViewCart","false");
  // }

  handleStoreData(pData) {

    this.processBar = false;

    if (pData.STATUS == 'OK') {

      let storeData = pData.STORE[0];

      this.statusCode = storeData.STORE_STATUS_CODE;

      if (this.statusCode != ApplicationConstants.STORE_STATUS_CODE_ACTIVE &&
        this.statusCode != ApplicationConstants.STORE_STATUS_CODE_TESTING) {

        this._router.navigate(['store-coming-soon']);

      } else {

        // Previous functionality in the ngOnInit()
        // this.FetchHeroBannerByStoreId();
        // Rating
        for (let index = 0; index < this.starCount; index++) {
          this.ratingArr.push(index);
        }

        this.flagsService.resetFlags();
      }

    } else {

      this.handleError("Please reload the page.");
    }
  }


  //Variables
  processBar = false;
  headerBanners = [];

  quarterFooterBanners = [];
  halfFooterBanners = [];
  fullFooterBanners = [];

  footerBannerProducts = [];
  categoryBanners = [];
  brandBanners = [];
  productBanners = [];
  fetchBannerByStoreIdRequest = {};
  subscriberId = 0;

  checkSubscriberId() {
    if (this.commonService.lsSubscriberId()) this.subscriberId = + this.commonService.lsSubscriberId();

    if (this.subscriberId == 0) {
      this.temporarySubscriberLogin();
    } else {
      this.loadDefaultMethods();
    }
  }

  temporarySubscriberLogin() {
    this.processBar = true;
    this.subscriberService.tempSubscriberLogin().subscribe(data => this.handleTemporarySubscriberLoginSuccess(data), error => this.handleError(error));
  }

  handleTemporarySubscriberLoginSuccess(data) {
    if (data.STATUS == "OK") {

      let authToken = data.SUBSCRIBER.AUTHENTICATION_TOKEN;
      let subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
      let tempSubscriberFlag = 1;
      let transactionId = 0;
      this.commonService.addStoreData(authToken, subscriberId, tempSubscriberFlag, transactionId);

      this.loadDefaultMethods();
    }
  }

  loadDefaultMethods() {

    this.checkStoreStatus();
    this.myWishlistService.fetchMyWishList();

    //Banner changes 
    this.bannerService.bannerCallFromPageCode = ApplicationConstants.BANNER_CALL_FROM_HOME_PAGE;
    this.bannerService.FetchHeroBannerByStoreId(ApplicationConstants.BANNER_VISIBILITY_TYPE_CODE_HOME_PAGE, 0);
    this.bannerService.FetchBannerByStoreId(ApplicationConstants.BANNER_VISIBILITY_TYPE_CODE_HOME_PAGE, 0, 0, 3);


  }

  makeFetchHeroBannerByStoreIdRequestObject() {

    this.fetchBannerByStoreIdRequest = {
      STORE_ID: this.configService.getStoreID(),
      OFFSET: 0,
      LIMIT: 2,
      SCREEN_HEIGHT: window.innerHeight,
      SCREEN_WIDTH: window.innerWidth,
    }
  }

  FetchHeroBannerByStoreId() {

    this.makeFetchHeroBannerByStoreIdRequestObject();
    this.homeService.fetchBannerByStoreIdAPI(this.fetchBannerByStoreIdRequest).subscribe(data => this.handleFetchHeroBannerByStoreId(data), error => this.handleError(error));
  }


  handleFetchHeroBannerByStoreId(pData) {

    if (pData.STATUS = 'OK') {

      let responseArray = pData.PARENT_BANNER;

      this.allBannersArray = [];

      this.headerBanners = []; //Final Checklist
      responseArray.forEach(element => {

        let tempObject: any;

        tempObject = {};

        if (element.BANNER_DISPLAY_SEQ_NR == ApplicationConstants.HERO_BANNER_DISPLAY_SEQ_NR) { // Display Seq number 1 is always Header/Hero Banner
          let SECTION_HEIGHT_IN_PERCENTAGE = element.SECTION_HEIGHT_IN_PERCENTAGE;
          let SECTION_WIDTH_IN_PERCENTAGE = element.SECTION_WIDTH_IN_PERCENTAGE;
          element.CHILD_BANNER.forEach(element => {
            if (element.BANNER_STATUS_CODE == ApplicationConstants.STATUS_CODE_ENABLE) {
              element.SECTION_HEIGHT_IN_PERCENTAGE = SECTION_HEIGHT_IN_PERCENTAGE;
              element.SECTION_WIDTH_IN_PERCENTAGE = SECTION_WIDTH_IN_PERCENTAGE;
              this.headerBanners.push(element);
            }
          });
        }
      });

      this.FetchBannerByStoreId();

    }
    this.processBar = false;
  }

  makeFetchBannerByStoreIdRequestObject() {
    this.fetchBannerByStoreIdRequest = {
      STORE_ID: this.configService.getStoreID(),
      OFFSET: 1,
      LIMIT: 50,
      SCREEN_HEIGHT: window.innerHeight,
      SCREEN_WIDTH: window.innerWidth,
    }
  }

  FetchBannerByStoreId() {

    this.makeFetchBannerByStoreIdRequestObject();
    this.homeService.fetchBannerByStoreIdAPI(this.fetchBannerByStoreIdRequest).subscribe(data => this.handleFetchBannerByStoreId(data), error => this.handleError(error));
  }

  fullImageBanners = [];
  halfImageBanners = [];
  imageBannersMoreThanTwoInRow = [];

  fullImageWithTextBanners = [];
  halfImageWithTextBanners = [];
  imageWithTextBannersMoreThanTwoInRow = [];

  quarterVideoBanners = [];
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

      let responseArray = pData.PARENT_BANNER;

      this.allBannersArray = [];


      responseArray.forEach(element => {

        let tempObject: any;

        tempObject = {};

        console.log("element.BANNER_VISIBILITY_TYPE_CODE", element.BANNER_VISIBILITY_TYPE_CODE);

        if (element.BANNER_DISPLAY_SEQ_NR == ApplicationConstants.HERO_BANNER_DISPLAY_SEQ_NR) { // Display Seq number 1 is always Header/Hero Banner

        } else if (element.BANNER_VISIBILITY_TYPE_CODE == ApplicationConstants.BANNER_VISIBILITY_TYPE_CODE_HOME_PAGE ||
          element.BANNER_VISIBILITY_TYPE_CODE == ApplicationConstants.BANNER_VISIBILITY_TYPE_CODE_ALL_PAGES) { //else means other than Hero Banners i.e Footer Banners 

          tempObject = element;

          let SECTION_HEIGHT_IN_PERCENTAGE = element.SECTION_HEIGHT_IN_PERCENTAGE;
          let SECTION_WIDTH_IN_PERCENTAGE = element.SECTION_WIDTH_IN_PERCENTAGE;
          let NO_OF_BANNERS_IN_ROW = element.NO_OF_BANNERS_IN_ROW;
          let BANNER_DISPLAY_TYPE_CODE = element.BANNER_DISPLAY_TYPE_CODE;
          let BANNER_TYPE_CODE = element.BANNER_TYPE_CODE;

          element.CHILD_BANNER.forEach(element => {

            element.SECTION_HEIGHT_IN_PERCENTAGE = SECTION_HEIGHT_IN_PERCENTAGE;
            element.SECTION_WIDTH_IN_PERCENTAGE = SECTION_WIDTH_IN_PERCENTAGE;
            element.NO_OF_BANNERS_IN_ROW = NO_OF_BANNERS_IN_ROW;
            element.BANNER_DISPLAY_TYPE_CODE = BANNER_DISPLAY_TYPE_CODE;
            element.BANNER_TYPE_CODE = BANNER_TYPE_CODE;

            /*************/

            if (element.BANNER_TYPE_CODE == ApplicationConstants.IMAGE_BANNER_REFERENCE_TYPE_CODE) {

              if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.FULL_BANNER_DISPLAY_TYPE_CODE) this.fullImageBanners.push(element);

              if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.HALF_BANNER_DISPLAY_TYPE_CODE) this.halfImageBanners.push(element);

              if (element.NO_OF_BANNERS_IN_ROW > 2) this.imageBannersMoreThanTwoInRow.push(element);

            }
            /*************/
            /*************/

            if (element.BANNER_TYPE_CODE == ApplicationConstants.IMAGE_WITH_TEXT_BANNER_REFERENCE_TYPE_CODE) {

              console.log("element", element.BANNER_DISPLAY_TYPE_CODE);

              if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.FULL_BANNER_DISPLAY_TYPE_CODE) this.fullImageWithTextBanners.push(element);

              if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.HALF_BANNER_DISPLAY_TYPE_CODE) this.halfImageWithTextBanners.push(element);

              if (element.NO_OF_BANNERS_IN_ROW > 2) this.imageWithTextBannersMoreThanTwoInRow.push(element);

            }
            /*************/

            if (element.BANNER_TYPE_CODE == ApplicationConstants.VIDEO_BANNER_REFERENCE_TYPE_CODE) {

              //Video Banners // BANNER_TYPE_CODE = 2; // BANNER_DISPLAY_TYPE_CODE = 3 // FULL BANNER

              if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.FULL_BANNER_DISPLAY_TYPE_CODE) this.fullVideoBanners.push(element);

              //Video Banners // BANNER_TYPE_CODE = 2; // BANNER_DISPLAY_TYPE_CODE = 2 // HALF BANNER

              if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.HALF_BANNER_DISPLAY_TYPE_CODE) this.halfVideoBanners.push(element);

              //Video Banners // BANNER_TYPE_CODE = 2; // BANNER_DISPLAY_TYPE_CODE = 1 // QUARTER BANNER

              if (element.BANNER_DISPLAY_TYPE_CODE == ApplicationConstants.QUATER_BANNER_DISPLAY_TYPE_CODE) this.quarterVideoBanners.push(element);

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

        // tempObject.CHILD_BANNER = [];

        tempObject.FULL_IMAGE_BANNERS = this.fullImageBanners;
        tempObject.HALF_IMAGE_BANNERS = this.halfImageBanners;
        tempObject.IMAGE_BANNERS_MORE_THAN_TWO_IN_ROW = this.imageBannersMoreThanTwoInRow;

        tempObject.FULL_IMAGE_WITH_TEXT_BANNERS = this.fullImageWithTextBanners;
        tempObject.HALF_IMAGE_WITH_TEXT_BANNERS = this.halfImageWithTextBanners;
        tempObject.IMAGE_WITH_TEXT_BANNERS_MORE_THAN_TWO_IN_ROW = this.imageWithTextBannersMoreThanTwoInRow;

        tempObject.FULL_VIDEO_BANNERS = this.fullVideoBanners;
        tempObject.HALF_VIDEO_BANNERS = this.halfVideoBanners;
        tempObject.QUARTER_VIDEO_BANNERS = this.quarterVideoBanners;

        tempObject.FULL_CATEGORIES = this.fullCategoryBanners;
        tempObject.HALF_CATEGORIES = this.halfCategoryBanners;
        tempObject.QUARTER_CATEGORIES = this.quarterCategoryBanners;
        tempObject.CATEGORY_BANNERS_MORE_THAN_TWO_IN_ROW = this.categoryBannersMoreThanTwoInRow;

        tempObject.FULL_BRANDS = this.fullBrandBanners;
        tempObject.HALF_BRANDS = this.halfBrandBanners;
        tempObject.QUARTER_BRANDS = this.quarterBrandBanners;
        tempObject.BRAND_BANNERS_MORE_THAN_TWO_IN_ROW = this.brandBannersMoreThanTwoInRow

        let lProductsMoreThanOneInRow = [];
        if (this.productsMoreThanOneInRow.length > 0) {
          lProductsMoreThanOneInRow = this.structureProducts(this.productsMoreThanOneInRow);
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

        this.allBannersArray.push(tempObject);

        this.fullImageBanners = [];
        this.halfImageBanners = [];
        this.imageBannersMoreThanTwoInRow = [];

        this.fullImageWithTextBanners = [];
        this.halfImageWithTextBanners = [];
        this.imageWithTextBannersMoreThanTwoInRow = [];


        this.fullVideoBanners = [];
        this.halfVideoBanners = [];
        this.quarterVideoBanners = [];

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



    }
    this.processBar = false;
  }

  handleError(errorData) {

  }

  fetchReviewsRequestObject = {};
  reviewsArray = [];
  reviewImagesArray = []

  makeFetchReviewAPIRequestObject() {
    this.fetchReviewsRequestObject = {
      STORE_ID: this.configService.getStoreID(),
      // REVIEW_ID                : ApplicationConstants.REVIEW_ID,
    }
  }

  fetchReviewAPI() {
    this.makeFetchReviewAPIRequestObject();
    this.homeService.fetchReviewAPI(this.fetchReviewsRequestObject).subscribe(data => this.handleFetchReviewAPISuccess(data), error => this.handleError(error));
  }

  handleFetchReviewAPISuccess(pData) {


    this.reviewImagesArray = [];

    if (pData.STATUS = 'OK') {
      let reviews = [];

      if (pData.REVIEW && pData.REVIEW.length > 0) {
        pData.REVIEW.forEach(element => {
          if (element.REVIEW_FILE && element.REVIEW_FILE.length > 0 && element.REVIEW_FILE[0].REVIEW_IMAGE_FILE_PATH) {
            element.REVIEW_IMAGE_FILE_PATH = element.REVIEW_FILE[0].REVIEW_IMAGE_FILE_PATH;
          }
          reviews.push(element)
        });
      }

      let testreviewsArray = [];
      if (reviews.length > 0) {
        if (window.innerWidth < 601) testreviewsArray = this.make4DataInEachShellOfBannerArray(reviews, 1);
        if (window.innerWidth > 600 && window.innerWidth < 1023) testreviewsArray = this.make4DataInEachShellOfBannerArray(reviews, 3);
        if (window.innerWidth > 1023 && window.innerWidth < 1300) testreviewsArray = this.make4DataInEachShellOfBannerArray(reviews, 3);
        if (window.innerWidth > 1299) testreviewsArray = this.make4DataInEachShellOfBannerArray(reviews, 3);
      }

      this.reviewsArray = testreviewsArray;
    }

    this.processBar = false;
  }

  make4DataInEachShellOfBannerArray(pArray, noOfItemsInRow) {



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

  getProductImageName(object) {
    let imageName = "";
    if (object.PRODUCT_DETAIL[0] && object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0] && object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH != 'undefined') imageName = object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH;
    return imageName;
  }

  //Fetch Cart In Progress 
  fetchCartInProgressRequestObject = {};
  makeFetchCartInProgressObject() {
    let tempObj = {
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
    }

    this.fetchCartInProgressRequestObject = tempObj;
  }

  fetchCartInProgress() {
    this.makeFetchCartInProgressObject()

    this.subscriberService.fetchCartInProgressTransactionsBySubscriberIdAPI(this.fetchCartInProgressRequestObject)
      .subscribe(data => this.handleFetchCartInProgressResponse(data), error => this.handleError(error))
  }

  handleFetchCartInProgressResponse(data) {
    if (data.STATUS == "OK") {

      this.transactionService.transactionDetailsArray = [];
      if (data.TRANSACTION && data.TRANSACTION.length > 0) {
        data.TRANSACTION[0].TRANSACTION_DETAIL.forEach(element => {
          if (element.TRANSACTION_DETAIL_TYPE_CODE == 1) { //Because we are  also getting Delivery Charge and Convenience fee
            this.transactionService.transactionDetailsArray.push(element);
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
  //Fetch Cart In Progress ends 


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

  addToCart(productObject, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex) {

    this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].progressBar = true;

    this.makeAddToCartRequestObject(productObject);
    this.subscriberService.addToCart(this.addToCartRequestObject)
      .subscribe(data => this.handleAddToCartResponse(data, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex),
        error => this.handleError(error));
  }

  handleAddToCartResponse(data, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex) {
    if (data.STATUS == "OK") {
      this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].showAddToCart = 0;

      this.putTransactionDetailsIdInProductDetailsArray
        (allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex, data.TRANSACTION[0].TRANSACTION_DETAIL);
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.checkOnlyTransactions();

      if (this.transactionService.transactionDetailsArray.length > 0) {
        this.commonService.addTransactionIdTols();
      }

      this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].progressBar = false;
    }
  }

  putTransactionDetailsIdInProductDetailsArray(allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex, transactionArray) {
    let productDetailsId = this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].PRODUCT_DETAIL[0].PRODUCT_DETAIL_ID;
    transactionArray.forEach(element => {
      if (productDetailsId == element.PRODUCT_DETAIL_ID) {
        this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].PRODUCT_DETAIL[0].transactionDetailsId = element.TRANSACTION_DETAIL_ID;
      }
    });
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

  updateCart(productObject, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex, selectedQty, method) {
    this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].progressBar = true;
    if (method == 1) {
      selectedQty = selectedQty + 1;
    } else {
      selectedQty = selectedQty - 1;
    }

    if (selectedQty == 0) {
      this.deleteCart(productObject.PRODUCT_DETAIL[0].transactionDetailsId, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex);
    } else {
      this.makeUpdateCartRequestObject(productObject, selectedQty)
      this.subscriberService.updateCart(this.updateCartRequestObject).subscribe(data => this.handleUpdateCartResponse(data, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex, selectedQty), error => this.handleError(error))
    }
  }

  handleUpdateCartResponse(data, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex, selectedQty) {
    if (data.STATUS == "OK") {
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].selectedQuantity = selectedQty;

      this.checkOnlyTransactions();
    }
    this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].progressBar = false;
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

  deleteCart(transactionDetailId, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex) {
    this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].progressBar = true;
    this.makeDeleteCartRequestObject(transactionDetailId)

    this.subscriberService.removeFromCart(this.deleteCartRequestObject)
      .subscribe(data => this.handleDeleteCartResponse(data, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex), error => this.handleError(error))
  }

  handleDeleteCartResponse(data, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex) {
    if (data.STATUS == "OK") {
      this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].showAddToCart = 1;
      this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].selectedQuantity = 1;
      this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].transactionDetailId = 0;

      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;

      this.checkOnlyTransactions();
    }
    this.allBannersArray[allBannersIndex].QUARTER_PRODUCTS[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].progressBar = false;
  }
  //Delete Cart Ends

  // Reviews Rating 
  ratingArr = [];

  @Input('rating') public rating: number;
  @Input('starCount') public starCount = 5;



  showIcon(ratings, index: number) {
    if (ratings >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  getColor(ratings, index: number) {

    if (ratings >= index + 1) {
      return 'blue';
    } else {
      return '#FFCC36';
    }
  }

  // Reviews Rating ends

  make4DataInEachShellOfArray(pArray, noOfItemsInRow) {

    let mainArray = [];
    let sourceProductsArray = [];
    let mArray = pArray;


    if (pArray[0] && pArray[0].PRODUCT) sourceProductsArray = pArray[0].PRODUCT;


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

    if (mArray[0] && mArray[0].PRODUCT) mArray[0].PRODUCT = mainArray;


    return mArray;
  }

  getClassName(index) {
    let className = "item";
    if (index == 0) className = "item active"
    return className;
  }

  getQutClassName(index) {
    let className = "carousel-item";
    if (index == 0) className = "carousel-item active"
    return className;
  }

  getCarosuelIndicatorClass(index) {
    let className = "";
    if (index == 0) className = "active"
    return className;
  }

  getProductClassName(index) {
    let className = "carousel-item";
    if (index == 0) className = "carousel-item active"
    return className;
  }

  getCarouselClass() {
    let carouselClass = 'carouel';
    if (this.statusCode == ApplicationConstants.STORE_STATUS_CODE_TESTING) carouselClass = 'carouel-test';
    return carouselClass;
  }

  getHeaderBannerClassName(index) {
    let className = "";
    if (index == 0) className = 'active';
    return className;

  }

  getBannerHeightInPixels(heightInPercentage) {
    return (heightInPercentage * screen.availHeight) / 100;
  }

  getImageHeight(id) {
    console.log("id", id);
    if (document.getElementById(id) != null) return document.getElementById(id).offsetWidth;


  }

  getHeight(containerId, numberOfBannersInRow) {

    let obj = document.getElementById(containerId);
    let containerStyle = window.getComputedStyle(obj);
    let a = +containerStyle.paddingLeft.replace('px', '');
    let b = +containerStyle.paddingRight.replace('px', '');
    let paddingLeftAndRight: number = a + b;

    return (document.getElementById(containerId).offsetWidth / numberOfBannersInRow) - paddingLeftAndRight;
  }

  getClassForHalfBanner(bannerIndex) {
    let className = "float-right";
    if (bannerIndex % 2) className = "float-left";
    return className;
  }

  getClassNameForBannerTitleContainer(element) {
    let className = "";
    if (element.NO_OF_BANNERS_IN_ROW > 2) className = "container";
    return className;
  }

  getTestClassName(index) {
    let className = "carousel-item";
    if (index == 0) className = "carousel-item active"
    return className;
  }

  // new-checklist-soln-empty-homepage from here 
  headersHeight: number;

  getHeadersHeight() {
    let headerHeight = 60;
    let secondHeaderheight = 60;
    let additionalHeight = 0;
    if (window.innerWidth < 600) {
      let headerDomObject = document.getElementById("mobileHeader");
      if(headerDomObject){
        let headerObject = window.getComputedStyle(headerDomObject);
        if(headerObject) {
           let header = +headerObject.height.replace('px', '');
            if(header) headerHeight = header;
        }
      }
      
    } else {
      let headerDomObject = document.getElementById("firstHeader");
      if(headerDomObject){
        let headerObject = window.getComputedStyle(headerDomObject);
        if(headerObject){
          let firstHeader = +headerObject.height.replace('px', '');
          if(firstHeader) headerHeight = firstHeader;
          console.log("headerHeight", headerHeight);
        }
      }
      

      let secondHeaderDomObject = document.getElementById("secondHeader");
      if(secondHeaderDomObject){
        let secondHeaderObject = window.getComputedStyle(secondHeaderDomObject);
        if(secondHeaderObject){
          let secondHeader = +secondHeaderObject.height.replace('px', '');
          if(secondHeader) secondHeaderheight = secondHeader;
          console.log("secondHeaderheight", secondHeaderheight);
        }
      }
      additionalHeight = 80;
    }


    return (headerHeight + secondHeaderheight + additionalHeight);
  }

  getHeroBannerHeightInPixels(heightInPercentage=90) {
      let availableHeight = screen.availHeight - this.headersHeight;
      return (heightInPercentage * availableHeight) / 100;
  }

  getBannerWidthInPercentage(widthInPercentage = 90) {
      if (window.innerWidth <= 600) return 100; // In Mobile all banners will have 100% width
      return widthInPercentage;
  }

  // new-checklist-soln-empty-homepage till here

  // new-checklist-soln-for-default-banner
  isMobile(){
    let mobileView = true;
    if (window.innerWidth > 600)  mobileView = false;
    return mobileView;
  }

}
