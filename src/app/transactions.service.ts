import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstants } from 'src/ApiConstants';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { FlagsService } from './flags.service';
import { UserProfileService } from './user-profile.service';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { WalletMethodsService } from './wallet-methods.service';
import { SubscriberService } from './subscriber.service';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})

export class TransactionsService {

  constructor(private configService: ConfigService,
    private _http: HttpClient,
    private flagsService: FlagsService,
    private userProfileService: UserProfileService,
    private subscriberService: SubscriberService,
    private route: Router
  ) { }

  public transactionReviewTransactionId = 0;
  public transactionReviewFlag = false;

  public transactionArray = []; // Invoice Related Details
  public transactionDetailsArray = []; // Product Related Details 
  public unavailableProductsArray = [];

  public checkTransactionReviewPending() {
    let requestObject = {
      SUBSCRIBER_ID: this.lsSubscriberId()
    }
    this.checkTransactionReviewPendingAPI(requestObject).subscribe(data => this.handleCheckTransactionReviewPending(data), error => error);

  }

  handleCheckTransactionReviewPending(data) {
    if (data.STATUS == "OK") {
      this.transactionReviewTransactionId = data.TRANSACTION_ID;
      this.transactionReviewFlag = data.FLAG;

      if (this.transactionReviewFlag && this.transactionReviewTransactionId > 0) {
        this.flagsService.orderStatusCodePopUp = true;
      } else {
        this.flagsService.orderStatusCodePopUp = false;
      }
    }
  }

  private checkTransactionReviewPendingAPI(requestObject): Observable<any> {
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.checkTransactionReviewPendingAPI, requestObject).pipe(map(data => data, error => error));
  }

  public insertTransactionReview() {
    this.insertTransactionReviewAPI().subscribe(data => data, error => error);

  }

  public insertTransactionReviewRequestObject = {};

  private insertTransactionReviewAPI(): Observable<any> {
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.insertTransactionReviewAPI, this.insertTransactionReviewRequestObject).pipe(map(data => data, error => error));
  }

  public refreshCartAmountDetail() {

    let data = this.transactionArray[0];

    this.userProfileService.invoiceTotal = data.INVOICE_FINAL_AMOUNT;

    this.calculateInvoiceDetail(data)
  }

  calculateInvoiceDetail(data) {
    this.userProfileService.invoiceAmount = data.INVOICE_AMOUNT;
    this.userProfileService.invoiceDiscount = data.INVOICE_DISCOUNT_AMOUNT;
    this.userProfileService.invoiceTotal = data.INVOICE_FINAL_AMOUNT;
  }

  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message || "Server Error");
  }

  fetchTransactionsByID(pTransactionId): Observable<any> {
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FETCH_TRANSACTIONS_API_URL, { TRANSACTION_ID: pTransactionId })
      .pipe(map(data => data,
        catchError((e, c) => this.handleError(e, c))))
  }

  handleError(e, c) {
    return null;
  }

  public showAddToCart(productObject, index = 0) {
    let showAddToCart = true;
    this.transactionDetailsArray.forEach(transaction => {
      if (productObject.PRODUCT_DETAIL && productObject.PRODUCT_DETAIL[index] && productObject.PRODUCT_DETAIL[index].PRODUCT_DETAIL_ID == transaction.PRODUCT_DETAIL_ID) {
        showAddToCart = false;
      }
    });
    return showAddToCart;
  }

  public getSelectedQty(productObject, index = 0) {
    let selectedQty = 1;
    this.transactionDetailsArray.forEach(transaction => {
      if (productObject.PRODUCT_DETAIL && productObject.PRODUCT_DETAIL[index] && productObject.PRODUCT_DETAIL[index].PRODUCT_DETAIL_ID == transaction.PRODUCT_DETAIL_ID) {
        selectedQty = transaction.PRODUCT_QUANTITY;
        //  element.PRODUCT_DETAIL[0].transactionDetailsId = transaction.TRANSACTION_DETAIL_ID;
      }
    });
    return selectedQty;
  }

  public showOutofStock(productObject, index = 0) {
    let showOutOfStock = false;
    if (productObject.PRODUCT_DETAIL && productObject.PRODUCT_DETAIL && productObject.PRODUCT_DETAIL.length > 0 && productObject.PRODUCT_DETAIL[index].INVENTORY_POLICY == 2 && productObject.PRODUCT_DETAIL[index].AVAILABLE_QUANTITY <= 0) showOutOfStock = true;
    return showOutOfStock;
  }

  getDeliveryCharges() {
    let value = 0;
    this.transactionDetailsArray.forEach(element => {
      if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_DELIVERY_CHAGE) {
        value += element.PRODUCT_FINAL_PRICE;
      }
    });
    return value;
  }

  getConvinienceFee() {
    let value = 0;
    this.transactionDetailsArray.forEach(element => {
      if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_CONVENIENCE_FEE) {
        value += element.PRODUCT_FINAL_PRICE;
      }
    });
    return value;
  }

  getDeliverySlotCharges() {
    let value = 0;
    this.transactionDetailsArray.forEach(element => {
      if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_DELIVERY_SLOT_CHARGE) {
        value += element.PRODUCT_FINAL_PRICE;
      }
    });
    return value;
  }

  getMaxGSTPercentageInTheProductsInCart(){
    let value = 0;
    this.transactionDetailsArray.forEach(element => {
      if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PRODUCT) {
        if(element.PRODUCT_GST_PERCENTAGE > value) value = element.PRODUCT_GST_PERCENTAGE;
      }
    });
    return value;
  }

  getGSTAmountOfDeliverySlotCharges(deliverySlotCharges){
    let amount = 0;
    amount = (this.getMaxGSTPercentageInTheProductsInCart()/100) * deliverySlotCharges;
    return amount;
  }

  // checklist-promocode-issue
  getPromoCodeDiscountAmount() {
    let value = 0;
    if(this.transactionArray.length > 0){
      this.transactionArray[0].TRANSACTION_DETAIL.forEach(element => {
        if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PROMO_CODE) {
          value += element.PROMO_CODE_DISCOUNT_AMOUNT;
        }
      });
    }
    return value;
  }

  // checklist-promocode-issue
  getPromoCodeObject() {
    let obj : any;
    this.transactionArray[0].TRANSACTION_DETAIL.forEach(element => {
      if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PROMO_CODE) {
        obj = element;
      }
    });
    return obj;
  }

  getGstAmount() {
    let value = 0;
    this.transactionDetailsArray.forEach(element => {
      if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PRODUCT) {
        value += element.PRODUCT_GST_AMOUNT * element.PRODUCT_QUANTITY;
      }
    });

    return value.toFixed(2);
  }

  getGstWithDeliveryTimingSlotPrice(deliveryTimingSlotPrice){
    let value = 0;
    this.transactionDetailsArray.forEach(element => {
      if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PRODUCT) {
        value += element.PRODUCT_GST_AMOUNT * element.PRODUCT_QUANTITY;
      }
    });
    value += this.getGSTAmountOfDeliverySlotCharges(deliveryTimingSlotPrice);
    return value.toFixed(2);
  }
  getSgstWithDeliveryTimingSlotPrice(deliveryTimingSlotPrice){
    let value = 0;
    this.transactionDetailsArray.forEach(element => {
      if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PRODUCT) {
        value += element.PRODUCT_GST_AMOUNT * element.PRODUCT_QUANTITY;
      }
    });
    value += this.getGSTAmountOfDeliverySlotCharges(deliveryTimingSlotPrice);
    value = value / 2;
    return value.toFixed(2);
  }

  getSGstOrCGstAmount() {
    let value = 0;
    this.transactionDetailsArray.forEach(element => {
      if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PRODUCT) {
        value += element.PRODUCT_GST_AMOUNT * element.PRODUCT_QUANTITY;
      }
    });
    value = value / 2;
    return value.toFixed(2);
  }

  getAppliedWalletMoney() {
    let value = 0;
    this.transactionDetailsArray.forEach(element => {
      if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_WALLET) {
        value += element.PRODUCT_FINAL_PRICE;
      }
    });
    value = value / 2;
    return value;
  }

  public checkoutApiCalledFlag = false;

  public checkoutApi() {
    let requestObject = {
      SUBSCRIBER_ID: this.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
      TRANSACTION_ID: this.lsTransactionId(),
    }

    if (this.lsTempSubscriberFlag() == 0) {
      this.subscriberService.checkoutAPI(requestObject).subscribe(data => this.handleCheckoutApiSuccess(data), error => error);
      this.checkoutApiCalledFlag = true;
    }
  }

  handleCheckoutApiSuccess(data) {
    if (data.STATUS == "OK") {
      this.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionArray = data.TRANSACTION;
      this.unavailableProductsArray = data.UNAVAILABLE_PRODUCT_LIST;
    }
  }

  updateTransactionIfCheckOutApiIsCalled() {

    let requestObject = {
      SUBSCRIBER_ID: this.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
      TRANSACTION_ID: this.lsTransactionId(),
    }

    if (this.checkoutApiCalledFlag) {
      this.updateAvailableProductQuantity(requestObject).subscribe(data => data, error => error);
      this.checkoutApiCalledFlag = false;
    }

  }

  updateAvailableProductQuantity(requestObject) {
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.UPDATE_AVAILABLE_PRODUCT_QUANTITY, requestObject).pipe(map(data => this.handleUpdateAvailableProductQuantitySuccess(data), error => error));
  }

  handleUpdateAvailableProductQuantitySuccess(data) {
    if (data.STATUS == "OK") {
      this.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionArray = data.TRANSACTION;
    }
  }

  checkCartItems() {

    if (this.transactionArray[0].NUMBER_OF_ITEMS == 0) {
      this.userProfileService.numberOfProductsInCart = this.transactionArray[0].NUMBER_OF_ITEMS;
      this.route.navigate(['/']);
    }
  }

  // Localstorage isseus starts 
  public storeDataObject() {
    let objectName = "storeData" + this.configService.getStoreID();
    let storeDataObject: any = JSON.parse(localStorage.getItem(objectName));
    return storeDataObject;
  }

  //get transaction id
  public lsTransactionId() {
    let transactionId = 0;
    let storeDataObject = this.storeDataObject();
    if (storeDataObject != null && storeDataObject.transactionId) transactionId = storeDataObject.transactionId;
    return transactionId;
  }

  //get subscriber id
  public lsSubscriberId() {
    let subscriberId = 0;
    let storeDataObject = this.storeDataObject();
    if (storeDataObject != null && storeDataObject.subscriberId) subscriberId = storeDataObject.subscriberId;
    return subscriberId;
  }

  //get temp subscriber flag
  public lsTempSubscriberFlag() {
    let tempSubscriberFlag = 0;
    let storeDataObject = this.storeDataObject();
    if (storeDataObject != null && storeDataObject.tempSubscriberFlag) tempSubscriberFlag = storeDataObject.tempSubscriberFlag;
    return tempSubscriberFlag;
  }

  //get loggedIn username
  public lsLoggedInUserName() {
    let loggedInUserName = "";
    let storeDataObject = this.storeDataObject();
    if (storeDataObject != null && storeDataObject.loggedInUserName) loggedInUserName = storeDataObject.loggedInUserName;
    return loggedInUserName;
  }

  public isUserLoggedIn() {
    this.userProfileService.loggedIn = 0;
    let subscriberId = 0;
    subscriberId = this.lsSubscriberId();
    if (this.lsTempSubscriberFlag() == 0 && subscriberId > 0) {
      this.userProfileService.loggedIn = 1;
    }
  }
  // Localstorage isseus ends 

  fetchCancellationFeeApi(requestObject) {
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FETCH_CANCELLATION_FEE_API, requestObject)
      .pipe(map(data => data, error => error));
  }

  cancelTransactionApi(requestObject) {
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.CANCEL_TRANSACTION_API, requestObject)
      .pipe(map(data => data, error => error));
  }

  fetchDeliverySlotApi(requestObject) {
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FETCH_DELIVERY_SLOT_API, requestObject)
      .pipe(map(data => data, error => error));
  }

  applyDeliverySlotAPI(requestObject) {
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.APPLY_DELIVERY_SLOT_API, requestObject)
      .pipe(map(data => data, error => error));
  }

  cancelDeliverySlotAPI(requestObject) {
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.CANCEL_DELIVERY_SLOT_API, requestObject)
      .pipe(map(data => data, error => error));
  }

  public showAddToCartBasedOnProductDetailsObject(productDetailsObject) {
    let showAddToCart = true;
    this.transactionDetailsArray.forEach(transaction => {
      if (productDetailsObject.PRODUCT_DETAIL_ID == transaction.PRODUCT_DETAIL_ID) {
        showAddToCart = false;
      }
    });
    return showAddToCart;
  }

  public getSelectedQtyByProductDetailsObject(productDetailsObject) {
    let selectedQty = 1;
    this.transactionDetailsArray.forEach(transaction => {
      if (productDetailsObject.PRODUCT_DETAIL_ID == transaction.PRODUCT_DETAIL_ID) {
        selectedQty = transaction.PRODUCT_QUANTITY;
        //  element.PRODUCT_DETAIL[0].transactionDetailsId = transaction.TRANSACTION_DETAIL_ID;
      }
    });
    return selectedQty;
  }

  public showOutofStockBasedOnProductDetailsObject(productDetailsObject) {
    let showOutOfStock = false;
    if ( productDetailsObject.INVENTORY_POLICY == 2 && productDetailsObject.AVAILABLE_QUANTITY <= 0) showOutOfStock = true;
    return showOutOfStock;
  }

  // addon related 
  public showAddToCartForSingleProductPage(productObject, index) {
    let showAddToCart = true;
    this.transactionDetailsArray.forEach(transaction => {
      if (productObject.PRODUCT_DETAIL && productObject.PRODUCT_DETAIL[index] && productObject.PRODUCT_DETAIL[index].PRODUCT_DETAIL_ID == transaction.PRODUCT_DETAIL_ID) {
        showAddToCart = false;
      }
    });
    return showAddToCart;
  }

  public getSelectedQtyForSingleProductPage(productObject, index) {
    let selectedQty = 0;
    this.transactionDetailsArray.forEach(transaction => {
      if (productObject.PRODUCT_DETAIL && productObject.PRODUCT_DETAIL[index] && productObject.PRODUCT_DETAIL[index].PRODUCT_DETAIL_ID == transaction.PRODUCT_DETAIL_ID) {
        selectedQty += transaction.PRODUCT_QUANTITY;
      }
    });
    return selectedQty;
  }

  public placeOrderClicked = true;
  cancelDeliverySlot() {

    let requestObject = {
      STORE_ID                  :   this.configService.getStoreID(),
      SUBSCRIBER_ID             :   this.lsSubscriberId(),
      TRANSACTION_ID            :   this.lsTransactionId()
    };
    this.cancelDeliverySlotAPI(requestObject).subscribe(data => this.handleCancelDeliverySlot(data), error => error)
  }

  handleCancelDeliverySlot(data) {
    if (data.STATUS == "OK") {
      this.placeOrderClicked = false;
      this.transactionArray = data.TRANSACTION;
      this.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
    }
  }

  // new-checklist-soln-potlighar-6
  releaseQuantity(){
    if(this.checkoutApiCalledFlag) this.updateTransaction();
  }

  updateTransaction() {

    let requestObject = {
      SUBSCRIBER_ID    : this.lsSubscriberId(),
      STORE_ID         : this.configService.getStoreID(),
      TRANSACTION_ID   : this.lsTransactionId(),
    }

    this.checkoutApiCalledFlag = false;
    
    this.updateAvailableProductQuantity(requestObject).subscribe(data => data, error => error);

  }

}