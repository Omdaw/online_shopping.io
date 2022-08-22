import { ConfigService } from './../config.service';
import { Component, OnInit } from '@angular/core';
import { FlagsService } from '../flags.service';
import { MyWishlistService } from '../my-wishlist.service';
import { ProductsMidLayerService } from '../products-mid-layer.service';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { SubscriberService } from '../subscriber.service';
import { TransactionsService } from '../transactions.service';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  
  constructor(
    private flagsService            :     FlagsService,
    public myWishlistService        :     MyWishlistService,
    public productMidLayerService   :     ProductsMidLayerService,
    public subscriberService        :     SubscriberService,
    public transactionService       :     TransactionsService,
    public configService            :     ConfigService,
    public commonService         : CommonService
    ) { }
    
    ngOnInit() {
      // this.flagsService.hideHeaderFooter();
      this.flagsService.showSearch();
      this.flagsService.showHeaderFooter();
      this.myWishlistService.fetchMyWishList();
    }
    
    getProductImageName(object){
      let imageName = "";
      if(object.PRODUCT_DETAIL && object.PRODUCT_DETAIL.PRODUCT_IMAGE[0] && object.PRODUCT_DETAIL.PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH != 'undefined') imageName = object.PRODUCT_DETAIL.PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH;
      return imageName;
    }
    
    
    moveToCart(productDetailsObject){
      this.addToCart(productDetailsObject);
      this.myWishlistService.deleteMyWishlist(productDetailsObject);
    }
    
    //Add To Cart
    addToCartRequestObject = {};
    makeAddToCartRequestObject(productDetailObject){
      let transactionId = 0;
      if(this.commonService.lsTransactionId()) { transactionId = + this.commonService.lsTransactionId(); }
      
      let transactionDetails  = {
        TRANSACTION_DETAIL_ID        : 0,  // while adding to cart transaction details id will be zero 
        TRANSACTION_ID               : transactionId,
        PRODUCT_DETAIL_ID            : productDetailObject.PRODUCT_DETAIL_ID,
        PRODUCT_NAME                 : productDetailObject.PRODUCT_NAME,
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
        // STORE_ID                     : +localStorage.getItem('storeId'),
        STORE_ID            : this.configService.getStoreID(), //<!-- Final Checklist-->
        TRANSACTION_DETAIL_TYPE_CODE : 1,
      }
      
      let addToCartObject = {
        SUBSCRIBER_ID       : + this.commonService.lsSubscriberId(),
        // STORE_ID            : +localStorage.getItem('storeId'),
        STORE_ID            : this.configService.getStoreID(), //<!-- Final Checklist-->
        TRANSACTION_ID      : transactionId,
        TRANSACTION_DETAIL  : transactionDetails
      }
      
      this.addToCartRequestObject = addToCartObject;
      
    }
    
    public addToCart(productObject){
      // this.processBar                = true;
      
      
      this.makeAddToCartRequestObject(productObject);
      this.subscriberService.addToCart(this.addToCartRequestObject).subscribe(data => this.handleAddToCartResponse(data), error => error);
    }
    
    handleAddToCartResponse(data){
      if(data.STATUS == "OK"){
        
        if(data.TRANSACTION[0].TRANSACTION_DETAIL[0].TRANSACTION_ID > 0){
          this.commonService.addTransactionIdTols();
        }
        
        this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
        this.transactionService.transactionArray = data.TRANSACTION;
        this.productMidLayerService.checkOnlyTransactions();
        
      }
    }
    //Add To Cart Ends
    
    showOutOfStock(productDetailsObject){
      let showOutOfStock = false;
      if(productDetailsObject.INVENTORY_POLICY == 2 && productDetailsObject.AVAILABLE_QUANTITY <= 0) showOutOfStock = true;
      return showOutOfStock;
    }
  }
  