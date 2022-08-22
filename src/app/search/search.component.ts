import { Component, OnInit } from '@angular/core';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { SubscriberService } from '../subscriber.service';
import { TransactionsService } from '../transactions.service';
import { FiltersService } from '../filters.service';
import { ProductsMidLayerService } from '../products-mid-layer.service';
import { FetchingproductsService } from '../fetchingproducts.service';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../search.service';
import { ConfigService } from '../config.service';
import { CommonService } from '../common.service';
import { BannerService } from '../banner.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private configService : ConfigService, 
    private route                         : ActivatedRoute, 
    private subscriberService             : SubscriberService,
    public transactionService             : TransactionsService,
    private filterService                 : FiltersService,
    protected productMidLayerService      : ProductsMidLayerService,
    private fetchProductsService          : FetchingproductsService,
    private SearchService                 : SearchService,
    public commonService                  : CommonService,
    public bannerService                  : BannerService,
) { }
  //variables
  fetchProductRequestObject = {};
  productsArray             = []
  productCategoryId         = 0;
  transactionId             = 0;
  transactionDetailsId      = 0;
  productDetailId           = 0;
  productName               = "";
  subscriberDetailsObject   = {SUBSCRIBER_ID: 0};
  productCategory           = "";
  
  addToCartRequestObject    = {};
  updateCartRequestObject   = {};
  deleteCartRequestObject   = {};
  selectedProductIndex      = 0;
  fetchCartInProgressRequestObject = {};

  ngOnInit() {
    this.bannerService.headerBanners.length     = 0;
    this.bannerService.allBannersArray.length   = 0;
    this.bannerService.displayBanner            = false;
    this.productMidLayerService.clearFilterInputs();
    this.productMidLayerService.filterCallFrom = ApplicationConstants.FILTER_CALL_FROM_SEARCH;
    this.SearchService.displaySearch = false;
    
    this.fetchProductsService.callFromPageCode = ApplicationConstants.CALL_FROM_SEARCH_PAGE;

    this.productMidLayerService.processBar                = true;
    this.checkSubscriberId();

    this.productMidLayerService.productsArray.length = 0;

    this.route.params.subscribe(params => {
      if(params['key'] != undefined){
        this.productMidLayerService.clearFilterInputs();
        this.fetchProductsService.searchKey = params['key'];
        this.productMidLayerService.filterSearchText = params['key'];
        window.scroll(0, 0);

        this.fetchProductsService.productOffset                 =   ApplicationConstants.DEFAULT_OFFSET;
        this.fetchProductsService.productLimit                  =   ApplicationConstants.DEFAULT_LIMIT;
        
        this.SearchService.displaySearch = false;

        this.productMidLayerService.productCategory = "";
        
        this.productMidLayerService.productsArray.length  = 0;
        this.productMidLayerService.processBar            = true;
        this.loadDefaultMethods();
      }
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
      this.subscriberDetailsObject = data.SUBSCRIBER;
      this.loadDefaultMethods();
    }
  }

  loadDefaultMethods(){
    this.fetchSearchKeyByParam();
    this.fetchFiltersBySearchKey();
    this.fetchProductsService.fetchCartInProgress(); 
  }

  searchKey = "";
  fetchSearchKeyByParam(){
    this.route.params.subscribe(params => {
      if(params['key'] != undefined){
        this.searchKey = params['key'];
      }
    });
  }

  /* Fetch Filters By Search Key */
  fetchFiltersBySearchKeyApiRequestObject = {};
 

  makeFetchFiltersBySearchKeyRequestObject(){
    this.fetchFiltersBySearchKeyApiRequestObject = {
      FILTER_SEARCH_KEY               : ApplicationConstants.SEARCH_KEY_FILTER_SEARCH_KEY,
      STORE_ID                        : this.configService.getStoreID(),
      FILTER_REQUEST_FROM_TYPE_CODE   :   ApplicationConstants.SEARCH_KEY_FILTER_REQUEST_FROM_TYPE_CODE, 
      SEARCH_KEY                      : this.searchKey
    }
  }

  fetchFiltersBySearchKey(){
    this.makeFetchFiltersBySearchKeyRequestObject();
    this.filterService.fetchFiltersAPI(this.fetchFiltersBySearchKeyApiRequestObject)
    .subscribe(data => this.handleFetchFiltersbySearchKeyResponse(data), error=>this.handleError(error));
  }

  filterDiscountArray = [];
  handleFetchFiltersbySearchKeyResponse(data){
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
  /* Fetch Filters By Search key ends */

  handleError(error){

  }
  
}
