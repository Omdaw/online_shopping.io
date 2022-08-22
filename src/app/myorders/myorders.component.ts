import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators/map'; 
import { ApplicationConstants } from 'src/ApplicationConstants';
import { ProductService } from '../product.service';
import { SubscriberService } from '../subscriber.service';
import { UserProfileService } from '../user-profile.service';
import { FlagsService } from '../flags.service';
import { ConfigService } from '../config.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductReviewDialogComponent } from '../product-review-dialog/product-review-dialog.component';
import { CommonService } from '../common.service';
import { TransactionsService } from '../transactions.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.css']
})
export class MyordersComponent implements OnInit {

  constructor(private configService      : ConfigService,
              private _router            : Router,
              private route              : ActivatedRoute,
              private subscriberService  : SubscriberService,
              private userProfileService : UserProfileService,
              private flagsService       : FlagsService,
              public commonService         : CommonService,
              public transactionsService         : TransactionsService,
              private dialog             : MatDialog) { }

   // Dialog (Cancel Orer )
   link: string;
   openDialog(pTransactionObject): void {
     const dialogRef = this.dialog.open(CancelOrderDialog, {
       width: '600px',
       data : pTransactionObject
     });
 
     dialogRef.afterClosed().subscribe(result => {
       this.fetchMyOrders();
     });
   }
   // Dialog ends (Cancel Orer )

  processBar               = false;
  transactionRequestObject = {};
  ordersArray              : [];
  showOrders               = true;
  showOrderDetails         = false;
  orderDetailsObject       = {};
  transactionArray         = [];
  deliverySlot             = "";

  invoiceTotal            = 0;
  invoiceAmount           = 0;
  invoiceDiscountAmount   = 0;
  deliveryCharge          = 0;
  convenienceFee          = 0;
  gst                     = 0;

  ngOnInit() {
    this.flagsService.showSearch();
    this.flagsService.showHeaderFooter();
    // this.flagsService.hideHeader();
    this.flagsService.inDeliveryPageFlag = 1;
    this.processBar                = true;
    this.fetchMyOrders();
    window.scroll(0,0);
  }

  fetchCancellationFeeApi(rowObject){
    let requestObject = {
      SUBSCRIBER_ID    : this.commonService.lsSubscriberId(),
      STORE_ID         : this.configService.getStoreID(),
      TRANSACTION_ID   : rowObject.TRANSACTION_ID,
      STATUS_CODE      : ApplicationConstants.STATUS_CODE_ENABLE
    };
    this.transactionsService.fetchCancellationFeeApi(requestObject).subscribe(data => data, error => error);
  }
  cancelOrderByOrderId(rowObject){
    this.processBar = true;
    let requestObject = {
      SUBSCRIBER_ID                         : this.commonService.lsSubscriberId(), 
      STORE_ID                              : this.configService.getStoreID(),
      TRANSACTION_ID                        : rowObject.TRANSACTION_ID,
      CANCELLATION_STAGE_ID                 : 1,
      CANCELLATION_FEE_AMOUNT               : 20,
      CANCELLATION_FEE_PAYMENT_REQUESTED_ID : "8d78cd6eeaf34af4ae004658b6c2fbe2",
      CANCELLATION_AMOUNT_PAID_FLAG         : "TRUE",
      CANCELLATION_REASON_ID                : 1
    };
    this.transactionsService.cancelTransactionApi(requestObject).subscribe(data => this.handleCancelOrder(data), error => error);
  }

  handleCancelOrder(data){
    if(data.STATUS == "OK"){
      this.fetchMyOrders();
    }
  }

  fetchMyOrders(){
    this.transactionRequestObject = {
      SUBSCRIBER_ID       : this.commonService.lsSubscriberId(),
      LIMIT               : 50,
      OFFSET              : 0
    }
    this.userProfileService.fetchMyOrdersBySubscriberId(this.transactionRequestObject).subscribe(data => this.handleFetchMyOrdersSuccess(data), error => error);
  }

  handleFetchMyOrdersSuccess(data){
    if(data.STATUS == "OK"){
      this.ordersArray = data.TRANSACTION;
    }
    this.processBar                = false;
  }

  viewOrderDetails(object){
    this.showOrderDetails = true;
    this.showOrders       = false;
    this.orderDetailsObject = object;
    // this.transactionArray  = object.TRANSACTION_DETAIL;
    this.makeTransactionArray(object);
    this.calculateInvoiceDetail(object);
    window.scroll(0,0);
  }

  goback(){
    this.showOrderDetails = false;
    this.showOrders       = true;
    window.scroll(0,0);
  }

  makeTransactionArray(data){
    this.gst = 0; this.deliveryCharge = 0; this.convenienceFee = 0; //Initialise
    this.transactionArray = [];
    data.TRANSACTION_DETAIL.forEach(element => {
      if(element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PRODUCT){
        this.transactionArray.push(element);
        this.gst += element.PRODUCT_GST_AMOUNT * element.PRODUCT_QUANTITY;
      }
      // if(element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_DELIVERY_CHAGE){
      //   this.deliveryCharge += element.PRODUCT_FINAL_PRICE;
      // }

      // Delivery Slot 
      if(element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_DELIVERY_SLOT_CHARGE){
        this.deliveryCharge += element.PRODUCT_FINAL_PRICE;
        this.deliverySlot = element.DELIVERY_SLOT_DAY +" "+ element.DELIVERY_SLOT_TIME;
      }

      if(element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_CONVENIENCE_FEE){
        this.convenienceFee += element.PRODUCT_FINAL_PRICE;
      }

    });
    console.log("<============ this.transactionArray ============>");
    console.log(this.transactionArray);
    // this.userProfileService.numberOfProductsInCart = this.transactionArray.length;
  }

  calculateInvoiceDetail(data){
    this.invoiceAmount          =  data.INVOICE_AMOUNT;
    this.invoiceDiscountAmount  =  data.INVOICE_DISCOUNT_AMOUNT;
    this.invoiceTotal           =  data.INVOICE_FINAL_AMOUNT;
  }

  openProductReviewDialog(pProductDetailId) {

    console.log("pProductDetailId => " + pProductDetailId);

    const dialogRef = this.dialog.open(ProductReviewDialogComponent, {
      data : {
        PRODUCT_DETAIL_ID : pProductDetailId
      },
      height   : '80%',
      maxWidth : '100%'
    });
    
    dialogRef.afterClosed().subscribe(result => {
    
    });
  }

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
}

// Dialog Code (Cancel Order Dialog)
export interface DialogData {
  link: string;
}

@Component({
  selector: 'cancel-order-dialog',
  templateUrl: './cancel-order.html',
})

export class CancelOrderDialog {

   constructor(private configService: ConfigService,
    public dialogRef: MatDialogRef<CancelOrderDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public  commonService         : CommonService,
    private transactionsService   : TransactionsService,
    private _snackBar             : MatSnackBar
  ) {
    this.transactionObject = data;
    this.fetchCancellationFeeApi();
   }


  openSnackBar(message: string) {
    this._snackBar.open(message, "", {
      duration: 2000,
      panelClass: ['snackbarStyle']
    });
    
  }

   transactionObject : any;

  onNoClick(): void {
    this.dialogRef.close();

  }

  closeDialogue(): void {
    this.dialogRef.close();
  }

  cancellationDetailsObject : any;
  fetchCancellationFeeApi(){
    let requestObject = {
      SUBSCRIBER_ID    : this.commonService.lsSubscriberId(),
      STORE_ID         : this.configService.getStoreID(),
      TRANSACTION_ID   : this.transactionObject.TRANSACTION_ID,
      STATUS_CODE      : ApplicationConstants.STATUS_CODE_ENABLE
    };
    this.transactionsService.fetchCancellationFeeApi(requestObject).subscribe(data => this.handleFetchCancellationFeeApi(data), error => error);
  }

  handleFetchCancellationFeeApi(data){
    // if(data.STATUS == "OK"){
      this.cancellationDetailsObject = data
    // }
  }

  cancellationReasonId = 0;

  cancellationReasonComment : string = "";

  cancelOrder(){

    if(this.cancellationReasonId == 0) {
      this.openSnackBar("Please choose reason for cancelling the order.");
    } else  if(this.cancellationReasonId == 1  && this.cancellationReasonComment == "") {
      this.openSnackBar("Please enter the reason for cancelling the order.");
    } else {
      let requestObject : any = {
        SUBSCRIBER_ID                         : this.commonService.lsSubscriberId(), 
        STORE_ID                              : this.configService.getStoreID(),
        TRANSACTION_ID                        : this.transactionObject.TRANSACTION_ID,
        CANCELLATION_STAGE_ID                 : this.cancellationDetailsObject.CANCELLATION_STAGE_ID,
        CANCELLATION_FEE_AMOUNT               : this.cancellationDetailsObject.CANCELLATION_FEE_AMOUNT,
        // CANCELLATION_FEE_PAYMENT_REQUESTED_ID : "8d78cd6eeaf34af4ae004658b6c2fbe2",
        // CANCELLATION_AMOUNT_PAID_FLAG         : "FALSE",
        CANCELLATION_REASON_ID                : this.cancellationReasonId
      };

      if(this.cancellationReasonId == 1) requestObject.CANCELLATION_REASON_COMMENT = this.cancellationReasonComment;
      this.transactionsService.cancelTransactionApi(requestObject).subscribe(data => this.handleCancelOrder(data), error => error);
    }
  }

  handleCancelOrder(data){
    if(data.STATUS == "OK"){
      this.openSnackBar("Your Order "+ this.transactionObject.INVOICE_ID +" has been Cancelled Successfully.");
      this.closeDialogue();
    }
  }

}
// Dialog Code Ends (Cancel Order Dialog)