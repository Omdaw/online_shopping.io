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
import { InvoiceService } from '../invoice.service';
import { TransactionsService } from '../transactions.service';
import {Location} from '@angular/common';
import { FlagsService } from '../flags.service';
import { ConfigService } from '../config.service';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  constructor(private configService : ConfigService, 
    private _router             : Router, 
    private route               : ActivatedRoute, 
    private invoiceService      : InvoiceService,
    private subscriberService   : SubscriberService,
    private userProfileService  : UserProfileService,
    private TransactionsService : TransactionsService,
    private flagsService        : FlagsService,
    private _location: Location,
    public commonService         : CommonService
) { }

  //Variables
  processBar = false;
  invoiceRequestObject  = {};
  invoiceObject         = {CONTACT_NAME : "", ADDRESS_LINE1 : "", ADDRESS_LINE2 : "", ADDRESS_CITY_NAME: "", ADDRESS_STATE_NAME : "", ADDRESS_COUNTRY_NAME : "", TRANSACTION_ID : 0, INVOICE_ID : 0, PAYMENT_TYPE_NAME : "", INVOICE_FINAL_AMOUNT : 0, length : 0, STORE_NAME : "", STORE_ADDRESS_LINE1 : "", STORE_ADDRESS_LINE2 : "", INVOICE_AMOUNT : 0, INVOICE_DISCOUNT_AMOUNT : 0, INVOICE_TOTAL_DISCOUNT : 0};
  invoiceDetails        = [];
  invoiceTotal            = 0;
  invoiceAmount           = 0;
  invoiceDiscountAmount   = 0;
  deliveryCharge          = 0;
  convenienceFee          = 0;
  gst                     = 0;
  invoiceNumber           = 0;

  paymentId          : string;
  paymentRequestedId : string;
  paymentStatus      : string;

  ngOnInit() {
    this.flagsService.hideHeaderFooter();
    this.flagsService.showSearch();
      this.flagsService.showHeaderFooter();
      if(window.innerWidth < 600){
        this.flagsService.hideFooter();
      }
    this.flagsService.continueShoppingCallFromInvoice = 1;
    this.flagsService.inDeliveryPageFlag              = 1;

    // http://noqsystem.com:50010/api/ols/paymentAPI?payment_id=MOJO9a10V05A88354966&payment_status=Credit&payment_request_id=ffbfea9b7e874d74b8eac17db6c19aa7

    this.route.queryParams.subscribe(params => {
        console.log(params);
    })

    this.route.queryParams.subscribe(params => {
      if(params.payment_id != undefined){
        this.paymentId = params.payment_id;
      }
    });

    this.route.queryParams.subscribe(params => {
      if(params.payment_status != undefined){
        this.paymentStatus = params.payment_status;
      }
    }); 

    this.route.queryParams.subscribe(params => {
      if(params.payment_request_id != undefined){
        this.paymentRequestedId = params.payment_request_id;
      }
    }); 

    console.log('**************PAYMENT-DATA*****************');
    console.log(this.paymentId);
    console.log(this.paymentStatus);
    console.log(this.paymentRequestedId);
    console.log('********************************************');

    if(this.paymentId != undefined && this.paymentRequestedId != undefined && this.paymentStatus != undefined){
      
      if(this.paymentStatus == 'Failed'){
 
        var txt = "You have cancelled the payment.";
        
        if (confirm(txt)) { 

          this._router.navigate(['/'], { replaceUrl: true });
 
        } else {

          this.backClicked();
            
        }
 
      } else if(this.paymentStatus == 'Credit'){
      
        this.processBar = true;
        this.invoiceService.fetchTransactionsByPaymentRequestIdAPI(this.paymentRequestedId).subscribe(data => this.handleFetchInvoiceDetailsSuccess(data), error => this.handleError(error));
      
      }

    } else {
      this.fetchInvoiceDetails();
    }
  }

  backClicked() {
    this._location.back();
  }

  fetchInvoiceDetails(){
    this.processBar = true;
    this.invoiceRequestObject = {
      SUBSCRIBER_ID   : this.commonService.lsSubscriberId(),
      TRANSACTION_ID  : this.commonService.lsTransactionId() 
    }
    this.invoiceService.fetchTransactionsByTransactionIdAPI(this.invoiceRequestObject).subscribe(data => this.handleFetchInvoiceDetailsSuccess(data), error => this.handleError(error));
  }

  handleFetchInvoiceDetailsSuccess(pData){

    if(pData.STATUS ='OK'){
      this.invoiceDetails = pData.TRANSACTION;
      this.invoiceObject  = pData.TRANSACTION[0];
      this.makeTransactionArray(pData.TRANSACTION);
      this.calculateInvoiceDetail(pData.TRANSACTION);

      localStorage.setItem('transactionId', "0");
      this.userProfileService.numberOfProductsInCart = 0;
      this.TransactionsService.transactionArray = [];
      this.TransactionsService.transactionDetailsArray = [];
    }

  }

  handleError(error){
    
  }

  makeTransactionArray(data){
    this.gst = 0; this.deliveryCharge = 0; this.convenienceFee = 0; //Initialise
    this.invoiceDetails = [];
    data[0].TRANSACTION_DETAIL.forEach(element => {
      if(element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PRODUCT){
        this.invoiceDetails.push(element);
        this.gst += element.PRODUCT_GST_AMOUNT * element.PRODUCT_QUANTITY;
      }
      if(element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_DELIVERY_CHAGE){
        this.deliveryCharge += element.PRODUCT_FINAL_PRICE;
      }
      if(element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_CONVENIENCE_FEE){
        this.convenienceFee += element.PRODUCT_FINAL_PRICE;
      }

    });
  }

  calculateInvoiceDetail(data){
    this.invoiceAmount          =  data[0].INVOICE_AMOUNT;
    this.invoiceDiscountAmount  =  data[0].INVOICE_DISCOUNT_AMOUNT;
    this.invoiceTotal           =  data[0].INVOICE_FINAL_AMOUNT;
    this.invoiceNumber           =  data[0].INVOICE_ID;
  }

}
