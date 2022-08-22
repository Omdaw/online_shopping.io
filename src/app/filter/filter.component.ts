import { Component, OnInit } from '@angular/core';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { Router } from '@angular/router';
import { UserProfileService } from '../user-profile.service';
import { FiltersService } from '../filters.service';
import { FlagsService } from '../flags.service';
import { ProductsMidLayerService } from '../products-mid-layer.service';
import { FetchingproductsService } from '../fetchingproducts.service';
import { ConfigService } from '../config.service';
import { Location } from '@angular/common'

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  constructor(private configService: ConfigService,
    private _router: Router,
    private userProfileService: UserProfileService,
    private filterService: FiltersService,
    private flagsService: FlagsService,
    private productsMidLayerService: ProductsMidLayerService,
    private fetchingproductsService: FetchingproductsService,
    private location:Location
  ) { }

  processBar = false;

  ngOnInit() {
    this.displayFilterByBlockId(1000);

    window.scroll(0, 0);
    this.fetchFiltersByCategoryId();
    this.flagsService.showSearch();
    this.flagsService.showHeaderFooter();
    if (window.innerWidth < 600) {
      this.flagsService.hideFooter();
    }

  }

  filterDisplayBlock = 1;

  displayFilterByBlockId(blockId) {
    this.filterDisplayBlock = blockId;
  }

  getClassName(blockId) {
    let className = "";
    if (blockId == this.filterDisplayBlock) className = "selectedFilter";
    return className;
  }

  updateSelectedFilterBG(blockId) {

    if (blockId == this.filterDisplayBlock) {
      return "#FEA838";
    } else {
      return "";
    }
  }

  /** Filters Logic Start here */
  fetchFiltersApiRequestObject = {};
  filtersObject = {
    ATTRIBUTES: [],
    PRICE: [],
    DISCOUNT: [],
    BRAND: [],
    CATEGORY: [],
    SORT_BY: [],

  };

  closeFilter(): void{
    this.location.back();
  }


  onSortBy(name, label) {

    this.filterSelectedSortByObject = {
      ORDER: name,
      VALUE: label
    }

  }

  attributeFiltersArray = [];
  makeFetchFiltersByCategoryIdRequestObject() {
    this.fetchFiltersApiRequestObject = {
      FILTER_SEARCH_KEY                   :     ApplicationConstants.CATEGORY_FILTER_SEARCH_KEY,
      STORE_ID                            :     this.configService.getStoreID(),
      FILTER_REQUEST_FROM_TYPE_CODE       :     ApplicationConstants.CATEGORY_FILTER_REQUEST_FROM_TYPE_CODE,
      CATEGORY_ID                         :     +localStorage.getItem("productCategoryIdForFilters")
    }
  }

  fetchFiltersByCategoryId() {
    this.processBar = true;
    this.makeFetchFiltersByCategoryIdRequestObject();
    this.filterService.fetchFiltersAPI(this.fetchFiltersApiRequestObject).subscribe(data => this.handleFetchFiltersbyCategoryIdResponse(data), error => this.handleError(error));
  }

  filterDiscountArray = [];
  handleFetchFiltersbyCategoryIdResponse(data) {
    this.filtersObject                =     data;
    this.filterDiscountArray          =     data.DISCOUNT;
    this.attributeFiltersArray        =     data.FILTER;
    this.processBar                   =     false;
  }
  
  // ***************************
  
  fetchFilteredProductsRequestObject      =     {};
  filteredProductsArray                   =     [];
  filterSelectedCategoryArray             =     []; //Selected caterories in filter
  filterSelectedBrandArray                =     []; //Selected brands in filter
  filterSelectedDiscountObject            =     { DISCOUNT_TO: 0, DISCOUNT_TYPE: "" }; //Selected discounts in filter
  filterSelectedPriceObject               =     { FROM_PRICE: 0, TO_PRICE: 0 }; //Selected price range in filter
  filterSelectedAttributesArray           =     []; //Selected attributes in filter
  filterSelectedSortByObject              =     { VALUE: "", ORDER: "" }; //Selected sort by in filter

  //Category
  onFilterSelectionChangeCategory(event, productCategoryId) {

    this.clearAttributeFilters();

    let isSelected = event.target.checked;

    if (isSelected) {
      this.filterSelectedCategoryArray.push(productCategoryId);
    } else {
      let index = this.filterSelectedCategoryArray.indexOf(productCategoryId);
      this.filterSelectedCategoryArray.splice(index, 1);
    }
  }

  // Brand
  onFilterSelectionChangeBrand(event, productBrandId) {

    let isSelected = event.target.checked;

    if (isSelected) {
      this.filterSelectedBrandArray.push(productBrandId);
    } else {
      let index = this.filterSelectedBrandArray.indexOf(productBrandId);
      this.filterSelectedBrandArray.splice(index, 1);
    }

  }

  // Discount
  onFilterSelectionChangeDiscount(event, dicountObject) {
    this.clearAttributeFilters();
    this.filterDiscountArray = [];
    this.filterSelectedDiscountObject = dicountObject;
  }

  onFiltersApply() {

    this.productsMidLayerService.callFromFilter = true;

    this.productsMidLayerService.filterSelectedCategoryArray = this.filterSelectedCategoryArray;
    this.productsMidLayerService.filterSelectedBrandArray = this.filterSelectedAttributesArray;
    this.productsMidLayerService.filterSelectedDiscountObject = this.filterSelectedDiscountObject;
    this.productsMidLayerService.filterSelectedSortByObject = this.filterSelectedSortByObject;//<!-- Final Checklist -->
    this.fetchingproductsService.callFromPageCode = ApplicationConstants.CALL_FROM_MOBILE_FILTER;
    this._router.navigate(['/AllCollections/product', localStorage.getItem("productCategoryIdForFilters")]);
  }


  /** Filters Logic Ends here */

  handleError(error) {

  }

  // On Filters Selection (means on check)
  filterAttributeNamesArray = [];
  filterAttributeValuesArray = [];
  onFilterSelectionChangeAttributes(event, attributeObject) {

    
    this.clearAttributeFilters();
    let tempArray = [];
    tempArray.push(attributeObject.FILTER_ATTRIBUTE_VALUE);
    this.filterAttributeNamesArray.push(attributeObject.TABLE_COLUMN_NAME);
    this.filterAttributeValuesArray.push(tempArray);

    this.productsMidLayerService.filterAttributeNamesArray = this.filterAttributeNamesArray;
    this.productsMidLayerService.filterAttributeValuesArray = this.filterAttributeValuesArray;
  }

  clearAttributeFilters(){
    this.filterAttributeNamesArray  = [];
    this.filterAttributeValuesArray = [];
   }

  checkNameExists(attributeName) {

    let index = -1;
    index = this.filterAttributeNamesArray.indexOf(attributeName);
    return index;
  }


}
