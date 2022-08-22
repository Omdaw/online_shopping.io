import { HeaderService } from './header.service';
import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { UserProfileService } from './user-profile.service';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionsService } from './transactions.service';
import { Subject } from 'rxjs';

// export IStoreObject{
//   {
//     "STORE": [
//       {
//         "STORE_ID": 352,
//         "STORE_NAME": "Heavenly",
//         "VENDOR_ID": 157,
//         "VENDOR_NAME": "Heavenly",
//         "VENDOR_STATUS_CODE": 1,
//         "VENDOR_STATUS_NAME": "Active",
//         "VENDOR_STATUS_TITLE": "",
//         "VENDOR_STATUS_DESC": "",
//         "STORE_LOGO_FILE_NAME": "Hevenly-Logo6.jpg",
//         "STORE_THEME_CODE": "null",
//         "STORE_TYPE_CODE": 1,
//         "STORE_TYPE_NAME": "Grocery",
//         "STORE_THEME_HEX_COLOR_CODE": "#734f96 ",
//         "PAGE_TITLE": "Heavenly",
//         "PAGE_DESCRIPTION": "",
//         "STORE_STATUS_CODE": 1,
//         "STORE_STATUS_NAME": "Active",
//         "STORE_CURRENCY_CODE": 1,
//         "STORE_CURRENCY_NAME": "INR",
//         "STORE_CURRENCY_SYMBOL": "Rs.",
//         "STORE_SHIPMENT_SERVICE_HANDLED_BY": 0,
//         "PRODUCTS_APPROVED_BY_ADMIN": "false",
//         "FLASH_MESSAGE": "This is flash messag efor heavenly - 8019567443",
//         "FLASH_MESSAGE_STATUS_CODE": 2,
//         "STORE_ADDRESS_ID": 1848,
//         "STORE_ADDRESS_LINE1": "JP Nagar 7th Phase, Bengaluru, Karnataka, India",
//         "STORE_ADDRESS_LINE2": "null",
//         "STORE_ADDRESS_AREA_ID": 39,
//         "STORE_ADDRESS_AREA_NAME": "JP Nagar 7th Phase",
//         "STORE_ADDRESS_CITY_ID": 1,
//         "STORE_ADDRESS_CITY_NAME": "Bengaluru",
//         "STORE_ADDRESS_STATE_ID": 12,
//         "STORE_ADDRESS_STATE_NAME": "Karnataka",
//         "STORE_ADDRESS_COUNTRY_ID": 1,
//         "STORE_ADDRESS_COUNTRY_NAME": "India",
//         "STORE_ADDRESS_PINCODE": "null",
//         "STORE_ADDRESS_LATITUDE": 12.8873185,
//         "STORE_ADDRESS_LONGITUDE": 77.57807509999999,
//         "STORE_ADDRESS_CREATED_DATE": "2021-01-30 17:40:07.0",
//         "STORE_ADDRESS_LAST_MODIFIED_DATE": "2021-01-30 17:40:07.0",
//         "SHOW_STORE_ADDRESS": "true",
//         "STORE_LANDMARK": "null",
//         "STORE_PRIMARY_CONTACT_ID": 400,
//         "STORE_PRIMARY_CONTACT_NAME": "Campion Software",
//         "STORE_PRIMARY_CONTACT_DESIGNATION": "owner",
//         "STORE_PRIMARY_CONTACT_LANDLINE_NR": "0264673266",
//         "STORE_PRIMARY_CONTACT_MOBILE_NR": "8019567443",
//         "STORE_PRIMARY_CONTACT_EMAIL_ID": "campionsoftware@wawbiz.com",
//         "STORE_PRIMARY_CREATED_DATE": "2020-12-10 22:03:57.0",
//         "STORE_PRIMARY_LAST_MODIFIED_DATE": "2021-01-30 17:40:07.0",
//         "STORE_SECONDARY_CONTACT_ID": "null",
//         "STORE_SECONDARY_CONTACT_NAME": "null",
//         "STORE_SECONDARY_CONTACT_DESIGNATION": "null",
//         "STORE_SECONDARY_CONTACT_LANDLINE_NR": "null",
//         "STORE_SECONDARY_CONTACT_MOBILE_NR": "null",
//         "STORE_SECONDARY_CONTACT_EMAIL_ID": "null",
//         "STORE_SECONDARY_CREATED_DATE": "null",
//         "STORE_SECONDARY_LAST_MODIFIED_DATE": "null",
//         "STORE_BANK_ID": "null",
//         "STORE_BANK_NAME": "null",
//         "STORE_BANK_ADDRESS": "null",
//         "STORE_BANK_ACCOUNT_NAME": "null",
//         "STORE_BANK_ACCOUNT_NUMBER": "null",
//         "STORE_BANK_IFSC": "null",
//         "STORE_BANK_CREATED_DATE": "null",
//         "STORE_BANK_LAST_MODIFIED_DATE": "null",
//         "STORE_VENDOR_ID": 157,
//         "STORE_VENDOR_NAME": "Heavenly",
//         "APPLICATION_ID": 124,
//         "APPLICATION_NAME": "Heavenly",
//         "APPLICATION_TYPE_CODE": 1,
//         "APPLICATION_TYPE_NAME": "Single Vendor",
//         "STORE_GSTIN": "null",
//         "STORE_MAX_AMOUNT": "null",
//         "STORE_MAX_ITEM": "null",
//         "STORE_MIN_AMOUNT": "null",
//         "STORE_MIN_ITEM": "null",
//         "STORE_LOCATION_ALTITUDE": 0,
//         "STORE_LOCATION_LATITUDE": 12.8873185,
//         "STORE_LOCATION_LONGITUDE": 77.57807509999999,
//         "STORE_LOCATION_RADIUS": 0,
//         "STORE_OPEN_TIME": "null",
//         "STORE_CLOSE_TIME": "null",
//         "STORE_TAGLINE": "null",
//         "STORE_DELIVERY_START_TIME": "null",
//         "STORE_DELIVERY_END_TIME": "null",
//         "STORE_DELIVERY_MAXIMUM_RADIUS": 0,
//         "STORE_DELIVERY_MINIMUM_AMOUNT": "null",
//         "STORE_DELIVERY_MINIMUM_TIME": "null",
//         "STORE_DELIVERY_CREATED_DATE": "2020-12-09 17:48:03.0",
//         "STORE_DELIVERY_LAST_MODIFIED_DATE": "2021-01-31 00:07:53.0",
//         "STORE_CREATED_DATE": "2020-12-09 17:48:03.0",
//         "STORE_LAST_MODIFIED": "2021-01-31 00:07:53.0",
//         "STORE_LAST_MODIFIED_DATE": "2021-01-31 00:07:53.0",
//         "STORE_LOGO_URL": "http://noqsystem.com:60010/wawbizbase/a_124/v_157/s_352/logos/Hevenly-Logo6.jpg",
//         "STORE_HOME_PATH": "http://noqsystem.com:60010/wawbizbase/a_124/v_157/s_352",
//         "PRODUCT_CATEGORY_IMAGE_PATH": "http://noqsystem.com:60010/wawbizbase/a_124/v_157/s_352/product_category_images",
//         "PRODUCT_IMAGE_PATH": "http://noqsystem.com:60010/wawbizbase/a_124/v_157/s_352/product_images",
//         "BANNER_IMAGE_PATH": "http://noqsystem.com:60010/wawbizbase/a_124/v_157/s_352/banner_images",
//         "IMAGE_NOT_FOUND_FILE_PATH": "http://noqsystem.com:60010/wawbizbase/a_124/v_157/s_352/image_not_found.png",
//         "STORE_IMAGE": "null",
//         "STORE_IMAGE_URL": "null",
//         "STORE_FAV_ICON": "01_ajwa_lf.jpg",
//         "STORE_FAV_ICON_IMAGE_URL": "http://noqsystem.com:60010/wawbizbase/a_124/v_157/s_352/fav_icon/01_ajwa_lf.jpg",
//         "MOBILE_LOGO_IMAGE": "Hevenly-Logo6.jpg",
//         "MOBILE_LOGO_IMAGE_URL": "http://noqsystem.com:60010/wawbizbase/a_124/v_157/s_352/mobile_logo/Hevenly-Logo6.jpg",
//         "STORE_MOBILE_LOGO_URL": "http://noqsystem.com:60010/wawbizbase/a_124/v_157/s_352/mobile_logo/Hevenly-Logo6.jpg",
//         "STORE_STRIP_IMAGE": "null",
//         "STORE_STATUS_IMAGE": "null",
//         "STORE_STATUS_IMAGE_URL": "null",
//         "STORE_STATUS_TITLE": "Under construction",
//         "STORE_STATUS_DESC": "Testing is going on please come after some time",
//         "STORE_SELF_BILLING_FEATURE": "null",
//         "STORE_ONLINE_SHOPPING_FEATURE": "null",
//         "STORE_PACKAGE_FILE_PATH": "null",
//         "STORE_WEBHOOK_LINK": "null",
//         "STORE_PURPOSE": "For Purchased",
//         "STORE_CASH_ON_DELIVERY_FLAG": "1",
//         "STORE_GST_FLAG": "null",
//         "STORE_PARTNER_FEE": "0",
//         "STORE_PARTNER_FEE_TYPE": "percent",
//         "STORE_ONLINE_PAYMENT_FLAG": "1",
//         "HOME_DELIVERY_FLAG": "1",
//         "STORE_PICKUP_FLAG": "1",
//         "UPDATE_ADDRESS_FLAG": "1",
//         "REDIRECT_URL_LINK": "http://noqsystem.com:60010/wawbiz-grocery/#/invoice",
//         "STORE_NEAR_ME_DEFAULT_KM": "5",
//         "WEBHOOK_LINK": "http://noqsystem.com:60010/api/ols/updatePaymentLogAPI",
//         "CANCELLATION_WEBHOOK_LINK": "http://noqsystem.com:60010/api/ols/updateCancellationTransactionPaymentLogAPI",
//         "STORE_OPEN_FLAG": "null",
//         "STORE_PICKUP_MINIMUM_AMOUNT": 0,
//         "STORE_CHECK_PINCODE_AT_CHECKOUT_FLAG": "0",
//         "STORE_PRIVACY_POLICY_URL": "https://wawbiz.com/privacy-policy.html",
//         "STORE_TERMS_AND_CONDITIONS_URL": "https://wawbiz.com/terms-of-service.html",
//         "WABIZ_DOMAIN_URL": "https://wawbiz.com/",
//         "VENDOR_LOGO_FILE_NAME": "null",
//         "VENDOR_LOGO_PATH": "logos",
//         "VENDOR_LOGO_URL": "null"
//       }
//     ]
//   }
// }

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  
  public STORE_CURRENCY_SYMBOL = "₹";
  public INR_SYMBOL = "₹";
  public storeLogo  = "";
  public applicationId  = 0;
  public storeObject  : any; // data for this will come from mainnav and this is used in razorpay payment in checkout page 

  public currentPageCategoruId = 0;
  
  constructor(
    private configService       : ConfigService,
    private userProfileService  : UserProfileService,
    private _router             : Router,
    private titleService        : Title,
    private headerService       : HeaderService,
    private _snackBar           : MatSnackBar,
    private transactionsService : TransactionsService,
    ) { }

    private hideWAHeaderSource = new Subject<string>();
    hideWAHeader = this.hideWAHeaderSource.asObservable();
    sendMessage(message: string) {
      this.hideWAHeaderSource.next(message);
    }
    
    public  notifyMessage(ngflashMessage, msgToBeDisplayed){
      
      // ngflashMessage.show(msgToBeDisplayed, { cssClass: 'alert-danger', timeout: ApplicationConstants.notification_display_time });
      this.openAlertBar(msgToBeDisplayed);
    }
    
    public  notifySuccessMessage(ngflashMessage, msgToBeDisplayed){
      
      // ngflashMessage.show(msgToBeDisplayed, { cssClass: 'alert-success', timeout: ApplicationConstants.notification_display_time });
      this.openAlertBar(msgToBeDisplayed);
    }
    
    public delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
    }
    
    public numberOnly(event): boolean { // this can be implemented like this ===>>> (keypress)="this.commonService.numberOnly($event)"
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  } 
  
  public checkLoggedIn(){
    if(this.lsTempSubscriberFlag() == 0 && this.lsSubscriberId() ) this._router.navigate(['']);
  }
  
  public static handleSuccessNoNavigation(data, _flashMessagesService){
    if(data.STATUS=="FAIL"){
      this.handleError(data.ERROR_MSG, _flashMessagesService);
    }
  }
  
  public static handleError(error, _flashMessagesService){  
    _flashMessagesService.show(error, { cssClass: 'alert-danger', timeout: ApplicationConstants.notification_display_time });
    
  }
  
  public handleSuccessWithNavigation(message, flashMessageService, navigationComponent){
    (async () => { 
      flashMessageService.show(message, {cssClass: 'alert-success', timeout: ApplicationConstants.notification_display_time});
      await this.delay(ApplicationConstants.notification_display_time);
      this._router.navigate([navigationComponent]);
    })();
  }
  
  
  
  mobNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$";  // this can be implemented like this (in HTML Page) ====>>> [pattern]="mobNumberPattern"
  
  pinCodePattern = "^((\\+91-?)|0)?[0-9]{6}$";  // this can be implemented like this (in HTML Page) ====>>> [pattern]="mobNumberPattern"
  
  
  
  public isSubscriberLoggedIn(){
    let value           = false;
    let subscriberId    = this.lsSubscriberId();
    let tempUserFlag    = this.lsTempSubscriberFlag();
    
    if(subscriberId > 0 && tempUserFlag == 0) value = true;
    return value;
  }
  
  public STORE_CHECK_PINCODE_AT_CHECKOUT_FLAG = false;  //assigned value from mainnav component
  
  getComponentName(){
    return this._router.url;
  }
  
  openAlertBar(message: string) {
    
    let action = "x";
    
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['mat-snackbar-alert-class'],
      verticalPosition:'top'
    });
  }
  
  checkIfNull(param1){
    let value = "";
    if(
      param1!=null &&
      param1!="null" &&
      param1!="undefined" &&
      param1!="Undefined" 
      ){
        value = param1;
      }
      return value;
    }
    
    // checklist-2 from here 
    setDocTitle(title: string) {
      this.titleService.setTitle(title);
    }
    
    fetchStoreParams(){
      let tempObject = { STORE_ID : this.configService.getStoreID(), PARAMETER_TYPE: "STORE"}
      this.headerService.fetchStoreParameterAPI(tempObject).subscribe(data => this.handleFetchStoreParams(data), error => error);
    }
    
    addToCartButtonText                     =   "Add to cart";//Done //Done
    poweredByText                           =   "";//Done //Done
    showPartyOrBulkOrder                    =   false;//Done //Done
    showDownloadApp                         =   false;//Done //Done
    showGoogleSignIn                        =   false;//Done //Done
    showFacebookLogin                       =   false;//Done //Done
    showWallet                              =   false;//Done //Done
    showGuestCheckIn                        =   false;//Done //Done
    showOtpLogin                            =   false;//Done //Done  //login-with-otp-enable-and-disable
    showPersonalEmailLogin                  =   false;//Done //Done
    deliverySlotFlag                        =   false;//Done //Done
    
    imagePathForNoImageForProduct           =   "assets/images/noProductToShowInThisCategory.jpg"; //Pending 
    imagePathForNoProductsInCategory        =   "assets/images/empty.png"; //Done //Done
    
    
    handleFetchStoreParams(data){
      if(data.STATUS == "OK"){
        data.STORE_PARAMETER.forEach(element => {
          if(element.STORE_PARAMETER_KEY == "ADD_TO_CART_BUTTON_TEXT") this.addToCartButtonText = element.STORE_PARAMETER_VALUE;
          if(element.STORE_PARAMETER_KEY == "POWERED_BY_TEXT") this.poweredByText = element.STORE_PARAMETER_VALUE;
          if(element.STORE_PARAMETER_KEY == "EMPTY_LIST_IMAGE_PATH" && element.STORE_PARAMETER_VALUE!='') this.imagePathForNoProductsInCategory = element.STORE_PARAMETER_VALUE;
          if(element.STORE_PARAMETER_KEY == "IMAGE_NOT_FOUND_FILE_NAME") this.imagePathForNoImageForProduct = element.STORE_PARAMETER_VALUE;
          
          if(element.STORE_PARAMETER_KEY == "ENABLE_PART_BULK_ORDER_FEATURE" && element.STORE_PARAMETER_VALUE == "1"){
            this.showPartyOrBulkOrder = true;
          } 
          
          if(element.STORE_PARAMETER_KEY == "ENABLE_DOWNLOAD_APP_FEATURE" && element.STORE_PARAMETER_VALUE == "1") {
            this.showDownloadApp = true;
          }
          
          if(element.STORE_PARAMETER_KEY == "ENABLE_GOOGLE_SIGN_IN_FEATURE" && element.STORE_PARAMETER_VALUE == "1") {
            this.showGoogleSignIn = true;
          }
          
          if(element.STORE_PARAMETER_KEY == "ENABLE_FACEBOOK_LOGIN_FEATURE" && element.STORE_PARAMETER_VALUE == "1") {
            this.showFacebookLogin = true;
          }
          
          if(element.STORE_PARAMETER_KEY == "ENABLE_WALLET_FEATURE" && element.STORE_PARAMETER_VALUE == "1") {
            this.showWallet = true;
          }

          if(element.STORE_PARAMETER_KEY == "ENABLE_GUEST_CHECKIN_FEATURE" && element.STORE_PARAMETER_VALUE == "1") {
            this.showGuestCheckIn = true;
          }

          //login-with-otp-enable-and-disable
          if(element.STORE_PARAMETER_KEY == "OTP_LOGIN" && element.STORE_PARAMETER_VALUE == "1") {
            this.showOtpLogin = true;
          }
          
          if(element.STORE_PARAMETER_KEY == "ENABLE_PERSONAL_EMAIL_FEATURE" && element.STORE_PARAMETER_VALUE == "1") {
            this.showPersonalEmailLogin = true;
          }

          if(element.STORE_PARAMETER_KEY == "DELIVERY_SLOT" && element.STORE_PARAMETER_VALUE == "1") {
            this.deliverySlotFlag = true;
          }
          
          
        });

      }
    }
    
    // checklist-2 till here 
    
    //Localstorage issues changes starts from here 
    public storeDataObject(){
      let objectName = "storeData"+this.configService.getStoreID();
      let storeDataObject:any = JSON.parse(localStorage.getItem(objectName));
      return storeDataObject;
    }
  
    public addStoreData(authToken, subscriberId, tempSubscriberFlag, transactionId){
      
      let storeObject = {
        authToken             : authToken,
        subscriberId          : subscriberId,
        tempSubscriberFlag    : tempSubscriberFlag,
        transactionId         : transactionId,
      }
      let objectName = "storeData"+this.configService.getStoreID();
      localStorage.setItem(objectName, JSON.stringify(storeObject));
    }

    public addSubscriberObjectTols(subscriberObject){
      let objectName = "storeData"+this.configService.getStoreID();
      let storeDataObject:any = JSON.parse(localStorage.getItem(objectName));
      
      storeDataObject.subscriberObject = subscriberObject;
      localStorage.setItem(objectName, JSON.stringify(storeDataObject));
    }

    //transaction id 
    public addTransactionIdTols(){
      let objectName = "storeData"+this.configService.getStoreID();
      let storeDataObject:any = JSON.parse(localStorage.getItem(objectName));
      let transactionId = 0;
      if(this.transactionsService.transactionDetailsArray && this.transactionsService.transactionDetailsArray[0] && this.transactionsService.transactionDetailsArray[0].TRANSACTION_ID) transactionId = this.transactionsService.transactionDetailsArray[0].TRANSACTION_ID;
      storeDataObject.transactionId = transactionId;
      localStorage.setItem(objectName, JSON.stringify(storeDataObject));
    }
  
    //subcriber id 
    public addSubscriberIdTols(subscriberId){
      let objectName = "storeData"+this.configService.getStoreID();
      let storeDataObject:any = JSON.parse(localStorage.getItem(objectName));
      storeDataObject.subscriberId = subscriberId;
      localStorage.setItem(objectName, JSON.stringify(storeDataObject));
    }
  
    //temp subscriber flag 
    public addTempSubscriberFlagTols(tempSubscriberFlag){
      let objectName = "storeData"+this.configService.getStoreID();
      let storeDataObject:any = JSON.parse(localStorage.getItem(objectName));
      storeDataObject.tempSubscriberFlag = tempSubscriberFlag;
      localStorage.setItem(objectName, JSON.stringify(storeDataObject));
    }
  
    //logged in username
    public addLoggedInUsernameTols(loggedInUserName){
      let objectName = "storeData"+this.configService.getStoreID();
      let storeDataObject:any = JSON.parse(localStorage.getItem(objectName));
      storeDataObject.loggedInUserName = loggedInUserName;
      localStorage.setItem(objectName, JSON.stringify(storeDataObject));
    }
  
    //Auth Token
    public addAuthTokenTols(authToken){
      let objectName = "storeData"+this.configService.getStoreID();
      let storeDataObject:any = JSON.parse(localStorage.getItem(objectName));
      storeDataObject.authToken = authToken;
      localStorage.setItem(objectName, JSON.stringify(storeDataObject));
    }
  
  
    //get transaction id
    public lsTransactionId(){
      let transactionId = 0;
      let storeDataObject = this.storeDataObject();
      if(storeDataObject != null && storeDataObject.transactionId) transactionId = storeDataObject.transactionId;
      return transactionId;
    }
  
    //get subscriber id
    public lsSubscriberId(){
      let subscriberId = 0;
      let storeDataObject = this.storeDataObject();
      if(storeDataObject != null && storeDataObject.subscriberId) subscriberId = storeDataObject.subscriberId;
      return subscriberId;
    }
    
    //get temp subscriber flag
    public lsTempSubscriberFlag(){
      let tempSubscriberFlag = 0;
      let storeDataObject = this.storeDataObject();
      if(storeDataObject != null && storeDataObject.tempSubscriberFlag) tempSubscriberFlag = storeDataObject.tempSubscriberFlag;
      return tempSubscriberFlag;
    }
  
    //get loggedIn username
    public lsLoggedInUserName(){
      let loggedInUserName = "";
      let storeDataObject = this.storeDataObject();
      if(storeDataObject != null && storeDataObject.loggedInUserName) loggedInUserName = storeDataObject.loggedInUserName;
      return loggedInUserName;
    }

    public lsSubscriberObject(){
      let subscriberObject : any = {};
      let storeDataObject = this.storeDataObject();
      if(storeDataObject != null && storeDataObject.subscriberObject) subscriberObject = storeDataObject.subscriberObject;
      return subscriberObject;
    }
  
    public isUserLoggedIn(){
      this.userProfileService.loggedIn = 0;
      let subscriberId = 0;
      subscriberId = this.lsSubscriberId();
      if(this.lsTempSubscriberFlag() == 0 && subscriberId  > 0){
        this.userProfileService.loggedIn = 1;
      }
    }

    public getLoggedInNameFromLocalStorage(): any {
      let objectName = "storeData"+this.configService.getStoreID();
      let storeDataObject:any = JSON.parse(localStorage.getItem(objectName));
      let subsObject =  storeDataObject.subscriberObject;
      return this.checkIfNull(subsObject.name);
    }
    
    public getLoggedInEmailFromLocalStorage(): any {
      let objectName = "storeData"+this.configService.getStoreID();
      let storeDataObject:any = JSON.parse(localStorage.getItem(objectName));
      let subsObject =  storeDataObject.subscriberObject;
      return this.checkIfNull(subsObject.email);
    }
    
    public getLoggedInMobileFromLocalStorage(): any {
      let objectName = "storeData"+this.configService.getStoreID();
      let storeDataObject:any = JSON.parse(localStorage.getItem(objectName));
      let subsObject =  storeDataObject.subscriberObject;
      return this.checkIfNull(subsObject.mobile);
    }
    //Localstorage issues changes ends here 

    limitStringTo(str, sizeLimit){
     return (str.length>sizeLimit)? (str.substring(0, sizeLimit))+'..':(str)
    }

    //convert-rupees-to-paise
    convertRupeesToPaise(pRupees){
      let integerValue        = pRupees; 
      let floatingPointValue  = 0;

      let array               = pRupees.toFixed(2).toString().split(".");
      
      if(array.length == 2){
        integerValue            =  parseInt(array[0]);
        floatingPointValue      =  parseInt(array[1]);
      }


      // convertToPaise
      integerValue = integerValue*100;

      return integerValue + floatingPointValue;
    }
  
  }
  