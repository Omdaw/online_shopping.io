import { Injectable } from '@angular/core';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { ConfigService } from './config.service';
import { HomePageService } from './home-page.service';
import { TransactionsService } from './transactions.service';
import { FetchingproductsService } from './fetchingproducts.service';
import { CommonService } from './common.service';
import { SubscriberService } from './subscriber.service';
import { UserProfileService } from './user-profile.service';
import { BannerService } from './banner.service';

@Injectable({
  providedIn: 'root'
})
export class ProductBannerCartService {

  constructor(
    private configService               :  ConfigService,
    private commonService               :  CommonService,
    private subscriberService           :  SubscriberService,
    private userProfileService          :  UserProfileService,
    private homeService                 :  HomePageService,
    private transactionService          :  TransactionsService,
    private fetchingproductsService     :  FetchingproductsService,
    private bannerService               :  BannerService,
  ) { }

  //Add To Cart
  addToCartRequestObject = {};
  transactionDetailsId = 0;
  makeAddToCartRequestObject(productObject){
    let transactionId = 0;
    if(this.commonService.lsTransactionId()) { transactionId = + this.commonService.lsTransactionId(); }
    let productDetailObject = productObject.PRODUCT_DETAIL[0];
    let transactionDetails  = {
      TRANSACTION_DETAIL_ID        : this.transactionDetailsId,
      TRANSACTION_ID               : transactionId,
      PRODUCT_DETAIL_ID            : productDetailObject.PRODUCT_DETAIL_ID,
      PRODUCT_NAME                 : productObject.PRODUCT_NAME,
      PRODUCT_PRICE                : productDetailObject.PRODUCT_PRICE,
      PRODUCT_FINAL_PRICE          : productDetailObject.PRODUCT_FINAL_PRICE,
      PRODUCT_DISCOUNT_ID          : productDetailObject.PRODUCT_DISCOUNT_ID,
      PRODUCT_DISCOUNT_AMOUNT      : productDetailObject.PRODUCT_DISCOUNT_AMOUNT,
      PRODUCT_GST_PERCENTAGE       : productDetailObject.PRODUCT_GST_PERCENTAGE,
      PRODUCT_GST_AMOUNT           : productDetailObject.PRODUCT_GST_AMOUNT,
      PRODUCT_GST_ID               : productDetailObject.PRODUCT_GST_ID,
      PRODUCT_GST_STATUS           : productDetailObject.PRODUCT_GST_STATUS,
      PRODUCT_QUANTITY             : 1,
      PRODUCT_MULTI_FLAG           : productDetailObject.PRODUCT_MULTI_FLAG,
      STORE_ID                     : productDetailObject.STORE_ID,//this.configService.getStoreID(),
      TRANSACTION_DETAIL_TYPE_CODE : 1,
    }
    
    let addToCartObject = {
      SUBSCRIBER_ID       : + this.commonService.lsSubscriberId(),
      STORE_ID            : productDetailObject.STORE_ID,//this.configService.getStoreID(),
      TRANSACTION_ID      : transactionId,
      TRANSACTION_DETAIL  : transactionDetails
    }
    
    this.addToCartRequestObject = addToCartObject;
    
  }
  
  addToCart(productObject, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex){
    
    this.bannerService.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].progressBar = true;
    
    this.makeAddToCartRequestObject(productObject);
    this.subscriberService.addToCart(this.addToCartRequestObject)
    .subscribe(data => this.handleAddToCartResponse(data, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex), 
    error => error);
  }
  
  handleAddToCartResponse(data, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex){
    if(data.STATUS == "OK"){
      this.bannerService.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].showAddToCart = 0;
      
      this.putTransactionDetailsIdInProductDetailsArray
      (allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex, data.TRANSACTION[0].TRANSACTION_DETAIL);
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.checkOnlyTransactions();
                
      if(this.transactionService.transactionDetailsArray.length > 0){
        this.commonService.addTransactionIdTols();
      }
      
      this.bannerService.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].progressBar = false;
    }
  }
  
  putTransactionDetailsIdInProductDetailsArray(allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex, transactionArray){
    let productDetailsId =  this.bannerService.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].PRODUCT_DETAIL[0].PRODUCT_DETAIL_ID;
    transactionArray.forEach(element => {
      if(productDetailsId == element.PRODUCT_DETAIL_ID){
        this.bannerService.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].PRODUCT_DETAIL[0].transactionDetailsId = element.TRANSACTION_DETAIL_ID;
      }
    });
  }
  //Add To Cart Ends
  
  //Update Cart
  updateCartRequestObject = {};
  makeUpdateCartRequestObject(productObject, selectedQty){

    let transactionDetailsId = 0;

    if(productObject.PRODUCT_DETAIL[0].transactionDetailsId != undefined && productObject.PRODUCT_DETAIL[0].transactionDetailsId > 0) {
      transactionDetailsId = productObject.PRODUCT_DETAIL[0].transactionDetailsId;
    }

    if(transactionDetailsId == 0) {
      this.transactionService.transactionDetailsArray.forEach(element => {
          if(element.PRODUCT_DETAIL_ID == productObject.PRODUCT_DETAIL[0].PRODUCT_DETAIL_ID) {
            transactionDetailsId = element.TRANSACTION_DETAIL_ID;
          }
      });
    }

    let transactionDetails  = {
      TRANSACTION_DETAIL_ID        : transactionDetailsId,
      PRODUCT_QUANTITY             : selectedQty
    }
    
    let addToCartObject = {
      SUBSCRIBER_ID       : +this.commonService.lsSubscriberId(),
      STORE_ID            : this.configService.getStoreID(),
      TRANSACTION_ID      : this.commonService.lsTransactionId(),
      TRANSACTION_DETAIL  : transactionDetails
    }
    
    this.updateCartRequestObject = addToCartObject;
    
  }
  
  updateCart(productObject, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex, selectedQty, method){
    this.bannerService.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].progressBar = true;
    if(method == 1) {
      selectedQty = selectedQty + 1;
    }else{
      selectedQty = selectedQty -1;
    }
    
    if(selectedQty == 0) 
    {
      this.deleteCart(productObject.PRODUCT_DETAIL[0].transactionDetailsId, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex);
    }else{
      this.makeUpdateCartRequestObject(productObject, selectedQty)
      this.subscriberService.updateCart(this.updateCartRequestObject).subscribe(
        data => this.handleUpdateCartResponse(data, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex, selectedQty), error => error)
    }
  }
  
  handleUpdateCartResponse(data, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex, selectedQty){
    if(data.STATUS == "OK"){
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.bannerService.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].selectedQuantity = selectedQty;
      
      this.checkOnlyTransactions();
    }
    this.bannerService.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].progressBar = false;
  }
  //Update Cart Ends
  
  //Delete Cart 
  deleteCartRequestObject = {};
  makeDeleteCartRequestObject(transactionDetailId){
    
    let transactionDetails  = {
      TRANSACTION_DETAIL_ID        : transactionDetailId,
    }
    
    let addToCartObject = {
      SUBSCRIBER_ID       : this.commonService.lsSubscriberId(),
      STORE_ID            : this.configService.getStoreID(),
      TRANSACTION_ID      : this.commonService.lsTransactionId(),
      TRANSACTION_DETAIL  : transactionDetails
    }
    
    this.deleteCartRequestObject = addToCartObject;
    
  }
  
  deleteCart(transactionDetailId, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex){
    this.bannerService.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].progressBar = true;
    this.makeDeleteCartRequestObject(transactionDetailId)
    
    this.subscriberService.removeFromCart(this.deleteCartRequestObject)
    .subscribe(data => this.handleDeleteCartResponse(data, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex), error => error)
  }
  
  handleDeleteCartResponse(data, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex){
    if(data.STATUS == "OK"){
      this.bannerService.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].showAddToCart       = 1;  
      this.bannerService.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].selectedQuantity    = 1;
      this.bannerService.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].transactionDetailId = 0;
      
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      
      this.checkOnlyTransactions();
    }
    this.bannerService.allBannersArray[allBannersIndex].PRODUCTS_MORE_THAN_ONE_IN_ROW[productBannerArrayIndex].PRODUCT[productsArrayIndex][productArrayIndex].progressBar = false;
  }
  //Delete Cart Ends

  checkOnlyTransactions(){ //This will return only Products 
    let localTransactionArray = [];
    if(this.transactionService.transactionDetailsArray && this.transactionService.transactionDetailsArray.length > 0){
      this.transactionService.transactionDetailsArray.forEach(element => {
        if(element.TRANSACTION_DETAIL_TYPE_CODE == 1){ //Because we are  also getting Delivery Charge and Convenience fee
          localTransactionArray.push(element);
        }
      });
    }
    this.transactionService.transactionDetailsArray = [];
    this.transactionService.transactionDetailsArray = localTransactionArray;
    this.refreshCart();
  }

  refreshCart(){
    this.userProfileService.numberOfProductsInCart = this.transactionService.transactionDetailsArray.length;
  }
}
