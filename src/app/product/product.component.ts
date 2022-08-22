import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { SubscriberService } from '../subscriber.service';
import { UserProfileService } from '../user-profile.service';
import { TransactionsService } from '../transactions.service';
import { FiltersService } from '../filters.service';
import { ProductsMidLayerService } from '../products-mid-layer.service';
import { FetchingproductsService } from '../fetchingproducts.service';
import { ConfigService } from '../config.service';
import { CommonService } from '../common.service';
import { BannerService } from '../banner.service';
import { HeaderService } from '../header.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(private configService : ConfigService, 
    private route                         : ActivatedRoute, 
    private subscriberService             : SubscriberService,
    private userProfileService            : UserProfileService,
    public transactionService             : TransactionsService,
    private filterService                 : FiltersService,
    private productMidLayerService        : ProductsMidLayerService,
    private fetchProductsService          : FetchingproductsService,
    public commonService                  : CommonService,
    public bannerService                  : BannerService,
    public headerService                  : HeaderService

) { }

    //variables
    transactionId                     = 0;
    transactionDetailsId              = 0;
    subscriberDetailsObject           = {SUBSCRIBER_ID: 0};
    fetchCartInProgressRequestObject  = {};
    productCategoryId                 = 0;

    errorImageLink = ApplicationConstants.COMING_SOON_IMAGE_LINK;

  ngOnInit() {

    window.scroll(0, 0);
    if(this.fetchProductsService.callFromPageCode != ApplicationConstants.CALL_FROM_MOBILE_FILTER) {
      this.fetchProductsService.callFromPageCode = ApplicationConstants.CALL_FROM_CATEGORY_PAGE;
      this.productMidLayerService.clearFilterInputs();
    }
    

    this.route.params.subscribe(params => {
      this.bannerService.emptyBannerList();
      window.scroll(0, 0);
      if(params['id'] != undefined){

        if(this.fetchProductsService.callFromPageCode != ApplicationConstants.CALL_FROM_MOBILE_FILTER) {
          this.productMidLayerService.clearFilterInputs();
        }

        this.productCategoryId                                = +params['id']
        this.productMidLayerService.productCategoryId         = +params['id'];
        this.fetchProductsService.productCategoryId           = +params['id'];

        localStorage.setItem("productCategoryIdForFilters", params['id']);// this is for filters mobile view
        
        this.checkSubscriberId();
        this.fetchProductCategoryNameForHeadingName();
      }
      this.fetchProductsService.productOffset                 =   ApplicationConstants.DEFAULT_OFFSET;
      this.fetchProductsService.productLimit                  =   ApplicationConstants.DEFAULT_LIMIT;
      this.fetchProductsService,this.callFromScroll           =   0;
      this.productMidLayerService.productsArray.length        =   0;
    });
  }

  fetchProductCategoryNameForHeadingName(){
    let reqObj = {
      PRODUCT_CATEGORY_ID : this.productCategoryId
    };
    this.headerService.fetchProductCategoryByIdAPI(reqObj)
    .subscribe(data => this.handleFetchProductCategoryNameForHeadingName(data), error => this.handleError(error));
  }

  handleFetchProductCategoryNameForHeadingName(data){
      if(data.PRODUCT_CATEGORY && data.PRODUCT_CATEGORY.length > 0 && data.PRODUCT_CATEGORY[0].PRODUCT_CATEGORY_NAME){
        this.productMidLayerService.productCategory = data.PRODUCT_CATEGORY[0].PRODUCT_CATEGORY_NAME;
      } 
  }

  GetProductCategoryIdByParam(){
    this.route.params.subscribe(params => {
      if(params['id'] != undefined){
        this.productMidLayerService.productCategoryId     = +params['id'];
        localStorage.setItem("productCategoryIdForFilters", params['id']);// this is for filters mobile view
      }
    });
  }

  

  checkProductExistsInTransaction(index){

    console.log(this.transactionService.transactionDetailsArray);

    this.transactionService.transactionDetailsArray.forEach(element => {
      if( this.productMidLayerService.productsArray[index].PRODUCT_DETAIL[0] && this.productMidLayerService.productsArray[index].PRODUCT_DETAIL[0].PRODUCT_DETAIL_ID == element.PRODUCT_DETAIL_ID){

        this.productMidLayerService.productsArray[index].showOutOfStock  = 0;
        this.productMidLayerService.productsArray[index].showAddToCart   = 0;
        this.productMidLayerService.productsArray[index].selectedQuantity = element.PRODUCT_QUANTITY;
        this.productMidLayerService.productsArray[index].PRODUCT_DETAIL[0].transactionDetailsId = element.TRANSACTION_DETAIL_ID;
      }
    });
  }
  
  handleError(error){

  }

  checkSubscriberId(){
    let subscribeId = 0;
    if(this.commonService.lsSubscriberId()) subscribeId     = + this.commonService.lsSubscriberId();

    if(subscribeId == 0){
      this.temporarySubscriberLogin();
    }else{
      this.loadDefaultMethods();
    }
  }

  loadDefaultMethods(){
    this.GetProductCategoryIdByParam();
    this.fetchFiltersByCategoryId();

    //Banner changes 
    this.bannerService.bannerCallFromPageCode = ApplicationConstants.BANNER_CALL_FROM_CATEGORY_PAGE;
    // this.bannerService.FetchHeroBannerByStoreId(ApplicationConstants.BANNER_VISIBILITY_TYPE_CODE_CATEGORY_PAGE, this.productCategoryId);
    console.log("productCategoryId", this.productCategoryId);
    this.bannerService.calledOnScroll = false;
    this.bannerService.FetchBannerByStoreId(ApplicationConstants.BANNER_VISIBILITY_TYPE_CODE_CATEGORY_PAGE, this.productCategoryId);
    
    this.fetchProductsService.fetchCartInProgress();


    // this.checkFiltersFromMobileFilter();
  }

  // checkFiltersFromMobileFilter(){
  //   console.log("checkFiltersFromMobileFilter");
  //   if(this.userProfileService.filterSelectedCategoryArray.length       > 0 )  this.productMidLayerService.filterSelectedCategoryArray  = this.userProfileService.filterSelectedCategoryArray;
  //   if(this.userProfileService.filterSelectedBrandArray.length          > 0 )  this.productMidLayerService.filterSelectedBrandArray     = this.userProfileService.filterSelectedBrandArray;
  //   if(this.userProfileService.filterSelectedDiscountObject.DISCOUNT_TO > 0 )  this.productMidLayerService.filterSelectedDiscountObject = this.userProfileService.filterSelectedDiscountObject;

  //   if(this.productMidLayerService.filterSelectedCategoryArray.length > 0 || 
  //     this.productMidLayerService.filterSelectedBrandArray.length > 0 || 
  //     this.productMidLayerService.filterSelectedDiscountObject.DISCOUNT_TO > 0){

  //     this.productMidLayerService.fetchFilteredProducts();
  //     // this.userProfileService.filterSelectedCategoryArray        = [];
  //     // this.userProfileService.filterSelectedBrandArray           = [];
  //     // this.userProfileService.filterSelectedDiscountObject       = {DISCOUNT_TO : 0, DISCOUNT_TYPE: ""};
  //   } else {
  //     // this.productMidLayerService.fetchpro();
  //   }
  // }

  temporarySubscriberLogin(){
    this.subscriberService.tempSubscriberLogin().subscribe(data => this.handleTemporarySubscriberLoginSuccess(data), error => this.handleError(error));
  }

  handleTemporarySubscriberLoginSuccess(data){
    if(data.STATUS == "OK"){

      let authToken             = data.SUBSCRIBER.AUTHENTICATION_TOKEN;
      let subscriberId          = data.SUBSCRIBER.SUBSCRIBER_ID;
      let tempSubscriberFlag    = 1;
      let transactionId         = 0;
      this.commonService.addStoreData(authToken, subscriberId, tempSubscriberFlag, transactionId);
      
      this.loadDefaultMethods();
    }
  }

  /** Scroll Logic for Paging  Starts here */
  
  windowScrollPosition        = 25000;
  windowScrollSize            = 25000;
  callFromScroll              = 0;
  
  // onScroll(event){
    
  //   if(event.timeStamp > this.windowScrollPosition){

  //     let productsAvailable = 1;
  //     let tempOffset = this.productOffset;
  //     if(tempOffset == 0) tempOffset = this.productLimit;
  //     console.log("this.productMidLayerService.productsArray.length");
  //     console.log(this.productMidLayerService.productsArray.length);
  //     console.log(tempOffset);
  //     if(this.productMidLayerService.productsArray.length == tempOffset  ){
  //         this.windowScrollPosition = this.windowScrollPosition + this.windowScrollSize;
  //         this.productOffset = this.productLimit;
  //         this.productLimit = this.productLimit + ApplicationConstants.DEFAULT_LIMIT;

  //         this.callFromScroll = 1;

  //         if(this.isFilterSelected()) {
  //           this.fetchFilteredProducts()
  //         }else{
  //           this.fetchProductCategoryAndProduct();
  //         }
  //     }
  //   }
  // }

  isFilterSelected() { // this is to notify that atleast one of the filter is selected 
    let filterSelectionFlag = 0
    //  if(this.filterSelectedCategoryArray.length           > 0   ||   
    //     this.filterSelectedBrandArray.length              > 0   ||      
    //     this.filterSelectedDiscountObject.DISCOUNT_TO     > 0   ||           
    //     this.filterSelectedPriceObject.TO_PRICE           != 0  ||     
    //     this.filterSelectedAttributesArray.length         > 0   || 
    //     this.filterSelectedSortByObject.VALUE             != ""){
    //       filterSelectionFlag = 1;
    //   }
      return filterSelectionFlag;
  }
  
  /** Scroll Logic for Paging Ends here */

  // public handleScroll(event: ScrollEvent) {

  //   if (event.isReachingBottom) {
  //     console.log(`the user is reaching the bottom`);

  //     this.callFromScroll = 1;

  //     if(this.isFilterSelected()) {
  //       this.fetchFilteredProducts()
  //     }else{
  //       this.fetchProductCategoryAndProduct();
  //     }

  //   }
  // }

  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  // onScrollDown (ev) {
  //   console.log('scrolled down!!', ev);
  //   this.callFromScroll = 1;

  //     let tempOffset = this.productOffset;
  //     if(tempOffset == 0) tempOffset = this.productLimit;
  //     if(this.productMidLayerService.productsArray.length == tempOffset  ){
  //       if(this.isFilterSelected()) {
  //         this.fetchFilteredProducts()
  //       }else{
  //         this.fetchProductCategoryAndProduct();
  //       }
  //     }
  // }

  /** Fetch Filters */
  fetchFiltersApiRequestObject = {};
  makeFetchFiltersByCategoryIdRequestObject(){
    this.fetchFiltersApiRequestObject =  {
      FILTER_SEARCH_KEY             :   ApplicationConstants.CATEGORY_FILTER_SEARCH_KEY,
      STORE_ID                      :   this.configService.getStoreID(),
      FILTER_REQUEST_FROM_TYPE_CODE :   ApplicationConstants.CATEGORY_FILTER_REQUEST_FROM_TYPE_CODE, 
      CATEGORY_ID                   :   this.productCategoryId 
    };
  }

  fetchFiltersByCategoryId(){
    // this.processBar = true;
    this.makeFetchFiltersByCategoryIdRequestObject();
    this.filterService.fetchFiltersAPI(this.fetchFiltersApiRequestObject).subscribe(data => this.handleFetchFiltersbyCategoryIdResponse(data), 
                                                                                    error=>this.handleError(error));
  }

  
  hideAllAttributeFilters(){
    this.productMidLayerService.attributeFiltersArray.forEach(element => {
      this.productMidLayerService.showAttributeFilter.push(0);
    });
  }
  
  handleFetchFiltersbyCategoryIdResponse(data){
    this.productMidLayerService.filtersObject = data;
    this.productMidLayerService.filterDiscountArray = data.DISCOUNT;
    
    this.productMidLayerService.attributeFiltersArray = data.FILTER;
    this.hideAllAttributeFilters();
    // this.processBar = false;
  }
  /** Fetch Filters ends */
  
}
