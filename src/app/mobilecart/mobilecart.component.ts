import { FlagsService } from './../flags.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService } from '../header.service';
import { UserProfileService } from '../user-profile.service';
import { TransactionsService } from '../transactions.service';
import { SubscriberService } from '../subscriber.service';
import { FooterService } from '../footer.service';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { CommonService } from '../common.service';
import { ConfigService } from '../config.service';
import { ProductService } from '../product.service';
import { VarianceDialog, CustomizationConfirmationDialog } from '../products/products.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-mobilecart',
  templateUrl: './mobilecart.component.html',
  styleUrls: ['./mobilecart.component.css']
})
export class MobilecartComponent implements OnInit {

  constructor(private configService: ConfigService, private _router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    public userProfileService: UserProfileService,
    public transactionService: TransactionsService,
    private subscriberService: SubscriberService,
    private footerService: FooterService,
    private flagsService: FlagsService,
    private commonService: CommonService,
    private productService: ProductService,
    public dialog: MatDialog,
  ) { }

  // Dialog
  openVarianceDialog(pProductDetail): void {
    const dialogRef = this.dialog.open(VarianceDialog, {
      width: '600px',
      data: pProductDetail
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  // Dialog ends

  //Variance/AddOns Dialog
  cLink: string;
  openCustomizationConfirmationPopup(pTransactionDetailsObject): void {
    const dialogRef = this.dialog.open(CustomizationConfirmationDialog, {
      width: '700px',
      data: pTransactionDetailsObject
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  //Variance/AddOns ends

  //Variables Used in this Component
  processBar = false;
  companyLogo = "../assets/images/logo.png";
  companyLogoAltText = "Campion Software";
  prodctSearchInput = "";
  public searchText = "";
  fetchStoreRequest = {};
  fetchSearchRequest = {};
  storeDetailsObject = {};
  loggedIn = 1;
  //transactionDetailsArray              = [];
  // numberOfProductsInCart        = this.userProfileService.numberOfProductsInCart;

  signUpName = "";
  displaySearch = false;
  loggedInUserName = "";

  ngOnInit() {
    //  this.flagsService.hideHeaderFooter();
    this.flagsService.showSearch();
    this.flagsService.showHeaderFooter();
    this.flagsService.hideFooter();
    window.scroll(0, 0);
    this.processBar = false;;
    this.checkSubscriberId();

    this.commonService.isUserLoggedIn();
    if (this.commonService.lsTempSubscriberFlag() == 1 || this.commonService.lsSubscriberId() == 0) { this.loggedIn = 0; }

    this.loggedInUserName = "";
    if (this.commonService.lsLoggedInUserName() != "" && this.commonService.lsLoggedInUserName() != "null") {
      this.loggedInUserName = this.commonService.lsLoggedInUserName();
    }
  }

  subscriberId = 0;
  checkSubscriberId() {
    if (this.commonService.lsSubscriberId()) this.subscriberId = + this.commonService.lsSubscriberId();

    if (this.subscriberId == 0) {
      this.temporarySubscriberLogin();
    } else {
      this.loadDefaultMethods();
    }
  }

  loadDefaultMethods() {
    this.fetchStore();
    this.fetchCartInProgress();
    this.fetchSocialMedia();
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

      this.loadDefaultMethods();
    }
  }

  handleError(error) {

  }

  //Store Details 
  storeLogo = "";
  storeName = "";
  makeFetchStoreRequestObject() {
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
    }
  }
  processBarLogo = false;
  fetchStore() {
    this.processBarLogo = true;
    this.makeFetchStoreRequestObject();
    this.headerService.fetchStore(this.fetchStoreRequest).subscribe(data => this.handleFetchStoreResponse(data), error => this.handleError(error));
  }

  handleFetchStoreResponse(pData) {
    if (pData.STATUS == "OK") {
      this.storeDetailsObject = pData.STORE[0];

      //Required things
      this.storeName = pData.STORE[0].STORE_NAME;
      this.storeLogo = pData.STORE[0].STORE_LOGO_URL;
    }
    this.processBarLogo = false;
  }

  makeFetchSearchObject() {
    this.fetchSearchRequest = {
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      PRODUCT_SEARCH_TEXT: this.searchText,
      STORE_ID: this.configService.getStoreID(),
      LIMIT: ApplicationConstants.DEFAULT_LIMIT,
      OFFSET: ApplicationConstants.DEFAULT_OFFSET
    }
  }

  fetchSearch() {
    this.processBar = true;
    this.makeFetchSearchObject();
    this.headerService.searchProductByInputId(this.fetchSearchRequest).subscribe(data => this.handleFetchSearchResponse(data), error => this.handleError(error));
  }
  searchedProductsArray = []
  handleFetchSearchResponse(pData) {
    this.searchedProductsArray = [];
    if (pData.STATUS == "OK") {
      this.searchedProductsArray = pData.PRODUCT;


      for (let i = 0; i < this.searchedProductsArray.length; i++) {
        this.searchedProductsArray[i].showAddToCart = 1;
        this.searchedProductsArray[i].selectedQuantity = 1;

        this.checkProductExistsInTransaction(i);
      }
    }
    this.processBar = false;
  }

  checkProductExistsInTransaction(index) {
    this.transactionService.transactionDetailsArray.forEach(element => {
      if (this.searchedProductsArray[index].PRODUCT_DETAIL[0].PRODUCT_DETAIL_ID == element.PRODUCT_DETAIL_ID) {

        this.searchedProductsArray[index].showAddToCart = 0;
        this.searchedProductsArray[index].selectedQuantity = element.PRODUCT_QUANTITY;
        this.searchedProductsArray[index].PRODUCT_DETAIL[0].transactionDetailsId = element.TRANSACTION_DETAIL_ID;
      }
    });
  }

  searchProducts() {
    if (this.searchText != '') {
      this._router.navigate(['search', this.searchText]);
    }
  }

  logout() {

    this.commonService.addTransactionIdTols();
    this.commonService.addSubscriberIdTols(0);
    this.commonService.addTempSubscriberFlagTols(0);
    this.commonService.addLoggedInUsernameTols("");

    if (this.flagsService.inDeliveryPageFlag) {

      this._router.navigate(['/']);
      // window.location.reload();
    } else {
      window.location.reload();
    }

  }

  showSerach() {
    this.displaySearch = true;
  }
  hideSerach() {
    this.displaySearch = false;
  }

  displayMinicart = false;
  showMinicart() {
    if (this.userProfileService.numberOfProductsInCart != this.transactionService.transactionDetailsArray.length) this.fetchCartInProgress();

    this.displayMinicart = true;
  }
  hideMinicart() {
    this.displayMinicart = false;
  }

  fetchCartInProgressRequestObject = {}

  makeFetchCartInProgressObject() {
    let tempObj = {
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
    }

    this.fetchCartInProgressRequestObject = tempObj;
  }

  fetchCartInProgress() {
    this.processBar = true;
    this.makeFetchCartInProgressObject()

    this.subscriberService.fetchCartInProgressTransactionsBySubscriberIdAPI(this.fetchCartInProgressRequestObject)
      .subscribe(data => this.handleFetchCartInProgressResponse(data), error => this.handleError(error))
  }

  invoiceTotal = 0;
  invoiceAmount = 0;
  invoiceDiscountAmount = 0;
  deliveryCharge = 0;
  convenienceFee = 0;
  gst = 0;

  handleFetchCartInProgressResponse(data) {
    if (data.STATUS == "OK") {
      this.processBar = false;

      if (data.TRANSACTION.length > 0) {
        this.transactionService.transactionArray = data.TRANSACTION;
        this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
        this.calculateInvoiceDetail(data.TRANSACTION[0]);
        this.maketransactionArray(data);
        if (data.TRANSACTION[0].TRANSACTION_DETAIL[0]) this.commonService.addTransactionIdTols();
      }
    }
  }

  refreshCartAmountDetail() {
    console.log("Transaction Array");
    let data = this.transactionService.transactionArray[0];
    this.invoiceAmount = data.INVOICE_AMOUNT;
    this.invoiceDiscountAmount = data.INVOICE_DISCOUNT_AMOUNT;
    this.invoiceTotal = data.INVOICE_FINAL_AMOUNT;
  }

  calculateInvoiceDetail(data) {
    this.invoiceAmount = data.INVOICE_AMOUNT;
    this.invoiceDiscountAmount = data.INVOICE_DISCOUNT_AMOUNT;
    this.invoiceTotal = data.INVOICE_FINAL_AMOUNT;

    this.userProfileService.invoiceAmount = this.invoiceAmount;
    this.userProfileService.invoiceDiscount = this.invoiceDiscountAmount;
    this.userProfileService.invoiceTotal = this.invoiceTotal;
  }

  maketransactionArray(data) {
    this.gst = 0; this.deliveryCharge = 0; this.convenienceFee = 0; //Initialise
    this.transactionService.transactionDetailsArray = [];
    data.TRANSACTION[0].TRANSACTION_DETAIL.forEach(element => {
      if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PRODUCT) {
        this.transactionService.transactionDetailsArray.push(element);
        this.transactionService.transactionDetailsArray = this.transactionService.transactionDetailsArray;
        this.gst += element.PRODUCT_GST_AMOUNT * element.PRODUCT_QUANTITY;
      }
      if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_DELIVERY_CHAGE) {
        this.deliveryCharge += element.PRODUCT_FINAL_PRICE;
      }
      if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_CONVENIENCE_FEE) {
        this.convenienceFee += element.PRODUCT_FINAL_PRICE;
      }

    });
    this.userProfileService.numberOfProductsInCart = this.transactionService.transactionDetailsArray.length;
  }

  selectedIndex = 0;
  reduceQuantity(index) {
    this.selectedIndex = index;
    this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY = this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY - 1;
    if (this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY == 0) {
      this.deleteCart();
    }
    this.updateCart();
  }

  increaseQuantity(index) {
    this.selectedIndex = index;
    this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY = this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY + 1;
    this.updateCart();
  }

  removeFromCart(index) {
    this.selectedIndex = index;
    this.deleteCart();
  }

  //Update Cart
  updateCartRequestObject = {};
  makeUpdateCartRequestObject() {

    let transactionDetails = {
      TRANSACTION_DETAIL_ID: this.transactionService.transactionDetailsArray[this.selectedIndex].TRANSACTION_DETAIL_ID,
      PRODUCT_QUANTITY: this.transactionService.transactionDetailsArray[this.selectedIndex].PRODUCT_QUANTITY
    }

    let addToCartObject = {
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
      TRANSACTION_ID: this.transactionService.transactionDetailsArray[this.selectedIndex].TRANSACTION_ID,
      TRANSACTION_DETAIL: transactionDetails
    }

    this.updateCartRequestObject = addToCartObject;

  }

  updateCart() {
    this.processBar = true;
    this.makeUpdateCartRequestObject()

    this.subscriberService.updateCart(this.updateCartRequestObject).subscribe(data => this.handleUpdateCartResponse(data), error => this.handleError(error))
  }

  handleUpdateCartResponse(data) {
    this.processBar = false;
    if (data.STATUS == "OK") {
      this.calculateInvoiceDetail(data.TRANSACTION[0]);
      this.maketransactionArray(data);
      this.transactionService.transactionArray = data.TRANSACTION;
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;

      this.checkOnlyTransactions();
    }
  }
  //Update Cart Ends

  //Delete Cart 
  deleteCartRequestObject = {};
  makeDeleteCartRequestObject() {
    let transactionDetails = {
      TRANSACTION_DETAIL_ID: this.transactionService.transactionDetailsArray[this.selectedIndex].TRANSACTION_DETAIL_ID,
    }

    let tempObj = {
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
      TRANSACTION_ID: this.transactionService.transactionDetailsArray[this.selectedIndex].TRANSACTION_ID,
      TRANSACTION_DETAIL: transactionDetails
    }

    this.deleteCartRequestObject = tempObj;

  }

  deleteCart() {
    this.processBar = true;
    this.makeDeleteCartRequestObject();

    this.subscriberService.removeFromCart(this.deleteCartRequestObject).subscribe(data => this.handleDeleteCartResponse(data), error => this.handleError(error))
  }

  handleDeleteCartResponse(data) {
    this.processBar = false;
    if (data.STATUS == "OK") {

      this.transactionService.transactionDetailsArray.splice(this.selectedIndex, 1);
      this.calculateInvoiceDetail(data.TRANSACTION[0]);
      this.maketransactionArray(data);

      this.transactionService.transactionArray = data.TRANSACTION;
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;

      this.checkOnlyTransactions();

    }
  }
  //Delete Cart Ends

  transactionDetailsId = 0;
  addToCartRequestObject = {};
  selectedProductIndex = 0;

  //Add To Cart
  makeAddToCartRequestObject(productObject) {
    let productDetailObject = productObject.PRODUCT_DETAIL[0];
    let transactionDetails = {
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
      TRANSACTION_DETAIL_TYPE_CODE: 1,
    }

    let addToCartObject = {
      SUBSCRIBER_ID: + this.commonService.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
      TRANSACTION_ID: this.commonService.lsTransactionId(),
      TRANSACTION_DETAIL: transactionDetails
    }

    this.addToCartRequestObject = addToCartObject;

  }

  addToCart(productObject, index) {
    this.processBar = true;
    this.selectedProductIndex = index;
    this.makeAddToCartRequestObject(productObject);
    this.subscriberService.addToCart(this.addToCartRequestObject).subscribe(data => this.handleAddToCartResponse(data, index), error => this.handleError(error));
  }

  handleAddToCartResponse(data, index) {
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
  }

  setPorductDetailId(index, transactionArray) {
    let productDetailsId = this.searchedProductsArray[index].PRODUCT_DETAIL[0].PRODUCT_DETAIL_ID;
    transactionArray.forEach(element => {
      if (productDetailsId == element.PRODUCT_DETAIL_ID) {
        this.searchedProductsArray[index].PRODUCT_DETAIL[0].transactionDetailsId = element.TRANSACTION_DETAIL_ID;
      }
    });
  }
  //Add To Cart Ends

  checkOnlyTransactions() {
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
  makeUpdateSearchedProductsCartRequestObject(productObject, index, selectedQty) {
    let transactionDetails = {
      TRANSACTION_DETAIL_ID: productObject.PRODUCT_DETAIL[0].transactionDetailsId,
      PRODUCT_QUANTITY: selectedQty
    }

    let addToCartObject = {
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
      TRANSACTION_ID: this.commonService.lsTransactionId(),
      TRANSACTION_DETAIL: transactionDetails
    }

    this.updateCartRequestObject = addToCartObject;

  }

  updateSearchedProductsCart(productObject, index, selectedQty, method) {
    this.processBar = true;
    if (method == 1) {
      selectedQty = selectedQty + 1;
    } else {
      selectedQty = selectedQty - 1;
    }

    if (selectedQty == 0) {
      this.deleteSearchedProductsCart(productObject.PRODUCT_DETAIL[0].transactionDetailsId, index);
    } else {
      this.makeUpdateSearchedProductsCartRequestObject(productObject, index, selectedQty)
      this.subscriberService.updateCart(this.updateCartRequestObject).subscribe(data => this.handleUpdateSearchedProductsCartResponse(data, index, selectedQty), error => this.handleError(error))
    }
  }

  handleUpdateSearchedProductsCartResponse(data, index, selectedQty) {
    if (data.STATUS == "OK") {
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.searchedProductsArray[index].selectedQuantity = selectedQty;

      this.checkOnlyTransactions();
    }
    this.processBar = false;
  }
  //Update Cart Ends

  //Delete Cart 
  makeDeleteSearchedProductsCartRequestObject(transactionDetailId) {

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

  deleteSearchedProductsCart(transactionDetailId, index) {
    this.processBar = true;
    this.makeDeleteSearchedProductsCartRequestObject(transactionDetailId)

    this.subscriberService.removeFromCart(this.deleteCartRequestObject).subscribe(data => this.handleDeleteSearchedProductsCartResponse(data, index), error => this.handleError(error))
  }

  handleDeleteSearchedProductsCartResponse(data, index) {
    if (data.STATUS == "OK") {
      this.searchedProductsArray[index].showAddToCart = 1;
      this.searchedProductsArray[index].selectedQuantity = 1;
      this.searchedProductsArray[index].transactionDetailId = 0;
      this.fetchCartInProgress();
    }
    this.processBar = false;
  }
  //Delete Cart Ends


  getProductImageName(object) {
    let imageName = "";
    if (object.PRODUCT_DETAIL[0] && object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0] && object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH != 'undefined') imageName = object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH;
    return imageName;
  }

  getProductUnit(object) {
    let unit = "";
    if (object.PRODUCT_DETAIL[0] && object.PRODUCT_DETAIL[0].UNIT != 'undefined') unit = object.PRODUCT_DETAIL[0].UNIT;
    return unit;
  }

  getProductUnitTypeName(object) {
    let unitTypeName = "";
    if (object.PRODUCT_DETAIL[0] && object.PRODUCT_DETAIL[0].UNIT_TYPE_NAME != 'undefined') unitTypeName = object.PRODUCT_DETAIL[0].UNIT_TYPE_NAME;
    return unitTypeName;
  }

  getProductSellingPrice(object) {
    let price = "";
    if (object.PRODUCT_DETAIL[0] && object.PRODUCT_DETAIL[0].SELLING_PRICE != 'undefined') price = object.PRODUCT_DETAIL[0].SELLING_PRICE;
    return price;
  }

  // Social Media
  fetchSocialMediaRequestObject = {};
  socialMediaDetailsArray = []
  makeFetchSocialMediaRequestObject() {
    this.fetchSocialMediaRequestObject = {
      STORE_ID: this.configService.getStoreID(),
    }
  }

  fetchSocialMedia() {
    this.processBar = true;
    this.makeFetchSocialMediaRequestObject();
    this.footerService.fetchSocialMediaAPI(this.fetchSocialMediaRequestObject).subscribe(data => this.handleFetchSocialMediaSuccess(data), error => this.handleError(error));
  }

  handleFetchSocialMediaSuccess(pData) {
    if (pData.STATUS = 'OK') {
      this.socialMediaDetailsArray = pData.SOCIAL_MEDIA;
    }

    // stop the progress bar
    this.processBar = false;
  }
  // Social Media end

  checkoutAPI() {
    if (window.innerWidth < 600) {
      if (this.commonService.isSubscriberLoggedIn()) {
        this._router.navigate(['/collections/checkout-new']);
      } else {
        this._router.navigate(['/collections/checkout-new-login']);
      }
    } else {
      this._router.navigate(['/collections/checkout-new']);
    }
  }

  fetchProduct(pTransactionDetailObject) {
    let requestObject = {
      STORE_ID: this.configService.getStoreID(),
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      PRODUCT_ID: pTransactionDetailObject.PRODUCT_ID
    }
    this.productService.fetchProductByProductId(requestObject).subscribe(data => this.handleFetchProduct(data, pTransactionDetailObject),
      error => error);
  }

  handleFetchProduct(pData, pTransactionDetailObject) {
    if (pData.STATUS == "OK") {
      let productArray = pData.PRODUCT;
      if (pTransactionDetailObject != undefined) productArray[0].TRANSACTION_DETAIL = pTransactionDetailObject;
      this.openVarianceDialog(productArray[0]);
    }
  }

  getProductFinalPrice(transactionDetailObject) {
    let productPrice = transactionDetailObject.PRODUCT_QUANTITY * transactionDetailObject.PRODUCT_FINAL_PRICE;
    let addOnPrice = 0;
    if (transactionDetailObject.ADD_ON_DETAIL && transactionDetailObject.ADD_ON_DETAIL.length > 0) {
      transactionDetailObject.ADD_ON_DETAIL.forEach(addOnProduct => {
        addOnPrice += (addOnProduct.PRODUCT_FINAL_PRICE * addOnProduct.PRODUCT_QUANTITY);
      });
    }
    return productPrice + addOnPrice;
  }

}
