import { Component, OnInit, Inject, NgZone, HostListener } from '@angular/core';
import { MapsService } from '../maps.service';
import { FlagsService } from '../flags.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { UserProfileService } from '../user-profile.service';
import { CommonService } from '../common.service';
import { LoginService } from '../login.service';
import { SocialSignupService } from '../social-signup.service';
import { SignupService } from '../signup.service';
import { EmailandphonenumberverifiationService } from '../emailandphonenumberverifiation.service';
import { ReferenceMethodsService } from '../reference-methods.service';
import { WalletMethodsService } from '../wallet-methods.service';
import { DeliveryAddressService } from '../delivery-address.service';
import { PaymentService } from '../payment.service';
import { TransactionsService } from '../transactions.service';
import { SubscriberService } from '../subscriber.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PincodeMethodsService } from '../pincode-methods.service';
import { ConfigService } from '../config.service';
import { DatePipe } from '@angular/common';
import { ApiConstants } from 'src/ApiConstants';
import * as $ from 'jquery';
import { ProductService } from '../product.service';
import { VarianceDialog, CustomizationConfirmationDialog } from '../products/products.component';


export interface Food {
  value: string;
  viewValue: string;
}


interface IPaymentGatewayCredentialsResponse {
  PAYMENT_GATEWAY_CREDENTIALS_ID: 0,
  STORE_ID: 0,
  STORE_NAME: "",
  PAYMENT_GATEWAY_TYPE_CODE: 0,
  PAYMENT_GATEWAY_TYPE_NAME: "",
  GRANT_TYPE: "",
  CLIENT_ID: "",
  CLIENT_SECRET: "",
  PAYMENT_GATEWAY_CREDENTIALS_DESC: "",
  CREATED_DATE: "",
  LAST_MODIFIED_DATE: ""
}

declare function initMap(param1, param2): any;

@Component({
  selector: 'app-checkout-new',
  templateUrl: './checkout-new.component.html',
  styleUrls: ['./checkout-new.component.css']
})
export class CheckoutNewComponent implements OnInit {


  // Dialog
  link: string;
  openDialog(): void {
    const dialogRef = this.dialog.open(UnavailableProductsDialog, {
      width: '1200px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.transactionsService.checkCartItems();
    });
  }
  // Dialog ends

  // 2nd Dialog
  openPincodeDialog(): void {
    const dialogRef = this.dialog.open(Deliverypincode, {
      width: '1200px',
    });

    dialogRef.afterClosed().subscribe(result => {
      //after dialogue closes
    });
  }
  // 2nd Dialog ends


  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' }
  ];

  displayLoginFlag = true;
  displayAddressFlag = true;
  processBar = false;
  displayLoginOrSignUpDiv = false;
  displayDeliveryAddressDiv = false;
  // displayDeliveryTimingSlotsDiv = false;
  displayPaymentsDiv = false;
  disablePlaceOrderButton = false; // new-checklist-soln-potlighar-6

  constructor(
    private  configService                             : ConfigService,
    public   transactionService                        : TransactionsService,
    public   mapsService                               : MapsService,
    private  _router                                   : Router,
    public   loginservice                              : LoginService,
    public   userProfileService                        : UserProfileService,
    private  flashMessagesService                      : FlashMessagesService,
    public   commonService                             : CommonService,
    public   socialSignupService                       : SocialSignupService,
    public   flagsService                              : FlagsService,
    public   signupService                             : SignupService,
    public   emailandphonenumberverifiationService     : EmailandphonenumberverifiationService,
    public   referenceMethodsService                   : ReferenceMethodsService,
    public   walletMethodsService                      : WalletMethodsService,
    public   deliveryAddressService                    : DeliveryAddressService,
    public   paymentService                            : PaymentService,
    public   transactionsService                       : TransactionsService,
    public   subscriberService                         : SubscriberService,
    public   flashMessageService                       : FlashMessagesService,
    public   dialog                                    : MatDialog,
    public   pincodeMethodsService                     : PincodeMethodsService,
    public   datePipe                                  : DatePipe,
    private  productService                            : ProductService,
    private  ngZone                                    : NgZone
  ) { }

  showProducts = "";

  displayInMobile = false;

  myDate: Date;
  currentDate = "";
  datesArray = [];
  daysArray = [];

  getProductFinalPrice(transactionDetailObject){
    let productPrice = transactionDetailObject.PRODUCT_QUANTITY * transactionDetailObject.PRODUCT_FINAL_PRICE;
    let addOnPrice = 0;
    if(transactionDetailObject.ADD_ON_DETAIL && transactionDetailObject.ADD_ON_DETAIL.length > 0){
      transactionDetailObject.ADD_ON_DETAIL.forEach(addOnProduct => {
        addOnPrice += (addOnProduct.PRODUCT_FINAL_PRICE * addOnProduct.PRODUCT_QUANTITY);
      });
    }
    return productPrice + addOnPrice;
  }

  ngOnInit() {
    this.flagsService.mobileOtpVerficationCallFromUpdateMobile = false;
    this.commonService.sendMessage("hideFM");

    if (window.innerWidth < 600) this.displayInMobile = true;
    window.scroll(0, 0);
    this.flagsService.hideSearch();
    this.userProfileService.loginCallFromCheckoutPage = 1;
    this.showLoginOrSignUp();
    if (this.userProfileService.loggedIn) this.showDeliveryAddress();
    this.fetchPaymentGatewayByStoreIdAPI();
    // this.flagsService.hideHeaderFooter();
    this.flagsService.showSearch();
    this.flagsService.showHeaderFooter();
    this.fetchDeliveryAddress();
    //this.makeTransactionArray(); // checklist-promocode-issue

    this.transactionsService.checkoutApi();

    this.makeTransactionArray(); // checklist-promocode-issue

    if (window.innerWidth < 600) {
      this.flagsService.hideFooter();
    }

    (async () => {
      await this.commonService.delay(ApplicationConstants.wait_time);
      if (this.transactionsService.unavailableProductsArray.length > 0) {
        this.openDialog();
      }
    })();

    this.transactionService.placeOrderClicked = false;
    this.transactionService.cancelDeliverySlot();

  }

  ngOnDestroy() {
    this.commonService.sendMessage("showFM");
    this.transactionService.releaseQuantity(); // new-checklist-soln-potlighar-6
  }

  // new-checklist-soln-potlighar-6
  @HostListener('window:beforeunload')
  doSomethingBeforeClosingBrowserTab() {
    this.transactionService.releaseQuantity();
  }

  updateSelectedDeliveryOption() {
    if (this.deliveryOptionCode == 1) this.selectedDeliveryOption = "Normal Delivery";
    else if (this.deliveryOptionCode == 2) this.selectedDeliveryOption = "Express Delivery";
    else if (this.deliveryOptionCode == 3) this.selectedDeliveryOption = "Delivery Slot";
  }

  updateSelectedDeliverySlotDay(pValue) {
    this.selectedDeliverySlotDay = pValue;
  }

  updateSelectedDeliverySlotTime(pValue) {
    this.selectedDeliverySlotTime = pValue;
  }

  update

  promocodeDetailsSampleObject = {
    TRANSACTION_DETAIL_ID: 0,
    TRANSACTION_ID: 0,
    STORE_ID: 0,
    VENDOR_ID: 0,
    PRODUCT_ID: "",
    PRODUCT_DETAIL_ID: "",
    PRODUCT_NAME: "",
    PRODUCT_PRICE: 0,
    PRODUCT_DISCOUNT_ID: "",
    PRODUCT_DISCOUNT_AMOUNT: 0,
    PRODUCT_FINAL_PRICE: 0,
    PRODUCT_GST_ID: "",
    PRODUCT_GST_PERCENTAGE: 0,
    PRODUCT_GST_AMOUNT: 0,
    PRODUCT_GST_STATUS: "",
    PRODUCT_QUANTITY: "",
    PRODUCT_MULTI_FLAG: "",
    PRODUCT_IMAGE_FILE: "",
    PRODUCT_IMAGE_PATH: "",
    PRODUCT_IMAGE_FILE_PATH: "",
    PRODUCT_UNIT_TYPE_CODE: "",
    PRODUCT_UNIT: "",
    PRODUCT_UNIT_TYPE_NAME: "",
    PRODUCT_BRAND_ID: "",
    PRODUCT_BRAND_NAME: "",
    MAX_PURCHASE_QUANTITY: "",
    TRANSACTION_DETAIL_TYPE_CODE: 0,
    PROMO_CODE: "",
    PROMO_CODE_DISCOUNT_AMOUNT: 0
  };

  showSignup() {
    this.displayLoginFlag = false;
  }
  showLogin() {
    this.displayLoginFlag = true;
  }
  showAddaddress() {
    this.displayAddressFlag = false;
  }

  hideAddress() {
    this.displayAddressFlag = true;
  }

  showLoginOrSignUp() {
    this.displayLoginOrSignUpDiv = true;
    this.displayDeliveryAddressDiv = false;
    this.displayPaymentsDiv = false;
    this.displayDeliveryTimingSlotsDiv = false;
  }

  showDeliveryAddress() {
    this.displayAddressFlag = true;
    this.displayLoginOrSignUpDiv = false;
    this.displayDeliveryAddressDiv = true;
    this.displayPaymentsDiv = false;
    this.displayDeliveryTimingSlotsDiv = false;
  }

  showDeliveryTimingSlots() {
    this.displayLoginOrSignUpDiv = false;
    this.displayDeliveryAddressDiv = false;
    this.displayPaymentsDiv = false;
    this.displayDeliveryTimingSlotsDiv = true;
  }

  showPayments() {
    this.displayLoginOrSignUpDiv = false;
    this.displayDeliveryAddressDiv = false;
    this.displayPaymentsDiv = true;
    this.displayDeliveryTimingSlotsDiv = false;
  }

  // Login login 
  loginEmail = "";
  loginPassword = "";
  signupEmail = "";
  signupPassword = "";
  signupConfirmPassword = "";


  loginRequestObject = {};

  makeLoginRequestObject() {
    this.loginRequestObject = {
      APPLICATION_ID: this.commonService.applicationId,
      SUBSCRIBER_EMAIL_ID: this.loginEmail,
      SUBSCRIBER_PASSWORD: this.loginPassword,
    }
  }

  makeDeleteTempSubscriberRequestObject() {
    this.loginRequestObject = {
      APPLICATION_ID: this.commonService.applicationId,
      TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      SUBSCRIBER_EMAIL_ID: this.loginEmail,
      SUBSCRIBER_PASSWORD: this.loginPassword,
      STORE_ID: this.configService.getStoreID(),
      REFERRAL_FLAG: this.referenceMethodsService.referralFlag,
      REFERRAL_URL: this.referenceMethodsService.referralUrl,
    }
  }

  // -----------------------
  collapseIcon1 = "down"
  collapseIcon = "down";

  collapseOrderDetails() {
    if (this.collapseIcon1 == "down") {
      this.collapseIcon1 = "up";
    }
    else {
      this.collapseIcon1 = "down";
    }
  }
  collapse() {
    if (this.collapseIcon == "down") {
      this.collapseIcon = "up";
    }
    else {
      this.collapseIcon = "down";
    }
  }



  selectedIndex = 0;
  reduceQuantity(index) {
    this.showProducts = "show";
    this.selectedIndex = index;
    this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY = this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY - 1;
    if (this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY == 0) {
      this.deleteCart();
    }
    this.updateCart();
  }

  increaseQuantity(index) {
    this.showProducts = "show";
    this.selectedIndex = index;
    this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY = this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY + 1;
    this.updateCart();
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
  removeFromCart(index) {
    this.showProducts = "show";
    this.processBar = true;
    this.selectedIndex = index;
    this.deleteCart();
  }
  deleteCart() {
    this.makeDeleteCartRequestObject();

    this.subscriberService.removeFromCart(this.deleteCartRequestObject).subscribe(data => this.handleDeleteCartResponse(data), error => this.handleError(error))
  }
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
  handleDeleteCartResponse(data) {
    if (data.STATUS == "OK") {

      this.transactionService.transactionDetailsArray.splice(this.selectedIndex, 1);
      this.calculateInvoiceDetail(data.TRANSACTION[0]);
      this.maketransactionArray(data);
      this.processBar = false;

      this.transactionService.transactionArray = data.TRANSACTION;
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
    }
  }
  invoiceTotal = 0;
  invoiceAmount = 0;
  invoiceDiscountAmount = 0;

  //Delete Cart Ends
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

  updateCart() {
    this.processBar = true;
    this.makeUpdateCartRequestObject()
    this.subscriberService.updateCart(this.updateCartRequestObject).subscribe(data => this.handleUpdateCartResponse(data), error => this.handleError(error))
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
  handleUpdateCartResponse(data) {
    this.processBar = false;
    if (data.STATUS == "OK") {
      this.calculateInvoiceDetail(data.TRANSACTION[0]);
      this.maketransactionArray(data);

      this.transactionService.transactionArray = data.TRANSACTION;
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;

    }
  }
  //Update Cart Ends
  // ---------------------------------

  login() {
    if (this.isLoginFormValid) {
      let tempSubscriberFlag = 0;
      tempSubscriberFlag = +this.commonService.lsTempSubscriberFlag();
      if (tempSubscriberFlag > 0) {
        this.makeDeleteTempSubscriberRequestObject();
        this.loginservice.deleteTemporarySubscriberAndLogInAPI(this.loginRequestObject).subscribe(data => this.handleTempSubscriberLoginSuccess(data), error => this.handleError(error));
      } else {
        this.makeLoginRequestObject();
        this.loginservice.subscriberLoginAPI(this.loginRequestObject).subscribe(data => this.handleLoginSuccess(data), error => this.handleError(error));
      }
    }
  }

  handleLoginSuccess(data) {
    if (data.STATUS == "OK") {

      this.commonService.notifyMessage(this.flashMessagesService, "User Login Success.");

      this.commonService.addSubscriberIdTols(data.SUBSCRIBER.SUBSCRIBER_ID)
      this.commonService.addLoggedInUsernameTols(data.SUBSCRIBER.SUBSCRIBER_FIRST_NAME + data.SUBSCRIBER.SUBSCRIBER_LAST_NAME);
      this.commonService.addTempSubscriberFlagTols(0);
      this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
      this.commonService.isUserLoggedIn();
      this.afterSuccessfullLogin();

    } else {
      this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
    }
  }

  handleTempSubscriberLoginSuccess(data) {
    if (data.STATUS == "OK") {
      if (data.SUBSCRIBER.SUBSCRIBER_EMAIL_OTP_STATUS == 1) { // this means otp is verified

        let authToken = data.SUBSCRIBER.AUTHENTICATION_TOKEN;
        let subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
        let tempSubscriberFlag = 0;
        let transactionId = 0;
        this.commonService.addStoreData(authToken, subscriberId, tempSubscriberFlag, transactionId);

        let subscriberObject = {
          name: data.SUBSCRIBER.SUBSCRIBER_FIRST_NAME + " " + this.commonService.checkIfNull(data.SUBSCRIBER.SUBSCRIBER_LAST_NAME),
          email: data.SUBSCRIBER.SUBSCRIBER_EMAIL_ID,
          mobile: data.SUBSCRIBER.SUBSCRIBER_MOBILE_NR
        }

        this.commonService.addSubscriberObjectTols(subscriberObject);


        this.loginservice.checkTransactionArrayAndUpdate(data);

        this.afterSuccessfullLogin();
        this.commonService.isUserLoggedIn();
      } else {

        this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);


        this.emailandphonenumberverifiationService.deleteTempSubsReqObject = {
          APPLICATION_ID: this.commonService.applicationId,
          TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
          SUBSCRIBER_EMAIL_ID: this.loginEmail,
          SUBSCRIBER_PASSWORD: this.loginPassword,
          STORE_ID: this.configService.getStoreID()
        }

        this.emailandphonenumberverifiationService.subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
        
        this._router.navigate(['/collections/otp']);

      }

      this.walletMethodsService.fetchWalletMoneyBySubscriberIdAPI();

      this.referenceMethodsService.referralFlag = false;

    } else {
      if(data.ERROR_MSG == 'Invalid Email Id'){
        this.commonService.notifyMessage(this.flashMessagesService, "The Email is not registered with us");
      } else {
        this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
      }
    }
  }

  afterSuccessfullLogin() {
    (async () => {
      this.transactionsService.checkoutApi();
      this.commonService.notifySuccessMessage(this.flashMessagesService, "User Login Success.");
      await this.delay(ApplicationConstants.notification_display_time);
      this.fetchDeliveryAddress();
      this.showDeliveryAddress();

      (async () => {
        await this.commonService.delay(ApplicationConstants.wait_time);
        if (this.transactionsService.unavailableProductsArray.length > 0) {
          this.openDialog();
        }
      })();
    })();
  }

  handleError(error) {

  }

  clearSignupForm() {
    this.loginEmail = "";
    this.loginPassword = "";
  }

  formDisable = true;
  validateForm(ngObject) {
    this.formDisable = true;
    if (ngObject._parent.form.status == "VALID") {
      this.formDisable = false;
    }
  }

  isLoginFormValid = false;
  loginFormValidation(ngObject) {
    this.isLoginFormValid = false;
    if (ngObject._parent.form.status == "VALID") this.isLoginFormValid = true;
  }

  isSignUpFormValid = false;
  signupFormValidation(ngObject) {
    this.isSignUpFormValid = false;
    if (ngObject._parent.form.status == "VALID") this.isSignUpFormValid = true;
  }
  // Login login ends 

  // delivery address 
  fetchDeliveryAddressRequestObject = {};
  deliveryAddressesArray = [];
  makeFetchDeliveryAddressRequestObject() {
    this.fetchDeliveryAddressRequestObject = {
      SUBSCRIBER_ID: this.commonService.lsSubscriberId()
    }
  }

  fetchDeliveryAddress() {
    this.makeFetchDeliveryAddressRequestObject();
    this.deliveryAddressService.fetchSubscriberAddress(this.fetchDeliveryAddressRequestObject)
      .subscribe(data => this.handleFetchDeliveryAddressSuccess(data), error => this.handleError(error))
  }
  numberOfRows = [];
  handleFetchDeliveryAddressSuccess(data) {
    if (data.STATUS == "OK") {
      this.deliveryAddressesArray = [];
      let delArray = data.SUBSCRIBER_ADDRESS;
      let arrayLength = Math.ceil(delArray.length / 3);

      let index = 0;
      for (let row = 0; row < arrayLength; row++) {

        let tempArray = [];
        if (index < delArray.length) {
          for (let col = 0; col < 3; col++) {
            if (delArray[index]) tempArray.push(delArray[index]);
            index++;
          }
          this.deliveryAddressesArray.push(tempArray);
        }

      }

      if (this.deliveryAddressesArray.length > 0 && this.deliveryAddressesArray[0].length == 1) {
        this.updateSelectedDeliveryAddressId(this.deliveryAddressesArray[0][0]);
        this.updateSelectedDeliveryAddressObject(this.deliveryAddressesArray[0][0]);
      }

    }
  }
  // delivery address ends 
  addressLabelCode = 1;
  addressLabel = "Home"; // new-checklist-1-soln-6 
  customLabel = "";
  updateAddressLabel(addressLabel) {
    this.addressLabelCode = addressLabel;
    if (addressLabel == 1) this.addressLabel = "Home";
    if (addressLabel == 2) this.addressLabel = "Office";
    if (addressLabel == 3) this.addressLabel = this.customLabel;
  }

  getDeliveryAddressClass(deliveryAddressLabelCode) {
    let cls = "";
    if (deliveryAddressLabelCode == this.addressLabelCode) cls = "highlightDeliveryAddressLabel";
    return cls;
  }

  highlightDeliveryAddressLabelByLabelName(addressLabelName) {
    if (this.addressLabel == "Home") this.addressLabelCode = 1;
    else if (this.addressLabel == "Office") this.addressLabelCode = 2;
    else this.addressLabelCode = 3;
  }

  // Create Delivery Address 
  //  new-checklist-1-soln-6 
  getCountryStateCityIdAndSave() {
    let requestObject = {
      ADDRESS_COUNTRY_NAME: this.countryName
    }
    this.deliveryAddressService.getCountryIdAPI(requestObject).subscribe(data => this.handleCountry(data), error => error)
  }

  handleCountry(pData) {
    this.countryId = pData.ADDRESS_COUNTRY_ID;
    this.getStateId();
  }

  //  new-checklist-1-soln-6 
  getStateId() {
    let requestObject = {
      ADDRESS_COUNTRY_ID: this.countryId,
      ADDRESS_STATE_NAME: this.stateName
    }
    this.deliveryAddressService.getStateIdAPI(requestObject).subscribe(data => this.handleState(data), error => error)
  }

  handleState(pData) {
    this.stateId = pData.ADDRESS_STATE_ID;
    this.getCityId();
  }

  //  new-checklist-1-soln-6 
  getCityId() {
    let requestObject = {
      ADDRESS_COUNTRY_ID: this.countryId,
      ADDRESS_STATE_ID: this.stateId,
      ADDRESS_CITY_NAME: this.cityName
    }
    this.deliveryAddressService.getCityIdAPI(requestObject).subscribe(data => this.handleCity(data), error => error)
  }

  handleCity(pData) {
    this.cityId = pData.ADDRESS_CITY_ID;
    this.createDeliveryAddress();
  }

  addressLine1   =     "";
  addressLine2   =     "";
  addressPin     =     null;
  lattitude      =     12;
  longitude      =     12;
  contactName    =     "";
  mobileNumber   =     "";
  addressStatus  =     1;

  // new-checklist-1-soln-6  from here 
  cityName       =     "";
  stateName      =     "";
  countryName    =     "";
  cityId         =     0; 
  stateId        =     0;
  countryId      =     0;
  // new-checklist-1-soln-6  till here


  createDeliveryAddressRequestObject = {};
    //  new-checklist-1-soln-6 
  makeCreateDeliveryAddressRequestObject() {
    this.createDeliveryAddressRequestObject = {
      SUBSCRIBER_ID        :  + this.commonService.lsSubscriberId(),
      ADDRESS_LINE1        :  this.addressLine1,
      ADDRESS_LINE2        :  this.addressLine2,
      ADDRESS_PINCODE      :  this.addressPin,
      ADDRESS_LATITUDE     :  this.lattitude,
      ADDRESS_LONGITUDE    :  this.longitude,
      ADDRESS_LABEL        :  this.addressLabel,
      CONTACT_NAME         :  this.contactName,
      CONTACT_MOBILE_NR    :  this.mobileNumber,
      ADDRESS_STATUS       :  this.addressStatus,
      ADDRESS_CITY_ID      : this.cityId,
      ADDRESS_STATE_ID     : this.stateId,
      ADDRESS_COUNTRY_ID   : this.countryId
    }
  }

  createDeliveryAddress() {
    if (this.subscriberAddressId > 0) {
      this.updateDeliveryAddress()
    } else {
      this.makeCreateDeliveryAddressRequestObject();
      this.deliveryAddressService.createSubscriberAddress(this.createDeliveryAddressRequestObject)
        .subscribe(data => this.handleCreateDeliveryAddressSuccess(data), error => this.handleError(error))
    }
  }

  handleCreateDeliveryAddressSuccess(data) {
    if (data.STATUS == "OK") {
      (async () => {
        this.flashMessageService.show("Delivery address Saved Successfully.", { cssClass: 'alert-success', timeout: ApplicationConstants.notification_display_time });

        await this.commonService.delay(ApplicationConstants.notification_display_time);

        this.refreshForm();
        this.fetchDeliveryAddress();
        this.hideAddress();
      })();
    }
  }
  // Create Delivery Address ends 

  // Update Delviery Address
  updateDeliveryAddressRequestObject = {};
  subscriberAddressId = 0;
  addressId = 0;
  makeUpdateDeliveryAddressRequestObject() {
    this.updateDeliveryAddressRequestObject = {
      SUBSCRIBER_ADDRESS_ID: this.subscriberAddressId,
      ADDRESS_ID: this.addressId,
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      ADDRESS_LINE1: this.addressLine1,
      ADDRESS_LINE2: this.mapsService.googleAddress,
      ADDRESS_PINCODE: this.addressPin,
      ADDRESS_LATITUDE: this.lattitude,
      ADDRESS_LONGITUDE: this.longitude,
      ADDRESS_LABEL: this.addressLabel,
      CONTACT_NAME: this.contactName,
      CONTACT_MOBILE_NR: this.mobileNumber,
      ADDRESS_STATUS: this.addressStatus
    }
  }

  updateDeliveryAddress() {
    this.makeUpdateDeliveryAddressRequestObject();
    this.deliveryAddressService.updateSubscriberAddress(this.updateDeliveryAddressRequestObject)
      .subscribe(data => this.handleUpdateDeliveryAddressSuccess(data), error => this.handleError(error))
  }

  handleUpdateDeliveryAddressSuccess(data) {
    if (data.STATUS == "OK") {
      this.refreshForm();
      this.fetchDeliveryAddress();
      this.hideAddress();
    }
  }
  // Update Delviery Address ends 
//  new-checklist-1-soln-6 
  refreshForm() {
    this.addressLine1 = "";
    this.addressLine2 = "";
    this.addressPin = 0;
    this.lattitude = 12;
    this.longitude = 12;
    this.addressLabel = "";
    this.contactName = "";
    this.mobileNumber = "";
    this.cityName     = "";
    this.stateName    = "";
    this.countryName  = "";
    this.cityId       = 0;
    this.stateId      = 0;
    this.countryId    = 0;

  }

  selctedDeliveryAddressId = 0;

  getSelectedDeliveryAddress(deliveryAddressObject) {
    let classname = "";
    if (this.selctedDeliveryAddressId == deliveryAddressObject.SUBSCRIBER_ADDRESS_ID) classname = "selectedDiv";
    return classname;
  }
  checkDeliveryAddress(deliveryAddressObject) {
    let flag = false;
    if (this.selctedDeliveryAddressId == deliveryAddressObject.SUBSCRIBER_ADDRESS_ID) flag = true;
    return flag;
  }

  updateSelectedDeliveryAddressId(addressObject) {

    if (this.commonService.STORE_CHECK_PINCODE_AT_CHECKOUT_FLAG) {
      this.pincodeMethodsService.checkDeliveryLocationPincodeAPIRequestObject.PINCODE = addressObject.ADDRESS_PINCODE;
      this.pincodeMethodsService.checkDeliveryLocationPincodeAPI();
      (async () => {
        await this.commonService.delay(ApplicationConstants.wait_time);
        this.openPincodeDialog();
        if (this.pincodeMethodsService.pincodeAvailablity == ApplicationConstants.PINCODE_AVAILABLITY_AVAILABLE) this.selctedDeliveryAddressId = addressObject.SUBSCRIBER_ADDRESS_ID;
      })();

    } else {
      this.selctedDeliveryAddressId = addressObject.SUBSCRIBER_ADDRESS_ID;
    }
  }

  // Update Delivery Address in Transaction 
  transactionObject = {};
  transactionId = this.commonService.lsTransactionId();
  updateDeliveryAddressInTransaction() {
    this.transactionObject = {
      DELIVERY_ADDRESS_ID: this.selctedDeliveryAddressId,
      STORE_ID: this.configService.getStoreID(),
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      TRANSACTION_ID: this.commonService.lsTransactionId()
    }
    this.deliveryAddressService.updateDeliveryAddressInTransaction(this.transactionObject).subscribe(data => this.handleUpdateDeliveryAddressInTransactionSuccess(data), error => this.handleError(error));
  }

  handleUpdateDeliveryAddressInTransactionSuccess(data) {
    if (data.STATUS == "OK") {
      if (this.commonService.deliverySlotFlag) {
        this.deliveryTimingSlots  = [];
        this.fetchDeliverySlotApi();
      } else {
        this.showPayments();
      }
    }
  }
  // Update Delivery Address in Transaction ends

  // Fetching Payment Gateways Starts here
  paymentGatewaysArray = [];
  fetchPaymentGatewayByStoreIdAPI() {
    this.processBar = true;
    let tempObj = {
      STORE_ID: this.configService.getStoreID()
    }
    this.deliveryAddressService.fetchPaymentGatewayByStoreIdAPI(tempObj)
      .subscribe(data => this.handleFetchPaymentGatewayByStoreIdAPISuccess(data), error => this.handleError(error))
  }

  handleFetchPaymentGatewayByStoreIdAPISuccess(data) {
    if (data.STATUS == "OK") {
      this.paymentGatewaysArray = data.STORE_PAYMENT_GATEWAY_MAP;
      if (this.paymentGatewaysArray.length > 0) this.selectedPaymentsId = this.paymentGatewaysArray[0].PAYMENT_GATEWAY_TYPE_CODE;
    }

    this.processBar = false;
  }
  // Fetching Payment Gateways Ends here
  selectedPaymentsId = 0;
  getPaymentsClass(paymentsId) {
    let classname = "";
    if (paymentsId == this.selectedPaymentsId) classname = "active";
    return classname;
  }

  updatePaymentsId(paymentsId) {
    this.selectedPaymentsId = paymentsId;
  }

  paymentRequestObject = {};

  makeUpdatePaymentRequestObject() {
    let paymentTypeId = 0;
    if (this.selectedPaymentsId == ApplicationConstants.CASH_0N_DELIVERY_PAYMENT_GATEWAY_TYPE_CODE) paymentTypeId = 2; //This means COD
    else if (this.selectedPaymentsId == ApplicationConstants.WALLET_PAYMENT_GATEWAY_TYPE_ID) paymentTypeId = 3; //This means wallet money
    else paymentTypeId = 1; // This means online 

    this.paymentRequestObject = {
      PAYMENT_GATEWAY_CODE     :  ApplicationConstants.CASH_0N_DELIVERY_PAYMENT_GATEWAY_TYPE_CODE,
      STORE_ID                 :  this.configService.getStoreID(),
      SUBSCRIBER_ID            :  this.commonService.lsSubscriberId(),
      TRANSACTION_ID           :  this.commonService.lsTransactionId(),
      PAYMENT_TYPE_ID          :  ApplicationConstants.CASH_0N_DELIVERY_PAYMENT_GATEWAY_TYPE_CODE,
      DELIVERY_STATUS_ID       :  ApplicationConstants.PENDING_DELIVERY_STATUS_TYPE_ID,
    }
  }

  updatePayment() {
    this.makeUpdatePaymentRequestObject();
    this.paymentService.updatePaymentTypeAPI(this.paymentRequestObject).subscribe(data => this.handleUpdatePayment(data), error => error)
  }

  handleUpdatePayment(data) {
    if (data.STATUS == "OK") {
      // this._router.navigate(['invoice']);
      this._router.navigate(['/collections/customer-invoice', this.commonService.lsTransactionId()]);
    }
  }
  displayLoggedInDetails = false;
  showLoggedInDetails() {
    this.showLoginOrSignUp();
    this.displayLoggedInDetails = true;
    this.displayLoginOrSignUpDiv = false;
  }

  hideLoggedInDetails() {
    this.displayLoggedInDetails = false;
  }

  gst = 0;
  deliveryCharge = 0;
  convenienceFee = 0;
  makeTransactionArray() {
    this.gst = 0; this.deliveryCharge = 0; this.convenienceFee = 0; //Initialise
    // this.invoiceDetails = [];

    if (this.transactionsService.transactionArray && this.transactionsService.transactionArray.length > 0) {
      this.transactionsService.transactionArray[0].TRANSACTION_DETAIL.forEach(element => {
        if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PRODUCT) {
          // this.invoiceDetails.push(element);
          this.gst += element.PRODUCT_GST_AMOUNT * element.PRODUCT_QUANTITY;
        }
        if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_DELIVERY_CHAGE) {
          this.deliveryCharge += element.PRODUCT_FINAL_PRICE;
        }
        if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_CONVENIENCE_FEE) {
          this.convenienceFee += element.PRODUCT_FINAL_PRICE;
        }

      });

      if(this.transactionService.getPromoCodeObject() != undefined) this.promocodeDetailsObject = this.transactionService.getPromoCodeObject(); // checklist-promocode-issue
    }
  }

  displayChangeDeliveryAddress() {
    let value = false;
    if (this.displayDeliveryAddressDiv == false && this.selctedDeliveryAddressId > 0) value = true;

    return value;
  }

  selectedDeliveryAddressObject: any = {};
  updateSelectedDeliveryAddressObject(address) {
    this.selectedDeliveryAddressObject = address;

  }

  addDeliveryAddressValidation() {
    let disabledValue = true;
    if (this.addressLine1 != "" && this.mapsService.googleAddress != "" && this.contactName != "" && this.mobileNumber != "" && this.addressPin > 0 && this.addressLabelCode > 0) disabledValue = false;
    return disabledValue;

  }

  // Sign Up 
  signupRequestObject = {};
  fName = "";
  lName = "";
  subscriberMobileNo = "";

  makeSignupRequestObject() {
    let tempSubscriberId = 0;
    tempSubscriberId = +this.commonService.lsSubscriberId();

    this.signupRequestObject = {
      APPLICATION_ID: this.commonService.applicationId,
      STORE_ID: this.configService.getStoreID(),
      SUBSCRIBER_FIRST_NAME: this.fName,
      SUBSCRIBER_LAST_NAME: this.lName,
      SUBSCRIBER_EMAIL_ID: this.signupEmail,
      SUBSCRIBER_PASSWORD: this.signupPassword,
      SUBSCRIBER_TOKEN: "",
      SUBSCRIBER_MOBILE_NR: this.subscriberMobileNo,
      SUBSCRIBER_STATUS_CODE: ApplicationConstants.SUBSCRIBER_STATUS_CODE_PENDING,
      PROVIDER_CODE: ApplicationConstants.PROVIDER_CODE_PERSONAL,
      TEMP_SUBSCRIBER_ID: tempSubscriberId,
      TEMP_SUBSCRIBER_FLAG: this.commonService.lsTempSubscriberFlag(),
      PROFILE_ID: ApplicationConstants.DEFAULT_SUBSCRIBER_PROFILE_ID,
      REFERRAL_FLAG: this.userProfileService.referralFlag(),
      REFERRAL_CODE: this.userProfileService.referralCode,
    }
  }

  pwdMatchError = false;
  validatePassAndConfirmPassword() { // here we have the 'passwords' group

    this.pwdMatchError = false;
    if (this.signupPassword != "" && this.signupConfirmPassword != "" && this.signupPassword != this.signupConfirmPassword) {
      this.pwdMatchError = true;
    }

  }
  signup() {
    if (this.isSignUpFormValid && this.pwdMatchError == false) {
      this.makeSignupRequestObject();
      this.signupService.subscriberRegistrationAPI(this.signupRequestObject).subscribe(data => this.handleSignupSuccess(data), error => this.handleError(error));
    }
  }

  handleSignupSuccess(data) {
    if (data.STATUS == "OK") {

      this.emailandphonenumberverifiationService.deleteTempSubsReqObject = {
        APPLICATION_ID: this.commonService.applicationId,
        TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
        SUBSCRIBER_EMAIL_ID: this.signupEmail,
        SUBSCRIBER_PASSWORD: this.signupPassword,
        STORE_ID: this.configService.getStoreID(),
      }

      this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
      this.emailandphonenumberverifiationService.subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;

      this.referenceMethodsService.referralFlag = false;

      this.afterSuccessfulSignUp();

    } else {
      this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
    }
  }
  // Sign Up ends

  afterSuccessfulSignUp() {
    (async () => {
      this.commonService.notifySuccessMessage(this.flashMessagesService, "User Registered Successfully.");
      await this.commonService.delay(2000);
      this._router.navigate(['/collections/otp']);
    })();
  }

  validateSignUp() {
    let disabledValue = true;

    if (this.fName != "" && this.subscriberMobileNo != "" && this.loginEmail != "" && this.loginPassword != "") disabledValue = false;

    return disabledValue;
  }

  // new-checklist-soln-potlighar-6
  onPaymentSubmit() {
    if (this.commonService.deliverySlotFlag) {
      this.updateDeliverySlot();
    } else {
      this.checkTransactionDetailsExistsAndProceedToPay();
    }
  }

  // new-checklist-soln-potlighar-6 from here 
  // this following function ensures that atlease there is one product in cart 
  checkTransactionDetailsExistsAndProceedToPay() {
    let requestObject = {
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      TRANSACTION_ID: this.commonService.lsTransactionId()
    }
    this.subscriberService.fetchTransactionsByTransactionIdAPI(requestObject).subscribe(data => this.handleCheckTransactionDetailsExistsAndProceedToPay(data), error => error);
  }

  handleCheckTransactionDetailsExistsAndProceedToPay(pData) {
    if (pData.STATUS == "OK") {
      let isTransactionValid = false;
      if (pData.TRANSACTION && pData.TRANSACTION.length > 0 && pData.TRANSACTION[0]
        && pData.TRANSACTION[0].TRANSACTION_DETAIL && pData.TRANSACTION[0].TRANSACTION_DETAIL.length > 0) {

        pData.TRANSACTION[0].TRANSACTION_DETAIL.forEach(transactionDetailObject => {
          if (transactionDetailObject.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PRODUCT) {
            isTransactionValid = true;
          }
        });

      }

      if (isTransactionValid) {
        this.checkoutApi();
      } else {
        this.commonService.openAlertBar("Your Cart is Empty or Something went wrong. Please try again.");
        this._router.navigate(['/']);
      }
    }
  }

  public checkoutApi() {
    let requestObject = {
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
      TRANSACTION_ID: this.commonService.lsTransactionId(),
    }


    this.subscriberService.checkoutAPI(requestObject).subscribe(data => this.handleCheckoutApiSuccess(data), error => error);

  }

  handleCheckoutApiSuccess(data) {
    if (data.STATUS == "OK") {
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.transactionService.unavailableProductsArray = data.UNAVAILABLE_PRODUCT_LIST;

      this.transactionService.checkoutApiCalledFlag = true;

      (async () => {
        await this.commonService.delay(ApplicationConstants.wait_time);
        if (this.transactionsService.unavailableProductsArray.length > 0) {
          this.transactionService.releaseQuantity(); 
          this.disablePlaceOrderButton = false;
          this.openDialog();
        } else {
          this.paymentUpdateToTransaction();
        }
      })();

    }
  }

  // new-checklist-soln-potlighar-6 till here 

  paymentUpdateToTransaction() {
    switch (this.selectedPaymentsId) {
      case ApplicationConstants.INSTAMOJO_PAYMENT_GATEWAY_TYPE_CODE:
        this.triggerInstamojoPaymentGateway();
        break;
      case ApplicationConstants.CASH_0N_DELIVERY_PAYMENT_GATEWAY_TYPE_CODE:
        this.updatePayment();
        break;
      case ApplicationConstants.PAYPAL_PAYMENT_GATEWAY_TYPE_CODE:
        this.fetchPaymentGatewayCredentialsByStoreId();
        this.createTransactionPaymentGatewayHistory();
        this.createPaymentGatewayApiLog();
        // this.updatePaymentGatewayApiLog();
        break;
      case ApplicationConstants.AUTHORIZE_NET_PAYMENT_GATEWAY_TYPE_CODE:
        this.fetchPaymentGatewayCredentialsByStoreId();
        this.createTransactionPaymentGatewayHistory();
        this.createPaymentGatewayApiLog();
        // this.updatePaymentGatewayApiLog();
        break;
      case ApplicationConstants.RAZORPAY_PAYMENT_GATEWAY_TYPE_CODE: //RazorpayPayment
        this.paymentGatementCode = ApplicationConstants.RAZORPAY_PAYMENT_GATEWAY_TYPE_CODE;
        this.updatePaymentMethodInTransaction();
        this.razorpayOrderRequestAPI()
        break;
      case ApplicationConstants.WALLET_PAYMENT_GATEWAY_TYPE_CODE:
        this.updatePayment();
        break;
    }
  }

  paymentGatementCode = 0;

  updatePaymentMethodInTransaction() {
    this.transactionObject = {
      PAYMENT_GATEWAY_CODE: this.paymentGatementCode,
      STORE_ID: this.configService.getStoreID(),
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      TRANSACTION_ID: this.commonService.lsTransactionId()
    }
    this.deliveryAddressService.updateTransaction(this.transactionObject)
      .subscribe(data => this.handleUpdatePaymentMethodInTransactionSuccess(data), error => this.handleError(error));
  }

  handleUpdatePaymentMethodInTransactionSuccess(data) {
    if (data.STATUS == "OK") {

    }
  }

  // RazorpayPayment
  // convert-rupees-to-paise
  razorpayOrderRequestAPI() {
    let reqObj = {
      ORDER_AMOUNT: this.commonService.convertRupeesToPaise(this.transactionsService.transactionArray[0].INVOICE_FINAL_AMOUNT), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      CURRENCY: "INR",
      TRANSACTION_ID: this.commonService.lsTransactionId(),
      STORE_ID: this.commonService.storeObject.STORE_ID
    }

    // currency from store if stored 
    // if (this.commonService.storeObject.STORE_CURRENCY_NAME && this.commonService.storeObject.STORE_CURRENCY_NAME != 'null') {
    //   reqObj.CURRENCY = this.commonService.storeObject.STORE_CURRENCY_NAME;
    // }

    this.paymentService.razorpayOrderRequestAPI(reqObj).subscribe(data => this.handleRazorpayOrderRequestApi(data), error => error);
  }

  razorpayPaymentLogId = 0;
  handleRazorpayOrderRequestApi(data) {

    if (data.STATUS == "OK") {

      this.razorpayPaymentLogId = data.RAZOPAY_PAYMENT_LOG_ID;
      
      let razorpayKey = "";
      if(data.RAZOPAY_KEY && data.RAZOPAY_KEY != 'null')  razorpayKey = data.RAZOPAY_KEY;
      
      let orderObject = JSON.parse(data.ORDER);

      // convert-rupees-to-paise
      let RazorpayOptions = {
        "key": razorpayKey, // Enter the Key ID generated from the Dashboard
        "amount": this.commonService.convertRupeesToPaise(this.transactionsService.transactionArray[0].INVOICE_FINAL_AMOUNT), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": this.commonService.storeObject.STORE_NAME,
        "description": "Test Transaction",
        "image": this.commonService.storeObject.STORE_LOGO_URL,
        "order_id": orderObject.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": (response) => {
          this.handleRazorpayPayment(response);
        },
        "modal": { // new-checklist-soln-potlighar-6
          "ondismiss": () => {

            this.ngZone.run(() =>
              this.disablePlaceOrderButton = false
            );

            this.transactionService.releaseQuantity();
          }
        },
        "prefill": {
          "name": "",
          "email": "",
          "contact": ""
        },
        "notes": {
          "address": ""
        },
        "theme": {
          "color": "#3399cc"
        }
      };

      // this is the detail pre populated in the payment popup
      let subscriberObject: any = this.commonService.lsSubscriberObject();
      if (subscriberObject != undefined) {
        RazorpayOptions.prefill.name = subscriberObject.name;
        RazorpayOptions.prefill.email = subscriberObject.email;
        RazorpayOptions.prefill.contact = subscriberObject.mobile;
      }

      // payment pop up color (store color) 
      if (this.commonService.storeObject.STORE_THEME_HEX_COLOR_CODE && this.commonService.storeObject.STORE_THEME_HEX_COLOR_CODE != 'null') {
        RazorpayOptions.theme.color = this.commonService.storeObject.STORE_THEME_HEX_COLOR_CODE;
      }

      // currency from store if stored 
      // if (this.commonService.storeObject.STORE_CURRENCY_NAME && this.commonService.storeObject.STORE_CURRENCY_NAME != 'null') {
      //   RazorpayOptions.currency = this.commonService.storeObject.STORE_CURRENCY_NAME;
      // }


      //@ts-ignore
      var rzp1 = new Razorpay(RazorpayOptions);
      rzp1.open();

      rzp1.on('payment.failed', (response) => {
        // alert(response.error.code);
        // alert(response.error.description);
        // alert(response.error.source);
        // alert(response.error.step);
        // alert(response.error.reason);
        // alert(response.error.metadata.order_id);
        // alert(response.error.metadata.payment_id);
        this.handleRazorpayFailureResponse(response);
      });

    } else if(data.STATUS == 'FAIL') {
        this.commonService.openAlertBar(data.ERROR_MSG);
    }
  }

  handleRazorpayPayment(pRazorpayObject){
    
    let responseObject = {
      RAZORPAY_PAYMENT_ID     :  pRazorpayObject.razorpay_payment_id,
      RAZORPAY_ORDER_ID       :  pRazorpayObject.razorpay_order_id,
      RAZORPAY_SIGNATURE      :  pRazorpayObject.razorpay_signature,
      TRANSACTION_ID          :  this.commonService.lsTransactionId(),
      RAZOPAY_PAYMENT_LOG_ID  :  this.razorpayPaymentLogId,
      STORE_ID                :   this.configService.getStoreID()
    };

    this.paymentService.updateRazorPayResposeAPI(responseObject)
      .subscribe(data => this.handleUpdateRazorpayResponseAPI(data), error => error);
  }

  handleRazorpayFailureResponse(pResponseObject) {
    console.log("failureResponseObject", pResponseObject)
  }

  handleUpdateRazorpayResponseAPI(data) {
    if (data.STATUS == "OK") {
      // this.commonService.openAlertBar("Payment Succussful");
      this.ngZone.run(() => 
      this._router.navigate(['/collections/customer-invoice', this.commonService.lsTransactionId()])
    );
      
    } else if (data.STATUS == "FAIL") {
      this.commonService.openAlertBar(data.ERROR_MSG);
    }
  }

  triggerInstamojoPaymentGateway() {

    this.processBar = true;

    this.paymentService.createAPaymentRequestAPI(this.configService.getStoreID(),
      this.commonService.lsSubscriberId(),
      this.commonService.lsTransactionId()).subscribe(data => this.handleCreatePaymentRequestAPIResponse(data),
        error => this.handleError(error));;
  }

  handleCreatePaymentRequestAPIResponse(data) {

    if (data.STATUS == "OK") {
      let paymentURL: string = data.PAYMENT_REQUESTED_LONGURL;
      window.open(paymentURL, "_self")
    }

    this.processBar = false;
  }

  //Fetch Payment Gateway Credentials Starts here 
  paymentGatewayCredentialsArray: IPaymentGatewayCredentialsResponse[];
  fetchPaymentGatewayCredentialsByStoreId() {
    this.processBar = true;
    let tempObj = {
      STORE_ID: this.configService.getStoreID()
    }
    this.deliveryAddressService.fetchPaymentGatewayCredentialsByStoreId(tempObj).subscribe(data => this.handleFetchPaymentGatewayCredentialsByStoreIdSuccess(data), error => this.handleError(error))
  }

  handleFetchPaymentGatewayCredentialsByStoreIdSuccess(data) {
    if (data.STATUS == "OK") {
      this.paymentGatewayCredentialsArray = data.PAYMENT_GATEWAY_CREDENTIALS;
    }
    this.processBar = false;
  }
  //Fetch Payment Gateway Credentials Ends here     

  //Create Payment Gateway History Starts here 
  createTransactionPaymentGatewayHistory() {
    let tempObj = {
      TRANSACTION_ID: this.commonService.lsTransactionId(),
      PAYMENT_GATEWAY_TYPE_CODE: this.selectedPaymentsId,
      PAYMENT_REQUEST_ID: this.paypalResponseObject.id //This will be implement once everything is done
    }
    this.deliveryAddressService.createPaymentGatewayHistoryAPI(tempObj).subscribe(data => this.handleCreateTransactionPaymentGatewayHistorySuccess(data), error => this.handleError(error));
  }

  handleCreateTransactionPaymentGatewayHistorySuccess(data) {
    if (data.STATUS == "OK") {
      console.log("createTransactionPaymentGatewayHistory");
      console.log(data);
    }
    this.processBar = false;
  }
  //Create Payment Gateway History Starts here 

  //Create Payment API Log Starts here 
  paypalResponseObject = { id: "" };
  paymentApiLogId = 0;
  createPaymentGatewayApiLog() {
    let tempObj = {
      PAYMENT_GATEWAY_TYPE_CODE: this.selectedPaymentsId,
      API_TYPE_CODE: 1,
      PAYMENT_REQUEST_ID: this.paypalResponseObject.id,
      REQUEST_CONTENT: "",//Request Object that we are passing to Payment API
      RESPONSE_CONTENT: "",
    }
    this.deliveryAddressService.createPaymentAPILogAPI(tempObj).subscribe(data => this.handleCreatePaymentGatewayApiLogSuccess(data), error => this.handleError(error));
  }

  handleCreatePaymentGatewayApiLogSuccess(data) {
    if (data.STATUS == "OK") {
      console.log("createPaymentAPILogAPI");
      console.log(data);
      this.paymentApiLogId = data.AUTHORIZENET_PAYMENT_API_LOG_ID;
      this.updatePaymentGatewayApiLog();
    }
    this.processBar = false;
  }
  //Create Payment API Log Ends here 

  //Update Payment API Log Starts here 
  updatePaymentGatewayApiLog() {
    let tempObj = {
      PAYMENT_API_LOG_ID: this.paymentApiLogId,
      PAYMENT_GATEWAY_TYPE_CODE: this.selectedPaymentsId,
      API_TYPE_CODE: 1,
      PAYMENT_REQUEST_ID: this.paypalResponseObject.id,
      REQUEST_CONTENT: "",
      RESPONSE_CONTENT: "",
    }
    this.deliveryAddressService.updatePaymentAPILogAPI(tempObj).subscribe(data => this.handleUpdatePaymentGatewayApiLogSuccess(data), error => this.handleError(error));
  }

  handleUpdatePaymentGatewayApiLogSuccess(data) {
    if (data.STATUS == "OK") {
      // this._router.navigate(['invoice']);
      this._router.navigate(['/collections/customer-invoice', this.commonService.lsTransactionId()]);
    }
    this.processBar = false;
  }

  //Update Payment API Log Ends here 

  // Apply Promocode Starts here
  applyPromocodeRequestObject = {};
  promocode = "";
  disablePromocodeInputAndApplyButton = false;
  invalidPromocodeNotification = "";

  makeApplyPromocodeRequestObject() {
    this.applyPromocodeRequestObject = {
      STORE_ID: this.configService.getStoreID(),
      PROMO_CODE: this.promocode,
      SUBSCRIBER_ID: + this.commonService.lsSubscriberId(),
      TRANSACTION_ID: + this.commonService.lsTransactionId()
    }
  }

  applyPromocode() {
    this.makeApplyPromocodeRequestObject();
    this.subscriberService.applyPromoCodeAPI(this.applyPromocodeRequestObject)
      .subscribe(data => this.handleApplyPromocodeSuccess(data), error => this.handleError(error))
  }

  handleApplyPromocodeSuccess(data) {
    if (data.STATUS == "OK") {

      this.transactionsService.transactionArray = data.TRANSACTION;
      this.transactionsService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;

      data.TRANSACTION.forEach(element => {
        element.TRANSACTION_DETAIL.forEach(element => {
          if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PROMO_CODE) {
            this.promocodeDetailsObject = element;
          }
        });
      });

      //disable promocode input box and apply button
      this.disablePromocodeInputAndApplyButton = true;

      //empty the promocode input 
      this.promocode = "";

    }
    if (data.STATUS == "FAIL") {
      (async () => {
        this.invalidPromocodeNotification = data.ERROR_MSG;
        await this.commonService.delay(2000);
        this.invalidPromocodeNotification = "";
      })();

      console.log(this.invalidPromocodeNotification);
    }
  }
  // Apply Promocode Ends here

  // cancel Promocode Starts here
  cancelPromocodeRequestObject = {};
  makeCancelPromocodeRequestObject() {
    this.cancelPromocodeRequestObject = {
      STORE_ID            :     this.configService.getStoreID(),
      PROMO_CODE          :     this.promocodeDetailsObject.PROMO_CODE,
      SUBSCRIBER_ID       :     + this.commonService.lsSubscriberId(),
      TRANSACTION_ID      :     + this.commonService.lsTransactionId()
    }
  }

  cancelPromocode() {
    this.makeCancelPromocodeRequestObject();
    this.subscriberService.cancelPromoCodeAPI(this.cancelPromocodeRequestObject)
      .subscribe(data => this.handleCancelPromocodeSuccess(data), error => this.handleError(error))
  }

  handleCancelPromocodeSuccess(data) {
    if (data.STATUS == "OK") {
      this.transactionsService.transactionArray = data.TRANSACTION;
      this.transactionsService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;

      this.promocodeDetailsObject = this.promocodeDetailsSampleObject;
      this.disablePromocodeInputAndApplyButton = false;
    }
  }
  // cancel Promocode Ends here

  //Applied Promocode Displaying Logic
  promocodeDetailsObject = this.promocodeDetailsSampleObject;

  displayAppyWalletButton = true;
  applyWalletMoney() {
    this.walletMethodsService.applyWalletMoneyAPI();
    this.displayAppyWalletButton = false;

    (async () => {

      await this.delay(500);

      if (this.walletMethodsService.walletPaymentGatewayType == ApplicationConstants.WALLET_PAYMENT_GATEWAY_TYPE_ID) {
        this.flagsService.completelyWalletPaymentFlag = true; // This means completely wallet payments is done 
        this.selectedPaymentsId = ApplicationConstants.WALLET_PAYMENT_GATEWAY_TYPE_CODE;
        // this.transactionsService.refreshWalletMoney();
      }

    })();
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  cancelWalletMoney() {
    this.walletMethodsService.cancelWalletMoneyAPI();
    this.displayAppyWalletButton = true;
    this.selectedPaymentsId = 1;
    this.flagsService.completelyWalletPaymentFlag = false;
    // this.transactionsService.refreshWalletMoney();
  }

  mandatoryFieldsValidation() {
    let disable = true;
    if (this.loginEmail != "" && this.loginPassword != "") disable = false;
    return disable;
  }

  gotoResetPassword() {
    this._router.navigate(['/reset-password']);
  }
  referralCode = "";
  onValueIn() {
    this.userProfileService.referralCode = this.referralCode;
  }

  /** Guest CheckIn */
  displayGuestCheckIn = false;
  hideGuestCheckIn() {
    this.displayGuestCheckIn = false;
  }
  showGuestCheckIn() {
    this.displayGuestCheckIn = true;
  }

  guestCheckInFormInValid = true;
  validateGuestCheckInForm(ngObject) {
    this.guestCheckInFormInValid = true;
    if (ngObject._parent.form.status == "VALID") {
      this.guestCheckInFormInValid = false;
    }
  }

  guestName = "";
  guestEmail = "";
  guestMobileNumber: any;
  guestCheckIn() {
    if (this.guestCheckInFormInValid == false) {
      this.makeGuestCheckInRequestObjectObject();
      this.signupService.subscriberRegistrationAPI(this.guestCheckInRequestObject).
        subscribe(data => this.socialSignupService.handleGuestCheckInSuccess(data), error => error);
    }
  }

  guestCheckInRequestObject = {};
  makeGuestCheckInRequestObjectObject() {
    this.guestCheckInRequestObject = {
      APPLICATION_ID: this.commonService.applicationId,
      SUBSCRIBER_FIRST_NAME: this.guestName,
      SUBSCRIBER_EMAIL_ID: this.guestEmail,
      SUBSCRIBER_TOKEN: "",
      SUBSCRIBER_STATUS_CODE: ApplicationConstants.SUBSCRIBER_STATUS_CODE_ACTIVATED,
      PROVIDER_CODE: ApplicationConstants.PROVIDER_CODE_GUEST_CHECK_IN,
      TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      TEMP_SUBSCRIBER_FLAG: 1,
      PROFILE_ID: ApplicationConstants.DEFAULT_SUBSCRIBER_PROFILE_ID,
      STORE_ID: this.configService.getStoreID(),
      SUBSCRIBER_MOBILE_NR: this.guestMobileNumber,
      REFERRAL_FLAG: this.referenceMethodsService.referralFlag,
      // REFERRAL_URL             : this.referenceMethodsService.referralUrl,// Checklist-3
    }
  }

  handleGuestCheckInSuccess(data) {

  }
  /** Guest CheckIn ends */

  dayIndex = 0;
  updateDayIndex(dayIndex) {
    this.dayIndex = dayIndex;
    this.timeIndex = 0;
    this.updateDeliveryTimingSlotId();
    if(this.timeOfTheDay && this.timeOfTheDay.length > 0 && this.timeOfTheDay[dayIndex].length > 0 ){
      this.updateSelectedDeliverySlotTime(this.formatTime(this.timeOfTheDay[dayIndex][0].START_TIME) +'-'+ this.formatTime(this.timeOfTheDay[dayIndex][0].END_TIME));
    }
  }

  timeIndex = null;
  updateTimeIndex(code) {
    this.timeIndex = code;
    this.updateDeliveryTimingSlotId();
  }

  // Delivery Time Slots 
  displayDeliveryTimingSlotsDiv = false;
  noOfDaysToBeShown = 0;
  daysOfTheWeek = [];
  tempTimeOfTheDay = [];
  deliveryOptions: any;
  deliveryOptionCode = 0;

  // the following 2 things are only if normal or express delivery along with timing slots is selected from backend 
  deliveryTimingSlots = [];
  timingSlotId = 0;

  validateDeliveryOptions() {
    let disableButton = true;
    // Delivery Option shoule be selected 
    if (this.deliveryOptionCode > 0) {
      disableButton = false;
      // if Delivery Option is (1 or 2) and 3 also there and also timing slots are available then user needs to select delivery slot id 
      if ((this.deliveryOptionCode == 1 || this.deliveryOptionCode == 2) && this.deliveryTimingSlots.length > 0) {
        disableButton = true;
        if (this.timingSlotId > 0) disableButton = false;
      }
      // if Only option 3 is availabe then delivery timing slot id > 0  
      if (this.deliveryOptionCode == 3) {
        disableButton = true;
        if (this.deliveryTimingSlotId > 0) disableButton = false;
      }
    }
    return disableButton;
  }

  formatTime(pTime) {
    let postFix = "AM";
    let timeObject = pTime.split(":");
    if (timeObject[0] > 12) {
      postFix = "PM";
      timeObject[0] = timeObject[0] - 12;
    }
    return timeObject[0] + ":" + timeObject[1] + " " + postFix;
  }

  fetchDeliverySlotApi() {
    let tempObj = {
      APPLICATION_ID: this.commonService.applicationId,
      STATUS_CODE: ApplicationConstants.STATUS_CODE_ENABLE,
      STORE_ID: this.configService.getStoreID(),
      PINCODE: this.selectedDeliveryAddressObject.ADDRESS_PINCODE,
      LATITUDE: this.selectedDeliveryAddressObject.ADDRESS_LATITUDE,
      LONGITUDE: this.selectedDeliveryAddressObject.ADDRESS_LONGITUDE,
    }

    this.transactionsService.fetchDeliverySlotApi(tempObj).subscribe(data => this.handleFetchDeliverySlotsApi(data), error => error);
  }

  handleFetchDeliverySlotsApi(data) {
    if (data.STATUS == "OK") {

      if (data.DELIVERY_OPTION && data.DELIVERY_OPTION.length > 0) this.deliveryOptions = data.DELIVERY_OPTION[0];
      if (this.deliveryOptions != undefined) {
        this.showDeliveryTimingSlots();

        if ((this.deliveryOptions.NORMAL_DELIVERY == 'true' || this.deliveryOptions.EXPRESS_DELIVERY == 'true') && this.deliveryOptions.DELIVERY_SLOT == 'true') { // 1 is Normal Delivery 
          if (this.deliveryOptions.DELIVERY_SLOT_ARRAY && this.deliveryOptions.DELIVERY_SLOT_ARRAY.length > 0) {

            this.deliveryOptions.DELIVERY_SLOT_ARRAY.forEach(timingSlot => {
              let tempObj = {
                DELIVERY_SLOT_ID: timingSlot.DELIVERY_SLOT_ID,
                FROM: timingSlot.START_TIME,
                TO: timingSlot.END_TIME,
              }
              this.deliveryTimingSlots.push(tempObj);
            });
          }
        }

        if (this.deliveryOptions.DELIVERY_SLOT == 'true') {
          this.noOfDaysToBeShown = this.deliveryOptions.DELIVERY_SLOT_ARRAY[0].NO_OF_DAYS_VISIBLE;
          this.makeDaysOfTheWeek(this.deliveryOptions.DELIVERY_SLOT_ARRAY);
        }

        this.selectFirstDeliveryOptionByDefault();

      } else {
        this.showPayments();
      }

    }
  }

  selectFirstDeliveryOptionByDefault() {
    // if(this.deliveryOptions.NORMAL_DELIVERY == 'true'){
    //   this.deliveryOptionCode = 1;
    // } else if(this.deliveryOptions.EXPRESS_DELIVERY == 'true'){
    //   this.deliveryOptionCode = 2;
    // } else {
    //   this.deliveryOptionCode = 3;
    // }
  }

  makeDaysOfTheWeek(deliverySlotsArray) {
    let currentDay = true;
    deliverySlotsArray.forEach(element => {

      let index = this.daysOfTheWeek.indexOf(element.DAY_OF_WEEK);

      if (index == -1) { // this is for removing duplicates

        this.daysOfTheWeek.push(element.DAY_OF_WEEK);
        let tempArray = [];
        tempArray.push(element);
        this.tempTimeOfTheDay.push(tempArray);

      } else {
        this.tempTimeOfTheDay[index].push(element);
      }
    });

    this.formatData();
  }

  isTimeValid(data) {
    let valid = true;

    let timeObject = data.START_TIME.split(":");
    let hour = timeObject[0];
    let minute = timeObject[1];
    let second = timeObject[2];

    let currentHour = 0;
    let currentMin = 0;
    let currentSecond = 0;

    this.myDate = new Date();
    let date = this.myDate.setDate(this.myDate.getDate());
    let currentTime = this.datePipe.transform(date, 'HH-mm');

    let currentTimeObject = currentTime.split("-");
    currentHour = Number(currentTimeObject[0]);
    currentMin = Number(currentTimeObject[1]);

    let bufferTimeHour = 0;
    let bufferTimeMin = 0;
    let bufferTimeSec = 0;

    if (data.BUFFER_TIME_TYPE_CODE == ApplicationConstants.BUFFER_TIME_TYPE_CODE_HOUR) bufferTimeHour = data.BUFFER_TIME;
    if (data.BUFFER_TIME_TYPE_CODE == ApplicationConstants.BUFFER_TIME_TYPE_CODE_MIN) bufferTimeMin = data.BUFFER_TIME;
    if (data.BUFFER_TIME_TYPE_CODE == ApplicationConstants.BUFFER_TIME_TYPE_CODE_SECOND) bufferTimeSec = data.BUFFER_TIME;

    currentSecond += bufferTimeSec;

    currentSecond += bufferTimeSec;
    if (currentSecond > 60) {
      currentMin += Math.floor(currentSecond / 60);
    }

    currentMin += bufferTimeMin;
    if (currentMin > 60) {
      currentHour += Math.floor(currentMin / 60);
      currentMin = currentMin % 60;
    }


    currentHour += bufferTimeHour;

    if (currentHour > hour || (currentHour == hour && currentMin > minute)) valid = false;

    return valid;
  }

  timeOfTheDay = [];
  formatData() {
    for (let i = 0; i < this.noOfDaysToBeShown; i++) {
      this.myDate = new Date();
      let date = this.myDate.setDate(this.myDate.getDate() + i);
      let formatedDate = this.datePipe.transform(date, 'dd-MM-yyyy');

      this.datesArray.push(formatedDate);
      let day = this.getDayNameByIndex(this.myDate.getDay());
      this.daysArray.push(day);
      // by using day get the index and put that in the first index
      let index = this.daysOfTheWeek.indexOf(day);

      let timesArray = this.tempTimeOfTheDay[index];
      // if(i==0) means current day 
      if (i == 0) {
        let tempTimesArray = [];
        timesArray.forEach(element => {
          if (this.isTimeValid(element)) tempTimesArray.push(element);
        });
        timesArray = tempTimesArray;
      }
      this.timeOfTheDay.push(timesArray);
    }

    if(this.datesArray && this.datesArray.length > 0) {
      this.updateSelectedDeliverySlotDay(this.datesArray[0]+' '+this.daysArray[0]);
    }

    this.updateDeliveryTimingSlotId();
  }

  getDayNameByIndex(index) {
    let day = "";
    if (index == 0) day = "Sunday";
    if (index == 1) day = "Monday";
    if (index == 2) day = "Tuesday";
    if (index == 3) day = "Wednesday";
    if (index == 4) day = "Thursday";
    if (index == 5) day = "Friday";
    if (index == 6) day = "Saturday";
    return day;
  }

  deliveryTimingSlotId = 0;

  updateDeliveryTimingSlotId() {
    if (this.timeOfTheDay[this.dayIndex] != undefined && this.timeOfTheDay[this.dayIndex][this.timeIndex] != undefined) this.deliveryTimingSlotId = this.timeOfTheDay[this.dayIndex][this.timeIndex].DELIVERY_SLOT_ID;
  }

  chekValidTime(pDate, pStartTime) {

    let invalidFlag = false;

    this.myDate = new Date();
    let date = this.myDate.setDate(this.myDate.getDate());
    let formatedCurrentDate = this.datePipe.transform(date, 'dd-MM-yyyy');

    if (pDate == formatedCurrentDate) {
      this.myDate = new Date();
      let date = this.myDate.setDate(this.myDate.getDate());
      let currentTime = this.datePipe.transform(date, 'HH-mm');

      let currentTimeObject = currentTime.split("-");
      let currentHour = currentTimeObject[0];
      let currentMin = currentTimeObject[1];


      let selectedTimeObject = pStartTime.split(':');
      let selectedHour = selectedTimeObject[0];
      let selectedMin = selectedTimeObject[1];

      if (selectedHour > currentHour || (selectedHour == currentHour && selectedMin > currentMin)) invalidFlag = true;
    }

    return invalidFlag;
  }

  selectedDeliveryOption = "";
  selectedDeliverySlotDay = "";
  selectedDeliverySlotTime = "";

  getDeliveryCharge() {
    let deliveryCharge = 0;
    if(!this.transactionService.placeOrderClicked){
      if (this.deliveryOptionCode == 1) {
        deliveryCharge = this.deliveryOptions.NORMAL_DELIVERY_COST;
      } else if (this.deliveryOptionCode == 2) {
        deliveryCharge = this.deliveryOptions.EXPRESS_DELIVERY_COST;
      } else {
        deliveryCharge = this.getDeliverySlotCharges();
      }
    }
    return deliveryCharge;
  }

  updateDeliverySlot() {

    let requestObject = {
      STORE_ID: this.configService.getStoreID(),
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      TRANSACTION_ID: this.commonService.lsTransactionId(),
      DELIVERY_SLOT_ID: this.deliveryTimingSlotId,
      DELIVERY_OPTION_ID: this.deliveryOptions.DELIVERY_OPTION_ID,
      DELIVERY_CHARGES: this.getDeliveryCharge(),
      PRODUCT_GST_PERCENTAGE: this.transactionService.getMaxGSTPercentageInTheProductsInCart(),
      PRODUCT_GST_AMOUNT: this.transactionService.getGSTAmountOfDeliverySlotCharges(this.getDeliveryCharge()),
      DELIVERY_OPTION: this.selectedDeliveryOption,
      DELIVERY_SLOT_DAY: this.selectedDeliverySlotDay,
      DELIVERY_SLOT_TIME: this.selectedDeliverySlotTime,
    };
    this.transactionService.applyDeliverySlotAPI(requestObject).subscribe(data => this.handleUpdateDeliverySlot(data), error => error)
  }

  handleUpdateDeliverySlot(data) {
    if (data.STATUS == "OK") {
      this.transactionService.placeOrderClicked = true;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.paymentUpdateToTransaction();
    }
  }

  getDeliverySlotCharges() {
    let deliverySlotCharge = 0;
    if (this.timeOfTheDay[this.dayIndex] != undefined
      && this.timeOfTheDay[this.dayIndex][this.timeIndex] != undefined
      && this.timeOfTheDay[this.dayIndex][this.timeIndex].DELIVERY_CHARGES != undefined) deliverySlotCharge = this.timeOfTheDay[this.dayIndex][this.timeIndex].DELIVERY_CHARGES;
    return deliverySlotCharge;
  }

  // OTP CheckIn Logic Starts 

  isOtpFormValid = false;
  otpLoginFormValidation(ngObject) {
    this.isOtpFormValid = false;
    if (ngObject._parent.form.status == "VALID") this.isOtpFormValid = true;
  }

  otpCheckInRequestObject: any;
  otpFirstname: string;
  otpMobileNumber: number;

  makeOtpCheckInRequestObjectObject() {
    this.otpCheckInRequestObject = {
      APPLICATION_ID: this.commonService.applicationId,
      SUBSCRIBER_FIRST_NAME: this.otpFirstname,
      SUBSCRIBER_STATUS_CODE: ApplicationConstants.SUBSCRIBER_STATUS_CODE_ACTIVATED,
      PROVIDER_CODE: ApplicationConstants.PROVIDER_CODE_OTP_CHECK_IN,
      TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      TEMP_SUBSCRIBER_FLAG: 1,
      PROFILE_ID: ApplicationConstants.DEFAULT_SUBSCRIBER_PROFILE_ID,
      STORE_ID: this.configService.getStoreID(),
      SUBSCRIBER_MOBILE_NR: this.otpMobileNumber
    };
    console.log("make ends");
  }
  otpCheckIn() {
    if (this.isOtpFormValid) {
      this.makeOtpCheckInRequestObjectObject();
      this.signupService.subscriberRegistrationAPI(this.otpCheckInRequestObject)
        .subscribe(data => this.handleOtpCheckInSuccess(data), error => error);
    }
  }

  handleOtpCheckInSuccess(data) {
    if (data.STATUS == "OK") {
      this.emailandphonenumberverifiationService.deleteTempSubsReqObjectThroughOtp = {
        TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
        SUBSCRIBER_MOBILE_NR: this.otpMobileNumber,
        STORE_ID: this.configService.getStoreID(),
      }

      this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
      this.emailandphonenumberverifiationService.subscriberId =  data.SUBSCRIBER.SUBSCRIBER_ID;
      
      this._router.navigate(['/collections/mobile-otp']);
      
      this.referenceMethodsService.referralFlag = false;
    }
  }
  // OTP CheckIn Logic Ends 

  // addon concept 

  fetchProduct(pTransactionDetailObject){
    let requestObject = {
      STORE_ID                 : this.configService.getStoreID(),
      SUBSCRIBER_ID            : this.commonService.lsSubscriberId(),
      PRODUCT_ID               : pTransactionDetailObject.PRODUCT_ID
    }
    this.productService.fetchProductByProductId(requestObject).subscribe( data => this.handleFetchProduct(data, pTransactionDetailObject), 
                                                                          error => error);
  }

  handleFetchProduct(pData, pTransactionDetailObject){
    if(pData.STATUS == "OK"){
      let productArray  = pData.PRODUCT;
      if(pTransactionDetailObject != undefined) productArray[0].TRANSACTION_DETAIL = pTransactionDetailObject;
      this.openVarianceDialog(productArray[0]);
    }
  }

  // Dialog
  openVarianceDialog(pProductDetail): void {
    const dialogRef = this.dialog.open(VarianceDialog, {
      width: '600px',
      height: '500px',
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
      data : pTransactionDetailsObject
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  //Variance/AddOns ends

  checkSubscriberHasEmailAndUpdateDeliveryAddress(){
    //  new-checklist-1-soln-5
    if (this.selctedDeliveryAddressId == 0) {
      this.commonService.openAlertBar("Please select an address to continue");
    }
    this.fetchSubcriberDetailsBySubscriberId();
  }

  subscriberIdPresent : boolean;
  fetchSubcriberDetailsBySubscriberId(){
    this.subscriberIdPresent = false;
    let tempObj = {
      APPLICATION_ID  : this.commonService.applicationId,
      SUBSCRIBER_ID   : this.commonService.lsSubscriberId()
    }

    this.subscriberService.fetchSubscriberAPI(tempObj).subscribe(data => this.handleFetchSubcriberDetailsBySubscriberIdSuccess(data), error => error);
  }

  handleFetchSubcriberDetailsBySubscriberIdSuccess(data){

    if(data.STATUS == "OK"){
      if(data.SUBSCRIBER && data.SUBSCRIBER.length > 0 && data.SUBSCRIBER[0].SUBSCRIBER_EMAIL_ID
        && data.SUBSCRIBER[0].SUBSCRIBER_EMAIL_ID != '' && data.SUBSCRIBER[0].SUBSCRIBER_EMAIL_ID != 'null'
        && data.SUBSCRIBER[0].SUBSCRIBER_EMAIL_ID != null) this.subscriberIdPresent = true; 

        if(this.subscriberIdPresent){
          this.subscriberEmailAddressDiv = false; 
          this.updateDeliveryAddressInTransaction();
        } else {
          this.subscriberEmailAddressDiv = true;
        }
    }
  }

  subscriberEmailId : string;
  subscriberEmailAddressDiv : boolean = false;
  updateSubscriberEmailId(){
    if(this.subscriberEmailId && this.subscriberEmailId != '' ){
      let requestObject = {
        SUBSCRIBER_ID         : this.commonService.lsSubscriberId(),
        SUBSCRIBER_EMAIL_ID   : this.subscriberEmailId,
        SEND_EMAIL            : false
      }
      this.subscriberService.updateSubscriberEmailIdAPI(requestObject).subscribe(data => this.handleUpdateSubscriberEmailIdAPISuccess(data), error => error)
    } else {
      this.commonService.openAlertBar("Please enter your email address");
    }
    
  }

  handleUpdateSubscriberEmailIdAPISuccess(pData){
    if(pData.STATUS == "OK"){
      this.checkSubscriberHasEmailAndUpdateDeliveryAddress();
    } else if(pData.STATUS == "FAIL"){
      this.commonService.openAlertBar(pData.ERROR_MSG);
    }
  }

}

// Dialog Code
export interface DialogData {
  link: string;
}

@Component({
  selector: 'unavailable-products-dialog',
  templateUrl: './unavailable_products.html',
})

export class UnavailableProductsDialog {


  /* To copy Text from Textbox */
  copyInputMessage(inputElement) {

    console.log("Hello");
    console.log(inputElement);

    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }


  constructor(private configService: ConfigService,
    public unavailableProdDialog: MatDialogRef<UnavailableProductsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public transactionsService: TransactionsService
  ) { }

  onNoClick(): void {
    this.unavailableProdDialog.close();

  }

  closeDialogue(): void {
    this.unavailableProdDialog.close();
  }

}

// Dialog Code ends

// 2nd Dialog  (for showing delivery pincode status)

@Component({
  selector: 'delivery-pincode-staus-dialog',
  templateUrl: './delivery-pincode.html',
})

export class Deliverypincode {

  constructor(private configService: ConfigService,
    public deliverypincode: MatDialogRef<Deliverypincode>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public pincodeMethodsService: PincodeMethodsService
  ) { }



  closeDialogue(): void {
    this.deliverypincode.close();

  }

}
