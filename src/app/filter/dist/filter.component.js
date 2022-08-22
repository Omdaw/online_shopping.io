"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FilterComponent = void 0;
var core_1 = require("@angular/core");
var ApplicationConstants_1 = require("src/ApplicationConstants");
var FilterComponent = /** @class */ (function () {
    function FilterComponent(configService, _router, userProfileService, filterService, flagsService, productsMidLayerService, fetchingproductsService, location) {
        this.configService = configService;
        this._router = _router;
        this.userProfileService = userProfileService;
        this.filterService = filterService;
        this.flagsService = flagsService;
        this.productsMidLayerService = productsMidLayerService;
        this.fetchingproductsService = fetchingproductsService;
        this.location = location;
        this.processBar = false;
        this.filterDisplayBlock = 1;
        /** Filters Logic Start here */
        this.fetchFiltersApiRequestObject = {};
        this.filtersObject = {
            ATTRIBUTES: [],
            PRICE: [],
            DISCOUNT: [],
            BRAND: [],
            CATEGORY: [],
            SORT_BY: []
        };
        this.attributeFiltersArray = [];
        this.filterDiscountArray = [];
        // ***************************
        this.fetchFilteredProductsRequestObject = {};
        this.filteredProductsArray = [];
        this.filterSelectedCategoryArray = []; //Selected caterories in filter
        this.filterSelectedBrandArray = []; //Selected brands in filter
        this.filterSelectedDiscountObject = { DISCOUNT_TO: 0, DISCOUNT_TYPE: "" }; //Selected discounts in filter
        this.filterSelectedPriceObject = { FROM_PRICE: 0, TO_PRICE: 0 }; //Selected price range in filter
        this.filterSelectedAttributesArray = []; //Selected attributes in filter
        this.filterSelectedSortByObject = { VALUE: "", ORDER: "" }; //Selected sort by in filter
        // On Filters Selection (means on check)
        this.filterAttributeNamesArray = [];
        this.filterAttributeValuesArray = [];
    }
    FilterComponent.prototype.ngOnInit = function () {
        this.displayFilterByBlockId(1000);
        window.scroll(0, 0);
        this.fetchFiltersByCategoryId();
        // this.displayFilterByBlockId(1001);
        // this.flagsService.hideHeaderFooter();
        this.flagsService.showSearch();
        this.flagsService.showHeaderFooter();
        if (window.innerWidth < 600) {
            this.flagsService.hideFooter();
        }
    };
    FilterComponent.prototype.displayFilterByBlockId = function (blockId) {
        this.filterDisplayBlock = blockId;
    };
    FilterComponent.prototype.getClassName = function (blockId) {
        var className = "";
        if (blockId == this.filterDisplayBlock)
            className = "selectedFilter";
        return className;
    };
    FilterComponent.prototype.updateSelectedFilterBG = function (blockId) {
        if (blockId == this.filterDisplayBlock) {
            return "#FEA838";
        }
        else {
            return "";
        }
    };
    FilterComponent.prototype.closeFilter = function () {
        // this._router.navigate(['/AllCollections/product', this.filtersObject.CATEGORY.PRODUCT_CATEGORY_ID]);
        this.location.back();
    };
    //SortBy <!-- Final Checklist -->
    FilterComponent.prototype.onSortBy = function (name, label) {
        this.filterSelectedSortByObject = {
            ORDER: name,
            VALUE: label
        };
    };
    FilterComponent.prototype.makeFetchFiltersByCategoryIdRequestObject = function () {
        this.fetchFiltersApiRequestObject = {
            FILTER_SEARCH_KEY: ApplicationConstants_1.ApplicationConstants.CATEGORY_FILTER_SEARCH_KEY,
            STORE_ID: this.configService.getStoreID(),
            FILTER_REQUEST_FROM_TYPE_CODE: ApplicationConstants_1.ApplicationConstants.CATEGORY_FILTER_REQUEST_FROM_TYPE_CODE,
            CATEGORY_ID: this.userProfileService.productCategoryIdForFilters
        };
    };
    FilterComponent.prototype.fetchFiltersByCategoryId = function () {
        var _this = this;
        this.processBar = true;
        this.makeFetchFiltersByCategoryIdRequestObject();
        this.filterService.fetchFiltersAPI(this.fetchFiltersApiRequestObject).subscribe(function (data) { return _this.handleFetchFiltersbyCategoryIdResponse(data); }, function (error) { return _this.handleError(error); });
    };
    FilterComponent.prototype.handleFetchFiltersbyCategoryIdResponse = function (data) {
        this.filtersObject = data;
        this.filterDiscountArray = data.DISCOUNT;
        this.attributeFiltersArray = data.FILTER;
        this.processBar = false;
    };
    // makeFetchFilteredProductsRequestObject(){
    //   if(this.callFromScroll) {
    //     this.productOffset = this.productOffset + this.productLimit;
    //   }else{
    //     this.productOffset  = ApplicationConstants.DEFAULT_OFFSET;
    //   }
    //   this.fetchFilteredProductsRequestObject = {
    //       STORE_ID   : this.configService.getStoreID(),
    //       CATEGORY   : this.filterSelectedCategoryArray, 
    //       BRAND      : this.filterSelectedBrandArray,
    //       DISCOUNT   : this.filterSelectedDiscountObject,
    //       PRICE      : this.filterSelectedPriceObject,
    //       ATTRIBUTES : this.filterSelectedAttributesArray,
    //       SORT_BY    : this.filterSelectedSortByObject,
    //       LIMIT      : this.productLimit,
    //       OFFSET     : this.productOffset
    //   }
    // }
    // fetchFilteredProducts(){
    //   this.processBar = true;
    //   this,this.makeFetchFilteredProductsRequestObject();
    //   this.filterService.fetchFilteredProductsAPI(this.fetchFilteredProductsRequestObject).subscribe(data => this.handleFetchFilteredProductsResponse(data), error=>this.handleError(error));
    // }
    // handleFetchFilteredProductsResponse(pData){
    //   console.log(pData);
    //     if(this.callFromScroll){
    //       this.productsArray = this.productsArray.concat(pData.PRODUCT);
    //       this.callFromScroll = 0;
    //     }else{
    //       this.productsArray = [];
    //       this.productsArray = pData.PRODUCT;
    //     }
    //     for(let i=0; i<this.productsArray.length; i++){
    //       this.productsArray[i].showAddToCart = 1;  
    //       this.productsArray[i].selectedQuantity = 1;
    //       this.checkProductExistsInTransaction(i);
    //     }
    //   this.processBar = false;
    // }
    //Category
    FilterComponent.prototype.onFilterSelectionChangeCategory = function (event, productCategoryId) {
        this.clearAttributeFilters();
        var isSelected = event.target.checked;
        if (isSelected) {
            this.filterSelectedCategoryArray.push(productCategoryId);
        }
        else {
            var index = this.filterSelectedCategoryArray.indexOf(productCategoryId);
            this.filterSelectedCategoryArray.splice(index, 1);
        }
    };
    // //Brand
    FilterComponent.prototype.onFilterSelectionChangeBrand = function (event, productBrandId) {
        var isSelected = event.target.checked;
        if (isSelected) {
            this.filterSelectedBrandArray.push(productBrandId);
        }
        else {
            var index = this.filterSelectedBrandArray.indexOf(productBrandId);
            this.filterSelectedBrandArray.splice(index, 1);
        }
    };
    //Discount
    FilterComponent.prototype.onFilterSelectionChangeDiscount = function (event, dicountObject) {
        this.clearAttributeFilters();
        this.filterDiscountArray = [];
        this.filterSelectedDiscountObject = dicountObject;
    };
    FilterComponent.prototype.onFiltersApply = function () {
        this.productsMidLayerService.callFromFilter = true;
        this.productsMidLayerService.filterSelectedCategoryArray = this.filterSelectedCategoryArray;
        this.productsMidLayerService.filterSelectedBrandArray = this.filterSelectedAttributesArray;
        this.productsMidLayerService.filterSelectedDiscountObject = this.filterSelectedDiscountObject;
        this.productsMidLayerService.filterSelectedSortByObject = this.filterSelectedSortByObject; //<!-- Final Checklist -->
        this.fetchingproductsService.callFromPageCode = ApplicationConstants_1.ApplicationConstants.CALL_FROM_MOBILE_FILTER;
        this._router.navigate(['/AllCollections/product', this.userProfileService.productCategoryIdForFilters]);
    };
    /** Filters Logic Ends here */
    FilterComponent.prototype.handleError = function (error) {
    };
    FilterComponent.prototype.onFilterSelectionChangeAttributes = function (event, attributeObject) {
        // let isSelected = event.target.checked;
        // let index = this.checkNameExists(attributeObject.TABLE_COLUMN_NAME);
        // if (isSelected) {
        //   if (index > -1) {
        //     let tempAttributeValuesArray = this.filterAttributeValuesArray[index];
        //     tempAttributeValuesArray.push(attributeObject.FILTER_ATTRIBUTE_VALUE);
        //     this.filterAttributeValuesArray[index] = tempAttributeValuesArray;
        //   } else {
        //     let tempArray = [];
        //     tempArray.push(attributeObject.FILTER_ATTRIBUTE_VALUE);
        //     this.filterAttributeNamesArray.push(attributeObject.TABLE_COLUMN_NAME);
        //     this.filterAttributeValuesArray.push(tempArray);
        //   }
        // } else {
        //   if (index > -1) {
        //     let tempAttributeValuesArray = this.filterAttributeValuesArray[index];
        //     let indexOfAttributeValue = tempAttributeValuesArray.indexOf(attributeObject.FILTER_ATTRIBUTE_VALUE);
        //     tempAttributeValuesArray.splice(indexOfAttributeValue, 1);
        //     this.filterAttributeValuesArray[index] = tempAttributeValuesArray;
        //     if (tempAttributeValuesArray.length == 0) {
        //       this.filterAttributeNamesArray.splice(index, 1);
        //       this.filterAttributeValuesArray.splice(index, 1);
        //     }
        //   }
        // }
        this.clearAttributeFilters();
        var tempArray = [];
        tempArray.push(attributeObject.FILTER_ATTRIBUTE_VALUE);
        this.filterAttributeNamesArray.push(attributeObject.TABLE_COLUMN_NAME);
        this.filterAttributeValuesArray.push(tempArray);
        this.productsMidLayerService.filterAttributeNamesArray = this.filterAttributeNamesArray;
        this.productsMidLayerService.filterAttributeValuesArray = this.filterAttributeValuesArray;
    };
    FilterComponent.prototype.clearAttributeFilters = function () {
        this.filterAttributeNamesArray = [];
        this.filterAttributeValuesArray = [];
    };
    FilterComponent.prototype.checkNameExists = function (attributeName) {
        var index = -1;
        index = this.filterAttributeNamesArray.indexOf(attributeName);
        return index;
    };
    FilterComponent = __decorate([
        core_1.Component({
            selector: 'app-filter',
            templateUrl: './filter.component.html',
            styleUrls: ['./filter.component.css']
        })
    ], FilterComponent);
    return FilterComponent;
}());
exports.FilterComponent = FilterComponent;
