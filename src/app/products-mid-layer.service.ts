import { Injectable } from '@angular/core';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { SubscriberService } from './subscriber.service';
import { TransactionsService } from './transactions.service';
import { UserProfileService } from './user-profile.service';
import { FiltersService } from './filters.service';
import { ConfigService } from './config.service';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsMidLayerService {

  public processBar       = false;
  public productCategory  = "";
  productsArray           = [];
  addingToCart            = [];
  showNoProductsImage     = false;
  selectedProductIndex    = 0;
  productCategoryId       = 0;
  productBrandId          = 0;//BrandProductsNewLogic
  callFromScroll          = 0;
  productOffset           = ApplicationConstants.DEFAULT_OFFSET;
  productLimit            = ApplicationConstants.DEFAULT_LIMIT;
  callFromFilter          = false;

  public getProductImageName(object){
    let imageName = "";
    if(object.PRODUCT_DETAIL[0] && object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0] && object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH != 'undefined') imageName = object.PRODUCT_DETAIL[0].PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH;
    return imageName;
  }
  
  constructor(private configService : ConfigService,
              private subscriberService    : SubscriberService,
              private transactionService   : TransactionsService,
              private userProfileService   : UserProfileService,
              private filterService        : FiltersService,
              public commonService         : CommonService
            ) { }

  //Add To Cart
  addToCartRequestObject = {};
  makeAddToCartRequestObject(productObject){
    let transactionId = 0;
    if(this.transactionService.transactionArray.length > 0 && this.transactionService.transactionArray[0].TRANSACTION_ID) { transactionId =  this.transactionService.transactionArray[0].TRANSACTION_ID; }
    let productDetailObject = productObject.PRODUCT_DETAIL[0];
    let transactionDetails  = {
      TRANSACTION_DETAIL_ID        : 0,  // while adding to cart transaction details id will be zero 
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

  public addToCart(productObject, index){
    // this.processBar                = true;

    this.addingToCart[index] = true;
    this.selectedProductIndex = index;
    this.makeAddToCartRequestObject(productObject);
    this.subscriberService.addToCart(this.addToCartRequestObject).subscribe(data => this.handleAddToCartResponse(data, index), error => this.handleError(error));
  }
  
  handleAddToCartResponse(data, index){
    if(data.STATUS == "OK"){
      this.productsArray[this.selectedProductIndex].showAddToCart = 0;

      this.setPorductDetailId(index, data.TRANSACTION[0].TRANSACTION_DETAIL);
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.checkOnlyTransactions();

      if(data.TRANSACTION[0].TRANSACTION_DETAIL[0].TRANSACTION_ID > 0){
        this.commonService.addTransactionIdTols();
      }

      this.addingToCart[index] = false;
    }
  }

  setPorductDetailId(index, transactionArray){
    let productDetailsId = this.productsArray[index].PRODUCT_DETAIL[0].PRODUCT_DETAIL_ID;
    transactionArray.forEach(element => {
      if(productDetailsId == element.PRODUCT_DETAIL_ID){
        this.productsArray[index].PRODUCT_DETAIL[0].transactionDetailsId = element.TRANSACTION_DETAIL_ID;
      }
    });
  }
//Add To Cart Ends

//Update Cart
updateCartRequestObject = {};
  makeUpdateCartRequestObject(productObject, index, selectedQty){
    let transactionDetails  = {
      TRANSACTION_DETAIL_ID        : productObject.PRODUCT_DETAIL[0].transactionDetailsId,
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

  updateCart(productObject, index, selectedQty, method, callFromSearch = 0){
    this.addingToCart[index] = true;
    // this.processBar                = true;
    if(method == 1) {
      selectedQty = selectedQty + 1;
    }else{
      selectedQty = selectedQty -1;
    }

    if(selectedQty == 0) 
    {
      this.deleteCart(productObject.PRODUCT_DETAIL[0].transactionDetailsId, index, callFromSearch);
    }else{
      this.makeUpdateCartRequestObject(productObject, index, selectedQty)
      this.subscriberService.updateCart(this.updateCartRequestObject).subscribe(data => this.handleUpdateCartResponse(data, index, selectedQty), error => this.handleError(error))
    }
  }

  handleUpdateCartResponse(data, index, selectedQty){
    if(data.STATUS == "OK"){
      console.log(data);
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.productsArray[index].selectedQuantity = selectedQty;

      this.checkOnlyTransactions();
    }
    this.addingToCart[index] = false;
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

  deleteCart(transactionDetailId, index, callFromSearch){
    this.addingToCart[index] = true;
    this.makeDeleteCartRequestObject(transactionDetailId)

    this.subscriberService.removeFromCart(this.deleteCartRequestObject).subscribe(data => this.handleDeleteCartResponse(data, index, callFromSearch), error => this.handleError(error))
  }

  handleDeleteCartResponse(data, index, callFromSearch){
    if(data.STATUS == "OK"){
      if(callFromSearch == 0){
        this.productsArray[index].showAddToCart       = 1;  
        this.productsArray[index].selectedQuantity    = 1;
        this.productsArray[index].transactionDetailId = 0;
      }
      
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.checkOnlyTransactions();
    }
    this.addingToCart[index] = false;
  }
//Delete Cart Ends

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

  /** Fetch Filters */

  public filtersObject                = {
    FILTER        : [], //This is Attribute filters
    PRICE         : {},
    DISCOUNT      : {},
    BRAND         : {},
    CATEGORY      : {},
    SORT_BY       : [],

  }; 
  public filterDiscountArray = [];
  public attributeFiltersArray = [];
  public showAttributeFilter = [];
  

  /** Fetch Filters ends */

   // On Filters Selection (means on check)
   filterAttributeNamesArray = [];
   filterAttributeValuesArray = [];
   onFilterSelectionChangeAttributes(event, attributeObject){

    this.callFromFilter = true;   
     
    //  let isSelected = event.target.checked;
 
    //  let index = this.checkNameExists(attributeObject.TABLE_COLUMN_NAME);
     
    //  if(isSelected){
       
    //    if( index > -1){
    //      let tempAttributeValuesArray = this.filterAttributeValuesArray[index];
    //      tempAttributeValuesArray.push(attributeObject.FILTER_ATTRIBUTE_VALUE);
    //      this.filterAttributeValuesArray[index] = tempAttributeValuesArray;
    //    }else{
    //      let tempArray = [];
    //      tempArray.push(attributeObject.FILTER_ATTRIBUTE_VALUE);
    //      this.filterAttributeNamesArray.push(attributeObject.TABLE_COLUMN_NAME);
    //      this.filterAttributeValuesArray.push(tempArray);
    //    }
 
    //  }else{
    //    if( index > -1){ 
    //      let tempAttributeValuesArray = this.filterAttributeValuesArray[index];
    //      let indexOfAttributeValue = tempAttributeValuesArray.indexOf(attributeObject.FILTER_ATTRIBUTE_VALUE);
    //      tempAttributeValuesArray.splice(indexOfAttributeValue, 1);
    //      this.filterAttributeValuesArray[index] = tempAttributeValuesArray;
 
    //      if(tempAttributeValuesArray.length == 0) {
    //        this.filterAttributeNamesArray.splice(index, 1);
    //        this.filterAttributeValuesArray.splice(index, 1);
    //      }
    //    }
    //  }

    this.clearAttributeFilters();
    let tempArray = [];
    tempArray.push(attributeObject.FILTER_ATTRIBUTE_VALUE);
    this.filterAttributeNamesArray.push(attributeObject.TABLE_COLUMN_NAME);
    this.filterAttributeValuesArray.push(tempArray);
 
     this.fetchFilteredProducts();
 
   }

   clearAttributeFilters(){
    this.filterAttributeNamesArray  = [];
    this.filterAttributeValuesArray = [];
   }
 
   checkNameExists(attributeName){
 
     let index = -1;
     index = this.filterAttributeNamesArray.indexOf(attributeName);
     return index;
   }
   
   // On Filters Selection (means on check) ends 

   /** Filters Logic Starts here */
   fetchFilteredProductsRequestObject  = {};
   filteredProductsArray               = []; 
   filterSelectedCategoryArray         = []; //Selected caterories in filter
   filterSelectedBrandArray            = []; //Selected brands in filter
   filterSelectedDiscountObject        = {DISCOUNT_TO : 0, DISCOUNT_TYPE: ""}; //Selected discounts in filter
   filterSelectedPriceObject           = {FROM_PRICE: 0, TO_PRICE: 0}; //Selected price range in filter
   filterSelectedAttributesArray       = []; //Selected attributes in filter
   filterSelectedSortByObject          = {VALUE: "", ORDER: ""}; //Selected sort by in filter

 
   //Category
   onFilterSelectionChangeCategory(event, productCategoryId){

      this.callFromFilter = true;   
 
      this.clearAttributeFilters();

     let isSelected = event.target.checked;
 
     if(isSelected){
       this.filterSelectedCategoryArray.push(productCategoryId);
     }else{
       let index = this.filterSelectedCategoryArray.indexOf(productCategoryId);
       this.filterSelectedCategoryArray.splice(index, 1);
     }
 
     this.fetchFilteredProducts();
   }
 
   //Brand
   onFilterSelectionChangeBrand(event, productBrandId){

    this.callFromFilter = true;   

    this.clearAttributeFilters();
 
     let isSelected = event.target.checked;
 
     if(isSelected){
       this.filterSelectedBrandArray.push(productBrandId);
     }else{
       let index = this.filterSelectedBrandArray.indexOf(productBrandId);
       this.filterSelectedBrandArray.splice(index, 1);
     }
     this.fetchFilteredProducts();
   }
 
   //Discount
   onFilterSelectionChangeDiscount(event, dicountObject){

    this.callFromFilter = true;   
    
    this.clearAttributeFilters();
     this.filterDiscountArray = [];
     this.filterSelectedDiscountObject = dicountObject;
     this.fetchFilteredProducts();
   }
 
   //Sort By
   onFilterSelectionChangeSortBy(sortBy, sortByOrder){
     this.filterSelectedSortByObject = {
       VALUE : sortByOrder,
       ORDER : sortBy
     }
     this.fetchFilteredProducts(1);
   }
   /** Filters Logic Ends here */



  //Hide and Show kind of stuff
  public showSortBy = 0;

  public showSortByDiv(){
    this.showSortBy = 1;
  }

  public hideSortByDiv(){
    this.showSortBy = 0;
  }

  //Category
  public showCategory = 0;
  public showCategoryFiltersDiv(){
    this.showCategory = 1;
  }
  public hideCategoryFiltersDiv(){
    this.showCategory = 0;
  }

  //Brands
  public showBrands = 0;
  public showBrandFiltersDiv(){
    this.showBrands = 1;
  }
  public hideBrandFiltersDiv(){
    this.showBrands = 0;
  }

  //Discount
  public showDiscounts = 0;
  public showDiscountFiltersDiv(){
    this.showDiscounts = 1;
  }
  public hideDiscountFiltersDiv(){
    this.showDiscounts = 0;
  }

  handleError(error){

  }

  filterCallFrom            = ApplicationConstants.FILTER_CALL_FROM_CATEGORY;
  filterProductCategoryId   = 0;
  filterBannerId            = 0;
  filterSearchText          = "";




  //Filtered Products 
  makeFetchFilteredProductsRequestObject(){
    
    if(this.callFromScroll) {
      this.productOffset = this.productOffset + this.productLimit;
    }else{
      this.productOffset  = ApplicationConstants.DEFAULT_OFFSET;
    }

    // if(this.filterCallFrom == ApplicationConstants.FILTER_CALL_FROM_CATEGORY) this.filterProductCategoryId    = this.productCategoryId;
    // if(this.filterCallFrom == ApplicationConstants.FILTER_CALL_FROM_BANNER)   this.filterBannerId             = this.FetchingproductsService.bannerId;;
    // if(this.filterCallFrom == ApplicationConstants.FILTER_CALL_FROM_SEARCH)   this.filterSearchText           = this.FetchingproductsService.searchKey;

    this.fetchFilteredProductsRequestObject = {
        STORE_ID                    : this.configService.getStoreID(),
        ATTRIBUTE_NAMES             : this.filterAttributeNamesArray,
        ATTRIBUTE_VALUES            : this.filterAttributeValuesArray,
        CATEGORY                    : this.filterSelectedCategoryArray, 
        BRAND                       : this.filterSelectedBrandArray,
        DISCOUNT                    : this.filterSelectedDiscountObject,
        PRICE                       : this.filterSelectedPriceObject,
        SORT_BY                     : this.filterSelectedSortByObject,
        LIMIT                       : this.productLimit,
        OFFSET                      : this.productOffset,
        FILTER_CALL_FROM_CODE       : this.filterCallFrom,  
        PRODUCT_CATEGORY_ID         : this.productCategoryId,  
        PRODUCT_BANNER_ID           : this.filterBannerId,  
        PRODUCT_SEARCH_TEXT         : this.filterSearchText,  
    }
  }

  checkAtleastOneFilterIsSelected(){
    let filterSelected = 0;
    if( 
        this.filterAttributeNamesArray.length         > 0 || 
        this.filterSelectedCategoryArray.length       > 0 ||
        this.filterSelectedBrandArray.length          > 0 ||
        this.filterSelectedDiscountObject.DISCOUNT_TO > 0 ||
        this.filterSelectedPriceObject.TO_PRICE       > 0 
      ){
        filterSelected = 1;
      }

      return filterSelected;
  }

  // GetProductCategoryIdByParam(){
  //   this.route.params.subscribe(params => {
  //     if(params['id'] != undefined){
  //       this.filterProductCategoryId = params['id'];
  //     }
  //   });
  // }

  fetchFilteredProducts(sortByCall = 0){
    this.processBar = true;

    // if(sortByCall == 0){
    //   if(this.checkAtleastOneFilterIsSelected() ){
    //     this.makeFetchFilteredProductsRequestObject();
    //     this.filterService.fetchFilteredProductsAPI(this.fetchFilteredProductsRequestObject).subscribe(data => this.handleFetchFilteredProductsResponse(data), error=>this.handleError(error));
    //   }
    // }else{
        this.makeFetchFilteredProductsRequestObject();
        this.filterService.fetchFilteredProductsAPI(this.fetchFilteredProductsRequestObject).subscribe(data => this.handleFetchFilteredProductsResponse(data), error=>this.handleError(error));
    // }
  }

  handleFetchFilteredProductsResponse(pData){

      if(this.callFromScroll){
        this.productsArray = this.productsArray.concat(pData.PRODUCT);
        this.callFromScroll = 0;
      }else{
        this.productsArray.length = 0;
        this.productsArray = pData.PRODUCT;
      }
      
      for(let i=0; i<this.productsArray.length; i++){
        let productObject =  this.productsArray[i];
        this.productsArray[i].showAddToCart = 1;  
        this.productsArray[i].selectedQuantity = 1;

        this.productsArray[i].showOutOfStock    = 0;

        let productDetailsObject = productObject.PRODUCT_DETAIL[0];
        let inStock = true;
        // if(productDetailsObject.INVENTORY_POLICY != null && productDetailsObject.INVENTORY_POLICY != '' && productDetailsObject.INVENTORY_POLICY != 'null') {
          // if(productDetailsObject.TRACK_INVENTORY ){
          if( productDetailsObject.AVAILABLE_QUANTITY == 0) {
            inStock = false;
            this.productsArray[i].showOutOfStock      = 1;
            this.productsArray[i].showAddToCart       = 0;
          }
        // }
        // }

        this.checkProductExistsInTransaction(i);
      }

    this.processBar = false;
  }

  checkProductExistsInTransaction(index){
    this.transactionService.transactionDetailsArray.forEach(element => {
      if( this.productsArray[index].PRODUCT_DETAIL[0] && this.productsArray[index].PRODUCT_DETAIL[0].PRODUCT_DETAIL_ID == element.PRODUCT_DETAIL_ID){

        this.productsArray[index].showOutOfStock  = 0;
        this.productsArray[index].showAddToCart   = 0;
        this.productsArray[index].selectedQuantity = element.PRODUCT_QUANTITY;
        this.productsArray[index].PRODUCT_DETAIL[0].transactionDetailsId = element.TRANSACTION_DETAIL_ID;
      }
    });
  }
  //Filtered Products ends 

  public getProductPrice(productDetailsObject){
    let price = 0;
    if(productDetailsObject && productDetailsObject.PRODUCT_FINAL_PRICE) price = productDetailsObject.PRODUCT_FINAL_PRICE;
    return price.toFixed(2);
  }

  // public getScratchPrice(productDetailsObject){
  //   let scratchPrice = 0;
  //   if(productDetailsObject.PRODUCT_DISCOUNT_ID > 0) {
  //     scratchPrice = productDetailsObject.SELLING_PRICE;
  //   }else{
  //     scratchPrice = productDetailsObject.COMPARE_AT_PRICE;
  //   }
  //   return scratchPrice;
  // }

  // public dicountPercentage(productDetailsObject){
    
  //   let discountPercentage = 0;
  //   if(productDetailsObject.COMPARE_AT_PRICE){
  //     discountPercentage = ((productDetailsObject.PRODUCT_FINAL_PRICE/productDetailsObject.COMPARE_AT_PRICE)*100);
  //   }
  //   return discountPercentage.toFixed(0);
  // }

  getScratchPrice(productDetailsObject)
  {
    let scratchPrice = 0;

    if(productDetailsObject.PRODUCT_DISCOUNT_ID > 0){
      scratchPrice = productDetailsObject.PRODUCT_PRICE;
    }else{
      scratchPrice = productDetailsObject.COMPARE_AT_PRICE;
    }

    return scratchPrice.toFixed(0);
  }


  getDicountPercentage(productDetailsObject)
  {
    let discountPercentage = "";

    if(productDetailsObject.PRODUCT_DISCOUNT_ID > 0){
      if(productDetailsObject.PRODUCT_DISCOUNT_TYPE == ApplicationConstants.DISCOUNT_TYPE_FLAT){
        discountPercentage = "FLAT "+this.commonService.STORE_CURRENCY_SYMBOL + productDetailsObject.PRODUCT_DISCOUNT.toFixed(0)+" OFF";
      }else{
        //Percentage discount details
        discountPercentage = productDetailsObject.PRODUCT_DISCOUNT.toFixed(0)+"% OFF";
      }

      
    }else{
      discountPercentage = productDetailsObject.COMPARE_AT_PRICE_WITH_PERCENTAGE.toFixed(0)+"% OFF";
    }

    return discountPercentage;
  }

  public clearFilterInputs(){
    this.filterAttributeNamesArray       = [];
    this.filterAttributeValuesArray      = [];
    this.filterSelectedCategoryArray     = [];
    this.filterSelectedBrandArray        = [];
    this.filterSelectedDiscountObject    =  {DISCOUNT_TO : 0, DISCOUNT_TYPE: ""};
    this.filterSelectedPriceObject       = {FROM_PRICE: 0, TO_PRICE: 0}; 
    this.filterSelectedSortByObject      = {VALUE: "", ORDER: ""};     
    this.productLimit                    = 49;
    this.productOffset                   = 0;
    this.productCategoryId               = 0;
    this.filterBannerId                  = 0;
    this.filterSearchText                = "";
  }
  public clearDiscountFilter(){
    this.filterSelectedDiscountObject = {DISCOUNT_TO : 0, DISCOUNT_TYPE: ""};
     this.fetchFilteredProducts(1);
  }

  unratedStars(ratedStars){
    let tempArray = []
    let unratedStars = 5 - ratedStars;
    for(let i= 0; i < unratedStars; i++){
      tempArray.push(i);
    }
    return tempArray;
  }

  ratedStars(ratedStars){
    let tempArray = []
    for(let i= 0; i < ratedStars; i++){
      tempArray.push(i);
    }
    return tempArray;
  }

  getRatingMessage(ratedStars){
    let message = "not yet rated";
    if(ratedStars > 0) message = "Rated "+ratedStars+".00 out of 5";
    return message;
  }

  showScratchPrice(productDetailsObject)
  {
    let flag = false;
    let scratchPrice = 0;
    
    if(productDetailsObject.PRODUCT_DISCOUNT_ID > 0){
      scratchPrice = productDetailsObject.PRODUCT_PRICE;
    }else{
      scratchPrice = productDetailsObject.COMPARE_AT_PRICE;
    }
    
    if(scratchPrice > 0) flag = true;
    return flag;
  }
}
