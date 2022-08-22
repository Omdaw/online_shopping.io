import { Component } from '@angular/core'; 
import { Router, ActivatedRoute } from '@angular/router'; 
import { ApplicationConstants } from 'src/ApplicationConstants'; 
import { SubscriberService } from '../subscriber.service';
import { UserProfileService } from '../user-profile.service';
import { DeliveryAddressService } from '../delivery-address.service';
import { PaymentService } from '../payment.service';
import { CommonService } from '../common.service';
import { TransactionsService } from '../transactions.service';
import { LoginService } from '../login.service';
import { FlagsService } from '../flags.service';
import { WalletMethodsService } from '../wallet-methods.service';
import { ConfigService } from '../config.service';

export interface ICreateDeliveryAddress {
  SUBSCRIBER_ID      : number,
  ADDRESS_LINE1      : string,
  ADDRESS_LINE2      : string,
  ADDRESS_PINCODE    : number,
  ADDRESS_LATITUDE   : number,
  ADDRESS_LONGITUDE  : number,
  ADDRESS_LABEL      : string,
  CONTACT_NAME       : string,
  CONTACT_MOBILE_NR  : string,
  ADDRESS_STATUS     : number,
}

export interface IFetchDeliveryAddress{
  SUBSCRIBER_ID      : number,
}

export interface IFetchDeliveryAddressResponse{
  SUBSCRIBER_ADDRESS_ID     : number,
  SUBSCRIBER_ID             : number,
  ADDRESS_ID                : number,
  SUBSCRIBER_FIRST_NAME     : string,
  SUBSCRIBER_LAST_NAME      : string,
  SUBSCRIBER_EMAIL_ID       : string,
  ADDRESS_LINE1             : string,
  ADDRESS_LINE2             : string,
  ADDRESS_PINCODE           : number,
  ADDRESS_AREA_ID           : string,
  ADDRESS_AREA_NAME         : string,
  ADDRESS_CITY_ID           : string,
  ADDRESS_CITY_NAME         : string,
  ADDRESS_STATE_ID          : string,
  ADDRESS_STATE_NAME        : string,
  ADDRESS_COUNTRY_ID        : string,
  ADDRESS_COUNTRY_NAME      : string,
  ADDRESS_LATITUDE          : number,
  ADDRESS_LONGITUDE         : number,
  ADDRESS_CREATED_DATE      : string,
  ADDRESS_LAST_MODIFIED_DATE: string,
  ADDRESS_LABEL             : string,
  CONTACT_NAME              : string,
  CONTACT_MOBILE_NR         : string,
  CREATED_DATE              : string,
  LAST_MODIFIED_DATE        : number,
  ADDRESS_STATUS            : number,
  ADDRESS_STATUS_NAME       : string,
}

interface IPaymentGatewayCredentialsResponse{
  PAYMENT_GATEWAY_CREDENTIALS_ID    : 0,
  STORE_ID                          : 0,
  STORE_NAME                        : "",
  PAYMENT_GATEWAY_TYPE_CODE         : 0,
  PAYMENT_GATEWAY_TYPE_NAME         : "",
  GRANT_TYPE                        : "",
  CLIENT_ID                         : "",
  CLIENT_SECRET                     : "",
  PAYMENT_GATEWAY_CREDENTIALS_DESC  : "",
  CREATED_DATE                      : "",
  LAST_MODIFIED_DATE                : ""
}

declare let paypal: any;

@Component({
  selector: 'app-delivery-and-payments',
  templateUrl: './delivery-and-payments.component.html',
  styleUrls: ['./delivery-and-payments.component.css']
})

// export class DeliveryAndPaymentsComponent implements AfterViewChecked {
export class DeliveryAndPaymentsComponent {
  
  constructor(private configService : ConfigService,private _router                 : Router,
    private route                   : ActivatedRoute, 
    private deliveryAddressService  : DeliveryAddressService,
    private subscriberService       : SubscriberService,
    public  userProfileService      : UserProfileService,
    private paymentService          : PaymentService,
    public commonService            : CommonService,
    public flagsService            : FlagsService,
    public  transactionService      : TransactionsService,
    public  wallerMethods           : WalletMethodsService
    ) { }
    
    ngOnInit() {
      this.selectedPaymentGatewayId = 1;
      // this.flagsService.hideHeaderFooter();
      this.flagsService.showSearch();
      this.flagsService.showHeaderFooter();
      if(window.innerWidth < 600){
        this.flagsService.hideFooter();
      }
      this.flagsService.inDeliveryPageFlag              = 1;
      this.flagsService.continueShoppingCallFromInvoice = 1;
      window.scroll(0, 0);
      this.fetchDeliveryAddress();
      this.fetchPaymentGatewayByStoreIdAPI();
      this.wallerMethods.fetchWalletMoneyBySubscriberIdAPI();
    }
    
    // variables
    processBar                                = false;
    subscriberAddressId                       = 0;
    addressId                                 = 0;
    subscriberId                              = + this.commonService.lsSubscriberId();
    addressLine1                              = "";
    addressLine2                              = "";
    addressPin                                = 0;
    lattitude                                 = 12;
    longitude                                 = 12;
    addressLabel                              = "";
    contactName                               = "";
    mobileNumber                              = "";
    addressStatus                             = 1;
    
    displayEditIcon                           = [];
    displayDeleteIcon                         = [];
    
    createDeliveryAddressRequestObject        : ICreateDeliveryAddress;
    fetchDeliveryAddressRequestObject         : IFetchDeliveryAddress;
    updateDeliveryAddressRequestObject        = {};
    deleteDeliveryAddressRequestObject        = {};
    
    deliveryAddressesArray                    = [];
    
    saveButtonStatus  = true;
    
    columnIndex = 0;
    
    selectedAddressId = 0;
    
    promocodeDetailsSampleObject = {
      TRANSACTION_DETAIL_ID            : 0,
      TRANSACTION_ID                   : 0,
      STORE_ID                         : 0,
      VENDOR_ID                        : 0,
      PRODUCT_ID                       : "",
      PRODUCT_DETAIL_ID                : "",
      PRODUCT_NAME                     : "",
      PRODUCT_PRICE                    : 0,
      PRODUCT_DISCOUNT_ID              : "",
      PRODUCT_DISCOUNT_AMOUNT          : 0,
      PRODUCT_FINAL_PRICE              : 0,
      PRODUCT_GST_ID                   : "",
      PRODUCT_GST_PERCENTAGE           : 0,
      PRODUCT_GST_AMOUNT               : 0,
      PRODUCT_GST_STATUS               : "",
      PRODUCT_QUANTITY                 : "",
      PRODUCT_MULTI_FLAG               : "",
      PRODUCT_IMAGE_FILE               : "",
      PRODUCT_IMAGE_PATH               : "",
      PRODUCT_IMAGE_FILE_PATH          : "",
      PRODUCT_UNIT_TYPE_CODE           : "",
      PRODUCT_UNIT                     : "",
      PRODUCT_UNIT_TYPE_NAME           : "",
      PRODUCT_BRAND_ID                 : "",
      PRODUCT_BRAND_NAME               : "",
      MAX_PURCHASE_QUANTITY            : "",
      TRANSACTION_DETAIL_TYPE_CODE     : 0,
      PROMO_CODE                       : "",
      PROMO_CODE_DISCOUNT_AMOUNT       : 0
    };
    
    makeCreateDeliveryAddressRequestObject(){
      this.createDeliveryAddressRequestObject = {
        SUBSCRIBER_ID      : + this.commonService.lsSubscriberId(),
        ADDRESS_LINE1      : this.addressLine1,
        ADDRESS_LINE2      : this.addressLine2,
        ADDRESS_PINCODE    : this.addressPin,
        ADDRESS_LATITUDE   : this.lattitude,
        ADDRESS_LONGITUDE  : this.longitude,
        ADDRESS_LABEL      : this.addressLabel,
        CONTACT_NAME       : this.contactName,
        CONTACT_MOBILE_NR  : this.mobileNumber,
        ADDRESS_STATUS     : this.addressStatus
      }
    }
    
    createDeliveryAddress(){
      if(this.subscriberAddressId>0){
        this.updateDeliveryAddress()
      } else {
        this.makeCreateDeliveryAddressRequestObject();
        this.deliveryAddressService.createSubscriberAddress(this.createDeliveryAddressRequestObject)
        .subscribe(data => this.handleCreateDeliveryAddressSuccess(data), error => this.handleError(error))
      }
    }
    
    handleCreateDeliveryAddressSuccess(data){
      if(data.STATUS == "OK"){
        this.refreshForm();
        this.fetchDeliveryAddress();
        // window.scroll(0,0);
        this.viewAddresses();
      }
    }
    
    handleError(error){
      
    }
    
    makeFetchDeliveryAddressRequestObject(){
      this.fetchDeliveryAddressRequestObject = {
        SUBSCRIBER_ID : + this.commonService.lsSubscriberId()
      }
    }
    
    fetchDeliveryAddress(){
      this.makeFetchDeliveryAddressRequestObject();
      this.deliveryAddressService.fetchSubscriberAddress(this.fetchDeliveryAddressRequestObject)
      .subscribe(data => this.handleFetchDeliveryAddressSuccess(data), error => this.handleError(error))
    }
    
    numberOfRows = [];
    
    handleFetchDeliveryAddressSuccess(data){
      
      if(data.STATUS == "OK"){
        
        this.deliveryAddressesArray = [];
        
        let delArray = data.SUBSCRIBER_ADDRESS;
        // this.deliveryAddressesArray  = data.SUBSCRIBER_ADDRESS;
        let arrayLength= Math.ceil(delArray.length/3);
        
        //  for(let i=0;i<arrayLength;i++){
        //   let addressArray = []
        //  }
        
        let index =0;
        for(let row =0; row<arrayLength; row++){
          
          let tempArray = [];
          if ( index < delArray.length  ){
            for(let col=0; col<3; col++){
              if(delArray[index]) tempArray.push(delArray[index]);
              index++;
            }
            this.deliveryAddressesArray.push(tempArray);
          }
          
        }
        //  console.log(this.deliveryAddressesArray);
      }
    }
    
    makeUpdateDeliveryAddressRequestObject(){
      this.updateDeliveryAddressRequestObject = {
        SUBSCRIBER_ADDRESS_ID : this.subscriberAddressId,
        ADDRESS_ID            : this.addressId,
        SUBSCRIBER_ID         : this.subscriberId,
        ADDRESS_LINE1         : this.addressLine1,
        ADDRESS_LINE2         : this.addressLine2,
        ADDRESS_PINCODE       : this.addressPin,
        ADDRESS_LATITUDE      : this.lattitude,
        ADDRESS_LONGITUDE     : this.longitude,
        ADDRESS_LABEL         : this.addressLabel,
        CONTACT_NAME          : this.contactName,
        CONTACT_MOBILE_NR     : this.mobileNumber,
        ADDRESS_STATUS        : this.addressStatus
      }
    }
    
    updateDeliveryAddress(){
      this.makeUpdateDeliveryAddressRequestObject();
      this.deliveryAddressService.updateSubscriberAddress(this.updateDeliveryAddressRequestObject)
      .subscribe(data => this.handleUpdateDeliveryAddressSuccess(data), error => this.handleError(error))
    }
    
    handleUpdateDeliveryAddressSuccess(data){
      if(data.STATUS == "OK"){
        this.refreshForm();
        this.fetchDeliveryAddress();
        // window.scroll(0,0);
        this.viewAddresses();
      }
    }
    
    deleteDeliveryAddress(addressId, subscriberAddressId){
      this.deleteDeliveryAddressRequestObject = {
        SUBSCRIBER_ID              : this.commonService.lsSubscriberId(),
        ADDRESS_ID                 : addressId,
        SUBSCRIBER_ADDRESS_ID      : subscriberAddressId
      }
      this.deliveryAddressService.deleteSubscriberAddress(this.deleteDeliveryAddressRequestObject)
      .subscribe(data => this.handleDeleteDeliveryAddressSuccess(data), error => this.handleError(error))
    }
    
    handleDeleteDeliveryAddressSuccess(data){
      if(data.STATUS == "OK"){
        this.fetchDeliveryAddress();
      }
    }
    
    putTestData(){
      this.subscriberId                              = 2;
      this.addressLine1                              = "Budigere";
      this.addressLine2                              = "Devanahalli Taluk";
      this.addressPin                                = 562129;
      this.lattitude                                 = 12.001;
      this.longitude                                 = 13.002;
      this.addressLabel                              = "Home";
      this.contactName                               = "Umraz";
      this.mobileNumber                              = "8147895714";
      this.addressStatus                             = 1;
      this.saveButtonStatus = false;
    }
    
    showDeleteEditIcons(index){
      this.displayDeleteIcon[index] = true;
      this.displayEditIcon[index] = true;
    }
    
    hideDeleteEditIcons(index){
      this.displayDeleteIcon[index] = false;
      this.displayEditIcon[index]     = false;
    }
    
    validateForm(ngObject){
      this.saveButtonStatus = true;
      if(ngObject._parent.form.status == "VALID"){
        this.saveButtonStatus = false;
      }
    }
    
    refreshForm(){
      this.addressLine1  = "";      
      this.addressLine2  = "";      
      this.addressPin    = 0;    
      this.lattitude     = 12;  
      this.longitude     = 12;  
      this.addressLabel  = "";      
      this.contactName   = "";    
      this.mobileNumber  = "";        
    }
    
    transactionObject = {};
    transactionId     = this.commonService.lsTransactionId();
    updateDeliveryAddressInTransaction(deliveryAddressId){
      this.transactionObject = {
        DELIVERY_ADDRESS_ID   : deliveryAddressId,
        STORE_ID              : this.configService.getStoreID(),
        SUBSCRIBER_ID         : this.commonService.lsSubscriberId(),
        TRANSACTION_ID        : this.commonService.lsTransactionId() 
      }
      this.deliveryAddressService.updateDeliveryAddressInTransaction(this.transactionObject).subscribe(data => this.handleUpdateDeliveryAddressInTransactionSuccess(data), error => this.handleError(error));
    }
    
    handleUpdateDeliveryAddressInTransactionSuccess(data){
      if(data.STATUS == "OK"){
        // this._router.navigate(['payment']);
        this.showPayments();
      }
    }
    
    checkArrayValueAndIncrementIndex(){
      
      // if(this.deliveryAddressesArray == null) return false;
      
      // if(this.columnIndex > this.deliveryAddressesArray.length - 1) return false;
      
      // let flag =  this.deliveryAddressesArray[this.columnIndex];
      // this.columnIndex++;
      
      // return flag ? true : false; 
      
    }
    
    increaseIndex(){
      return this.columnIndex++;
    }
    
    editDeliveryAddress(data){
      this.subscriberAddressId  =   data.SUBSCRIBER_ADDRESS_ID;
      this.addressId            =   data.ADDRESS_ID;
      this.subscriberId         =   data.SUBSCRIBER_ID; 
      this.addressLine1         =   data.ADDRESS_LINE1; 
      this.addressLine2         =   data.ADDRESS_LINE2; 
      this.addressPin           =   data.ADDRESS_PINCODE; 
      this.lattitude            =   data.ADDRESS_LATITUDE;
      this.longitude            =   data.ADDRESS_LONGITUDE;
      this.addressLabel         =   data.ADDRESS_LABEL; 
      this.contactName          =   data.CONTACT_NAME; 
      this.mobileNumber         =   data.CONTACT_MOBILE_NR; 
      this.addressStatus        =   data.ADDRESS_STATUS; 
      
      this.saveButtonStatus = false;
      
      // window.scroll(0, 700);
      this.addNewAddress();
    }
    
    
    //Animation Logic
    displayAddressView  = true;
    displayAddressAdd   = false;
    
    addNewAddress(){
      this.displayAddressAdd = true;
      this.displayAddressView= false;
    }
    
    viewAddresses(){
      this.displayAddressAdd = false;
      this.displayAddressView= true;
    }
    
    displayeliveryAddressDiv = true;
    displayPayments          = false;
    
    showDeliveryAddress(){
      this.displayPayments = false; //Collapse Payments
      if(this.displayeliveryAddressDiv == true) {
        this.displayeliveryAddressDiv = false;
      }else{
        this.displayeliveryAddressDiv = true;
      }
    }
    
    showPayments(){
      if(this.selectedAddressId > 0){
        this.displayeliveryAddressDiv = false; //Collapse Delivery Address
        if(this.displayPayments == true) {
          this.displayPayments = false;
        }else{
          this.displayPayments = true;
        }
      }
    } 
    
    paymentRequestObject = {};
    
    makeUpdatePaymentRequestObject(){
      let paymentTypeId = 0;
      if(this.selectedPaymentGatewayId == ApplicationConstants.CASH_0N_DELIVERY_PAYMENT_GATEWAY_TYPE_CODE)  paymentTypeId = 2; //This means COD
      else if(this.selectedPaymentGatewayId == ApplicationConstants.WALLET_PAYMENT_GATEWAY_TYPE_ID)       paymentTypeId = 3; //This means wallet money
      else paymentTypeId = 1; // This means online 
      
      this.paymentRequestObject = {
        STORE_ID            : this.configService.getStoreID(),
        SUBSCRIBER_ID       : this.commonService.lsSubscriberId(),
        TRANSACTION_ID      : this.commonService.lsTransactionId(),
        PAYMENT_TYPE_ID     : ApplicationConstants.CASH_0N_DELIVERY_PAYMENT_GATEWAY_TYPE_CODE,
        DELIVERY_STATUS_ID  : ApplicationConstants.PENDING_DELIVERY_STATUS_TYPE_ID,
      }
    }
    
    updatePayment(){
      this.makeUpdatePaymentRequestObject();
      this.paymentService.updatePaymentTypeAPI(this.paymentRequestObject).subscribe(data => this.handleUpdatePayment(data), error => error)
    }
    
    handleUpdatePayment(data){
      if(data.STATUS == "OK"){
        this._router.navigate(['invoice']);
      }
    }
    
    setAddress(subscriberAddressId){
      this.selectedAddressId = subscriberAddressId;
    }
    
    // Apply Promocode Starts here
    applyPromocodeRequestObject         = {};
    promocode                           = "";
    disablePromocodeInputAndApplyButton = false;
    invalidPromocodeNotification        = "";
    
    makeApplyPromocodeRequestObject(){
      this.applyPromocodeRequestObject = {
        STORE_ID        : this.configService.getStoreID(),
        PROMO_CODE      : this.promocode,
        SUBSCRIBER_ID   : + this.commonService.lsSubscriberId(),
        TRANSACTION_ID  : + this.commonService.lsTransactionId()
      }
    }
    
    applyPromocode(){
      this.makeApplyPromocodeRequestObject();
      this.subscriberService.applyPromoCodeAPI(this.applyPromocodeRequestObject)
      .subscribe(data => this.handleApplyPromocodeSuccess(data), error => this.handleError(error))
    }
    
    handleApplyPromocodeSuccess(data){
      if(data.STATUS == "OK"){
        
        data.TRANSACTION.forEach(element => {
          element.TRANSACTION_DETAIL.forEach(element => {
            if(element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PROMO_CODE){
              this.promocodeDetailsObject = element;
            }
          });
        });
        
        //disable promocode input box and apply button
        this.disablePromocodeInputAndApplyButton = true;
        
        //empty the promocode input 
        this.promocode = "";
        
      }
      if(data.STATUS=="FAIL"){
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
    makeCancelPromocodeRequestObject(){
      this.cancelPromocodeRequestObject = {
        STORE_ID        : this.configService.getStoreID(),
        PROMO_CODE      : this.promocodeDetailsObject.PROMO_CODE,
        SUBSCRIBER_ID   : + this.commonService.lsSubscriberId(),
        TRANSACTION_ID  : + this.commonService.lsTransactionId()
      }
    }
    
    cancelPromocode(){
      this.makeCancelPromocodeRequestObject();
      this.subscriberService.cancelPromoCodeAPI(this.applyPromocodeRequestObject)
      .subscribe(data => this.handleCancelPromocodeSuccess(data), error => this.handleError(error))
    }
    
    handleCancelPromocodeSuccess(data){
      if(data.STATUS == "OK"){
        this.promocodeDetailsObject = this.promocodeDetailsSampleObject;
        this.disablePromocodeInputAndApplyButton = false;
      }
    }
    // cancel Promocode Ends here
    
    //Applied Promocode Displaying Logic
    promocodeDetailsObject = this.promocodeDetailsSampleObject;
    
    // Fetching Payment Gateways Starts here
    paymentGatewaysArray = [];
    fetchPaymentGatewayByStoreIdAPI(){
      this.processBar = true;
      let tempObj = {
        STORE_ID : this.configService.getStoreID()
      }
      this.deliveryAddressService.fetchPaymentGatewayByStoreIdAPI(tempObj)
      .subscribe(data => this.handleFetchPaymentGatewayByStoreIdAPISuccess(data), error => this.handleError(error))
    }
    
    handleFetchPaymentGatewayByStoreIdAPISuccess(data){
      if(data.STATUS == "OK"){
        this.paymentGatewaysArray = data.STORE_PAYMENT_GATEWAY_MAP;
      }
      
      this.processBar = false;
    }
    // Fetching Payment Gateways Ends here
    
    selectedPaymentGatewayId = 0;
    selectedPaymentGateway(paymentGatewayId){
      this.selectedPaymentGatewayId = paymentGatewayId;
    }
    
    onPaymentSubmit(){
      
      switch(this.selectedPaymentGatewayId){
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
        case ApplicationConstants.WALLET_PAYMENT_GATEWAY_TYPE_CODE:
        this.updatePayment();
        break;
      }
      
      //fetch payment gateway credentials by store id >> Done
      
      //create transaction payment gateway history
      
      //trigger payment 
      
      //after this the following
      
      //create payment api log
      
      //update payment api log
      
      
    }
    
    //Fetch Payment Gateway Credentials Starts here 
    paymentGatewayCredentialsArray : IPaymentGatewayCredentialsResponse[]; 
    fetchPaymentGatewayCredentialsByStoreId(){
      this.processBar = true;
      let tempObj = {
        STORE_ID : this.configService.getStoreID()
      }
      this.deliveryAddressService.fetchPaymentGatewayCredentialsByStoreId(tempObj).subscribe(data => this.handleFetchPaymentGatewayCredentialsByStoreIdSuccess(data), error => this.handleError(error))
    }
    
    handleFetchPaymentGatewayCredentialsByStoreIdSuccess(data){
      if(data.STATUS == "OK"){
        this.paymentGatewayCredentialsArray = data.PAYMENT_GATEWAY_CREDENTIALS;
      }
      this.processBar = false;
    }
    //Fetch Payment Gateway Credentials Ends here     
    
    //Create Payment Gateway History Starts here 
    createTransactionPaymentGatewayHistory(){
      let tempObj = {
        TRANSACTION_ID              :  this.commonService.lsTransactionId(),
        PAYMENT_GATEWAY_TYPE_CODE   :  this.selectedPaymentGatewayId,
        PAYMENT_REQUEST_ID          :  this.paypalResponseObject.id //This will be implement once everything is done
      }      
      this.deliveryAddressService.createPaymentGatewayHistoryAPI(tempObj).subscribe(data => this.handleCreateTransactionPaymentGatewayHistorySuccess(data), error => this.handleError(error));
    }
    
    handleCreateTransactionPaymentGatewayHistorySuccess(data){
      if(data.STATUS == "OK"){
        console.log("createTransactionPaymentGatewayHistory");
        console.log(data);
      }
      this.processBar = false;
    }
    //Create Payment Gateway History Starts here 
    
    //Create Payment API Log Starts here 
    paymentApiLogId = 0;
    createPaymentGatewayApiLog(){
      let tempObj = {
        PAYMENT_GATEWAY_TYPE_CODE   :  this.selectedPaymentGatewayId,
        API_TYPE_CODE               :  1,
        PAYMENT_REQUEST_ID          :  this.paypalResponseObject.id,
        REQUEST_CONTENT             :  "",//Request Object that we are passing to Payment API
        RESPONSE_CONTENT            :  "",
      }      
      this.deliveryAddressService.createPaymentAPILogAPI(tempObj).subscribe(data => this.handleCreatePaymentGatewayApiLogSuccess(data), error => this.handleError(error));
    }
    
    handleCreatePaymentGatewayApiLogSuccess(data){
      if(data.STATUS == "OK"){
        console.log("createPaymentAPILogAPI");
        console.log(data);
        this.paymentApiLogId = data.AUTHORIZENET_PAYMENT_API_LOG_ID;
        this.updatePaymentGatewayApiLog();
      }
      this.processBar = false;
    }
    //Create Payment API Log Ends here 
    
    //Update Payment API Log Starts here 
    updatePaymentGatewayApiLog(){
      let tempObj = {
        PAYMENT_API_LOG_ID          :  this.paymentApiLogId,
        PAYMENT_GATEWAY_TYPE_CODE   :  this.selectedPaymentGatewayId,
        API_TYPE_CODE               :  1,
        PAYMENT_REQUEST_ID          :  this.paypalResponseObject.id,
        REQUEST_CONTENT             :  "",
        RESPONSE_CONTENT            :  "",
      }      
      this.deliveryAddressService.updatePaymentAPILogAPI(tempObj).subscribe(data => this.handleUpdatePaymentGatewayApiLogSuccess(data), error => this.handleError(error));
    }
    
    handleUpdatePaymentGatewayApiLogSuccess(data){
      if(data.STATUS == "OK"){
        this._router.navigate(['invoice']);
      }
      this.processBar = false;
    }
    
    //Update Payment API Log Ends here 
    
    //Paypal Payments Logic 
    
    //     addScript  : boolean = false;
    //     paypalLoad : boolean = true;
    //     finalAmount: number = 1;
    
    //     paypalConfig = {
    //       env:'sandbox',
    //       client: {
    //         sandbox:'AbIAzIcCWmX_NOI55tkTLvktpxRF9AMsbwg9Rlxo0Lsz_XQfoHbfAnuJ_Cy4OFYd6yQOqIIVHfo4uIsY',
    //         production:'<production-key-here>'
    //       },
    //       commit : true,
    //       payment : (data, actions) => {
    //         return actions.payment.create({
    //           payment : {
    //             transactions : [
    //               {amount : { total : this.userProfileService.invoiceTotal + this.promocodeDetailsObject.PRODUCT_FINAL_PRICE, currency: ApplicationConstants.CURRENCY_INR} }
    //             ]
    //           } 
    //       });
    //     },
    //     onAuthorize: (data, actions) => {
    
    
    //       return actions.payment.execute().then((payment) => {
    
    //           console.log(payment);      
    //           window.alert('Payment Completed');
    //           this.paypalResponseObject = payment;
    
    //           this.onPaymentSubmit();
    //       })
    //     }
    //   };
    paypalResponseObject = {id:""};
    //     ngAfterViewChecked(): void {
    //       if(!this.addScript) {
    //         this.addPaypalScript().then(() => {
    //           paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
    //           this.paypalLoad = false;
    //         })
    //       }
    //     }
    
    //     addPaypalScript() {
    //       this.addScript = true; 
    //       return new Promise((resolve, reject) => {
    //         let scripttagElement = document.createElement('script');
    //         scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
    //         scripttagElement.onload = resolve;
    //           document.body.appendChild(scripttagElement);
    //       })
    //     } 
    
    //Paypal Payments Logic Ends Here
    
    numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    } 
    
    triggerInstamojoPaymentGateway(){
      
      this.processBar = true;
      
      this.paymentService.createAPaymentRequestAPI(this.configService.getStoreID(), 
      this.subscriberId, 
      this.transactionId).subscribe(data  => this.handleCreatePaymentRequestAPIResponse(data), 
      error => this.handleError(error));;
    }
    
    handleCreatePaymentRequestAPIResponse(data){
      
      if(data.STATUS == "OK"){ 
        let paymentURL:string = data.PAYMENT_REQUESTED_LONGURL; 
        window.open(paymentURL,"_self") 
      }
      
      this.processBar = false;
    }
    
    displayAppyWalletButton = true;
    applyWalletMoney(){
      this.wallerMethods.applyWalletMoneyAPI();
      this.displayAppyWalletButton = false;
      
      (async () => { 
        
        await this.delay(500);
        
        if(this.wallerMethods.walletPaymentGatewayType == ApplicationConstants.WALLET_PAYMENT_GATEWAY_TYPE_ID) {
          this.flagsService.completelyWalletPaymentFlag  = true; // This means completely wallet payments is done 
          this.selectedPaymentGatewayId = ApplicationConstants.WALLET_PAYMENT_GATEWAY_TYPE_CODE;
        }
        
      })();
    }
    
    delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
    }
    
    cancelWalletMoney(){
      this.wallerMethods.cancelWalletMoneyAPI();
      this.displayAppyWalletButton = true;
      this.selectedPaymentGatewayId = 1;
      this.flagsService.completelyWalletPaymentFlag = false;
    }
  }
  