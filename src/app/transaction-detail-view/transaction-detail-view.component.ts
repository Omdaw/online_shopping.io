import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { MainNavComponent } from 'src/app/main-nav/main-nav.component';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { CommonModule } from '@angular/common';
import { CommonService } from '../common.service';
import { TransactionsService } from '../transactions.service';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-transaction-detail-view',
  templateUrl: './transaction-detail-view.component.html',
  styleUrls: ['./transaction-detail-view.component.css']
})

export class TransactionDetailViewComponent implements OnInit {


  currency                                 = "Rs."

  transactionId                            : number;            
  transactionDate                          : string;     
  subscriberId                             : number;     
  subscriberName                           : string;    
  subscriberFirstName                      : string;    
  subscriberLastName                       : string;    
  subscriberMobileNr                       : string;    
  subscriberEmailId                        : string;    
  storeId                                  : number;     
  vendorId                                 : number;     
  storeName                                : string;     
  storeAddressLine1                        : string;    
  storeAddressLine2                        : string;    
  storeAddressPincode                      : string;    
  storeAddressAreaId                       : number;   
  storeAddressAreaName                     : string;   
  storeAddressCityId                       : number;   
  storeAddressCityName                     : string;   
  storeAddressStateId                      : number;   
  storeAddressStateName                    : string;   
  storeAddressCountryId                    : number;   
  storeAddressCountryName                  : string;   
  storeLocationAltitude                    : number;    
  storeLocationLatitude                    : number;    
  storeLocationLongitude                   : number;    
  storeLocationRadius                      : number;    
  storePrimaryContactMobileNr              : string;  
  storePrimaryContactEmailId               : string;  
  storeDeliveryMinimumTime                 : string;   
  shoppingTypeCode                         : number;    
  shoppingTypeName                         : string;    
  cartNumber                               : string;     
  deliveryAddressId                        : number;    
  addressId                                : number;     
  addressLine1                             : string;     
  addressLine2                             : string;     
  addressPincode                           : string;     
  addressAreaId                            : number;    
  addressAreaName                          : string;    
  addressCityId                            : number;    
  addressCityName                          : string;    
  addressStateId                           : number;    
  addressStateName                         : string;    
  addressCountryId                         : number;    
  addressCountryName                       : string;    
  addressLatitude                          : number;     
  addressLongitude                         : number;     
  addressCreatedDate                       : string;    
  addressLastModifiedDate                  : string;   
  addressLabel                             : string;     
  contactName                              : string;     
  contactMobileNr                          : string;    
  invoiceId                                : string;     
  invoiceAmount                            : string;     
  invoiceDiscountAmount                    : number;    
  invoiceDiscountId                        : number;    
  invoiceFinalAmount                       : number;    
  invoiceTotalDiscount                     : number;    
  numberOfItems                            : number;    
  paymentRequestedId                       : number;    
  paymentStatusId                          : number;    
  cancellationStageId                      : number;    
  cancellationFeeAmount                    : number;    
  cancellationFeePaymentRequestedId        : number;  
  cancellationReasonId                     : number;    
  cancellationReasonComment                : string;    
  previousCancellationStageId              : number;   
  previousCancellationFeeAmount            : number;   
  previousCancellationDate                 : string;    
  previousCancellationFeePaymentRequestedId: string; 
  previousCancellationPaymentStatusId      : number;  
  previousCancellationReasonId             : number;   
  previousCancellationReasonComment        : string;   
  previousCancellationTransactionId        : number;   
  paymentStatusName                        : string;    
  paymentTypeId                            : number;    
  paymentTypeName                          : string;    
  deliveryTypeId                           : number;    
  deliveryTypeName                         : string;    
  deliveryStatusId                         : number;    
  deliveryStatusName                       : string;    
  fromUserId                               : number;    
  fromUserFirstName                        : string;   
  fromUserLastName                         : string;   
  fromUserMobileNr                         : string;   
  toUserId                                 : number;    
  toUserFirstName                          : string;   
  toUserLastName                           : string;   
  toUserMobileNr                           : string;   
  storeWebhookLink                         : string;    
  storePurpose                             : string;     
  gstIncludedInTheProductPriceFlag         : number; 
  updateAddressFlag                        : number;    
  redirectUrlLink                          : string;    
  webhookLink                              : string;     
  cancellationWebhookLink                  : string;    
  createdDate                              : string;     
  lastModifiedDate                         : string;    
  applicationId                            : number;     
  scheduledDeliveryDateFlag                : number;  
  deliveryDateUIFormat                     : string;   
  deliveryTimeUIFormat                     : string;   
  orderPlacedDate                          : string;    
  cancellationDate                         : string;     
  deliveredDate                            : string;     
  deliveryDate                             : string;
  options                                  : string;
  transactionDetailArrayObj                : any;
  color                                    : string;
  statusColor                              : string;           

  gst             : number;
  deliveryCharge  : number;
  convenienceFee  : number;
  promoCodeDiscountAmount : number;
  transactionProductCount : number;
  invoiceDetails  = [];

  headerPaymentStatusName  : string; 
  headerDeliveryStatusName : string;  

  // updatedDeliveryStatusId   : number;
  // updatedDeliveryStatusName : string;
  // updatedPaymentStatusId    : number;
  // updatedPaymentStatusName  : string;

  apiResponse        : string;

  // MatPaginator Output
  pageEvent: PageEvent;

  createAccess: boolean;
  deleteAccess: boolean;
  viewAccess: boolean;
  updateAccess: boolean;

  processBar = true;

  deliveryStatusArray = [];

  // Product Category Controller
  deliveryStatusController      = new FormControl();
  deliveryStatusFilteredOptions : Observable<string[]>;

  // private _deliveryStatusFilter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.deliveryStatusArray.filter(option => option.name.toLowerCase().includes(filterValue));
  // }

  paymentStatusArray  = [];

  // Product Category Controller
  paymentStatusController      = new FormControl();
  paymentStatusFilteredOptions : Observable<string[]>;

  // private _paymentStatusFilter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.paymentStatusArray.filter(option => option.name.toLowerCase().includes(filterValue));
  // }


  constructor(private configService : ConfigService,
              private _router                 : Router, 
              private route                   : ActivatedRoute, 
              private mainNav                 : MainNavComponent, 
              private _transactionListService : TransactionsService,
              private _flashMessagesService   : FlashMessagesService,
              private commonMethods           : CommonService
              ) {}

  ngOnInit() {
    // this.checkAccess();
    this.getTransactionIdByParam();
    this.loadData();

    // this.deliveryStatusFilteredOptions = this.deliveryStatusController.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._deliveryStatusFilter(value))
    // );

    // this.paymentStatusFilteredOptions = this.paymentStatusController.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._paymentStatusFilter(value))
    // );
  }

  getTransactionIdByParam(){
        
		this.route.params.subscribe(params => {
			
			if(params['id'] != undefined) {
			  this.transactionId = params['id']; 
      }
		});
	}

  loadData() {
    this._transactionListService.fetchTransactionsByID(this.transactionId).subscribe(data  => this.handleData(data),
                                                                                     error => this.handleError(error));
  }
  
  handleData(pData) {

    // check is there any failure ?
    // this.commonMethods.handleSuccessNoNavigation(pData, this._flashMessagesService);

    if (pData.STATUS = 'OK') {

      this.convertFromWebDataToFormData(pData);

    }

    // stop the progress bar
    this.processBar = false;
  }

  handleError(pError) {
    // this.commonMethods.handleError(pError, this._flashMessagesService);
    // stop the progress bar
    this.processBar = false;
  }

  convertFromWebDataToFormData(pData: any) {

    this.transactionDetailArrayObj = [];

    let arrayObj: any = pData.TRANSACTIONS;

    for (let i = 0; i < arrayObj.length; i++) {

      let data:any = arrayObj[i];

        this.transactionId                             = data.TRANSACTION_ID;
        this.transactionDate                           = data.TRANSACTION_DATE;
        this.subscriberId                              = data.SUBSCRIBER_ID;
        this.subscriberName                            = data.SUBSCRIBER_FIRST_NAME + ' ' + data.SUBSCRIBER_LAST_NAME,
        this.subscriberFirstName                       = data.SUBSCRIBER_FIRST_NAME;
        this.subscriberLastName                        = data.SUBSCRIBER_LAST_NAME;         
        this.subscriberMobileNr                        = data.SUBSCRIBER_MOBILE_NR;         
        this.subscriberEmailId                         = data.SUBSCRIBER_EMAIL_ID;        
        this.storeId                                   = data.STORE_ID;
        this.vendorId                                  = data.VENDOR_ID;
        this.storeName                                 = data.STORE_NAME;
        this.storeAddressLine1                         = data.STORE_ADDRESS_LINE1;        
        this.storeAddressLine2                         = data.STORE_ADDRESS_LINE2;        
        this.storeAddressPincode                       = data.STORE_ADDRESS_PINCODE;          
        this.storeAddressAreaId                        = data.STORE_ADDRESS_AREA_ID;         
        this.storeAddressAreaName                      = data.STORE_ADDRESS_AREA_NAME;           
        this.storeAddressCityId                        = data.STORE_ADDRESS_CITY_ID;         
        this.storeAddressCityName                      = data.STORE_ADDRESS_CITY_NAME;           
        this.storeAddressStateId                       = data.STORE_ADDRESS_STATE_ID;          
        this.storeAddressStateName                     = data.STORE_ADDRESS_STATE_NAME;            
        this.storeAddressCountryId                     = data.STORE_ADDRESS_COUNTRY_ID;            
        this.storeAddressCountryName                   = data.STORE_ADDRESS_COUNTRY_NAME;              
        this.storeLocationAltitude                     = data.STORE_LOCATION_ALTITUDE;            
        this.storeLocationLatitude                     = data.STORE_LOCATION_LATITUDE;            
        this.storeLocationLongitude                    = data.STORE_LOCATION_LONGITUDE;             
        this.storeLocationRadius                       = data.STORE_LOCATION_RADIUS;          
        this.storePrimaryContactMobileNr               = data.STORE_PRIMARY_CONTACT_MOBILE_NR;                  
        this.storePrimaryContactEmailId                = data.STORE_PRIMARY_CONTACT_EMAIL_ID;                 
        this.storeDeliveryMinimumTime                  = data.STORE_DELIVERY_MINIMUM_TIME;               
        this.shoppingTypeCode                          = data.SHOPPING_TYPE_CODE;       
        this.shoppingTypeName                          = data.SHOPPING_TYPE_NAME;       
        this.cartNumber                                = data.CART_NUMBER; 
        this.deliveryAddressId                         = data.DELIVERY_ADDRESS_ID;        
        this.addressId                                 = data.ADDRESS_ID;
        this.addressLine1                              = data.ADDRESS_LINE1;   
        this.addressLine2                              = data.ADDRESS_LINE2;   
        this.addressPincode                            = data.ADDRESS_PINCODE;     
        this.addressAreaId                             = data.ADDRESS_AREA_ID;    
        this.addressAreaName                           = data.ADDRESS_AREA_NAME;      
        this.addressCityId                             = data.ADDRESS_CITY_ID;    
        this.addressCityName                           = data.ADDRESS_CITY_NAME;      
        this.addressStateId                            = data.ADDRESS_STATE_ID;     
        this.addressStateName                          = data.ADDRESS_STATE_NAME;       
        this.addressCountryId                          = data.ADDRESS_COUNTRY_ID;       
        this.addressCountryName                        = data.ADDRESS_COUNTRY_NAME;         
        this.addressLatitude                           = data.ADDRESS_LATITUDE;      
        this.addressLongitude                          = data.ADDRESS_LONGITUDE;       
        this.addressCreatedDate                        = data.ADDRESS_CREATED_DATE;         
        this.addressLastModifiedDate                   = data.ADDRESS_LAST_MODIFIED_DATE;              
        this.addressLabel                              = data.ADDRESS_LABEL;   
        this.contactName                               = data.CONTACT_NAME;  
        this.contactMobileNr                           = data.CONTACT_MOBILE_NR;      
        this.invoiceId                                 = data.INVOICE_ID;
        this.invoiceAmount                             = data.INVOICE_AMOUNT;    
        this.invoiceDiscountAmount                     = data.INVOICE_DISCOUNT_AMOUNT;            
        this.invoiceDiscountId                         = data.INVOICE_DISCOUNT_ID;        
        this.invoiceFinalAmount                        = data.INVOICE_FINAL_AMOUNT;         
        this.invoiceTotalDiscount                      = data.INVOICE_TOTAL_DISCOUNT;           
        this.numberOfItems                             = data.NUMBER_OF_ITEMS;    
        this.paymentRequestedId                        = data.PAYMENT_REQUESTED_ID;         
        this.paymentStatusId                           = data.PAYMENT_STATUS_ID;      
        this.cancellationStageId                       = data.CANCELLATION_STAGE_ID;          
        this.cancellationFeeAmount                     = data.CANCELLATION_FEE_AMOUNT;            
        this.cancellationFeePaymentRequestedId         = data.CANCELLATION_FEE_PAYMENT_REQUESTED_ID;                        
        this.cancellationReasonId                      = data.CANCELLATION_REASON_ID;           
        this.cancellationReasonComment                 = data.CANCELLATION_REASON_COMMENT;                
        this.previousCancellationStageId               = data.PREVIOUS_CANCELLATION_STAGE_ID;                  
        this.previousCancellationFeeAmount             = data.PREVIOUS_CANCELLATION_FEE_AMOUNT;                    
        this.previousCancellationDate                  = data.PREVIOUS_CANCELLATION_DATE;               
        this.previousCancellationFeePaymentRequestedId = data.PREVIOUS_CANCELLATION_FEE_PAYMENT_REQUESTED_ID;                                
        this.previousCancellationPaymentStatusId       = data.PREVIOUS_CANCELLATION_PAYMENT_STATUS_ID;                          
        this.previousCancellationReasonId              = data.PREVIOUS_CANCELLATION_REASON_ID;                   
        this.previousCancellationReasonComment         = data.PREVIOUS_CANCELLATION_REASON_COMMENT;                        
        this.previousCancellationTransactionId         = data.PREVIOUS_CANCELLATION_TRANSACTION_ID;                        
        this.paymentStatusName                         = data.PAYMENT_STATUS_NAME;        
        this.paymentTypeId                             = data.PAYMENT_TYPE_ID;    
        this.paymentTypeName                           = data.PAYMENT_TYPE_NAME;      
        this.deliveryTypeId                            = data.DELIVERY_TYPE_ID;     
        this.deliveryTypeName                          = data.DELIVERY_TYPE_NAME;       
        this.deliveryStatusId                          = this.deliveryStatusId;       
        this.deliveryStatusName                        = data.DELIVERY_STATUS_NAME;         
        this.fromUserId                                = data.FROM_USER_ID; 
        this.fromUserFirstName                         = data.FROM_USER_FIRST_NAME;        
        this.fromUserLastName                          = data.FROM_USER_LAST_NAME;       
        this.fromUserMobileNr                          = data.FROM_USER_MOBILE_NR;       
        this.toUserId                                  = data.TO_USER_ID;                                                     
        this.toUserFirstName                           = data.TO_USER_FIRST_NAME;                                                                                             
        this.toUserLastName                            = data.TO_USER_LAST_NAME;     
        this.toUserMobileNr                            = data.TO_USER_MOBILE_NR;     
        this.storeWebhookLink                          = data.STORE_WEBHOOK_LINK;
        this.storePurpose                              = data.STORE_PURPOSE;
        this.gstIncludedInTheProductPriceFlag          = data.GST_INCLUDED_IN_THE_PRODUCT_PRICE_FLAG;
        this.updateAddressFlag                         = data.UPDATE_ADDRESS_FLAG;
        this.redirectUrlLink                           = data.REDIRECT_URL_LINK;
        this.webhookLink                               = data.WEBHOOK_LINK;
        this.cancellationWebhookLink                   = data.CANCELLATION_WEBHOOK_LINK;
        this.createdDate                               = data.CREATED_DATE;
        this.lastModifiedDate                          = data.LAST_MODIFIED_DATE;
        this.applicationId                             = data.APPLICATION_ID;
        this.scheduledDeliveryDateFlag                 = data.SCHEDULED_DELIVERY_DATE_FLAG;
        this.deliveryDateUIFormat                      = data.DELIVERY_DATE_UI_FORMAT;
        this.deliveryTimeUIFormat                      = data.DELIVERY_TIME_UI_FORMAT;
        this.orderPlacedDate                           = data.ORDER_PLACED_DATE;
        this.cancellationDate                          = data.CANCELLATION_DATE;
        this.deliveredDate                             = data.DELIVERED_DATE;
        this.deliveryDate                              = data.DELIVERY_DATE;
        this.options                                   = '',
        this.color                                     = '',
        this.statusColor                               = '';
 
        let transactionDetailArray: any = data.TRANSACTION_DETAIL;

        for (let i = 0; i < transactionDetailArray.length; i++) {

          let tDData : any = transactionDetailArray[i]; 

          if(tDData.PRODUCT_IMAGE_FILE_PATH == 'null'){

            tDData.PRODUCT_IMAGE_FILE_PATH = './assets/images/image-not-found.jpg';
          }

          let transactionDetailObj: any = {
            transactionDetailId       : tDData.TRANSACTION_DETAIL_ID,            
            transactionId             : tDData.TRANSACTION_ID,      
            storeId                   : tDData.STORE_ID,
            vendorId                  : tDData.VENDOR_ID, 
            productId                 : tDData.PRODUCT_ID,  
            productDetailId           : tDData.PRODUCT_DETAIL_ID,        
            productName               : tDData.PRODUCT_NAME,    
            productPrice              : tDData.PRODUCT_PRICE,     
            productDiscountId         : tDData.PRODUCT_DISCOUNT_ID,          
            productDiscountAmount     : tDData.PRODUCT_DISCOUNT_AMOUNT,              
            productFinalPrice         : tDData.PRODUCT_FINAL_PRICE,          
            productGstId              : tDData.PRODUCT_GST_ID,     
            productGstPercentage      : tDData.PRODUCT_GST_PERCENTAGE,             
            productGstAmount          : tDData.PRODUCT_GST_AMOUNT,         
            productGstStatus          : tDData.PRODUCT_GST_STATUS,         
            productQuantity           : tDData.PRODUCT_QUANTITY,        
            productMultiFlag          : tDData.PRODUCT_MULTI_FLAG,         
            productImageFile          : tDData.PRODUCT_IMAGE_FILE,         
            productImagePath          : tDData.PRODUCT_IMAGE_PATH,         
            productImageFilePath      : tDData.PRODUCT_IMAGE_FILE_PATH,             
            productUnitTypeCode       : tDData.PRODUCT_UNIT_TYPE_CODE,            
            productUnit               : tDData.PRODUCT_UNIT,    
            productUnitTypeName       : tDData.PRODUCT_UNIT_TYPE_NAME,            
            productBrandId            : tDData.PRODUCT_BRAND_ID,       
            productBrandName          : tDData.PRODUCT_BRAND_NAME,         
            maxPurchaseQuantity       : tDData.MAX_PURCHASE_QUANTITY,            
            transactionDetailTypeCode : tDData.TRANSACTION_DETAIL_TYPE_CODE,                  
            promoCode                 : tDData.PROMO_CODE,  
            promoCodeDiscountAmount   : tDData.PROMO_CODE_DISCOUNT_AMOUNT,                
          }

        this.transactionDetailArrayObj.push(transactionDetailObj); 
      }      

      if (this.paymentTypeId == 1) {
        this.color = 'green';
      } else {
        this.color = 'red';
      }

        
    }
    this.makeTransactionArray(this.transactionDetailArrayObj);

    // Status Names
    this.headerPaymentStatusName  = this.paymentStatusName;
    this.headerDeliveryStatusName = this.deliveryStatusName;
  }

  checkIfProduct(transactionDetail:any){
    // console.log('*************************checkIfProduct()BEGIN****************************');
    // console.log(transactionDetail);
    if(transactionDetail.transactionDetailTypeCode == ApplicationConstants.PRODUCT_CODE){
      return true;
    }
    // console.log('*************************checkIfProduct()END****************************');
  }

  checkIfNotProduct(transactionDetail:any){
    // console.log('*************************checkIfNotProduct() BEGIN****************************');
    // console.log(transactionDetail);
    if(transactionDetail.transactionDetailTypeCode > ApplicationConstants.PRODUCT_CODE){
      return true;
    }
    // console.log('*************************checkIfNotProduct()END****************************');
  }

  checkDeliveryAddress(){
    if(this.deliveryAddressId > 0){
      return true;
    }else {
      return false;
    }
  }

  makeTransactionArray(pData){

    this.gst                     = 0;
    this.deliveryCharge          = 0;
    this.convenienceFee          = 0;
    this.promoCodeDiscountAmount = 0;
    this.invoiceDetails = [];

    this.transactionProductCount = 0;

    for(let index = 0; index < pData.length; index ++){

      console.log("data");
      console.log(pData[index]);

      if(pData[index].transactionDetailTypeCode == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PRODUCT){
        this.invoiceDetails.push(pData[index]);
        this.gst += pData[index].productGstAmount * pData[index].productQuantity;
        this.transactionProductCount ++;
      }
      if(pData[index].transactionDetailTypeCode == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_DELIVERY_CHAGE){
        this.deliveryCharge += pData[index].productFinalPrice;
      }

      if(pData[index].transactionDetailTypeCode == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_CONVENIENCE_FEE){
        this.convenienceFee += pData[index].productFinalPrice;
      }

      if(pData[index].transactionDetailTypeCode == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PROMO_CODE){
        this.promoCodeDiscountAmount += pData[index].promoCodeDiscountAmount;
      }
      

    }
  }

  

}
