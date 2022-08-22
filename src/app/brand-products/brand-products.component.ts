import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { SubscriberService } from '../subscriber.service';
import { TransactionsService } from '../transactions.service';
import { FiltersService } from '../filters.service';
import { ProductsMidLayerService } from '../products-mid-layer.service';
import { FetchingproductsService } from '../fetchingproducts.service';
import { CommonService } from '../common.service';
import { BannerService } from '../banner.service';

@Component({
  selector: 'app-brand-products',
  templateUrl: './brand-products.component.html',
  styleUrls: ['./brand-products.component.css']
})
export class BrandProductsComponent implements OnInit {
  
  constructor(
    private route                         : ActivatedRoute, 
    private subscriberService             : SubscriberService,
    public transactionService             : TransactionsService,
    private filterService                 : FiltersService,
    private productMidLayerService        : ProductsMidLayerService,
    private fetchProductsService          : FetchingproductsService,
    public commonService                  : CommonService,
    public bannerService                  : BannerService,
    ) { }
    
    ngOnInit() {
      this.bannerService.headerBanners.length     = 0;
      this.bannerService.allBannersArray.length   = 0;
      this.bannerService.displayBanner            = false;
      this.productMidLayerService.filterCallFrom = ApplicationConstants.FILTER_CALL_FROM_BRAND;//new
      
      window.scrollTo(0, 0);
      if (this.fetchProductsService.callFromPageCode != ApplicationConstants.CALL_FROM_MOBILE_FILTER) {
        this.fetchProductsService.callFromPageCode = ApplicationConstants.CALL_FROM_BRAND_PAGE;
        this.productMidLayerService.clearFilterInputs();
      }
  
      this.checkSubscriberId();
      this.route.params.subscribe(params => {
        window.scroll(0, 0);
        if (params['id'] != undefined) {
  
          if (this.fetchProductsService.callFromPageCode != ApplicationConstants.CALL_FROM_MOBILE_FILTER) {
            this.productMidLayerService.clearFilterInputs();
          }
  
          this.fetchProductsService.productBrandId                  = +params['id'];
          this.productMidLayerService.productBrandId                = +params['id'];
        }
        this.fetchProductsService.productOffset   = ApplicationConstants.DEFAULT_OFFSET;
        this.fetchProductsService.productLimit    = ApplicationConstants.DEFAULT_LIMIT;
        // this.fetchProductsService, this.callFromScroll = 0;

        this.productMidLayerService.productCategory = "";
  
        this.productMidLayerService.productsArray.length = 0;
  
        this.loadDefaultMethods();
      });
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
    
    loadDefaultMethods(){
      this.getProductBrandIdByParam();
      this.fetchFiltersByBrandId();
      this.fetchProductsService.fetchCartInProgress();
    }
    
    getProductBrandIdByParam(){
      this.route.params.subscribe(params => {
        if(params['id'] != undefined){
          this.fetchProductsService.productBrandId = +params['id'];
          this.productMidLayerService.productBrandId                = +params['id'];
          // this.userProfileService.productCategoryIdForFilters = +params['id'];// this is for filters mobile view
        }
      });
    }
    
    handleError(error){
      
    }
    
    /** Fetch Filters */
    fetchFiltersApiRequestObject = {};
    makeFetchFiltersByBrandIdRequestObject(){
      this.fetchFiltersApiRequestObject =  {
        FILTER_SEARCH_KEY             :   ApplicationConstants.BRAND_FILTER_SEARCH_KEY,
        STORE_ID                      :   ApplicationConstants.STORE_ID,
        FILTER_REQUEST_FROM_TYPE_CODE :   ApplicationConstants.BRAND_FILTER_REQUEST_FROM_TYPE_CODE, 
        BRAND_ID                      :   this.fetchProductsService.productBrandId //this we are getting from url parameter
      };
    }
    
    fetchFiltersByBrandId(){
      this.makeFetchFiltersByBrandIdRequestObject();
      this.filterService.fetchFiltersAPI(this.fetchFiltersApiRequestObject).subscribe(data => this.handleFetchFiltersbyCategoryIdResponse(data), 
      error=>this.handleError(error));
    }
    
    handleFetchFiltersbyCategoryIdResponse(data){
      this.productMidLayerService.filtersObject = data;
      this.productMidLayerService.filterDiscountArray = data.DISCOUNT;
      
      this.productMidLayerService.attributeFiltersArray = data.FILTER;
      this.hideAllAttributeFilters();
    }
    
    hideAllAttributeFilters(){
      this.productMidLayerService.attributeFiltersArray.forEach(element => {
        this.productMidLayerService.showAttributeFilter.push(0);
      });
    }
    /** Fetch Filters ends */
    
  }
  