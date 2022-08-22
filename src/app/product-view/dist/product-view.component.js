"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.AddonDialog = exports.ProductViewComponent = void 0;
var core_1 = require("@angular/core");
var ApplicationConstants_1 = require("src/ApplicationConstants");
var dialog_1 = require("@angular/material/dialog");
var products_component_1 = require("../products/products.component");
var ProductViewComponent = /** @class */ (function () {
    function ProductViewComponent(configService, _router, route, productService, subscriberService, reviewService, transactionService, userProfileService, productMidLayerService, pincodeMethods, commonService, flagsService, myWishlistService, homepageService, dialog) {
        this.configService = configService;
        this._router = _router;
        this.route = route;
        this.productService = productService;
        this.subscriberService = subscriberService;
        this.reviewService = reviewService;
        this.transactionService = transactionService;
        this.userProfileService = userProfileService;
        this.productMidLayerService = productMidLayerService;
        this.pincodeMethods = pincodeMethods;
        this.commonService = commonService;
        this.flagsService = flagsService;
        this.myWishlistService = myWishlistService;
        this.homepageService = homepageService;
        this.dialog = dialog;
        this.sizes = [
            { value: 'steak-0', viewValue: 'Steak' },
            { value: 'pizza-1', viewValue: 'Pizza' },
            { value: 'tacos-2', viewValue: 'Tacos' }
        ];
        this.panelOpenState = false;
        this.processBar = false;
        this.fetchProductRequestObject = {};
        this.productsDetailObject = { PRODUCT_IMAGE: "", SELLING_PRICE: 0, COMPARE_AT_PRICE: 0, PRODUCT_DETAIL_REVIEW_VALUE: 0 };
        this.productObject = { PRODUCT_CATEGORY_ID: 0, PRODUCT_CATEGORY_NAME: "", PRODUCT_BRAND_NAME: "", PRODUCT_NAME: "", PRODUCT_DESC: "" };
        this.productArray = [];
        this.productId = 0;
        this.sizePresent = false;
        this.colorPresent = false;
        this.quantityDropdownValues = [];
        this.selectedQuantity = 1;
        this.selectedProductDetailId = 0;
        this.subscriberDetailsObject = { SUBSCRIBER_ID: 0 };
        this.fetchCartInProgressRequestObject = {};
        this.showAddToCart = 1;
        this.showSoldOut = 0;
        this.showUnavailable = 0;
        this.transactionId = this.commonService.lsTransactionId();
        this.transactionDetailsId = 0;
        this.addToCartRequestObject = {};
        this.selectedProductIndex = 0;
        this.updateCartRequestObject = {};
        this.deleteCartRequestObject = {};
        this.buyNowClickedNavigateToCart = 0;
        this.dSelectedSize = "s3";
        this.iFrameUrlForFacebook = "";
        this.additionalInfo = [];
        this.relatedProducts = [];
        this.productDetailIdByParam = 0; //Checklist-3 (Point-1)
        this.reviewDataArray = [];
        this.productImageWithPathArray = [];
        this.productDetailsIndex = 0;
        this.singleProductPageProcessBar = false;
        //Making Dropdowns Logic starts here
        this.colorDropdownValues = [];
        this.sizeDropdownValues = [];
        this.materialDropdownValues = [];
        this.selectedSize = "null";
        this.selectedColor = "null";
        this.selectedMaterial = "null";
        this.dropdownLabelsObject = {
            SIZE_LABEL: "",
            PRODUCT_COLOR_LABEL: "",
            MATERIAL_LABEL: ""
        };
        this.imageUrl = "";
        this.imagesArray = [];
        //Share Product hide/show 
        this.displaySharingIcons = false;
        this.pincode = 0;
        //Add related products To Cart
        this.addRelatedProductsToCartRequestObject = {};
        this.rTransactionDetailsId = 0;
        //Add related products To Cart Ends
        //Update related products 
        this.updateCartRelatedProductsRequestObject = {};
    }
    ProductViewComponent.prototype.openAddonDialog = function () {
        var dialogRef = this.dialog.open(AddonDialog, {
            width: '700px',
            data: this.productsDetailObject
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log('The dialog was closed');
        });
    };
    //AddOns ends
    ProductViewComponent.prototype.onAddToCartButtonClick = function () {
        this.productsDetailObject.buyNowClickedNavigateToCart = false;
        if (this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP && this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.length > 0) {
            this.openAddonDialog();
        }
        else {
            this.addToCart();
        }
    };
    ProductViewComponent.prototype.openCustomizationConfirmationPopup = function () {
        var recentTransactionDetailObject = this.getRecentTransactionDetailObject();
        var dialogRef = this.dialog.open(products_component_1.CustomizationConfirmationDialog, {
            width: '700px',
            data: recentTransactionDetailObject
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log('The dialog was closed');
        });
    };
    //Customization confirmation dialog ends
    ProductViewComponent.prototype.getRecentTransactionDetailObject = function () {
        var _this = this;
        var transactionDetailArray = this.transactionService.transactionDetailsArray;
        var recentTransactionDetailId = 0;
        var recentTransactionDetailObject = {};
        if (transactionDetailArray && transactionDetailArray.length > 0) {
            transactionDetailArray.forEach(function (transactionDetailObject) {
                var tProductDetailId = transactionDetailObject.PRODUCT_DETAIL_ID;
                var tTransactionDetailId = transactionDetailObject.TRANSACTION_DETAIL_ID;
                // if(pProductObject.PRODUCT_DETAIL && pProductObject.PRODUCT_DETAIL.length > 0){
                // pProductObject.PRODUCT_DETAIL.forEach(productDetailObject => {
                // let pProductDetailId = productDetailObject.PRODUCT_DETAIL_ID;
                if (tProductDetailId == _this.productsDetailObject.PRODUCT_DETAIL_ID) {
                    if (tTransactionDetailId > recentTransactionDetailId) {
                        recentTransactionDetailId = tTransactionDetailId;
                        recentTransactionDetailObject = transactionDetailObject;
                    }
                }
                // });
                // }
            });
        }
        return recentTransactionDetailObject;
    };
    ProductViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scrollTo(0, 0);
        this.flagsService.showSearch();
        this.flagsService.showHeaderFooter();
        if (window.innerWidth < 600) {
            this.flagsService.hideFooter();
        }
        this.iFrameUrlForFacebook = "https://www.facebook.com/plugins/share_button.php?href=" + this.route.url;
        this.GetProductIdByParam();
        // this.fetchProductByProductId();
        this.checkSubscriberId();
        this.route.params.subscribe(function (params) {
            if (params['id'] != undefined) {
                _this.productId = +params['id'];
                _this.productDetailIdByParam = +params['product_detail_id']; //Checklist-3 (Point-1)
                _this.GetProductIdByParam(); //Checklist-3 (Point-1) -- this is cut paste
                _this.checkSubscriberId(); //Checklist-3 (Point-1) -- this is cut paste
                _this.fetchCartInProgress();
            }
        });
        this.myWishlistService.fetchMyWishList();
        this.loadData();
    };
    ProductViewComponent.prototype.GetProductIdByParam = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            if (params['id'] != undefined) {
                _this.productId = +params['id'];
            }
            if (params['product_detail_id'] != undefined && params['product_detail_id'] != 0) {
                _this.selectedProductDetailId = +params['product_detail_id'];
            }
        });
    };
    ProductViewComponent.prototype.loadData = function () {
        this.fetchRatingsData();
        this.fetchStoreDetails(this.configService.getStoreID());
    };
    ProductViewComponent.prototype.fetchRatingsData = function () {
        var _this = this;
        if (this.selectedProductDetailsId > 0) {
            this.processBar = true;
            var requestParams = {
                PRODUCT_DETAIL_ID: this.selectedProductDetailsId
            };
            this.reviewService.fetchReviewAPI(requestParams)
                .subscribe(function (data) { return _this.handleReviewData(data); }, function (error) { return _this.handleError(error); });
        }
    };
    ProductViewComponent.prototype.handleReviewData = function (pData) {
        if (pData.STATUS == "OK") {
            var reviewArray = pData.REVIEW;
            this.reviewDataArray = pData.REVIEW;
            var totalRatings = 0;
            for (var index = 0; index < reviewArray.length; index++) {
                var reviewObj = reviewArray[index];
                totalRatings += reviewObj.RATINGS;
            }
            this.ratingsAverage = Math.round(totalRatings / pData.TOTAL_COUNT * 10) / 10;
        }
        this.processBar = false;
    };
    ProductViewComponent.prototype.fetchStoreDetails = function (pStoreId) {
        var _this = this;
        this.homepageService.fetchStoreByIdAPI(pStoreId)
            .subscribe(function (data) { return _this.handleStoreData(data); }, function (error) { return _this.handleError(error); });
    };
    ProductViewComponent.prototype.handleStoreData = function (pData) {
        if (pData.STATUS == "OK") {
            var storeObj = pData.STORE[0];
            this.storeName = storeObj.STORE_NAME;
            this.addressArea = storeObj.STORE_ADDRESS_AREA_NAME;
            this.addressCity = storeObj.STORE_ADDRESS_CITY_NAME;
            this.addressState = storeObj.STORE_ADDRESS_STATE_NAME;
            this.addressCountry = storeObj.STORE_ADDRESS_COUNTRY_NAME;
        }
    };
    ProductViewComponent.prototype.makefetchProductByProductIdObject = function () {
        this.fetchProductRequestObject = {
            STORE_ID: this.configService.getStoreID(),
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            PRODUCT_ID: this.productId
        };
    };
    ProductViewComponent.prototype.fetchProductByProductId = function () {
        var _this = this;
        this.processBar = true;
        this.makefetchProductByProductIdObject();
        this.productService.fetchProductByProductId(this.fetchProductRequestObject).subscribe(function (data) { return _this.handleFetchProductByProductIdSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    ProductViewComponent.prototype.handleFetchProductByProductIdSuccess = function (pData) {
        if (pData.STATUS = 'OK') {
            this.productObject = pData.PRODUCT[0];
            this.productArray = pData.PRODUCT;
            this.productsDetailObject = pData.PRODUCT[0].PRODUCT_DETAIL[this.productDetailsIndex];
            this.productImageWithPathArray = pData.PRODUCT[0].PRODUCT_DETAIL[this.productDetailsIndex].PRODUCT_IMAGE;
            if (pData.PRODUCT[0].PRODUCT_DETAIL.length > 0 &&
                pData.PRODUCT[0].PRODUCT_DETAIL[0].PRODUCT_IMAGE &&
                pData.PRODUCT[0].PRODUCT_DETAIL[0].PRODUCT_IMAGE.length > 0 &&
                pData.PRODUCT[0].PRODUCT_DETAIL[0].PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH) {
                this.imageUrl = pData.PRODUCT[0].PRODUCT_DETAIL[this.productDetailsIndex].PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH;
            }
            this.additionalInfo = pData.PRODUCT[0].PRODUCT_DETAIL[this.productDetailsIndex].ADDITIONAL_INFO;
            this.checkProductExistsInTransaction();
            this.dropdownLabelsObject = pData.PRODUCT_LABEL;
            this.makeDropdowns(pData.PRODUCT[0]);
            // stop the progress bar
            this.processBar = false;
        }
    };
    ProductViewComponent.prototype.structureProducts = function (tempArray) {
        var _this = this;
        console.log("tempArray", tempArray);
        var relatedProds = tempArray;
        var productsArray = [];
        if (relatedProds && relatedProds.length > 0) {
            relatedProds.forEach(function (element) {
                if (element.PRODUCT_DETAIL) {
                    element.showAddToCart = 1;
                    element.selectedQuantity = 1;
                    _this.transactionService.transactionDetailsArray.forEach(function (transaction) {
                        if (element.PRODUCT_DETAIL && element.PRODUCT_DETAIL.PRODUCT_DETAIL_ID == transaction.PRODUCT_DETAIL_ID) {
                            element.showAddToCart = 0;
                            element.selectedQuantity = transaction.PRODUCT_QUANTITY;
                            element.PRODUCT_DETAIL.transactionDetailsId = transaction.TRANSACTION_DETAIL_ID;
                            element.progressBar = false;
                        }
                    });
                    productsArray.push(element);
                }
            });
        }
        relatedProds = productsArray;
        return relatedProds;
    };
    ProductViewComponent.prototype.make4DataInEachShellOfArray = function (pArray, noOfItemsInRow) {
        var mainArray = [];
        var sourceProductsArray = [];
        var mArray = pArray;
        if (pArray.length > 0)
            sourceProductsArray = pArray;
        if (sourceProductsArray.length <= noOfItemsInRow) { //If Array has upto 4 items ;
            mainArray.push(sourceProductsArray);
        }
        else {
            var arrayLength = sourceProductsArray.length / noOfItemsInRow;
            var mod = sourceProductsArray.length % noOfItemsInRow;
            if (mod > 0)
                arrayLength = arrayLength + 1;
            var prodArrayIndex = 0;
            for (var i = 0; i < arrayLength; i++) {
                var tempProArray = [];
                for (var j = 0; j < noOfItemsInRow; j++) {
                    if (sourceProductsArray[prodArrayIndex])
                        tempProArray.push(sourceProductsArray[prodArrayIndex]);
                    prodArrayIndex++;
                }
                if (tempProArray.length > 0)
                    mainArray.push(tempProArray);
            }
        }
        if (mArray.length > 0)
            mArray = mainArray;
        return mArray;
    };
    ProductViewComponent.prototype.handleError = function (error) {
    };
    ProductViewComponent.prototype.checkProductExistsInTransaction = function () {
        var _this = this;
        this.showAddToCart = 1;
        this.selectedQuantity = 1;
        this.transactionService.transactionDetailsArray.forEach(function (element) {
            if (_this.productArray[0].PRODUCT_DETAIL[_this.productDetailsIndex].PRODUCT_DETAIL_ID == element.PRODUCT_DETAIL_ID) {
                _this.showAddToCart = 0;
                _this.selectedQuantity = element.PRODUCT_QUANTITY;
                _this.productArray[0].PRODUCT_DETAIL[_this.productDetailsIndex].transactionDetailsId = element.TRANSACTION_DETAIL_ID;
                _this.transactionDetailsId = element.TRANSACTION_DETAIL_ID;
            }
        });
    };
    // gotoSingleProductPage(sizeId, colorId){
    //   if(sizeId != 0) this.selectedSize = sizeId;
    //   if(colorId != 0) this.selectedColor = colorId;
    //   this._router.navigate(['product-view/'+this.productId+ '/' +this.selectedSize+ '/' +this.selectedColor]);   
    // }
    // gotoProductPageByProductDetailId(event, pProductDetailsId){
    //   if (event.target) {
    //     this._router.navigate(['product-view/'+this.productId+ '/' +pProductDetailsId]);  
    //     this.selectedProductDetailId = pProductDetailsId; 
    //     this.makeDataBasedOnQuantity(this.productObject);
    //   }
    // }
    ProductViewComponent.prototype.makeQuantityDropdown = function (data) {
        var _this = this;
        data.forEach(function (element) {
            var tempObj = {
                productDetailsId: element.PRODUCT_DETAIL_ID,
                unit: element.UNIT,
                unitTypeName: element.UNIT_TYPE_NAME,
                unitTypeCode: element.UNIT_TYPE_CODE
            };
            _this.quantityDropdownValues.push(tempObj);
        });
    };
    ProductViewComponent.prototype.makeDataBasedOnQuantity = function (pData) {
        var _this = this;
        pData.PRODUCT_DETAIL.forEach(function (element) {
            if (_this.selectedProductDetailId == element.PRODUCT_DETAIL_ID) {
                _this.productImageWithPathArray = element.PRODUCT_IMAGE;
                _this.productsDetailObject = element;
            }
        });
    };
    ProductViewComponent.prototype.makeProductColorsDropdown = function (pData) {
        var _this = this;
        pData.PRODUCT_DETAIL.forEach(function (element) {
            var tempObj = {
                productDetailsId: element.PRODUCT_DETAIL_ID,
                color: element.PRODUCT_COLOR
            };
            if (_this.colorDropdownValues.find(function (tempObj) { return tempObj.color === element.PRODUCT_COLOR; }) === undefined) {
                if (element.PRODUCT_COLOR != '' && element.PRODUCT_COLOR != 'null')
                    _this.colorDropdownValues.push(tempObj);
            }
        });
        if (this.colorDropdownValues.length > 0 && this.selectedColor == '')
            this.selectedColor = this.colorDropdownValues[0].value;
    };
    ProductViewComponent.prototype.makeSizesDropdown = function (pData) {
        var _this = this;
        pData.PRODUCT_DETAIL.forEach(function (element) {
            var tempObj = {
                productDetailsId: element.PRODUCT_DETAIL_ID,
                size: element.SIZE
            };
            if (_this.sizeDropdownValues.find(function (tempObj) { return tempObj.size === element.SIZE; }) === undefined) {
                if (element.SIZE != '' && element.SIZE != 'null')
                    _this.sizeDropdownValues.push(tempObj);
            }
        });
        if (this.sizeDropdownValues.length > 0 && this.selectedSize == '')
            this.selectedSize = this.sizeDropdownValues[0].value;
    };
    ProductViewComponent.prototype.onSizeChange = function (size) {
        this.selectedSize = size;
        this.onVariantChange();
        this.makeColorDropdowns(); //#variantLogic
    };
    ProductViewComponent.prototype.onColorChange = function (size) {
        this.selectedColor = size;
        this.onVariantChange();
        this.makeMaterialDropdowns(); //#variantLogic
    };
    ProductViewComponent.prototype.onMaterialChange = function (size) {
        this.selectedMaterial = size;
        this.onVariantChange();
    };
    ProductViewComponent.prototype.onVariantChange = function () {
        this.getProductDetailsBasedOnColorSizeMaterialCombination();
    };
    ProductViewComponent.prototype.getSizeClassName = function (size) {
        var className = "_2UBURg";
        if (size == this.selectedSize)
            className = "selectedVariant";
        return className;
    };
    ProductViewComponent.prototype.getColorClassName = function (size) {
        var className = "_2UBURg";
        if (size == this.selectedColor)
            className = "selectedVariant";
        return className;
    };
    ProductViewComponent.prototype.getMaterialClassName = function (size) {
        var className = "_2UBURg";
        if (size == this.selectedMaterial)
            className = "selectedVariant";
        return className;
    };
    ProductViewComponent.prototype.getProductDetailsBasedOnColorSizeMaterialCombination = function () {
        var _this = this;
        var productDetailsIndex = 0;
        var combinationAvailable = 0;
        var available = 1;
        this.productArray[0].PRODUCT_DETAIL.forEach(function (element) {
            if (element.PRODUCT_COLOR == _this.selectedColor
                && element.SIZE == _this.selectedSize
                && element.MATERIAL == _this.selectedMaterial) {
                if (element.AVAILABLE_QUANTITY == 0)
                    available = 0;
                _this.productsDetailObject = element;
                _this.productDetailsIndex = productDetailsIndex;
                _this.sellerDetail = element.SELLER_DETAIL;
                _this.selectedProductDetailsId = element.PRODUCT_DETAIL_ID;
                if (element.PRODUCT_IMAGE &&
                    element.PRODUCT_IMAGE.length > 0 &&
                    element.PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH) {
                    _this.imageUrl = element.PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH; //Checklist-3 
                }
                _this.imagesArray = element.PRODUCT_IMAGE; //Checklist-3 
                _this.additionalInfo = element.ADDITIONAL_INFO;
                var relatedProducts = [];
                if (element.RELATED_PRODUCTS_DETAIL)
                    relatedProducts = element.RELATED_PRODUCTS_DETAIL;
                var relProducts = _this.structureProducts(relatedProducts);
                var array = [];
                if (relProducts.length > 0) {
                    if (window.innerWidth <= 600) {
                        array = _this.make4DataInEachShellOfArray(relProducts, 2);
                    }
                    else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
                        array = _this.make4DataInEachShellOfArray(relProducts, 3);
                    }
                    else if (window.innerWidth >= 1024 && window.innerWidth < 1365) {
                        array = _this.make4DataInEachShellOfArray(relProducts, 4);
                    }
                    else {
                        array = _this.make4DataInEachShellOfArray(relProducts, 4);
                    }
                }
                _this.relatedProducts = array;
                console.log("this.relatedProducts", _this.relatedProducts);
                _this.checkProductExistsInTransaction();
                combinationAvailable = 1;
            }
            productDetailsIndex++;
        });
        this.showUnavailable = 0;
        if (combinationAvailable == 0) {
            this.showAddToCart = 0;
            this.showUnavailable = 1;
            this.showSoldOut = 0;
        }
        if (available == 0) {
            this.showSoldOut = 1;
            this.showAddToCart = 0;
            this.showUnavailable = 0;
        }
        if (combinationAvailable == 1 && this.productsDetailObject && this.productsDetailObject.PRODUCT_IMAGE && this.productsDetailObject.PRODUCT_IMAGE.length > 0) {
            this.productImageWithPathArray = this.productsDetailObject.PRODUCT_IMAGE;
        }
        else {
            this.showDummyImage();
        }
        this.fetchRatingsData();
    };
    ProductViewComponent.prototype.showDummyImage = function () {
        var tempArray = [];
        var tempObject = {
            PRODUCT_IMAGE_PATH: "http://noqsystem.com:60010/noqbase",
            PRODUCT_IMAGE_FILE: "image_coming_soon.png"
        };
        tempArray.push(tempObject);
        this.productImageWithPathArray = tempArray;
    };
    ProductViewComponent.prototype.getSizeDropdownValuesBasedColor = function (color) {
        var _this = this;
        var pData = this.productArray[0];
        pData.PRODUCT_DETAIL.forEach(function (element) {
            if (element.PRODUCT_COLOR == color) {
                var tempObj = {
                    productDetailsId: element.PRODUCT_DETAIL_ID,
                    size: element.SIZE
                };
                if (_this.sizeDropdownValues.find(function (tempObj) { return tempObj.size === element.SIZE; }) === undefined) {
                    if (element.SIZE != '')
                        _this.sizeDropdownValues.push(tempObj);
                }
            }
        });
        if (this.selectedSize == '')
            this.selectedSize = this.sizeDropdownValues[0].value;
    };
    ProductViewComponent.prototype.checkSubscriberId = function () {
        var subscriberId = 0;
        if (this.commonService.lsSubscriberId())
            subscriberId = +this.commonService.lsSubscriberId();
        if (subscriberId == 0) {
            this.temporarySubscriberLogin();
        }
        else {
            this.fetchCartInProgress();
        }
    };
    ProductViewComponent.prototype.temporarySubscriberLogin = function () {
        var _this = this;
        this.subscriberService.tempSubscriberLogin().subscribe(function (data) { return _this.handleTemporarySubscriberLoginSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    ProductViewComponent.prototype.handleTemporarySubscriberLoginSuccess = function (data) {
        if (data.STATUS == "OK") {
            var authToken = data.SUBSCRIBER.AUTHENTICATION_TOKEN;
            var subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
            var tempSubscriberFlag = 1;
            var transactionId = 0;
            this.commonService.addStoreData(authToken, subscriberId, tempSubscriberFlag, transactionId);
            this.subscriberDetailsObject = data.SUBSCRIBER;
            this.fetchCartInProgress();
        }
    };
    ProductViewComponent.prototype.makeFetchCartInProgressObject = function () {
        var tempObj = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID()
        };
        this.fetchCartInProgressRequestObject = tempObj;
    };
    ProductViewComponent.prototype.fetchCartInProgress = function () {
        var _this = this;
        this.makeFetchCartInProgressObject();
        this.subscriberService.fetchCartInProgressTransactionsBySubscriberIdAPI(this.fetchCartInProgressRequestObject)
            .subscribe(function (data) { return _this.handleFetchCartInProgressResponse(data); }, function (error) { return _this.handleError(error); });
    };
    ProductViewComponent.prototype.handleFetchCartInProgressResponse = function (data) {
        var _this = this;
        if (data.STATUS == "OK") {
            this.transactionService.transactionDetailsArray = [];
            if (data.TRANSACTION && data.TRANSACTION.length > 0) {
                data.TRANSACTION[0].TRANSACTION_DETAIL.forEach(function (element) {
                    if (element.TRANSACTION_DETAIL_TYPE_CODE == 1) { //Because we are  also getting Delivery Charge and Convenience fee
                        _this.transactionService.transactionDetailsArray.push(element);
                    }
                });
            }
            this.fetchProductByProductId();
        }
        this.processBar = false;
    };
    //Add To Cart
    ProductViewComponent.prototype.makeAddToCartRequestObject = function () {
        var transactionId = 0;
        if (this.commonService.lsTransactionId()) {
            transactionId = +this.commonService.lsTransactionId();
        }
        var productDetailObject = this.productArray[0].PRODUCT_DETAIL[this.productDetailsIndex];
        var transactionDetailsId = 0;
        if (productDetailObject.transactionDetailsId)
            transactionDetailsId = productDetailObject.transactionDetailsId;
        var transactionDetails = {
            TRANSACTION_DETAIL_ID: transactionDetailsId,
            TRANSACTION_ID: transactionId,
            PRODUCT_DETAIL_ID: productDetailObject.PRODUCT_DETAIL_ID,
            PRODUCT_NAME: this.productArray[0].PRODUCT_NAME,
            PRODUCT_PRICE: productDetailObject.PRODUCT_PRICE,
            PRODUCT_FINAL_PRICE: productDetailObject.PRODUCT_FINAL_PRICE,
            PRODUCT_DISCOUNT_ID: productDetailObject.PRODUCT_DISCOUNT_ID,
            PRODUCT_DISCOUNT_AMOUNT: productDetailObject.PRODUCT_DISCOUNT_AMOUNT,
            PRODUCT_GST_PERCENTAGE: productDetailObject.PRODUCT_GST_PERCENTAGE,
            PRODUCT_GST_AMOUNT: productDetailObject.PRODUCT_GST_AMOUNT,
            PRODUCT_GST_ID: productDetailObject.PRODUCT_GST_ID,
            PRODUCT_GST_STATUS: productDetailObject.PRODUCT_GST_STATUS,
            PRODUCT_QUANTITY: 1,
            PRODUCT_MULTI_FLAG: productDetailObject.PRODUCT_MULTI_FLAG,
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_DETAIL_TYPE_CODE: 1
        };
        var addToCartObject = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_ID: transactionId,
            TRANSACTION_DETAIL: transactionDetails
        };
        this.addToCartRequestObject = addToCartObject;
    };
    ProductViewComponent.prototype.addToCart = function () {
        var _this = this;
        this.singleProductPageProcessBar = true;
        this.makeAddToCartRequestObject();
        this.subscriberService.addToCart(this.addToCartRequestObject).subscribe(function (data) { return _this.handleAddToCartResponse(data); }, function (error) { return _this.handleError(error); });
    };
    ProductViewComponent.prototype.handleAddToCartResponse = function (data) {
        if (data.STATUS == "OK") {
            this.showAddToCart = 0;
            this.putTransactionDetailsIdInProductsArray(data.TRANSACTION[0].TRANSACTION_DETAIL);
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.transactionService.transactionArray = data.TRANSACTION;
            this.checkOnlyTransactions();
            if (data.TRANSACTION[0].TRANSACTION_DETAIL[0].TRANSACTION_ID > 0) {
                this.commonService.addTransactionIdTols();
                this.transactionId = data.TRANSACTION[0].TRANSACTION_ID;
            }
        }
        this.singleProductPageProcessBar = false;
    };
    ProductViewComponent.prototype.putTransactionDetailsIdInProductsArray = function (transactionArray) {
        var _this = this;
        var productDetailsId = this.productArray[0].PRODUCT_DETAIL[this.productDetailsIndex].PRODUCT_DETAIL_ID;
        transactionArray.forEach(function (element) {
            if (productDetailsId == element.PRODUCT_DETAIL_ID) {
                _this.productArray[0].PRODUCT_DETAIL[_this.productDetailsIndex].transactionDetailsId = element.TRANSACTION_DETAIL_ID;
            }
        });
    };
    //Add To Cart Ends
    //Update Cart
    ProductViewComponent.prototype.makeUpdateCartRequestObject = function (selectedQty) {
        var transactionDetails = {
            TRANSACTION_DETAIL_ID: this.productArray[0].PRODUCT_DETAIL[this.productDetailsIndex].transactionDetailsId,
            PRODUCT_QUANTITY: selectedQty
        };
        var tempObj = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_ID: this.commonService.lsTransactionId(),
            TRANSACTION_DETAIL: transactionDetails
        };
        this.updateCartRequestObject = tempObj;
    };
    ProductViewComponent.prototype.updateCart = function (selectedQty, method) {
        var _this = this;
        this.singleProductPageProcessBar = true;
        if (method == 1) {
            selectedQty = selectedQty + 1;
        }
        else {
            selectedQty = selectedQty - 1;
        }
        if (selectedQty == 0) {
            this.deleteCart();
        }
        else {
            this.makeUpdateCartRequestObject(selectedQty);
            this.subscriberService.updateCart(this.updateCartRequestObject).subscribe(function (data) { return _this.handleUpdateCartResponse(data, selectedQty); }, function (error) { return _this.handleError(error); });
        }
    };
    ProductViewComponent.prototype.handleUpdateCartResponse = function (data, selectedQty) {
        if (data.STATUS == "OK") {
            this.productArray[0].selectedQuantity = selectedQty;
            this.selectedQuantity = selectedQty;
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.transactionService.transactionArray = data.TRANSACTION;
            this.checkOnlyTransactions();
        }
        this.singleProductPageProcessBar = false;
    };
    //Update Cart Ends
    //Delete Cart 
    ProductViewComponent.prototype.makeDeleteCartRequestObject = function () {
        var transactionDetails = {
            TRANSACTION_DETAIL_ID: this.productArray[0].PRODUCT_DETAIL[this.productDetailsIndex].transactionDetailsId
        };
        var addToCartObject = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_ID: this.commonService.lsTransactionId(),
            TRANSACTION_DETAIL: transactionDetails
        };
        this.deleteCartRequestObject = addToCartObject;
    };
    ProductViewComponent.prototype.deleteCart = function () {
        var _this = this;
        this.singleProductPageProcessBar = true;
        this.makeDeleteCartRequestObject();
        this.subscriberService.removeFromCart(this.deleteCartRequestObject).subscribe(function (data) { return _this.handleDeleteCartResponse(data); }, function (error) { return _this.handleError(error); });
    };
    ProductViewComponent.prototype.handleDeleteCartResponse = function (data) {
        if (data.STATUS == "OK") {
            this.showAddToCart = 1;
            this.selectedQuantity = 1;
            this.transactionDetailsId = 0;
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.transactionService.transactionArray = data.TRANSACTION;
            this.checkOnlyTransactions();
        }
        this.singleProductPageProcessBar = false;
    };
    //Delete Cart Ends
    //Buy Now
    ProductViewComponent.prototype.buyNow = function () {
        this.buyNowClickedNavigateToCart = 1;
        this.productsDetailObject.buyNowClickedNavigateToCart = true;
        // this.addToCart();
        if (this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP && this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.length > 0) {
            this.openAddonDialog();
        }
        else {
            this.addToCart();
        }
    };
    ProductViewComponent.prototype.makeDropdowns = function (pData) {
        var _this = this;
        var productDetailsObject; //Checklist-3 (Point-1)
        pData.PRODUCT_DETAIL.forEach(function (element) {
            //Checklist-3 (Point-1) from here 
            if (element.PRODUCT_DETAIL_ID == _this.productDetailIdByParam) {
                productDetailsObject = element;
            }
            //Checklist-3 (Point-1) to here
            if (element.PRODUCT_DETAIL_ID == _this.productDetailIdByParam) {
                productDetailsObject = element;
            }
            //Product Size Dropdown 
            if (element.SIZE_LABEL != "" && element.SIZE_LABEL != 'null' && element.SIZE != "" && element.SIZE != 'null') {
                var item = { value: element.SIZE };
                if (_this.sizeDropdownValues.find(function (test) { return test.value === element.SIZE; }) === undefined) {
                    _this.sizeDropdownValues.push(item);
                }
            }
            //Product Size Dropdown Ends
            //Product Color Dropdown 
            if (element.PRODUCT_COLOR_LABEL != ""
                && element.PRODUCT_COLOR_LABEL != 'null'
                && element.PRODUCT_COLOR != ""
                && element.PRODUCT_COLOR != 'null') {
                var item = { value: element.PRODUCT_COLOR };
                if (_this.colorDropdownValues.find(function (test) { return test.value === element.PRODUCT_COLOR; }) === undefined) {
                    _this.colorDropdownValues.push(item);
                }
            }
            //Product Color Dropdown Ends 
            //Product Material Dropdown 
            if (element.MATERIAL_LABEL != "" && element.MATERIAL_LABEL != 'null' && element.MATERIAL != 'null' && element.MATERIAL != "") {
                var item = { value: element.MATERIAL };
                if (_this.materialDropdownValues.find(function (test) { return test.value === element.MATERIAL; }) === undefined) {
                    _this.materialDropdownValues.push(item);
                }
            }
            //Product Material Dropdown Ends
        });
        // Checklist-3(Point-1) from here 
        // if(this.sizeDropdownValues.length > 0 ) this.selectedSize = this.sizeDropdownValues[0].value;
        // if(this.colorDropdownValues.length > 0 ) this.selectedColor = this.colorDropdownValues[0].value;
        // if(this.materialDropdownValues.length > 0 ) this.selectedMaterial = this.materialDropdownValues[0].value;
        if (this.sizeDropdownValues.length > 0)
            this.selectedSize = productDetailsObject.SIZE;
        // if(this.colorDropdownValues.length > 0 )      this.selectedColor        = productDetailsObject.PRODUCT_COLOR;
        this.makeColorDropdowns();
        // if(this.materialDropdownValues.length > 0 )   this.selectedMaterial     = productDetailsObject.MATERIAL;
        this.makeMaterialDropdowns();
        // Checklist-3(Point-1) to here 
        this.getProductDetailsBasedOnColorSizeMaterialCombination();
    };
    // variant logic changes from here 
    ProductViewComponent.prototype.makeColorDropdowns = function () {
        var _this = this;
        var lProductDetailsObject; //Checklist-3 (Point-1)
        this.colorDropdownValues = [];
        this.productObject.PRODUCT_DETAIL.forEach(function (element) {
            if (element.PRODUCT_DETAIL_ID == _this.productDetailIdByParam) {
                lProductDetailsObject = element;
            }
            //Product Color Dropdown 
            if (_this.selectedSize == element.SIZE
                && element.PRODUCT_COLOR_LABEL != ""
                && element.PRODUCT_COLOR_LABEL != 'null'
                && element.PRODUCT_COLOR != ""
                && element.PRODUCT_COLOR != 'null') {
                var item = { value: element.PRODUCT_COLOR };
                if (_this.colorDropdownValues.find(function (test) { return test.value === element.PRODUCT_COLOR; }) === undefined) {
                    _this.colorDropdownValues.push(item);
                }
            }
            //Product Color Dropdown Ends   
        });
        if (this.colorDropdownValues.length > 0)
            this.selectedColor = this.colorDropdownValues[0].value;
        this.getProductDetailsBasedOnColorSizeMaterialCombination();
    };
    ProductViewComponent.prototype.makeMaterialDropdowns = function () {
        var _this = this;
        var lProductDetailsObject; //Checklist-3 (Point-1)
        this.materialDropdownValues = [];
        this.productObject.PRODUCT_DETAIL.forEach(function (element) {
            if (element.PRODUCT_DETAIL_ID == _this.productDetailIdByParam) {
                lProductDetailsObject = element;
            }
            //Product Color Dropdown 
            if (_this.selectedSize == element.SIZE
                && _this.selectedColor == element.PRODUCT_COLOR
                && element.MATERIAL_LABEL != ""
                && element.MATERIAL_LABEL != 'null'
                && element.MATERIAL != ""
                && element.MATERIAL != 'null') {
                var item = { value: element.MATERIAL };
                if (_this.materialDropdownValues.find(function (test) { return test.value === element.MATERIAL; }) === undefined) {
                    _this.materialDropdownValues.push(item);
                }
            }
            //Product Material Dropdown Ends   
        });
        if (this.materialDropdownValues.length > 0)
            this.selectedMaterial = this.materialDropdownValues[0].value;
        this.getProductDetailsBasedOnColorSizeMaterialCombination();
    };
    // variant logic changes to here  #variantLogic
    //Making Dropdowns Logic ends here
    ProductViewComponent.prototype.checkOnlyTransactions = function () {
        var localTransactionArray = [];
        if (this.transactionService.transactionDetailsArray && this.transactionService.transactionDetailsArray.length > 0) {
            this.transactionService.transactionDetailsArray.forEach(function (element) {
                if (element.TRANSACTION_DETAIL_TYPE_CODE == 1) { //Because we are  also getting Delivery Charge and Convenience fee
                    localTransactionArray.push(element);
                }
            });
        }
        this.transactionService.transactionDetailsArray = [];
        this.transactionService.transactionDetailsArray = localTransactionArray;
        this.refreshCart();
    };
    ProductViewComponent.prototype.refreshCart = function () {
        this.userProfileService.numberOfProductsInCart = this.transactionService.transactionDetailsArray.length;
        if (this.buyNowClickedNavigateToCart == 1)
            this._router.navigate(['/collections/checkout-new']);
    };
    ProductViewComponent.prototype.selectColor = function (color) {
        return color;
    };
    ProductViewComponent.prototype.displayImage = function (image) {
        this.imageUrl = image;
    };
    ProductViewComponent.prototype.displaySocialIconsFunction = function () {
        this.displaySharingIcons = true;
    };
    ProductViewComponent.prototype.hideSocialIconsFunction = function () {
        this.displaySharingIcons = false;
    };
    ProductViewComponent.prototype.estimateDelivery = function () {
        this.pincodeMethods.checkDeliveryLocationPincodeAPIRequestObject.PINCODE = this.pincode;
        this.pincodeMethods.checkDeliveryLocationPincodeAPI();
    };
    ProductViewComponent.prototype.getImageCarouselClassName = function (index) {
        var className = "";
        if (index == 0)
            className = "active";
        return className;
    };
    ProductViewComponent.prototype.getClassName = function (index) {
        var className = "carousel-item";
        if (index == 0)
            className = "carousel-item active";
        return className;
    };
    ProductViewComponent.prototype.getItemClassName = function (index) {
        var className = "item";
        if (index == 0)
            className = "item active";
        return className;
    };
    ProductViewComponent.prototype.getQutClassName = function (index) {
        var className = "carousel-item";
        if (index == 0)
            className = "carousel-item active";
        return className;
    };
    ProductViewComponent.prototype.getProductImageName = function (object) {
        var imageName = "";
        if (object.PRODUCT_DETAIL && object.PRODUCT_DETAIL.PRODUCT_IMAGE[0] && object.PRODUCT_DETAIL.PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH != 'undefined')
            imageName = object.PRODUCT_DETAIL.PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH;
        return imageName;
    };
    ProductViewComponent.prototype.showAddToCartForSlidingProds = function (productObject, index) {
        if (index === void 0) { index = 0; }
        var showAddToCart = true;
        this.transactionService.transactionDetailsArray.forEach(function (transaction) {
            if (productObject.PRODUCT_DETAIL && productObject.PRODUCT_DETAIL.PRODUCT_DETAIL_ID == transaction.PRODUCT_DETAIL_ID) {
                showAddToCart = false;
            }
        });
        return showAddToCart;
    };
    ProductViewComponent.prototype.getSelectedQty = function (productObject, index) {
        if (index === void 0) { index = 0; }
        var selectedQty = 1;
        this.transactionService.transactionDetailsArray.forEach(function (transaction) {
            if (productObject.PRODUCT_DETAIL[index] && productObject.PRODUCT_DETAIL[index].PRODUCT_DETAIL_ID == transaction.PRODUCT_DETAIL_ID) {
                selectedQty = transaction.PRODUCT_QUANTITY;
                //  element.PRODUCT_DETAIL[0].transactionDetailsId = transaction.TRANSACTION_DETAIL_ID;
            }
        });
        return selectedQty;
    };
    ProductViewComponent.prototype.showOutofStock = function (productObject, index) {
        if (index === void 0) { index = 0; }
        var showOutOfStock = false;
        if (productObject.PRODUCT_DETAIL && productObject.PRODUCT_DETAIL.INVENTORY_POLICY == 2 && productObject.PRODUCT_DETAIL.AVAILABLE_QUANTITY <= 0)
            showOutOfStock = true;
        return showOutOfStock;
    };
    ProductViewComponent.prototype.makeAddRelatedProductsToCartRequestObject = function (productObject) {
        var transactionId = 0;
        if (this.commonService.lsTransactionId()) {
            transactionId = +this.commonService.lsTransactionId();
        }
        var productDetailObject = productObject.PRODUCT_DETAIL;
        var transactionDetails = {
            TRANSACTION_DETAIL_ID: this.rTransactionDetailsId,
            TRANSACTION_ID: transactionId,
            PRODUCT_DETAIL_ID: productDetailObject.PRODUCT_DETAIL_ID,
            PRODUCT_NAME: productObject.PRODUCT_NAME,
            PRODUCT_PRICE: productDetailObject.PRODUCT_PRICE,
            PRODUCT_FINAL_PRICE: productDetailObject.PRODUCT_FINAL_PRICE,
            PRODUCT_DISCOUNT_ID: productDetailObject.PRODUCT_DISCOUNT_ID,
            PRODUCT_DISCOUNT_AMOUNT: productDetailObject.PRODUCT_DISCOUNT_AMOUNT,
            PRODUCT_GST_PERCENTAGE: productDetailObject.PRODUCT_GST_PERCENTAGE,
            PRODUCT_GST_AMOUNT: productDetailObject.PRODUCT_GST_AMOUNT,
            PRODUCT_GST_ID: productDetailObject.PRODUCT_GST_ID,
            PRODUCT_GST_STATUS: productDetailObject.PRODUCT_GST_STATUS,
            PRODUCT_QUANTITY: 1,
            PRODUCT_MULTI_FLAG: productDetailObject.PRODUCT_MULTI_FLAG,
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_DETAIL_TYPE_CODE: 1
        };
        var addToCartObject = {
            SUBSCRIBER_ID: +this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_ID: transactionId,
            TRANSACTION_DETAIL: transactionDetails
        };
        this.addRelatedProductsToCartRequestObject = addToCartObject;
    };
    ProductViewComponent.prototype.addRelatedProductsToCart = function (productObject, rowIndex, prodIndex) {
        var _this = this;
        this.relatedProducts[rowIndex][prodIndex].progressBar = true;
        this.makeAddRelatedProductsToCartRequestObject(productObject);
        this.subscriberService.addToCart(this.addRelatedProductsToCartRequestObject)
            .subscribe(function (data) { return _this.handleAddRelatedProductsToCartResponse(data, rowIndex, prodIndex); }, function (error) { return _this.handleError(error); });
    };
    ProductViewComponent.prototype.handleAddRelatedProductsToCartResponse = function (data, rowIndex, prodIndex) {
        if (data.STATUS == "OK") {
            this.relatedProducts[rowIndex][prodIndex].showAddToCart = 0;
            if (this.transactionService.transactionDetailsArray.length > 0) {
                this.commonService.addTransactionIdTols();
            }
            this.putTransactionDetailsIdInProductDetailsArray(rowIndex, prodIndex, data.TRANSACTION[0].TRANSACTION_DETAIL);
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.transactionService.transactionArray = data.TRANSACTION;
            this.checkOnlyTransactions();
            this.relatedProducts[rowIndex][prodIndex].progressBar = false;
        }
    };
    ProductViewComponent.prototype.putTransactionDetailsIdInProductDetailsArray = function (rowIndex, prodIndex, transactionArray) {
        var _this = this;
        var productDetailsId = this.relatedProducts[rowIndex][prodIndex].PRODUCT_DETAIL.PRODUCT_DETAIL_ID;
        transactionArray.forEach(function (element) {
            if (productDetailsId == element.PRODUCT_DETAIL_ID) {
                _this.relatedProducts[rowIndex][prodIndex].PRODUCT_DETAIL.transactionDetailsId = element.TRANSACTION_DETAIL_ID;
            }
        });
    };
    ProductViewComponent.prototype.makeUpdateCartRelatedProductsRequestObject = function (productObject, selectedQty) {
        var transactionDetails = {
            TRANSACTION_DETAIL_ID: productObject.PRODUCT_DETAIL.transactionDetailsId,
            PRODUCT_QUANTITY: selectedQty
        };
        var addToCartObject = {
            SUBSCRIBER_ID: +this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_ID: this.transactionService.transactionArray[0].TRANSACTION_ID,
            TRANSACTION_DETAIL: transactionDetails
        };
        this.updateCartRelatedProductsRequestObject = addToCartObject;
    };
    ProductViewComponent.prototype.updateRelatedProducts = function (productObject, rowIndex, prodIndex, selectedQty, method) {
        var _this = this;
        this.relatedProducts[rowIndex][prodIndex].progressBar = true;
        if (method == 1) {
            selectedQty = selectedQty + 1;
        }
        else {
            selectedQty = selectedQty - 1;
        }
        if (selectedQty == 0) {
            // this.deleteCart(productObject.PRODUCT_DETAIL[0].transactionDetailsId, allBannersIndex, productBannerArrayIndex, productsArrayIndex, productArrayIndex);
        }
        else {
            this.makeUpdateCartRelatedProductsRequestObject(productObject, selectedQty);
            this.subscriberService.updateCart(this.updateCartRelatedProductsRequestObject)
                .subscribe(function (data) { return _this.handleUpdateRelatedProductsResponse(data, rowIndex, prodIndex, selectedQty); }, function (error) { return _this.handleError(error); });
        }
    };
    ProductViewComponent.prototype.handleUpdateRelatedProductsResponse = function (data, rowIndex, prodIndex, selectedQty) {
        if (data.STATUS == "OK") {
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.transactionService.transactionArray = data.TRANSACTION;
            this.relatedProducts[rowIndex][prodIndex].selectedQuantity = selectedQty;
            this.checkOnlyTransactions();
        }
        this.relatedProducts[rowIndex][prodIndex].progressBar = false;
    };
    //Update related products  Ends
    ProductViewComponent.prototype.getSelectedQtyOfRelatedProduct = function (productObject, index) {
        if (index === void 0) { index = 0; }
        var selectedQty = 1;
        this.transactionService.transactionDetailsArray.forEach(function (transaction) {
            if (productObject.PRODUCT_DETAIL && productObject.PRODUCT_DETAIL.PRODUCT_DETAIL_ID == transaction.PRODUCT_DETAIL_ID) {
                selectedQty = transaction.PRODUCT_QUANTITY;
                //  element.PRODUCT_DETAIL[0].transactionDetailsId = transaction.TRANSACTION_DETAIL_ID;
            }
        });
        return selectedQty;
    };
    ProductViewComponent = __decorate([
        core_1.Component({
            selector: 'app-product-view',
            templateUrl: './product-view.component.html',
            styleUrls: ['./product-view.component.css']
        })
    ], ProductViewComponent);
    return ProductViewComponent;
}());
exports.ProductViewComponent = ProductViewComponent;
// Dialog One (Variance or AddOns Dialog)
var AddonDialog = /** @class */ (function () {
    function AddonDialog(configService, dialogRef, data, //Prduct Object
    commonService, productMidLayerService, myWishlistService, subscriberService, transactionService, userProfileService, router) {
        this.configService = configService;
        this.dialogRef = dialogRef;
        this.data = data;
        this.commonService = commonService;
        this.productMidLayerService = productMidLayerService;
        this.myWishlistService = myWishlistService;
        this.subscriberService = subscriberService;
        this.transactionService = transactionService;
        this.userProfileService = userProfileService;
        this.router = router;
        this.displayVarianceBox = true;
        this.singleProductPageProcessBar = false;
        this.addd = "";
        this.productsDetailObject = data;
    }
    AddonDialog.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    AddonDialog.prototype.closeDialogue = function () {
        this.dialogRef.close();
    };
    AddonDialog.prototype.gotoNextStep = function () {
        this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.forEach(function (addOnGroup) {
            addOnGroup.NO_OF_ITEMS_SELECTED = 0;
            var productIndex = 0;
            addOnGroup.ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP.forEach(function (addOnProduct) {
                addOnProduct.CHECKED = false; //this is for checkboxes               
                // following is for Radio Button
                if (addOnGroup.IS_MULTI_SELECT == 'false' && productIndex == 0)
                    addOnProduct.CHECKED = true;
                productIndex++;
            });
        });
        this.displayVarianceBox = false;
    };
    AddonDialog.prototype.gotoPreviousStep = function () {
        this.displayVarianceBox = true;
    };
    AddonDialog.prototype.makeAddToCartRequestObject = function () {
        var _this = this;
        var transactionId = 0;
        if (this.commonService.lsTransactionId()) {
            transactionId = +this.commonService.lsTransactionId();
        }
        var productDetailObject = this.productsDetailObject;
        var lAddOnProducts = [];
        if (this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP
            && this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.length > 0) {
            this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.forEach(function (addOnGroup) {
                //this is for radio buttons
                if (addOnGroup.SELECTED_PRODUCT) {
                    var singleAddOnObject = {
                        PRODUCT_DETAIL_ID: addOnGroup.SELECTED_PRODUCT.PRODUCT_DETAIL_ID,
                        PRODUCT_FINAL_PRICE: addOnGroup.SELECTED_PRODUCT.SELLING_PRICE,
                        PRODUCT_NAME: addOnGroup.SELECTED_PRODUCT.PRODUCT_NAME,
                        PRODUCT_PRICE: addOnGroup.SELECTED_PRODUCT.SELLING_PRICE,
                        PRODUCT_QUANTITY: 1,
                        STORE_ID: _this.configService.getStoreID(),
                        TRANSACTION_DETAIL_TYPE_CODE: ApplicationConstants_1.ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_ADD_ON_PRODUCT,
                        TRANSACTION_ID: transactionId,
                        ADD_ON_PRODUCT_GROUP_ID: addOnGroup.ADD_ON_PRODUCT_GROUP_ID
                    };
                    lAddOnProducts.push(singleAddOnObject);
                }
                if (addOnGroup.ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP
                    && addOnGroup.ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP.length > 0) {
                    addOnGroup.ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP.forEach(function (addOnProduct) {
                        //this is for checkboxes
                        if (addOnProduct.CHECKED && addOnProduct.CHECKED == true) {
                            var singleAddOnObject = {
                                PRODUCT_DETAIL_ID: addOnProduct.PRODUCT_DETAIL_ID,
                                PRODUCT_FINAL_PRICE: addOnProduct.SELLING_PRICE,
                                PRODUCT_NAME: addOnProduct.PRODUCT_NAME,
                                PRODUCT_PRICE: addOnProduct.SELLING_PRICE,
                                PRODUCT_QUANTITY: 1,
                                STORE_ID: _this.configService.getStoreID(),
                                TRANSACTION_DETAIL_TYPE_CODE: ApplicationConstants_1.ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_ADD_ON_PRODUCT,
                                TRANSACTION_ID: transactionId,
                                ADD_ON_PRODUCT_GROUP_ID: addOnProduct.ADD_ON_PRODUCT_GROUP_ID
                            };
                            lAddOnProducts.push(singleAddOnObject);
                        }
                    });
                }
            });
        }
        var transactionDetails = {
            TRANSACTION_ID: transactionId,
            PRODUCT_DETAIL_ID: productDetailObject.PRODUCT_DETAIL_ID,
            PRODUCT_NAME: this.productsDetailObject.PRODUCT_NAME,
            PRODUCT_PRICE: productDetailObject.PRODUCT_PRICE,
            PRODUCT_FINAL_PRICE: productDetailObject.PRODUCT_FINAL_PRICE,
            PRODUCT_DISCOUNT_ID: productDetailObject.PRODUCT_DISCOUNT_ID,
            PRODUCT_DISCOUNT_AMOUNT: productDetailObject.PRODUCT_DISCOUNT_AMOUNT,
            PRODUCT_GST_PERCENTAGE: productDetailObject.PRODUCT_GST_PERCENTAGE,
            PRODUCT_GST_AMOUNT: productDetailObject.PRODUCT_GST_AMOUNT,
            PRODUCT_GST_ID: productDetailObject.PRODUCT_GST_ID,
            PRODUCT_GST_STATUS: productDetailObject.PRODUCT_GST_STATUS,
            PRODUCT_QUANTITY: 1,
            PRODUCT_MULTI_FLAG: productDetailObject.PRODUCT_MULTI_FLAG,
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_DETAIL_TYPE_CODE: 1,
            ADD_ON_DETAIL: lAddOnProducts
        };
        var addToCartObject = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_ID: transactionId,
            TRANSACTION_DETAIL: transactionDetails
        };
        this.addToCartRequestObject = addToCartObject;
    };
    AddonDialog.prototype.addToCart = function () {
        var _this = this;
        var valid = true;
        valid = this.validateMandatory();
        if (valid) {
            this.closeDialogue();
            this.singleProductPageProcessBar = true;
            this.makeAddToCartRequestObject();
            this.subscriberService.addToCart(this.addToCartRequestObject).subscribe(function (data) { return _this.handleAddToCartResponse(data); }, function (error) { return error; });
        }
    };
    AddonDialog.prototype.handleAddToCartResponse = function (data) {
        if (data.STATUS == "OK") {
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.transactionService.transactionArray = data.TRANSACTION;
            this.putTransactionDetailsIdInProductDetailsArray(data.TRANSACTION[0].TRANSACTION_DETAIL);
            this.checkOnlyTransactions();
            if (data.TRANSACTION[0].TRANSACTION_DETAIL[0].TRANSACTION_ID > 0) {
                this.commonService.addTransactionIdTols();
            }
            console.log("this.productsDetailObject", this.productsDetailObject);
            // this is when called from buy now 
            if (this.productsDetailObject.buyNowClickedNavigateToCart) {
                this.productsDetailObject.buyNowClickedNavigateToCart = false;
                this.singleProductPageProcessBar = false;
                this.router.navigate(['/collections/checkout-new']);
            }
        }
        this.singleProductPageProcessBar = false;
    };
    AddonDialog.prototype.validateMandatory = function () {
        var _this = this;
        var valid = true;
        if (this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP
            && this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.length > 0) {
            var index = 1;
            this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.forEach(function (addOnGroup) {
                if (addOnGroup.IS_MANDATORY == 'true') {
                    if (addOnGroup.IS_MULTI_SELECT == 'true') {
                        if (addOnGroup.NO_OF_ITEMS_SELECTED == undefined || addOnGroup.NO_OF_ITEMS_SELECTED == 0)
                            valid = false;
                    }
                    else {
                        if (addOnGroup.SELECTED_PRODUCT == undefined || addOnGroup.SELECTED_PRODUCT == '')
                            valid = false;
                    }
                    if (!valid)
                        _this.commonService.openAlertBar("Please choose required addons.");
                }
            });
        }
        return valid;
    };
    AddonDialog.prototype.checkOnlyTransactions = function () {
        var localTransactionArray = [];
        if (this.transactionService.transactionDetailsArray && this.transactionService.transactionDetailsArray.length > 0) {
            this.transactionService.transactionDetailsArray.forEach(function (element) {
                if (element.TRANSACTION_DETAIL_TYPE_CODE == 1) { //Because we are  also getting Delivery Charge and Convenience fee
                    localTransactionArray.push(element);
                }
            });
        }
        this.transactionService.transactionDetailsArray = [];
        this.transactionService.transactionDetailsArray = localTransactionArray;
        this.refreshCart();
    };
    AddonDialog.prototype.refreshCart = function () {
        this.userProfileService.numberOfProductsInCart = this.transactionService.transactionDetailsArray.length;
    };
    AddonDialog.prototype.makeUpdateCartRequestObject = function (selectedQty) {
        var _this = this;
        var transactionDetailId = 0;
        this.transactionService.transactionDetailsArray.forEach(function (element) {
            if (element.PRODUCT_DETAIL_ID == _this.productsDetailObject.PRODUCT_DETAIL_ID)
                transactionDetailId = element.TRANSACTION_DETAIL_ID;
        });
        var transactionDetails = {
            TRANSACTION_DETAIL_ID: transactionDetailId,
            PRODUCT_QUANTITY: selectedQty
        };
        var tempObj = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_ID: this.commonService.lsTransactionId(),
            TRANSACTION_DETAIL: transactionDetails
        };
        this.updateCartRequestObject = tempObj;
    };
    AddonDialog.prototype.updateCart = function (selectedQty, method) {
        var _this = this;
        this.closeDialogue();
        var valid = true;
        if (valid) {
            this.singleProductPageProcessBar = true;
            if (method == 1) {
                selectedQty = selectedQty + 1;
            }
            else {
                selectedQty = selectedQty - 1;
            }
            if (selectedQty == 0) {
                this.deleteCart();
            }
            else {
                this.makeUpdateCartRequestObject(selectedQty);
                this.subscriberService.updateCart(this.updateCartRequestObject).subscribe(function (data) { return _this.handleUpdateCartResponse(data, selectedQty); }, function (error) { return error; });
            }
        }
    };
    AddonDialog.prototype.handleUpdateCartResponse = function (data, selectedQty) {
        if (data.STATUS == "OK") {
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.transactionService.transactionArray = data.TRANSACTION;
            this.checkOnlyTransactions();
        }
        this.singleProductPageProcessBar = false;
    };
    AddonDialog.prototype.makeDeleteCartRequestObject = function () {
        var _this = this;
        var transactionDetailId = 0;
        this.transactionService.transactionDetailsArray.forEach(function (element) {
            if (element.PRODUCT_DETAIL_ID == _this.productsDetailObject.PRODUCT_DETAIL_ID)
                transactionDetailId = element.TRANSACTION_DETAIL_ID;
        });
        var transactionDetails = {
            TRANSACTION_DETAIL_ID: transactionDetailId
        };
        var addToCartObject = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_ID: this.commonService.lsTransactionId(),
            TRANSACTION_DETAIL: transactionDetails
        };
        this.deleteCartRequestObject = addToCartObject;
    };
    AddonDialog.prototype.deleteCart = function () {
        var _this = this;
        this.singleProductPageProcessBar = true;
        this.makeDeleteCartRequestObject();
        this.subscriberService.removeFromCart(this.deleteCartRequestObject).subscribe(function (data) { return _this.handleDeleteCartResponse(data); }, function (error) { return error; });
    };
    AddonDialog.prototype.handleDeleteCartResponse = function (data) {
        if (data.STATUS == "OK") {
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.transactionService.transactionArray = data.TRANSACTION;
            this.checkOnlyTransactions();
        }
        this.singleProductPageProcessBar = false;
    };
    //Delete Cart Ends
    AddonDialog.prototype.putTransactionDetailsIdInProductDetailsArray = function (transactionArray) {
        var _this = this;
        transactionArray.forEach(function (element) {
            if (_this.productsDetailObject.PRODUCT_DETAIL_ID == element.PRODUCT_DETAIL_ID) {
                _this.productsDetailObject.transactionDetailsId = element.TRANSACTION_DETAIL_ID;
            }
        });
    };
    AddonDialog.prototype.selectionCount = function (productObject, groupIndex) {
        if (productObject.CHECKED) {
            this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP[groupIndex].NO_OF_ITEMS_SELECTED++;
        }
        else {
            this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP[groupIndex].NO_OF_ITEMS_SELECTED--;
        }
    };
    AddonDialog.prototype.checkRadioButton = function (productObject, groupIndex, productIndex) {
        console.log("checkRadioButton");
        // make all the values to false 
        this.productsDetailObject
            .ADD_ON_PRODUCT_GROUP_MAP[groupIndex]
            .ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP
            .forEach(function (element) {
            element.CHECKED = false;
        });
        this.productsDetailObject
            .ADD_ON_PRODUCT_GROUP_MAP[groupIndex]
            .ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP[productIndex]
            .CHECKED = !productObject.CHECKED;
    };
    AddonDialog = __decorate([
        core_1.Component({
            selector: 'addon-dialog',
            templateUrl: './addon-dialog.html'
        }),
        __param(2, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], AddonDialog);
    return AddonDialog;
}());
exports.AddonDialog = AddonDialog;
// Dialog One Ends Here (Variance or AddOns Dialog)
