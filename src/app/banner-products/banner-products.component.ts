import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { SubscriberService } from '../subscriber.service';
import { TransactionsService } from '../transactions.service';
import { FiltersService } from '../filters.service';
import { ProductsMidLayerService } from '../products-mid-layer.service';
import { FetchingproductsService } from '../fetchingproducts.service';
import { ConfigService } from '../config.service';
import { CommonService } from '../common.service';
import { BannerService } from '../banner.service';

@Component({
  selector: 'app-banner-products',
  templateUrl: './banner-products.component.html',
  styleUrls: ['./banner-products.component.css']
})
export class BannerProductsComponent implements OnInit {
  constructor(private configService : ConfigService, 
    private route                         : ActivatedRoute, 
    private subscriberService             : SubscriberService,
    public transactionService             : TransactionsService,
    private filterService                 : FiltersService,
    private productsMidLayerService       : ProductsMidLayerService,
    private FetchingproductsService       : FetchingproductsService,
    private commonService                 : CommonService,
    private bannerService                 : BannerService
) { }
  //variables
  processBar                = true;
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

  bannerId = 0;
  ngOnInit() {
    this.bannerService.headerBanners.length     = 0;
    this.bannerService.allBannersArray.length   = 0;
    this.bannerService.displayBanner            = false;
    this.productsMidLayerService.clearFilterInputs();
    this.productsMidLayerService.filterCallFrom = ApplicationConstants.FILTER_CALL_FROM_BANNER;
    this.FetchingproductsService.callFromPageCode = ApplicationConstants.CALL_FROM_BANNER_PAGE;

    this.productsMidLayerService.productCategory = "";
    
    this.checkSubscriberId();  
  }

  GetBannerIdByParam(){
    this.route.params.subscribe(params => {
      if(params['id'] != undefined){
        this.productsMidLayerService.clearFilterInputs();
        this.FetchingproductsService.bannerId = +params['id'];
        this.bannerId = +params['id'];
        this.productsMidLayerService.filterBannerId = +params['id'];

        this.FetchingproductsService.productOffset                 =   ApplicationConstants.DEFAULT_OFFSET;
        this.FetchingproductsService.productLimit                  =   ApplicationConstants.DEFAULT_LIMIT;
      }
    });
  }

  

  handleError(error){

  }

	checkSubscriberId(){
    if( this.commonService.lsSubscriberId() == 0){
      this.temporarySubscriberLogin();
    }else{
      this.loadDefaultMethods();
    }
    }
  

  loadDefaultMethods(){
    this.GetBannerIdByParam();
    this.fetchFiltersByBannerId();
    this.FetchingproductsService.fetchCartInProgress();
  }

  temporarySubscriberLogin(){
  this.subscriberService.tempSubscriberLogin().subscribe(data => this.handleTemporarySubscriberLoginSuccess(data), error => this.handleError(error));
  }

  handleTemporarySubscriberLoginSuccess(data){
    if(data.STATUS == "OK"){
      this.commonService.addSubscriberIdTols(data.SUBSCRIBER.SUBSCRIBER_ID);
      this.loadDefaultMethods();
    }
  }

    /** Fetch Filters */
    fetchFiltersApiRequestObject = {};
    makeFetchFiltersByBannerIdRequestObject(){
      this.fetchFiltersApiRequestObject =  {
        FILTER_SEARCH_KEY             :   ApplicationConstants.CATEGORY_FILTER_SEARCH_KEY,
        STORE_ID                      :   this.configService.getStoreID(),
        FILTER_REQUEST_FROM_TYPE_CODE :   ApplicationConstants.BANNER_FILTER_REQUEST_FROM_TYPE_CODE, 
        BANNER_ID                     :   this.bannerId
      };
    }
  
    fetchFiltersByBannerId(){
      this.makeFetchFiltersByBannerIdRequestObject();
      this.filterService.fetchFiltersAPI(this.fetchFiltersApiRequestObject).subscribe(data => this.handleFetchFiltersbyBannerIdResponse(data), 
                                                                                      error=>this.handleError(error));
    }
  

    hideAllAttributeFilters(){
      this.productsMidLayerService.attributeFiltersArray.forEach(element => {
        this.productsMidLayerService.showAttributeFilter.push(0);
      });
    }
    handleFetchFiltersbyBannerIdResponse(data){
      this.productsMidLayerService.filtersObject = data;
      this.productsMidLayerService.filterDiscountArray = data.DISCOUNT;
      
      this.productsMidLayerService.attributeFiltersArray = data.FILTER;
      this.hideAllAttributeFilters();
      
    }
    /** Fetch Filters ends */


      // /** Scroll Logic for Paging  Starts here */

      // throttle = 300;
      // scrollDistance = 1;
      // scrollUpDistance = 2;
      
      // windowScrollPosition        = 25000;
      // windowScrollSize            = 25000;  
      // onScroll(event){
        
      //   if(event.timeStamp > this.windowScrollPosition){
      //     this.windowScrollPosition = this.windowScrollPosition + this.windowScrollSize;
      //     this.productOffset = this.productLimit;
      //     this.productLimit = this.productLimit + ApplicationConstants.DEFAULT_LIMIT;
    
      //     this.callFromScroll = 1;
    
      //     if(this.isFilterSelected()) {
      //       this.fetchFilteredProducts()
      //     }else{
      //       this.fetchProductByBannerIdAPI();
      //     }
    
      //   }
      // }
    
      // isFilterSelected() { // this is to notify that atleast one of the filter is selected 
      //   let filterSelectionFlag = 0
      //    if(this.filterSelectedCategoryArray.length           > 0   ||   
      //       this.filterSelectedBrandArray.length              > 0   ||      
      //       this.filterSelectedDiscountObject.DISCOUNT_TO     > 0   ||           
      //       this.filterSelectedPriceObject.TO_PRICE           != 0  ||     
      //       this.filterSelectedAttributesArray.length         > 0   || 
      //       this.filterSelectedSortByObject.VALUE             != ""){
      //         filterSelectionFlag = 1;
      //     }
      //     return filterSelectionFlag;
      // }
    
      // onScrollDown (ev) {
      //   console.log('scrolled down!!', ev);
      //   this.callFromScroll = 1;
    
      //   if(this.isFilterSelected()) {
      //     this.fetchFilteredProducts()
      //   }else{
      //     this.fetchProductByBannerIdAPI();
      //   }
          
      // }
      
      // /** Scroll Logic for Paging Ends here */


  // On Filters Selection (means on check)
  filterAttributeNamesArray = [];
  filterAttributeValuesArray = [];
  onFilterSelectionChangeAttributes(event, attributeObject){
    
    let isSelected = event.target.checked;

    let index = this.checkNameExists(attributeObject.FILTER_ATTRIBUTE_NAME);
    
    if(isSelected){
      
      if( index > -1){
        let tempAttributeValuesArray = this.filterAttributeValuesArray[index];
        tempAttributeValuesArray.push(attributeObject.FILTER_ATTRIBUTE_VALUE);
        this.filterAttributeValuesArray[index] = tempAttributeValuesArray;
      }else{
        let tempArray = [];
        tempArray.push(attributeObject.FILTER_ATTRIBUTE_VALUE);
        this.filterAttributeNamesArray.push(attributeObject.FILTER_ATTRIBUTE_NAME);
        this.filterAttributeValuesArray.push(tempArray);
      }

    }else{


      if( index > -1){ 
        let tempAttributeValuesArray = this.filterAttributeValuesArray[index];
        let indexOfAttributeValue = tempAttributeValuesArray.indexOf(attributeObject.FILTER_ATTRIBUTE_VALUE);
        tempAttributeValuesArray.splice(indexOfAttributeValue, 1);
        this.filterAttributeValuesArray[index] = tempAttributeValuesArray;

        if(tempAttributeValuesArray.length == 0) {
          this.filterAttributeNamesArray.splice(index, 1);
          this.filterAttributeValuesArray.splice(index, 1);
        }
      }
    }

    // this.fetchFilteredProducts();

  }

  checkNameExists(attributeName){

    let index = -1;
    index = this.filterAttributeNamesArray.indexOf(attributeName);
    return index;
  }

  showNoProductsImage = false;
  
  // On Filters Selection (means on check) ends 
}