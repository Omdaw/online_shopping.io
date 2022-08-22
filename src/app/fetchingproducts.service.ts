import { Injectable } from '@angular/core';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { SearchService } from './search.service';
import { TransactionsService } from './transactions.service';
import { Router } from '@angular/router';
import { SubscriberService } from './subscriber.service';
import { UserProfileService } from './user-profile.service';
import { ProductService } from './product.service';
import { BannerproductsService } from './bannerproducts.service';
import { ProductsMidLayerService } from './products-mid-layer.service';
import { ConfigService } from './config.service';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class FetchingproductsService {
  
  constructor(private configService : ConfigService,
    protected productMidLayerService        : ProductsMidLayerService,
    private   searchService                 : SearchService,
    public    transactionService            : TransactionsService,
    private   subscriberService             : SubscriberService,
    private   userProfileService            : UserProfileService,
    private productService                  : ProductService,
    private bannerProductsService           : BannerproductsService,
    public commonService         : CommonService
    ) { }
    
    callFromPageCode = 0; 
    
    // fetch cart in progress 
    fetchCartInProgressRequestObject = {};
    makeFetchCartInProgressObject(){
      let tempObj = {
        SUBSCRIBER_ID       : this.commonService.lsSubscriberId(),
        STORE_ID            : this.configService.getStoreID(),
      }
      
      this.fetchCartInProgressRequestObject = tempObj;
    }
    
    fetchCartInProgress(){
      this.productMidLayerService.processBar = true;
      this.productMidLayerService.productsArray.length = 0;
      this.makeFetchCartInProgressObject()
      
      this.subscriberService.fetchCartInProgressTransactionsBySubscriberIdAPI(this.fetchCartInProgressRequestObject)
      .subscribe(data => this.handleFetchCartInProgressResponse(data), error => this.handleError(error))
    }
    
    handleFetchCartInProgressResponse(data){
      if(data.STATUS == "OK"){
        
        this.transactionService.transactionDetailsArray = [];
        if(data.TRANSACTION && data.TRANSACTION.length > 0){
          data.TRANSACTION[0].TRANSACTION_DETAIL.forEach(element => {
            if(element.TRANSACTION_DETAIL_TYPE_CODE == 1){ //Because we are  also getting Delivery Charge and Convenience fee
              this.transactionService.transactionDetailsArray.push(element);
            }
          });
          this.checkOnlyTransactions();
        }
        
        if(this.transactionService.transactionDetailsArray.length > 0){
          this.commonService.addTransactionIdTols();
        }
        console.log("callFromPageCode", this.callFromPageCode);
        if(this.callFromPageCode == ApplicationConstants.CALL_FROM_SEARCH_PAGE)   this.searchProductByInputIdAPI();
        if(this.callFromPageCode == ApplicationConstants.CALL_FROM_BANNER_PAGE)   this.fetchProductByBannerIdAPI();
        if(this.callFromPageCode == ApplicationConstants.CALL_FROM_CATEGORY_PAGE) this.fetchProductsByCategoryId();
        if(this.callFromPageCode == ApplicationConstants.CALL_FROM_BRAND_PAGE)    this.fetchProductsByBrandId(); //BrandProductsNewLogic
        if(this.callFromPageCode == ApplicationConstants.CALL_FROM_MOBILE_FILTER) {
          this.productMidLayerService.fetchFilteredProducts();
          this.callFromPageCode = 2;
        }
        
      }
    }
    
    // fetch cart in progress ends
    
    refreshCart(){
      this.userProfileService.numberOfProductsInCart = this.transactionService.transactionDetailsArray.length;
    }
    
    public checkOnlyTransactions(){ //This will return only Products 
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
    
    
    
    // Searched Products Page 
    
    // Search Logic Start 
    searchProductRequestObject = {};
    
    searchKey = "";
    
    makeSearchProductRequestObject(){
      this.searchProductRequestObject = {
        SUBSCRIBER_ID         : + this.commonService.lsSubscriberId(),
        PRODUCT_SEARCH_TEXT   : this.searchKey,
        STORE_ID              : this.configService.getStoreID(),
        LIMIT                 : this.productLimit,
        OFFSET                : this.productOffset   
      }
    }
    
    searchProductByInputIdAPI(){
      this.productMidLayerService.showNoProductsImage = false;
      this,this.makeSearchProductRequestObject();
      this.searchService.searchProductByInputIdAPI(this.searchProductRequestObject).subscribe(data => this.handleSearchProductSuccess(data), error => this.handleError(error));
    }
    
    handleSearchProductSuccess(pData){
      if(pData.STATUS == "OK"){
        
        
        if(pData.PRODUCT.length == 0 && this.productMidLayerService.productsArray.length == 0) {
          this.productMidLayerService.showNoProductsImage = true;
        } else {
          
          
          if(this.productMidLayerService.productsArray.length > 0 && this.callFromScroll) {
            
            this.productMidLayerService.productsArray = this.productMidLayerService.productsArray.concat(pData.PRODUCT); //Array Concatination // this function is called on scroll 
            this.callFromScroll = 0;
            
          }else{
            
            this.productMidLayerService.productsArray.length = 0; // This is for making array empty'
            this.productMidLayerService.productsArray = pData.PRODUCT; // this function is called  On Category Click 
          }
          
          for(let i=0; i<this.productMidLayerService.productsArray.length; i++){
            let productObject = this.productMidLayerService.productsArray[i];
            
            this.productMidLayerService.productsArray[i].showAddToCart     = 1;
            this.productMidLayerService.productsArray[i].selectedQuantity  = 1;
            this.productMidLayerService.productsArray[i].showOutOfStock    = 0;
            
            this.productMidLayerService.addingToCart.push(false);
            
            let productDetailsObject = productObject.PRODUCT_DETAIL[0];
            let inStock = true;
            // if(productDetailsObject.INVENTORY_POLICY != null && productDetailsObject.INVENTORY_POLICY != '' && productDetailsObject.INVENTORY_POLICY != 'null') {
            // if(productDetailsObject.TRACK_INVENTORY ){
            if( productDetailsObject.AVAILABLE_QUANTITY == 0) {
              inStock = false;
              this.productMidLayerService.productsArray[i].showOutOfStock      = 1;
              this.productMidLayerService.productsArray[i].showAddToCart       = 0;
              
            }
            // }
            // }
            
            this.checkProductExistsInTransaction(i);
          }
          
        }  
        
        this.productMidLayerService.processBar = false;
      }
    }
    // Search Logic End 
    
    // Searched Products Page  ends
    
    checkProductExistsInTransaction(index){
      this.transactionService.transactionDetailsArray.forEach(element => {
        if( this.productMidLayerService.productsArray[index].PRODUCT_DETAIL[0] && this.productMidLayerService.productsArray[index].PRODUCT_DETAIL[0].PRODUCT_DETAIL_ID == element.PRODUCT_DETAIL_ID){
          
          this.productMidLayerService.productsArray[index].showAddToCart = 0;
          this.productMidLayerService.productsArray[index].selectedQuantity = element.PRODUCT_QUANTITY;
          this.productMidLayerService.productsArray[index].PRODUCT_DETAIL[0].transactionDetailsId = element.TRANSACTION_DETAIL_ID;
        }
      });
    }
    
    handleError(error){
      
    }
    
    // Category Products Page 
    productOffset             =   ApplicationConstants.DEFAULT_OFFSET;
    productLimit              =   ApplicationConstants.DEFAULT_LIMIT;
    fetchProductsByCategoryIdRequestObject =   {};
    productCategoryId         =   0;
    
    // makefetchProductCategoryAndProductObject(){
    //   if(this.callFromScroll) {
    //     this.productOffset = this.productOffset + this.productLimit;
    //   }else{
    //     this.productOffset  = ApplicationConstants.DEFAULT_OFFSET;
    //   }    
    
    //   this.fetchProductRequestObject = {
    //     STORE_ID                 : this.configService.getStoreID(),
    //     SUBSCRIBER_ID            : this.commonService.lsSubscriberId(),
    //     PRODUCT_CATEGORY_ID      : this.productCategoryId,
    //     LIMIT                    : this.productLimit,
    //     OFFSET                   : this.productOffset
    //   }
    // }
    
    // public fetchProductCategoryAndProduct(){
    //   this.productMidLayerService.processBar = true;
    //   this.productMidLayerService.showNoProductsImage = false;
    //   this.makefetchProductCategoryAndProductObject();
    //   this.productService.fetchProductCategoryAndProduct(this.fetchProductRequestObject).subscribe(data => this.handleFetchProductCategoryAndProductSuccess(data), error => this.handleError(error));
    // }
    
    // handleFetchProductCategoryAndProductSuccess(pData){
    
    //     if(pData.STATUS ='OK'){
    
    //       if(pData.PRODUCT.length == 0 && this.productMidLayerService.productsArray.length == 0) {
    //         this.productMidLayerService.showNoProductsImage = true;
    //       } else {
    
    
    //         if(this.productMidLayerService.productsArray.length > 0 && this.callFromScroll) {
    
    //           this.productMidLayerService.productsArray = this.productMidLayerService.productsArray.concat(pData.PRODUCT); //Array Concatination // this function is called on scroll 
    //           this.callFromScroll = 0;
    
    //         }else{
    
    //           this.productMidLayerService.productsArray.length = 0; // This is for making array empty'
    //           this.productMidLayerService.productsArray = pData.PRODUCT; // this function is called  On Category Click 
    //         }
    
    //         for(let i=0; i<this.productMidLayerService.productsArray.length; i++){
    //           let productObject = this.productMidLayerService.productsArray[i];
    
    //           this.productMidLayerService.productsArray[i].showAddToCart     = 1;
    //           this.productMidLayerService.productsArray[i].selectedQuantity  = 1;
    //           this.productMidLayerService.productsArray[i].showOutOfStock    = 0;
    
    //           this.productMidLayerService.addingToCart.push(false);
    
    //           let productDetailsObject = productObject.PRODUCT_DETAIL[0];
    //           let inStock = true;
    //           // if(productDetailsObject.INVENTORY_POLICY != null && productDetailsObject.INVENTORY_POLICY != '' && productDetailsObject.INVENTORY_POLICY != 'null') {
    //             // if(productDetailsObject.TRACK_INVENTORY ){
    //             if( productDetailsObject.AVAILABLE_QUANTITY == 0) {
    //               inStock = false;
    //               this.productMidLayerService.productsArray[i].showOutOfStock      = 1;
    //               this.productMidLayerService.productsArray[i].showAddToCart       = 0;
    
    //             }
    //           // }
    //           // }
    
    //           this.checkProductExistsInTransaction(i);
    //         }
    
    
    //         if(this.productMidLayerService.productsArray.length > 0) {
    //           this.productMidLayerService.productCategory  = this.productMidLayerService.productsArray[0].PRODUCT_CATEGORY_NAME; 
    //         }
    
    //         this.productMidLayerService.productsArray = this.productMidLayerService.productsArray;
    //       }  
    
    //       this.productMidLayerService.processBar = false;
    //     }
    // } 
    
    // Category Products Page ends 
    
    
    // Fetch Products By Category 
    makefetchProductsByCategoryId(){
      if(this.callFromScroll) {
        this.productOffset = this.productOffset + this.productLimit;
      }else{
        this.productOffset  = ApplicationConstants.DEFAULT_OFFSET;
      }    
      
      this.fetchProductsByCategoryIdRequestObject = {
        STORE_ID                 : this.configService.getStoreID(),
        SUBSCRIBER_ID            : this.commonService.lsSubscriberId(),
        PRODUCT_CATEGORY_ID      : this.productCategoryId,
        LIMIT                    : this.productLimit,
        OFFSET                   : this.productOffset
      }
    }
    
    public fetchProductsByCategoryId(){
      this.productMidLayerService.processBar = true;
      this.productMidLayerService.showNoProductsImage = false;
      this.makefetchProductsByCategoryId();
      this.productService.fetchProductsByCategoryId(this.fetchProductsByCategoryIdRequestObject).subscribe(data => this.handleFetchProductsByCategoryIdSuccess(data), error => this.handleError(error));
    }
    
    handleFetchProductsByCategoryIdSuccess(pData){
      
      if(pData.STATUS ='OK'){
        
        if( pData.PRODUCT.length == 0 && this.productMidLayerService.productsArray.length == 0) {
          this.productMidLayerService.showNoProductsImage = true;
        } else {
          
          
          if(this.productMidLayerService.productsArray.length > 0 && this.callFromScroll) {
            
            this.productMidLayerService.productsArray = this.productMidLayerService.productsArray.concat(pData.PRODUCT); //Array Concatination // this function is called on scroll 
            this.callFromScroll = 0;
            
          }else{
            
            this.productMidLayerService.productsArray.length = 0; // This is for making array empty'
            this.productMidLayerService.productsArray = pData.PRODUCT; // this function is called  On Category Click 
          }
          
          for(let i=0; i<this.productMidLayerService.productsArray.length; i++){
            
            let productObject = this.productMidLayerService.productsArray[i];
            
            if(productObject.PRODUCT_DETAIL&&productObject.PRODUCT_DETAIL[0]){
              
              this.productMidLayerService.productsArray[i].showAddToCart     = 1;
              this.productMidLayerService.productsArray[i].selectedQuantity  = 1;
              this.productMidLayerService.productsArray[i].showOutOfStock    = 0;
              
              this.productMidLayerService.addingToCart.push(false);
              
              let productDetailsObject = productObject.PRODUCT_DETAIL[0];
              let inStock = true;
              // if(productDetailsObject.INVENTORY_POLICY != null && productDetailsObject.INVENTORY_POLICY != '' && productDetailsObject.INVENTORY_POLICY != 'null') {
              // if(productDetailsObject.TRACK_INVENTORY ){
              if( productDetailsObject.AVAILABLE_QUANTITY == 0) {
                inStock = false;
                this.productMidLayerService.productsArray[i].showOutOfStock      = 1;
                this.productMidLayerService.productsArray[i].showAddToCart       = 0;
                
              }
              // }
              // }
              
              this.checkProductExistsInTransaction(i);
            }
          }
          
          this.productMidLayerService.productsArray = this.productMidLayerService.productsArray;
        }  
        
        this.productMidLayerService.processBar = false;
      }
    }
    // Fetch Products By Category ends 
    
    //BrandProductsNewLogic From here 
    // Fetch Products By Brand 
    fetchProductsByBrandIdRequestObject : any;
    productBrandId = 0;
    makefetchProductsByBrandId(){
      
      if(this.callFromScroll) {
        this.productOffset = this.productOffset + this.productLimit;
      }else{
        this.productOffset  = ApplicationConstants.DEFAULT_OFFSET;
      }    
      
      this.fetchProductsByBrandIdRequestObject = {
        STORE_ID                 : ApplicationConstants.STORE_ID,
        SUBSCRIBER_ID            : this.commonService.lsSubscriberId(),
        BRAND_ID                 : this.productBrandId,
        LIMIT                    : this.productLimit,
        OFFSET                   : this.productOffset
      }
    }
    
    public fetchProductsByBrandId(){
      this.productMidLayerService.processBar = true;
      this.productMidLayerService.showNoProductsImage = false;
      this.makefetchProductsByBrandId();
      this.productService.fetchProductsByBrandId(this.fetchProductsByBrandIdRequestObject)
      .subscribe(data => this.handleFetchProductsByBrandIdSuccess(data), error => this.handleError(error));
    }
    
    handleFetchProductsByBrandIdSuccess(pData){
      
      if(pData.STATUS ='OK'){
        
        if( pData.PRODUCT.length == 0 && this.productMidLayerService.productsArray.length == 0) {
          this.productMidLayerService.showNoProductsImage = true;
        } else {
          
          
          if(this.productMidLayerService.productsArray.length > 0 && this.callFromScroll) {
            
            this.productMidLayerService.productsArray = this.productMidLayerService.productsArray.concat(pData.PRODUCT); //Array Concatination // this function is called on scroll 
            this.callFromScroll = 0;
            
          }else{
            
            this.productMidLayerService.productsArray.length = 0; // This is for making array empty'
            this.productMidLayerService.productsArray = pData.PRODUCT; // this function is called  On Category Click 
          }
          
          for(let i=0; i<this.productMidLayerService.productsArray.length; i++){
            
            let productObject = this.productMidLayerService.productsArray[i];
            
            if(productObject.PRODUCT_DETAIL&&productObject.PRODUCT_DETAIL[0]){
              
              this.productMidLayerService.productsArray[i].showAddToCart     = 1;
              this.productMidLayerService.productsArray[i].selectedQuantity  = 1;
              this.productMidLayerService.productsArray[i].showOutOfStock    = 0;
              
              this.productMidLayerService.addingToCart.push(false);
              
              let productDetailsObject = productObject.PRODUCT_DETAIL[0];
              let inStock = true;
              
              if( productDetailsObject.AVAILABLE_QUANTITY == 0) {
                inStock = false;
                this.productMidLayerService.productsArray[i].showOutOfStock      = 1;
                this.productMidLayerService.productsArray[i].showAddToCart       = 0;
                
              }
              
              
              for(let j=0; j<this.productMidLayerService.productsArray[i].PRODUCT_DETAIL.length; j++){
                this.productMidLayerService.productsArray[i].PRODUCT_DETAIL[j].PRODUCT_IMAGE_INDEX = 0;
              }
              
              this.checkProductExistsInTransaction(i);
            }
          }
          
          this.productMidLayerService.productsArray = this.productMidLayerService.productsArray;
        }  
        
        this.productMidLayerService.processBar = false;
      }
    }
    // Fetch Products By Brand ends 
    //BrandProductsNewLogic till here
    
    //Banner Products Page 
    //Fetch Products By Banners
    bannerId = 0;
    fetchProductByBannerIdAPI(){
      this.productMidLayerService.showNoProductsImage = false;
      let requestObject = {
        SUBSCRIBER_ID       : this.commonService.lsSubscriberId(),
        STORE_ID            : this.configService.getStoreID(),
        LIMIT               : this.productLimit,
        OFFSET              : this.productOffset,
        BANNER_ID           : this.bannerId
      }
      
      this.bannerProductsService.fetchProductByBannerIdAPI(requestObject)
      .subscribe(data => this.handleFetchProductByBannerIdAPISuccess(data), error => this.handleError(error));
    }
    callFromScroll = 0;
    handleFetchProductByBannerIdAPISuccess(pData){
      console.log("pData.PRODUCT", pData.PRODUCT);
      if((pData.PRODUCT == undefined || (pData.PRODUCT && pData.PRODUCT.length == 0)) && this.productMidLayerService.productsArray.length == 0) {
        this.productMidLayerService.showNoProductsImage = true;
        this.productMidLayerService.processBar = false;
      } else {
        
        
        if(this.productMidLayerService.productsArray.length > 0 && this.callFromScroll) {
          
          this.productMidLayerService.productsArray = this.productMidLayerService.productsArray.concat(pData.PRODUCT); //Array Concatination // this function is called on scroll 
          this.callFromScroll = 0;
          
        }else{
          
          this.productMidLayerService.productsArray.length = 0; // This is for making array empty'
          this.productMidLayerService.productsArray = pData.PRODUCT; // this function is called  On Category Click 
        }
        
        for(let i=0; i<this.productMidLayerService.productsArray.length; i++){
          let productObject = this.productMidLayerService.productsArray[i];
          
          this.productMidLayerService.productsArray[i].showAddToCart     = 1;
          this.productMidLayerService.productsArray[i].selectedQuantity  = 1;
          this.productMidLayerService.productsArray[i].showOutOfStock    = 0;
          
          this.productMidLayerService.addingToCart.push(false);
          
          let productDetailsObject = productObject.PRODUCT_DETAIL[0];
          let inStock = true;
          // if(productDetailsObject.INVENTORY_POLICY != null && productDetailsObject.INVENTORY_POLICY != '' && productDetailsObject.INVENTORY_POLICY != 'null') {
          // if(productDetailsObject.TRACK_INVENTORY ){
          if( productDetailsObject.AVAILABLE_QUANTITY == 0) {
            inStock = false;
            this.productMidLayerService.productsArray[i].showOutOfStock      = 1;
            this.productMidLayerService.productsArray[i].showAddToCart       = 0;
            
          }
          // }
          // }
          
          this.checkProductExistsInTransaction(i);
        }
        
        if(this.productMidLayerService.productsArray.length > 0) {
        }
        
        this.productMidLayerService.processBar = false;
      }  
      
    }
    //Fetch Products By Banners ends 
    //Banner Products Page ends 
    
    
    fetchProductsOnScroll(){
      if(this.callFromPageCode == ApplicationConstants.CALL_FROM_SEARCH_PAGE)   this.searchProductByInputIdAPI();
      if(this.callFromPageCode == ApplicationConstants.CALL_FROM_BANNER_PAGE)   this.fetchProductByBannerIdAPI();
      if(this.callFromPageCode == ApplicationConstants.CALL_FROM_CATEGORY_PAGE) this.fetchProductsByCategoryId();    
      if(this.callFromPageCode == ApplicationConstants.CALL_FROM_MOBILE_FILTER) {
        this.productMidLayerService.fetchFilteredProducts();
        this.callFromPageCode = 0;
      }
    }
  }
  