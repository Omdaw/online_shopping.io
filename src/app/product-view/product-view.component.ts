import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { ProductService } from '../product.service';
import { SubscriberService } from '../subscriber.service';
import { TransactionsService } from '../transactions.service';
import { UserProfileService } from '../user-profile.service';
import { ProductsMidLayerService } from '../products-mid-layer.service';
import { PincodeMethodsService } from '../pincode-methods.service';
import { CommonService } from '../common.service';
import { FlagsService } from '../flags.service';
import { ConfigService } from '../config.service';
import { HomePageService } from '../home-page.service';
import { ReviewService } from '../review.service';
import { MyWishlistService } from '../my-wishlist.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CustomizationConfirmationDialog } from '../products/products.component';
import { ViewProductComponent } from '../view-product/view-product.component';

export interface iAddOnProduct {
  TRANSACTION_DETAIL_ID?: number,
  TRANSACTION_ID: number,
  STORE_ID: number,
  PRODUCT_DETAIL_ID: number,
  PRODUCT_NAME: string,
  PRODUCT_PRICE: number,
  PRODUCT_FINAL_PRICE: number,
  PRODUCT_QUANTITY: number,
  TRANSACTION_DETAIL_TYPE_CODE: number,
  ADD_ON_PRODUCT_GROUP_ID: number,
}

export interface Size {
  value: string;
  viewValue: string;
}

interface Reveiew {
  REVIEW_ID: number,
  REVIEW_TYPE_CODE: number,
  REVIEW_TYPE_NAME: string,
  APPLICATION_ID: number,
  APPLICATION_NAME: string,
  VENDOR_ID: number,
  VENDOR_NAME: string,
  STORE_ID: number,
  STORE_NAME: string,
  PRODUCT_DETAIL_ID: number,
  PRODUCT_NAME: string,
  SUBSCRIBER_ID: number,
  SUBSCRIBER_NAME: string,
  CUSTOMER_NAME: string,
  CUSTOMER_EMAIL_ID: string,
  CUSTOMER_MOBILE_NR: string,
  CUSTOMER_DESIGNATION: string,
  RATINGS: number,
  COMMENT: string,
  REVIEW_FILE_ID: number,
  REVIEW_FILE: string,
  ALT_TEXT: string,
  DISPLAY_SEQ_NR: number,
  REVIEW_IMAGE_PATH: string,
  REVIEW_IMAGE_FILE_PATH: string,
  STATUS_CODE: number,
  STATUS_NAME: string,
  CREATED_DATE: string,
  LAST_MODIFIED_DATE: string
}

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {

  sizes: Size[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' }
  ];

  //AddOns Dialog
  link: string;
  openAddonDialog(): void {
    const dialogRef = this.dialog.open(AddonDialog, {
      width: '700px',
      data: this.productsDetailObject
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  //AddOns ends

  onAddToCartButtonClick() {
    this.productsDetailObject.buyNowClickedNavigateToCart = false;
    if (this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP && this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.length > 0) {
      this.openAddonDialog();
    } else {
      this.addToCart();
    }
  }

  //Customization confirmation Dialog
  cLink: string;
  openCustomizationConfirmationPopup(): void {

    let recentTransactionDetailObject = this.getRecentTransactionDetailObject();
    const dialogRef = this.dialog.open(CustomizationConfirmationDialog, {
      width: '700px',
      data: recentTransactionDetailObject
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  //Customization confirmation dialog ends

  getRecentTransactionDetailObject() {
    let transactionDetailArray = this.transactionService.transactionDetailsArray;
    let recentTransactionDetailId = 0;
    let recentTransactionDetailObject = {};

    if (transactionDetailArray && transactionDetailArray.length > 0) {
      transactionDetailArray.forEach(transactionDetailObject => {
        let tProductDetailId = transactionDetailObject.PRODUCT_DETAIL_ID;
        let tTransactionDetailId = transactionDetailObject.TRANSACTION_DETAIL_ID;

        // if(pProductObject.PRODUCT_DETAIL && pProductObject.PRODUCT_DETAIL.length > 0){
        // pProductObject.PRODUCT_DETAIL.forEach(productDetailObject => {
        // let pProductDetailId = productDetailObject.PRODUCT_DETAIL_ID;
        if (tProductDetailId == this.productsDetailObject.PRODUCT_DETAIL_ID) {
          if (tTransactionDetailId > recentTransactionDetailId) {
            recentTransactionDetailId = tTransactionDetailId;
            recentTransactionDetailObject = transactionDetailObject;
          }
        }
        // });
        // }

      });
    }


    return recentTransactionDetailObject;
  }

  constructor(private configService: ConfigService,
    private _router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private subscriberService: SubscriberService,
    private reviewService: ReviewService,
    public transactionService: TransactionsService,
    private userProfileService: UserProfileService,
    public productMidLayerService: ProductsMidLayerService,
    public pincodeMethods: PincodeMethodsService,
    public commonService: CommonService,
    public flagsService: FlagsService,
    public myWishlistService: MyWishlistService,
    public homepageService: HomePageService,
    public dialog: MatDialog) { }

  panelOpenState = false;
  //variables
  sellerDetail: string;
  ratingsAverage: number;
  processBar = false;
  fetchProductRequestObject = {};
  productsDetailObject: any;//= {PRODUCT_IMAGE:"", SELLING_PRICE : 0, COMPARE_AT_PRICE : 0,PRODUCT_DETAIL_REVIEW_VALUE : 0};
  productObject: any = { PRODUCT_CATEGORY_ID: 0, PRODUCT_CATEGORY_NAME: "", PRODUCT_BRAND_NAME: "", PRODUCT_NAME: "", PRODUCT_DESC: "" };
  productArray = [];
  productId = 0;
  sizePresent = false;
  colorPresent = false;
  quantityDropdownValues = [];
  selectedQuantity = 1;
  selectedProductDetailId = 0;
  subscriberDetailsObject = { SUBSCRIBER_ID: 0 };
  fetchCartInProgressRequestObject = {};
  showAddToCart = 1;

  showSoldOut = 0;
  showUnavailable = 0;

  transactionId = this.commonService.lsTransactionId();
  transactionDetailsId = 0;
  addToCartRequestObject = {};
  selectedProductIndex = 0;

  updateCartRequestObject = {};
  deleteCartRequestObject = {};

  buyNowClickedNavigateToCart = 0;

  dSelectedSize = "s3";

  iFrameUrlForFacebook = "";


  additionalInfo: any = [];
  relatedProducts: any = [];

  productDetailIdByParam = 0; //Checklist-3 (Point-1)

  ngOnInit() {
    window.scrollTo(0, 0);
    this.flagsService.showSearch();
    this.flagsService.showHeaderFooter();
    if (window.innerWidth < 600) {
      this.flagsService.hideFooter();
    }

    this.iFrameUrlForFacebook = "https://www.facebook.com/plugins/share_button.php?href=" + this.route.url;
    this.GetProductIdByParam();
    // this.fetchProductByProductId();
    this.checkSubscriberId();
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.productId = +params['id'];
        this.productDetailIdByParam = +params['product_detail_id']; //Checklist-3 (Point-1)
        this.GetProductIdByParam(); //Checklist-3 (Point-1) -- this is cut paste
        this.checkSubscriberId(); //Checklist-3 (Point-1) -- this is cut paste
        this.fetchCartInProgress();
      }
    });

    this.myWishlistService.fetchMyWishList();
    this.loadData();
  }

  GetProductIdByParam() {
    this.route.params.subscribe(params => {
      if (params['id'] != undefined) {
        this.productId = +params['id'];
      }

      if (params['product_detail_id'] != undefined && params['product_detail_id'] != 0) {
        this.selectedProductDetailId = +params['product_detail_id'];
      }
    });
  }

  loadData() {

    this.fetchRatingsData();
    this.fetchStoreDetails(this.configService.getStoreID());
  }

  storeName: string;
  addressArea: string;
  addressCity: string;
  addressState: string;
  addressCountry: string;

  reviewDataArray = [];

  fetchRatingsData() {

    if (this.selectedProductDetailsId > 0) {

      this.processBar = true;

      let requestParams = {
        PRODUCT_DETAIL_ID: this.selectedProductDetailsId
      }

      this.reviewService.fetchReviewAPI(requestParams)
        .subscribe(data => this.handleReviewData(data),
          error => this.handleError(error))
    }
  }

  handleReviewData(pData) {

    if (pData.STATUS == "OK") {

      let reviewArray = pData.REVIEW;

      this.reviewDataArray = pData.REVIEW;

      let totalRatings = 0;

      for (let index = 0; index < reviewArray.length; index++) {

        let reviewObj: Reveiew = reviewArray[index];

        totalRatings += reviewObj.RATINGS;
      }
      this.ratingsAverage = Math.round(totalRatings / pData.TOTAL_COUNT * 10) / 10;
    }
    this.processBar = false;
  }

  fetchStoreDetails(pStoreId) {

    this.homepageService.fetchStoreByIdAPI(pStoreId)
      .subscribe(data => this.handleStoreData(data),
        error => this.handleError(error))
  }

  handleStoreData(pData) {
    if (pData.STATUS == "OK") {

      let storeObj = pData.STORE[0];

      this.storeName = storeObj.STORE_NAME;
      this.addressArea = storeObj.STORE_ADDRESS_AREA_NAME;
      this.addressCity = storeObj.STORE_ADDRESS_CITY_NAME;
      this.addressState = storeObj.STORE_ADDRESS_STATE_NAME;
      this.addressCountry = storeObj.STORE_ADDRESS_COUNTRY_NAME;
    }
  }

  makefetchProductByProductIdObject() {
    this.fetchProductRequestObject = {
      STORE_ID      : this.configService.getStoreID(),
      SUBSCRIBER_ID : this.commonService.lsSubscriberId(),
      PRODUCT_ID    : this.productId,
      STATUS_CODE   : ApplicationConstants.STATUS_CODE_ENABLE
    }
  }

  fetchProductByProductId() {
    this.processBar = true;
    this.makefetchProductByProductIdObject();
    this.productService.fetchProductByProductId(this.fetchProductRequestObject).subscribe(data => this.handleFetchProductByProductIdSuccess(data), error => this.handleError(error));
  }

  productImageWithPathArray: any = [];
  handleFetchProductByProductIdSuccess(pData) {

    if (pData.STATUS = 'OK') {

      this.productObject = pData.PRODUCT[0];

      this.productArray = pData.PRODUCT;

      this.productsDetailObject = pData.PRODUCT[0].PRODUCT_DETAIL[this.productDetailsIndex];

      this.productImageWithPathArray = pData.PRODUCT[0].PRODUCT_DETAIL[this.productDetailsIndex].PRODUCT_IMAGE;

      if (pData.PRODUCT[0].PRODUCT_DETAIL.length > 0 &&
        pData.PRODUCT[0].PRODUCT_DETAIL[0].PRODUCT_IMAGE &&
        pData.PRODUCT[0].PRODUCT_DETAIL[0].PRODUCT_IMAGE.length > 0 &&
        pData.PRODUCT[0].PRODUCT_DETAIL[0].PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH) {
        this.imageUrl = pData.PRODUCT[0].PRODUCT_DETAIL[this.productDetailsIndex].PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH;
      }
      this.additionalInfo = pData.PRODUCT[0].PRODUCT_DETAIL[this.productDetailsIndex].ADDITIONAL_INFO;
      this.checkProductExistsInTransaction();

      this.dropdownLabelsObject = pData.PRODUCT_LABEL;

      this.makeDropdowns(pData.PRODUCT[0]);

      // stop the progress bar
      this.processBar = false;
    }
  }

  structureProducts(tempArray) {

    console.log("tempArray", tempArray)

    let relatedProds = tempArray;
    let productsArray = [];

    if (relatedProds && relatedProds.length > 0) {
      relatedProds.forEach(element => {
        if (element.PRODUCT_DETAIL) {
          element.showAddToCart = 1;
          element.selectedQuantity = 1;

          this.transactionService.transactionDetailsArray.forEach(transaction => {
            if (element.PRODUCT_DETAIL && element.PRODUCT_DETAIL.PRODUCT_DETAIL_ID == transaction.PRODUCT_DETAIL_ID) {
              element.showAddToCart = 0;
              element.selectedQuantity = transaction.PRODUCT_QUANTITY;
              element.PRODUCT_DETAIL.transactionDetailsId = transaction.TRANSACTION_DETAIL_ID;
              element.progressBar = false;
            }
          });
          productsArray.push(element);
        }
      });
    }

    relatedProds = productsArray;
    return relatedProds;
  }

  make4DataInEachShellOfArray(pArray, noOfItemsInRow) {

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

    if (mArray.length > 0) mArray = mainArray;


    return mArray;
  }


  handleError(error) {

  }

  productDetailsIndex = 0;
  checkProductExistsInTransaction() {

    this.showAddToCart = 1;
    this.selectedQuantity = 1;

    this.transactionService.transactionDetailsArray.forEach(element => {
      if (this.productArray[0].PRODUCT_DETAIL[this.productDetailsIndex].PRODUCT_DETAIL_ID == element.PRODUCT_DETAIL_ID) {
        this.showAddToCart = 0;
        this.selectedQuantity = element.PRODUCT_QUANTITY;
        this.productArray[0].PRODUCT_DETAIL[this.productDetailsIndex].transactionDetailsId = element.TRANSACTION_DETAIL_ID;
        this.transactionDetailsId = element.TRANSACTION_DETAIL_ID;
      }
    });
  }

  // gotoSingleProductPage(sizeId, colorId){
  //   if(sizeId != 0) this.selectedSize = sizeId;
  //   if(colorId != 0) this.selectedColor = colorId;
  //   this._router.navigate(['product-view/'+this.productId+ '/' +this.selectedSize+ '/' +this.selectedColor]);   
  // }

  // gotoProductPageByProductDetailId(event, pProductDetailsId){
  //   if (event.target) {
  //     this._router.navigate(['product-view/'+this.productId+ '/' +pProductDetailsId]);  
  //     this.selectedProductDetailId = pProductDetailsId; 
  //     this.makeDataBasedOnQuantity(this.productObject);
  //   }
  // }

  makeQuantityDropdown(data) {
    data.forEach(element => {

      let tempObj = {
        productDetailsId: element.PRODUCT_DETAIL_ID,
        unit: element.UNIT,
        unitTypeName: element.UNIT_TYPE_NAME,
        unitTypeCode: element.UNIT_TYPE_CODE
      }
      this.quantityDropdownValues.push(tempObj);

    });
  }

  makeDataBasedOnQuantity(pData) {
    pData.PRODUCT_DETAIL.forEach(element => {
      if (this.selectedProductDetailId == element.PRODUCT_DETAIL_ID) {
        this.productImageWithPathArray = element.PRODUCT_IMAGE;

        this.productsDetailObject = element;
      }
    });
  }

  makeProductColorsDropdown(pData) {
    pData.PRODUCT_DETAIL.forEach(element => {
      let tempObj = {
        productDetailsId: element.PRODUCT_DETAIL_ID,
        color: element.PRODUCT_COLOR,
      };

      if (this.colorDropdownValues.find((tempObj) => tempObj.color === element.PRODUCT_COLOR) === undefined) {
        if (element.PRODUCT_COLOR != '' && element.PRODUCT_COLOR != 'null') this.colorDropdownValues.push(tempObj);
      }
    });

    if (this.colorDropdownValues.length > 0 && this.selectedColor == '') this.selectedColor = this.colorDropdownValues[0].value;
  }

  makeSizesDropdown(pData) {
    pData.PRODUCT_DETAIL.forEach(element => {
      let tempObj = {
        productDetailsId: element.PRODUCT_DETAIL_ID,
        size: element.SIZE,
      }

      if (this.sizeDropdownValues.find((tempObj) => tempObj.size === element.SIZE) === undefined) {
        if (element.SIZE != '' && element.SIZE != 'null') this.sizeDropdownValues.push(tempObj);
      }
    });
    if (this.sizeDropdownValues.length > 0 && this.selectedSize == '') this.selectedSize = this.sizeDropdownValues[0].value;
  }

  onSizeChange(size) {
    this.selectedSize = size;
    this.onVariantChange();
    this.makeColorDropdowns(); //#variantLogic
  }

  onColorChange(size) {
    this.selectedColor = size;
    this.onVariantChange();
    this.makeMaterialDropdowns(); //#variantLogic
  }

  onMaterialChange(size) {
    this.selectedMaterial = size;
    this.onVariantChange();
  }

  onVariantChange() {
    this.getProductDetailsBasedOnColorSizeMaterialCombination();
  }

  getSizeClassName(size) {
    let className = "_2UBURg";
    if (size == this.selectedSize) className = "selectedVariant";
    return className;
  }

  getColorClassName(size) {
    let className = "_2UBURg";
    if (size == this.selectedColor) className = "selectedVariant";
    return className;
  }

  getMaterialClassName(size) {
    let className = "_2UBURg";
    if (size == this.selectedMaterial) className = "selectedVariant";
    return className;
  }

  selectedProductDetailsId: number;

  getProductDetailsBasedOnColorSizeMaterialCombination() {

    let productDetailsIndex = 0;
    let combinationAvailable = 0;
    let available = 1;

    this.productArray[0].PRODUCT_DETAIL.forEach(element => {
      if (element.PRODUCT_COLOR == this.selectedColor
        && element.SIZE == this.selectedSize
        && element.MATERIAL == this.selectedMaterial) {
        if (element.AVAILABLE_QUANTITY == 0) available = 0;
        this.productsDetailObject = element;
        this.productDetailsIndex = productDetailsIndex;

        this.sellerDetail = element.SELLER_DETAIL

        this.selectedProductDetailsId = element.PRODUCT_DETAIL_ID;
        if (element.PRODUCT_IMAGE &&
          element.PRODUCT_IMAGE.length > 0 &&
          element.PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH) {
          this.imageUrl = element.PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH; //Checklist-3 
        }

        this.imagesArray = element.PRODUCT_IMAGE; //Checklist-3 
        this.additionalInfo = element.ADDITIONAL_INFO;
        let relatedProducts = [];
        if (element.RELATED_PRODUCTS_DETAIL) relatedProducts = element.RELATED_PRODUCTS_DETAIL;

        let relProducts = this.structureProducts(relatedProducts);

        let array = [];

        if (relProducts.length > 0) {
          if (window.innerWidth <= 600) {
            array = this.make4DataInEachShellOfArray(relProducts, 2);
          } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
            array = this.make4DataInEachShellOfArray(relProducts, 3);
          } else if (window.innerWidth >= 1024 && window.innerWidth < 1365) {
            array = this.make4DataInEachShellOfArray(relProducts, 4);
          } else {
            array = this.make4DataInEachShellOfArray(relProducts, 4);
          }
        }

        this.relatedProducts = array;

        console.log("this.relatedProducts", this.relatedProducts);

        this.checkProductExistsInTransaction();

        combinationAvailable = 1;
      }

      productDetailsIndex++;
    });


    this.showUnavailable = 0
    if (combinationAvailable == 0) {
      this.showAddToCart = 0;
      this.showUnavailable = 1;
      this.showSoldOut = 0;
    }

    if (available == 0) {
      this.showSoldOut = 1;
      this.showAddToCart = 0;
      this.showUnavailable = 0;
    }

    if (combinationAvailable == 1 && this.productsDetailObject && this.productsDetailObject.PRODUCT_IMAGE && this.productsDetailObject.PRODUCT_IMAGE.length > 0) {
      this.productImageWithPathArray = this.productsDetailObject.PRODUCT_IMAGE;
    } else {
      this.showDummyImage();
    }

    this.fetchRatingsData();
  }

  showDummyImage() {
    let tempArray = [];
    let tempObject = {
      PRODUCT_IMAGE_PATH: "http://noqsystem.com:60010/noqbase",
      PRODUCT_IMAGE_FILE: "image_coming_soon.png"
    }
    tempArray.push(tempObject);
    this.productImageWithPathArray = tempArray;
  }

  getSizeDropdownValuesBasedColor(color) {
    let pData = this.productArray[0];
    pData.PRODUCT_DETAIL.forEach(element => {
      if (element.PRODUCT_COLOR == color) {
        let tempObj = {
          productDetailsId: element.PRODUCT_DETAIL_ID,
          size: element.SIZE,
        }

        if (this.sizeDropdownValues.find((tempObj) => tempObj.size === element.SIZE) === undefined) {
          if (element.SIZE != '') this.sizeDropdownValues.push(tempObj);
        }
      }
    });
    if (this.selectedSize == '') this.selectedSize = this.sizeDropdownValues[0].value;
  }

  checkSubscriberId() {
    let subscriberId = 0;
    if (this.commonService.lsSubscriberId()) subscriberId = + this.commonService.lsSubscriberId();

    if (subscriberId == 0) {
      this.temporarySubscriberLogin();
    } else {
      this.fetchCartInProgress();
    }
  }

  temporarySubscriberLogin() {
    this.subscriberService.tempSubscriberLogin().subscribe(data => this.handleTemporarySubscriberLoginSuccess(data), error => this.handleError(error));
  }


  handleTemporarySubscriberLoginSuccess(data) {
    if (data.STATUS == "OK") {

      let authToken = data.SUBSCRIBER.AUTHENTICATION_TOKEN;
      let subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
      let tempSubscriberFlag = 1;
      let transactionId = 0;
      this.commonService.addStoreData(authToken, subscriberId, tempSubscriberFlag, transactionId);

      this.subscriberDetailsObject = data.SUBSCRIBER;
      this.fetchCartInProgress();
    }
  }

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
      }

      this.fetchProductByProductId();
    }
    this.processBar = false;

  }

  //Add To Cart
  makeAddToCartRequestObject() {

    let transactionId = 0;
    if (this.commonService.lsTransactionId()) { transactionId = + this.commonService.lsTransactionId(); }

    let productDetailObject = this.productArray[0].PRODUCT_DETAIL[this.productDetailsIndex];

    let transactionDetailsId = 0;

    if (productDetailObject.transactionDetailsId) transactionDetailsId = productDetailObject.transactionDetailsId

    let transactionDetails = {
      TRANSACTION_DETAIL_ID: transactionDetailsId,
      TRANSACTION_ID: transactionId,
      PRODUCT_DETAIL_ID: productDetailObject.PRODUCT_DETAIL_ID,
      PRODUCT_NAME: this.productArray[0].PRODUCT_NAME,
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
      TRANSACTION_DETAIL_TYPE_CODE: 1,
    }

    let addToCartObject = {
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
      TRANSACTION_ID: transactionId,
      TRANSACTION_DETAIL: transactionDetails
    }

    this.addToCartRequestObject = addToCartObject;

  }
  singleProductPageProcessBar = false;
  addToCart() {
    this.singleProductPageProcessBar = true;
    this.makeAddToCartRequestObject();
    this.subscriberService.addToCart(this.addToCartRequestObject).subscribe(data => this.handleAddToCartResponse(data), error => this.handleError(error));
  }

  handleAddToCartResponse(data) {
    if (data.STATUS == "OK") {
      this.showAddToCart = 0;


      this.putTransactionDetailsIdInProductsArray(data.TRANSACTION[0].TRANSACTION_DETAIL)
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.checkOnlyTransactions();
      if (data.TRANSACTION[0].TRANSACTION_DETAIL[0].TRANSACTION_ID > 0) {
        this.commonService.addTransactionIdTols();
        this.transactionId = data.TRANSACTION[0].TRANSACTION_ID;
      }
    }
    this.singleProductPageProcessBar = false;
  }

  putTransactionDetailsIdInProductsArray(transactionArray) {
    let productDetailsId = this.productArray[0].PRODUCT_DETAIL[this.productDetailsIndex].PRODUCT_DETAIL_ID;
    transactionArray.forEach(element => {
      if (productDetailsId == element.PRODUCT_DETAIL_ID) {
        this.productArray[0].PRODUCT_DETAIL[this.productDetailsIndex].transactionDetailsId = element.TRANSACTION_DETAIL_ID;
      }
    });
  }
  //Add To Cart Ends

  //Update Cart
  makeUpdateCartRequestObject(selectedQty) {
    let transactionDetails = {
      TRANSACTION_DETAIL_ID: this.productArray[0].PRODUCT_DETAIL[this.productDetailsIndex].transactionDetailsId,
      PRODUCT_QUANTITY: selectedQty
    }

    let tempObj = {
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
      TRANSACTION_ID: this.commonService.lsTransactionId(),
      TRANSACTION_DETAIL: transactionDetails
    }

    this.updateCartRequestObject = tempObj;

  }

  updateCart(selectedQty, method) {
    this.singleProductPageProcessBar = true;
    if (method == 1) {
      selectedQty = selectedQty + 1;
    } else {
      selectedQty = selectedQty - 1;
    }

    if (selectedQty == 0) {
      this.deleteCart();
    } else {
      this.makeUpdateCartRequestObject(selectedQty)
      this.subscriberService.updateCart(this.updateCartRequestObject).subscribe(data => this.handleUpdateCartResponse(data, selectedQty), error => this.handleError(error))
    }
  }

  handleUpdateCartResponse(data, selectedQty) {
    if (data.STATUS == "OK") {
      this.productArray[0].selectedQuantity = selectedQty;
      this.selectedQuantity = selectedQty;
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.checkOnlyTransactions();
    }
    this.singleProductPageProcessBar = false;
  }
  //Update Cart Ends

  //Delete Cart 
  makeDeleteCartRequestObject() {

    let transactionDetails = {
      TRANSACTION_DETAIL_ID: this.productArray[0].PRODUCT_DETAIL[this.productDetailsIndex].transactionDetailsId,
    }

    let addToCartObject = {
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
      TRANSACTION_ID: this.commonService.lsTransactionId(),
      TRANSACTION_DETAIL: transactionDetails
    }

    this.deleteCartRequestObject = addToCartObject;

  }

  deleteCart() {
    this.singleProductPageProcessBar = true;
    this.makeDeleteCartRequestObject()

    this.subscriberService.removeFromCart(this.deleteCartRequestObject).subscribe(data => this.handleDeleteCartResponse(data), error => this.handleError(error))
  }

  handleDeleteCartResponse(data) {
    if (data.STATUS == "OK") {
      this.showAddToCart = 1;
      this.selectedQuantity = 1;
      this.transactionDetailsId = 0;
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.checkOnlyTransactions();
    }
    this.singleProductPageProcessBar = false;
  }
  //Delete Cart Ends

  //Buy Now
  buyNow() {
    this.buyNowClickedNavigateToCart = 1;
    this.productsDetailObject.buyNowClickedNavigateToCart = true;
    // this.addToCart();
    if (this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP && this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.length > 0) {
      this.openAddonDialog();
    } else {
      this.addToCart();
    }
  }



  //Making Dropdowns Logic starts here
  colorDropdownValues = [];
  sizeDropdownValues = [];
  materialDropdownValues = [];

  selectedSize = "null";
  selectedColor = "null";
  selectedMaterial = "null";

  dropdownLabelsObject = {
    SIZE_LABEL: "",
    PRODUCT_COLOR_LABEL: "",
    MATERIAL_LABEL: ""

  };

  makeDropdowns(pData) {
    let productDetailsObject: any; //Checklist-3 (Point-1)

    pData.PRODUCT_DETAIL.forEach(element => {

      //Checklist-3 (Point-1) from here 
      if (element.PRODUCT_DETAIL_ID == this.productDetailIdByParam) {
        productDetailsObject = element;
      }
      //Checklist-3 (Point-1) to here

      if (element.PRODUCT_DETAIL_ID == this.productDetailIdByParam) {
        productDetailsObject = element;
      }



      //Product Size Dropdown 
      if (element.SIZE_LABEL != "" && element.SIZE_LABEL != 'null' && element.SIZE != "" && element.SIZE != 'null') {

        let item = { value: element.SIZE };
        if (this.sizeDropdownValues.find((test) => test.value === element.SIZE) === undefined) {
          this.sizeDropdownValues.push(item);
        }

      }

      //Product Size Dropdown Ends

      //Product Color Dropdown 
      if (element.PRODUCT_COLOR_LABEL != ""
        && element.PRODUCT_COLOR_LABEL != 'null'
        && element.PRODUCT_COLOR != ""
        && element.PRODUCT_COLOR != 'null') {

        let item = { value: element.PRODUCT_COLOR };
        if (this.colorDropdownValues.find((test) => test.value === element.PRODUCT_COLOR) === undefined) {
          this.colorDropdownValues.push(item);
        }

      }

      //Product Color Dropdown Ends 

      //Product Material Dropdown 
      if (element.MATERIAL_LABEL != "" && element.MATERIAL_LABEL != 'null' && element.MATERIAL != 'null' && element.MATERIAL != "") {


        let item = { value: element.MATERIAL };
        if (this.materialDropdownValues.find((test) => test.value === element.MATERIAL) === undefined) {
          this.materialDropdownValues.push(item);
        }

      }

      //Product Material Dropdown Ends

    });





    // Checklist-3(Point-1) from here 

    // if(this.sizeDropdownValues.length > 0 ) this.selectedSize = this.sizeDropdownValues[0].value;
    // if(this.colorDropdownValues.length > 0 ) this.selectedColor = this.colorDropdownValues[0].value;
    // if(this.materialDropdownValues.length > 0 ) this.selectedMaterial = this.materialDropdownValues[0].value;


    if (this.sizeDropdownValues.length > 0) this.selectedSize = productDetailsObject.SIZE;
    // if(this.colorDropdownValues.length > 0 )      this.selectedColor        = productDetailsObject.PRODUCT_COLOR;
    this.makeColorDropdowns();
    // if(this.materialDropdownValues.length > 0 )   this.selectedMaterial     = productDetailsObject.MATERIAL;
    this.makeMaterialDropdowns();
    // Checklist-3(Point-1) to here 
    this.getProductDetailsBasedOnColorSizeMaterialCombination();


  }

  // variant logic changes from here 

  makeColorDropdowns() {
    let lProductDetailsObject: any; //Checklist-3 (Point-1)
    this.colorDropdownValues = [];
    this.productObject.PRODUCT_DETAIL.forEach(element => {


      if (element.PRODUCT_DETAIL_ID == this.productDetailIdByParam) {
        lProductDetailsObject = element;
      }



      //Product Color Dropdown 
      if (this.selectedSize == element.SIZE
        && element.PRODUCT_COLOR_LABEL != ""
        && element.PRODUCT_COLOR_LABEL != 'null'
        && element.PRODUCT_COLOR != ""
        && element.PRODUCT_COLOR != 'null') {
        let item = { value: element.PRODUCT_COLOR };
        if (this.colorDropdownValues.find((test) => test.value === element.PRODUCT_COLOR) === undefined) {
          this.colorDropdownValues.push(item);
        }

      }
      //Product Color Dropdown Ends   
    });

    if (this.colorDropdownValues.length > 0) this.selectedColor = this.colorDropdownValues[0].value;
    this.getProductDetailsBasedOnColorSizeMaterialCombination();
  }

  makeMaterialDropdowns() {
    let lProductDetailsObject: any; //Checklist-3 (Point-1)
    this.materialDropdownValues = [];
    this.productObject.PRODUCT_DETAIL.forEach(element => {


      if (element.PRODUCT_DETAIL_ID == this.productDetailIdByParam) {
        lProductDetailsObject = element;
      }



      //Product Color Dropdown 
      if (
        this.selectedSize == element.SIZE
        && this.selectedColor == element.PRODUCT_COLOR
        && element.MATERIAL_LABEL != ""
        && element.MATERIAL_LABEL != 'null'
        && element.MATERIAL != ""
        && element.MATERIAL != 'null') {
        let item = { value: element.MATERIAL };
        if (this.materialDropdownValues.find((test) => test.value === element.MATERIAL) === undefined) {
          this.materialDropdownValues.push(item);
        }

      }
      //Product Material Dropdown Ends   
    });

    if (this.materialDropdownValues.length > 0) this.selectedMaterial = this.materialDropdownValues[0].value;
    this.getProductDetailsBasedOnColorSizeMaterialCombination();
  }
  // variant logic changes to here  #variantLogic
  //Making Dropdowns Logic ends here

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
    // if (this.buyNowClickedNavigateToCart == 1) this._router.navigate(['/collections/checkout-new']);

    if (this.buyNowClickedNavigateToCart == 1) {
      if (window.innerWidth < 600) {
        if (this.commonService.isSubscriberLoggedIn()) {
          this._router.navigate(['/collections/checkout-new'], { replaceUrl: true });
        } else {
          this._router.navigate(['/collections/checkout-new-login']);
        }
      } else {
        this._router.navigate(['/collections/checkout-new'], { replaceUrl: true });
      }
    }
  }

  selectColor(color) {
    return color;
  }

  imageUrl = "";
  imagesArray = [];
  displayImage(image) {
    this.imageUrl = image;
  }

  //Share Product hide/show 
  displaySharingIcons = false;

  displaySocialIconsFunction() {
    this.displaySharingIcons = true;
  }

  hideSocialIconsFunction() {
    this.displaySharingIcons = false;
  }

  pincode = 0;
  estimateDelivery() {
    this.pincodeMethods.checkDeliveryLocationPincodeAPIRequestObject.PINCODE = this.pincode;
    this.pincodeMethods.checkDeliveryLocationPincodeAPI();
  }

  getImageCarouselClassName(index) {
    let className = "";
    if (index == 0) className = "active";
    return className;
  }

  getClassName(index) {
    let className = "carousel-item";
    if (index == 0) className = "carousel-item active"
    return className;
  }

  getItemClassName(index) {
    let className = "item";
    if (index == 0) className = "item active"
    return className;
  }

  getQutClassName(index) {
    let className = "carousel-item";
    if (index == 0) className = "carousel-item active"
    return className;
  }

  getProductImageName(object) {
    let imageName = "";
    if (object.PRODUCT_DETAIL && object.PRODUCT_DETAIL.PRODUCT_IMAGE[0] && object.PRODUCT_DETAIL.PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH != 'undefined') imageName = object.PRODUCT_DETAIL.PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH;
    return imageName;
  }


  public showAddToCartForSlidingProds(productObject, index = 0) {
    let showAddToCart = true;

    this.transactionService.transactionDetailsArray.forEach(transaction => {
      if (productObject.PRODUCT_DETAIL && productObject.PRODUCT_DETAIL.PRODUCT_DETAIL_ID == transaction.PRODUCT_DETAIL_ID) {
        showAddToCart = false;
      }
    });
    return showAddToCart;
  }

  public getSelectedQty(productObject, index = 0) {
    let selectedQty = 1;
    this.transactionService.transactionDetailsArray.forEach(transaction => {
      if (productObject.PRODUCT_DETAIL[index] && productObject.PRODUCT_DETAIL[index].PRODUCT_DETAIL_ID == transaction.PRODUCT_DETAIL_ID) {
        selectedQty = transaction.PRODUCT_QUANTITY;
        //  element.PRODUCT_DETAIL[0].transactionDetailsId = transaction.TRANSACTION_DETAIL_ID;
      }
    });
    return selectedQty;
  }

  public showOutofStock(productObject, index = 0) {
    let showOutOfStock = false;
    if (productObject.PRODUCT_DETAIL && productObject.PRODUCT_DETAIL.INVENTORY_POLICY == 2 && productObject.PRODUCT_DETAIL.AVAILABLE_QUANTITY <= 0) showOutOfStock = true;
    return showOutOfStock;
  }


  //Add related products To Cart
  addRelatedProductsToCartRequestObject = {};
  rTransactionDetailsId = 0;
  makeAddRelatedProductsToCartRequestObject(productObject) {
    let transactionId = 0;
    if (this.commonService.lsTransactionId()) { transactionId = + this.commonService.lsTransactionId(); }
    let productDetailObject = productObject.PRODUCT_DETAIL;
    let transactionDetails = {
      TRANSACTION_DETAIL_ID: this.rTransactionDetailsId,
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
      TRANSACTION_DETAIL_TYPE_CODE: 1,
    }

    let addToCartObject = {
      SUBSCRIBER_ID: + this.commonService.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
      TRANSACTION_ID: transactionId,
      TRANSACTION_DETAIL: transactionDetails
    }

    this.addRelatedProductsToCartRequestObject = addToCartObject;

  }

  addRelatedProductsToCart(productObject, rowIndex, prodIndex) {

    this.relatedProducts[rowIndex][prodIndex].progressBar = true;

    this.makeAddRelatedProductsToCartRequestObject(productObject);
    this.subscriberService.addToCart(this.addRelatedProductsToCartRequestObject)
      .subscribe(data => this.handleAddRelatedProductsToCartResponse(data, rowIndex, prodIndex),
        error => this.handleError(error));
  }

  handleAddRelatedProductsToCartResponse(data, rowIndex, prodIndex) {
    if (data.STATUS == "OK") {
      this.relatedProducts[rowIndex][prodIndex].showAddToCart = 0;

      if (this.transactionService.transactionDetailsArray.length > 0) {
        this.commonService.addTransactionIdTols();
      }

      this.putTransactionDetailsIdInProductDetailsArray(rowIndex, prodIndex, data.TRANSACTION[0].TRANSACTION_DETAIL);
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.checkOnlyTransactions();
      this.relatedProducts[rowIndex][prodIndex].progressBar = false;
    }
  }

  putTransactionDetailsIdInProductDetailsArray(rowIndex, prodIndex, transactionArray) {
    let productDetailsId = this.relatedProducts[rowIndex][prodIndex].PRODUCT_DETAIL.PRODUCT_DETAIL_ID;
    transactionArray.forEach(element => {
      if (productDetailsId == element.PRODUCT_DETAIL_ID) {
        this.relatedProducts[rowIndex][prodIndex].PRODUCT_DETAIL.transactionDetailsId = element.TRANSACTION_DETAIL_ID;
      }
    });
  }
  //Add related products To Cart Ends

  //Update related products 
  updateCartRelatedProductsRequestObject = {};
  makeUpdateCartRelatedProductsRequestObject(productObject, selectedQty) {
    let transactionDetails = {
      TRANSACTION_DETAIL_ID: productObject.PRODUCT_DETAIL.transactionDetailsId,
      PRODUCT_QUANTITY: selectedQty
    }

    let addToCartObject = {
      SUBSCRIBER_ID: +this.commonService.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
      TRANSACTION_ID: this.transactionService.transactionArray[0].TRANSACTION_ID,
      TRANSACTION_DETAIL: transactionDetails
    }

    this.updateCartRelatedProductsRequestObject = addToCartObject;

  }

  updateRelatedProducts(productObject, rowIndex, prodIndex, selectedQty, method) {
    this.relatedProducts[rowIndex][prodIndex].progressBar = true;
    if (method == 1) {
      selectedQty = selectedQty + 1;
    } else {
      selectedQty = selectedQty - 1;
    }

    if (selectedQty == 0) {
      // this.deleteCart(productObject.PRODUCT_DETAIL[0].transactionDetailsId, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex);
    } else {
      this.makeUpdateCartRelatedProductsRequestObject(productObject, selectedQty);
      this.subscriberService.updateCart(this.updateCartRelatedProductsRequestObject)
        .subscribe(data => this.handleUpdateRelatedProductsResponse(data, rowIndex, prodIndex, selectedQty), error => this.handleError(error))
    }
  }

  handleUpdateRelatedProductsResponse(data, rowIndex, prodIndex, selectedQty) {
    if (data.STATUS == "OK") {
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.relatedProducts[rowIndex][prodIndex].selectedQuantity = selectedQty;

      this.checkOnlyTransactions();
    }
    this.relatedProducts[rowIndex][prodIndex].progressBar = false;
  }
  //Update related products  Ends

  public getSelectedQtyOfRelatedProduct(productObject, index = 0) {
    let selectedQty = 1;
    this.transactionService.transactionDetailsArray.forEach(transaction => {
      if (productObject.PRODUCT_DETAIL && productObject.PRODUCT_DETAIL.PRODUCT_DETAIL_ID == transaction.PRODUCT_DETAIL_ID) {
        selectedQty = transaction.PRODUCT_QUANTITY;
        //  element.PRODUCT_DETAIL[0].transactionDetailsId = transaction.TRANSACTION_DETAIL_ID;
      }
    });
    return selectedQty;
  }

}
// Dialog One (Variance or AddOns Dialog)

@Component({
  selector: 'addon-dialog',
  templateUrl: './addon-dialog.html',
})

export class AddonDialog {

  constructor(
    private configService: ConfigService,
    public dialogRef: MatDialogRef<AddonDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, //Prduct Object
    public commonService: CommonService,
    public productMidLayerService: ProductsMidLayerService,
    public myWishlistService: MyWishlistService,
    public subscriberService: SubscriberService,
    public transactionService: TransactionsService,
    public userProfileService: UserProfileService,
    public router: Router,
    public dialog: MatDialog,
  ) {
    this.productsDetailObject = data;
  }

  productsDetailObject;

  onNoClick(): void {
    this.dialogRef.close();

  }

  //View Product
  openViewProductDialog(productObject): void {
    const dialogRef = this.dialog.open(ViewProductComponent, {
      width: '700px',
      data: productObject
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  //View Product ends

  closeDialogue(): void {
    this.dialogRef.close();
  }

  displayVarianceBox = true;
  gotoNextStep() {
    this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.forEach(addOnGroup => {
      addOnGroup.NO_OF_ITEMS_SELECTED = 0;
      let productIndex = 0;
      addOnGroup.ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP.forEach(addOnProduct => {
        addOnProduct.CHECKED = false; //this is for checkboxes               

        // following is for Radio Button
        if (addOnGroup.IS_MULTI_SELECT == 'false' && productIndex == 0) addOnProduct.CHECKED = true;
        productIndex++;


      });
    });
    this.displayVarianceBox = false;
  }
  gotoPreviousStep() {
    this.displayVarianceBox = true;
  }

  //Add To Cart
  addToCartRequestObject: any;
  makeAddToCartRequestObject() {

    let transactionId = 0;
    if (this.commonService.lsTransactionId()) { transactionId = + this.commonService.lsTransactionId(); }

    let productDetailObject = this.productsDetailObject;

    let lAddOnProducts = [];
    if (this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP
      && this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.length > 0) {

      this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.forEach(addOnGroup => {

        //this is for radio buttons
        if (addOnGroup.SELECTED_PRODUCT) {
          let singleAddOnObject: iAddOnProduct = {
            PRODUCT_DETAIL_ID: addOnGroup.SELECTED_PRODUCT.PRODUCT_DETAIL_ID,
            PRODUCT_FINAL_PRICE: addOnGroup.SELECTED_PRODUCT.SELLING_PRICE,
            PRODUCT_NAME: addOnGroup.SELECTED_PRODUCT.PRODUCT_NAME,
            PRODUCT_PRICE: addOnGroup.SELECTED_PRODUCT.SELLING_PRICE,
            PRODUCT_QUANTITY: 1,
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_DETAIL_TYPE_CODE: ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_ADD_ON_PRODUCT,
            TRANSACTION_ID: transactionId,
            ADD_ON_PRODUCT_GROUP_ID: addOnGroup.ADD_ON_PRODUCT_GROUP_ID
          }
          lAddOnProducts.push(singleAddOnObject);
        }

        if (addOnGroup.ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP
          && addOnGroup.ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP.length > 0) {
          addOnGroup.ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP.forEach(addOnProduct => {
            //this is for checkboxes
            if (addOnProduct.CHECKED && addOnProduct.CHECKED == true) {
              let singleAddOnObject: iAddOnProduct = {
                PRODUCT_DETAIL_ID: addOnProduct.PRODUCT_DETAIL_ID,
                PRODUCT_FINAL_PRICE: addOnProduct.SELLING_PRICE,
                PRODUCT_NAME: addOnProduct.PRODUCT_NAME,
                PRODUCT_PRICE: addOnProduct.SELLING_PRICE,
                PRODUCT_QUANTITY: 1,
                STORE_ID: this.configService.getStoreID(),
                TRANSACTION_DETAIL_TYPE_CODE: ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_ADD_ON_PRODUCT,
                TRANSACTION_ID: transactionId,
                ADD_ON_PRODUCT_GROUP_ID: addOnProduct.ADD_ON_PRODUCT_GROUP_ID
              }
              lAddOnProducts.push(singleAddOnObject);
            }

          });
        }

      });

    }

    let transactionDetails = {
      TRANSACTION_ID: transactionId,
      PRODUCT_DETAIL_ID: productDetailObject.PRODUCT_DETAIL_ID,
      PRODUCT_NAME: this.productsDetailObject.PRODUCT_NAME,
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
      TRANSACTION_DETAIL_TYPE_CODE: 1,
      ADD_ON_DETAIL: lAddOnProducts
    }

    let addToCartObject = {
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
      TRANSACTION_ID: transactionId,
      TRANSACTION_DETAIL: transactionDetails
    }

    this.addToCartRequestObject = addToCartObject;

  }

  singleProductPageProcessBar = false;
  addToCart() {
    let valid = true;
    valid = this.validateMandatory();
    if (valid) {
      this.closeDialogue();
      this.singleProductPageProcessBar = true;
      this.makeAddToCartRequestObject();
      this.subscriberService.addToCart(this.addToCartRequestObject).subscribe(data => this.handleAddToCartResponse(data), error => error);
    }
  }

  handleAddToCartResponse(data) {
    if (data.STATUS == "OK") {
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;

      this.putTransactionDetailsIdInProductDetailsArray(data.TRANSACTION[0].TRANSACTION_DETAIL)
      this.checkOnlyTransactions();

      if (data.TRANSACTION[0].TRANSACTION_DETAIL[0].TRANSACTION_ID > 0) {
        this.commonService.addTransactionIdTols();
      }

      console.log("this.productsDetailObject", this.productsDetailObject);

      // this is when called from buy now 
      if (this.productsDetailObject.buyNowClickedNavigateToCart) {
        this.productsDetailObject.buyNowClickedNavigateToCart = false;
        this.singleProductPageProcessBar = false;
        this.router.navigate(['/collections/checkout-new']);
      }
    }
    this.singleProductPageProcessBar = false;
  }

  validateMandatory() {
    let valid = true;
    if (this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP
      && this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.length > 0) {
      let index = 1;
      this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.forEach(addOnGroup => {

        if (addOnGroup.IS_MANDATORY == 'true') {
          if (addOnGroup.IS_MULTI_SELECT == 'true') {
            if (addOnGroup.NO_OF_ITEMS_SELECTED == undefined || addOnGroup.NO_OF_ITEMS_SELECTED == 0) valid = false;
          } else {
            if (addOnGroup.SELECTED_PRODUCT == undefined || addOnGroup.SELECTED_PRODUCT == '') valid = false;
          }
          if (!valid) this.commonService.openAlertBar("Please choose required addons.");
        }

      });
    }
    return valid;
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

  //Update Cart
  updateCartRequestObject: any;
  makeUpdateCartRequestObject(selectedQty) {

    let transactionDetailId = 0;
    this.transactionService.transactionDetailsArray.forEach(element => {
      if (element.PRODUCT_DETAIL_ID == this.productsDetailObject.PRODUCT_DETAIL_ID) transactionDetailId = element.TRANSACTION_DETAIL_ID;
    });


    let transactionDetails: any = {
      TRANSACTION_DETAIL_ID: transactionDetailId,
      PRODUCT_QUANTITY: selectedQty
    }

    let tempObj = {
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
      TRANSACTION_ID: this.commonService.lsTransactionId(),
      TRANSACTION_DETAIL: transactionDetails
    }

    this.updateCartRequestObject = tempObj;

  }

  updateCart(selectedQty, method) {
    this.closeDialogue();
    let valid = true;

    if (valid) {
      this.singleProductPageProcessBar = true;
      if (method == 1) {
        selectedQty = selectedQty + 1;
      } else {
        selectedQty = selectedQty - 1;
      }

      if (selectedQty == 0) {
        this.deleteCart();
      } else {
        this.makeUpdateCartRequestObject(selectedQty)
        this.subscriberService.updateCart(this.updateCartRequestObject).subscribe(data => this.handleUpdateCartResponse(data, selectedQty), error => error)
      }
    }
  }

  handleUpdateCartResponse(data, selectedQty) {
    if (data.STATUS == "OK") {
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.checkOnlyTransactions();
    }
    this.singleProductPageProcessBar = false;
  }
  //Update Cart Ends

  //Delete Cart 
  deleteCartRequestObject: any;
  makeDeleteCartRequestObject() {

    let transactionDetailId = 0;
    this.transactionService.transactionDetailsArray.forEach(element => {
      if (element.PRODUCT_DETAIL_ID == this.productsDetailObject.PRODUCT_DETAIL_ID) transactionDetailId = element.TRANSACTION_DETAIL_ID;
    });

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

  deleteCart() {
    this.singleProductPageProcessBar = true;
    this.makeDeleteCartRequestObject()

    this.subscriberService.removeFromCart(this.deleteCartRequestObject).subscribe(data => this.handleDeleteCartResponse(data), error => error)
  }

  handleDeleteCartResponse(data) {
    if (data.STATUS == "OK") {
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.checkOnlyTransactions();
    }
    this.singleProductPageProcessBar = false;
  }
  //Delete Cart Ends

  putTransactionDetailsIdInProductDetailsArray(transactionArray) {
    transactionArray.forEach(element => {
      if (this.productsDetailObject.PRODUCT_DETAIL_ID == element.PRODUCT_DETAIL_ID) {
        this.productsDetailObject.transactionDetailsId = element.TRANSACTION_DETAIL_ID;
      }
    });
  }

  selectionCount(productObject, groupIndex) {
    if (productObject.CHECKED) {
      this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP[groupIndex].NO_OF_ITEMS_SELECTED++;
    } else {
      this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP[groupIndex].NO_OF_ITEMS_SELECTED--;
    }
  }

  checkRadioButton(productObject, groupIndex, productIndex) {
    console.log("checkRadioButton");
    // make all the values to false 
    this.productsDetailObject
      .ADD_ON_PRODUCT_GROUP_MAP[groupIndex]
      .ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP
      .forEach(element => {
        element.CHECKED = false;
      });
    this.productsDetailObject
      .ADD_ON_PRODUCT_GROUP_MAP[groupIndex]
      .ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP[productIndex]
      .CHECKED = !productObject.CHECKED;

  }

  addd = "";

}
// Dialog One Ends Here (Variance or AddOns Dialog)