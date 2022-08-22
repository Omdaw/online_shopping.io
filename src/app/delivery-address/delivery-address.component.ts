import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators/map'; 
import { ApplicationConstants } from 'src/ApplicationConstants';
import { ProductService } from '../product.service';
import { SubscriberService } from '../subscriber.service';
import { UserProfileService } from '../user-profile.service';
import { DeliveryAddressService } from '../delivery-address.service';
import { PaymentService } from '../payment.service';
import { ConfigService } from '../config.service';
import { CommonService } from '../common.service';

export interface ICreateDeliveryAddress{
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
@Component({
  selector: 'app-delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.css']
})
export class DeliveryAddressComponent implements OnInit {

  constructor(private configService : ConfigService,
    private _router                     : Router, 
    private route                       : ActivatedRoute, 
    private deliveryAddressService      : DeliveryAddressService,
    private subscriberService           : SubscriberService,
    private userProfileService          : UserProfileService,
    private paymentService              : PaymentService,
    public commonService         : CommonService

  ) { }

  ngOnInit() {
    this.fetchDeliveryAddress();
    this.fetchCartInProgress();
  }

  //Variables
  processBar                                = false;
  subscriberAddressId                       = 0;
  addressId                                 = 0;
  subscriberId                              = 2;
  addressLine1                              = "";
  addressLine2                              = "";
  addressPin                                = 0;
  lattitude                                 = 0;
  longitude                                 = 0;
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

  makeCreateDeliveryAddressRequestObject(){
    this.createDeliveryAddressRequestObject = {
      SUBSCRIBER_ID      : this.subscriberId,
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
      SUBSCRIBER_ID : this.subscriberId
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
    this.lattitude     = 0;  
    this.longitude     = 0;  
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
    this.displayeliveryAddressDiv = false; //Collapse Delivery Address
    if(this.displayPayments == true) {
      this.displayPayments = false;
    }else{
      this.displayPayments = true;
    }
  }

  //Transactions Logic Starts here
  transactionArray                      = [];
  fetchCartInProgressRequestObject      = {};
  makeFetchCartInProgressObject(){
    let tempObj = {
      SUBSCRIBER_ID       : this.commonService.lsSubscriberId(),
      STORE_ID            : this.configService.getStoreID(),
    }

    this.fetchCartInProgressRequestObject = tempObj;
  }

  fetchCartInProgress(){
    this.processBar = true;
    this.makeFetchCartInProgressObject()

    this.subscriberService.fetchCartInProgressTransactionsBySubscriberIdAPI(this.fetchCartInProgressRequestObject)
    .subscribe(data => this.handleFetchCartInProgressResponse(data), error => this.handleError(error))
  }

  invoiceTotal            = 0;
  invoiceAmount           = 0;
  invoiceDiscountAmount   = 0;
  deliveryCharge          = 0;
  convenienceFee          = 0;
  gst                     = 0;
  numberOfItems           = 0;
  
  handleFetchCartInProgressResponse(data){
    if(data.STATUS == "OK"){
      this.processBar = false;

      this.calculateInvoiceDetail(data.TRANSACTION[0]);
     
      this.makeTransactionArray(data);
      
    }
  }

  calculateInvoiceDetail(data){
    this.invoiceAmount          =  data.INVOICE_AMOUNT;
    this.invoiceDiscountAmount  =  data.INVOICE_DISCOUNT_AMOUNT;
    this.invoiceTotal           =  data.INVOICE_FINAL_AMOUNT;
  }

  makeTransactionArray(data){
    this.transactionArray = [];
    
    data.TRANSACTION[0].TRANSACTION_DETAIL.forEach(element => {
    
      if(element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PRODUCT){
        this.transactionArray.push(element);
        this.gst += element.PRODUCT_GST_AMOUNT * element.PRODUCT_QUANTITY;
      }
    
      if(element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_DELIVERY_CHAGE){
        this.deliveryCharge += element.PRODUCT_FINAL_PRICE;
      }
    
      if(element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_CONVENIENCE_FEE){
        this.convenienceFee += element.PRODUCT_FINAL_PRICE;
      }

      this.numberOfItems = this.transactionArray.length;
    });
  }

  //Transactions Logic Ends Here



  paymentRequestObject = {};

  makeUpdatePaymentRequestObject(){
    this.paymentRequestObject = {
      STORE_ID            : this.configService.getStoreID(),
      SUBSCRIBER_ID       : this.commonService.lsSubscriberId(),
      TRANSACTION_ID      : this.commonService.lsTransactionId(),
      PAYMENT_TYPE_ID     : 2,
      DELIVERY_STATUS_ID  : 1,
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
}
