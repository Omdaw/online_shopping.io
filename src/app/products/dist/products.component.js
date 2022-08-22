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
exports.CustomizationConfirmationDialog = exports.VarianceDialog = exports.ProductsComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var ApplicationConstants_1 = require("src/ApplicationConstants");
var ProductsComponent = /** @class */ (function () {
    function ProductsComponent(productMidLayerService, transactionService, FetchingproductsService, flagsService, myWishlistService, commonService, bannerService) {
        this.productMidLayerService = productMidLayerService;
        this.transactionService = transactionService;
        this.FetchingproductsService = FetchingproductsService;
        this.flagsService = flagsService;
        this.myWishlistService = myWishlistService;
        this.commonService = commonService;
        this.bannerService = bannerService;
        this.callFromScroll = 0;
        this.throttle = 300;
        this.scrollDistance = 1;
        this.scrollUpDistance = 2;
        this.selectedSortByReferenceCode = 0;
    }
    ProductsComponent.prototype.ngOnInit = function () {
        // localStorage.setItem("showBotViewCart","true");
        localStorage.setItem("categoryIdKey", "1");
        localStorage.setItem("subCategoryIdKey", "1");
        this.flagsService.showSearch();
        this.flagsService.showHeaderFooter();
        if (window.innerWidth < 600) {
            this.flagsService.hideFooter();
        }
        window.scroll(0, 0);
        this.flagsService.resetFlags();
        this.transactionService.updateTransactionIfCheckOutApiIsCalled();
        this.myWishlistService.fetchMyWishList();
    };
    ProductsComponent.prototype.ngOnDestroy = function () {
        // localStorage.setItem("showBotViewCart","false");
        localStorage.setItem("categoryIdKey", "0");
        localStorage.setItem("subCategoryIdKey", "0");
    };
    ProductsComponent.prototype.onScrollDown = function (ev) {
        var tempOffset = this.FetchingproductsService.productOffset;
        if (tempOffset == 0)
            tempOffset = this.FetchingproductsService.productLimit;
        if (this.productMidLayerService.productsArray.length == tempOffset) {
            this.FetchingproductsService.callFromScroll = 1;
            // if(this.isFilterSelected()) {
            //   this.fetchFilteredProducts()
            // }else{
            this.FetchingproductsService.fetchProductsOnScroll();
            // }
        }
    };
    ProductsComponent.prototype.updateSelectedFilter = function (sortByReferenceCode) {
        this.selectedSortByReferenceCode = sortByReferenceCode;
    };
    ProductsComponent.prototype.getSortByClassName = function (sortByReferenceCode) {
        var className = "";
        if (sortByReferenceCode == this.selectedSortByReferenceCode)
            className = "selectedSortBy";
        return className;
    };
    ProductsComponent.prototype.getSizeDropdown = function (pData) {
        var sizeDropdownValues = [];
        var selectedSize = '';
        pData.PRODUCT_DETAIL.forEach(function (element) {
            var tempObj = {
                productDetailsId: element.PRODUCT_DETAIL_ID,
                size: element.SIZE
            };
            if (sizeDropdownValues.find(function (tempObj) { return tempObj.size === element.SIZE; }) === undefined) {
                if (element.SIZE != '' && element.SIZE != 'null')
                    sizeDropdownValues.push(tempObj);
            }
        });
        if (sizeDropdownValues.length > 0 && selectedSize == '')
            selectedSize = sizeDropdownValues[0].value;
        return sizeDropdownValues;
    };
    ProductsComponent.prototype.onsortbychange = function () {
        this.productMidLayerService.onFilterSelectionChangeSortBy(this.sortby.REFERENCE_CODE_NAME, this.sortby.REFERENCE_CODE_LABEL);
    };
    ProductsComponent.prototype.isThisMobile = function () {
        return (window.innerWidth <= 600);
    };
    ProductsComponent = __decorate([
        core_1.Component({
            selector: 'app-products',
            templateUrl: './products.component.html',
            styleUrls: ['./products.component.css']
        })
    ], ProductsComponent);
    return ProductsComponent;
}());
exports.ProductsComponent = ProductsComponent;
// Products ts Ends here 
// Dialog One (Variance or AddOns Dialog)
var VarianceDialog = /** @class */ (function () {
    function VarianceDialog(configService, dialogRef, data, //Prduct Object
    commonService, productMidLayerService, myWishlistService, subscriberService, transactionService, userProfileService) {
        this.configService = configService;
        this.dialogRef = dialogRef;
        this.data = data;
        this.commonService = commonService;
        this.productMidLayerService = productMidLayerService;
        this.myWishlistService = myWishlistService;
        this.subscriberService = subscriberService;
        this.transactionService = transactionService;
        this.userProfileService = userProfileService;
        this.dropdownLabelsObject = {
            SIZE_LABEL: "",
            PRODUCT_COLOR_LABEL: "",
            MATERIAL_LABEL: ""
        };
        this.sizeDropdownValues = [];
        this.colorDropdownValues = [];
        this.materialDropdownValues = [];
        this.selectedSize = "null";
        this.selectedColor = "null";
        this.selectedMaterial = "null";
        this.displayVarianceBox = true;
        this.singleProductPageProcessBar = false;
        this.productObject = data;
        if (data.TRANSACTION_DETAIL != undefined)
            this.transactionDetailObject = data.TRANSACTION_DETAIL; // call from mini cart
        this.makeSizeDropdown();
    }
    VarianceDialog.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    VarianceDialog.prototype.closeDialogue = function () {
        this.dialogRef.close();
    };
    VarianceDialog.prototype.onSizeChange = function (size) {
        this.selectedSize = size;
        this.makeColorDropdown();
    };
    VarianceDialog.prototype.onColorChange = function (size) {
        this.selectedColor = size;
        this.makeMaterialDropdown();
    };
    VarianceDialog.prototype.onMaterialChange = function (size) {
        this.selectedMaterial = size;
    };
    VarianceDialog.prototype.getSizeClassName = function (size) {
        var className = "_2UBURg";
        if (size == this.selectedSize)
            className = "selectedVariant";
        return className;
    };
    VarianceDialog.prototype.getColorClassName = function (size) {
        var className = "_2UBURg";
        if (size == this.selectedColor)
            className = "selectedVariant";
        return className;
    };
    VarianceDialog.prototype.getMaterialClassName = function (size) {
        var className = "_2UBURg";
        if (size == this.selectedMaterial)
            className = "selectedVariant";
        return className;
    };
    // variant logic changes from here 
    VarianceDialog.prototype.makeSizeDropdown = function () {
        var _this = this;
        this.productObject.PRODUCT_DETAIL.forEach(function (element) {
            if (element.SIZE_LABEL != "" && element.SIZE_LABEL != 'null' && element.SIZE != "" && element.SIZE != 'null') {
                _this.dropdownLabelsObject.SIZE_LABEL = element.SIZE_LABEL;
                var item = { value: element.SIZE };
                if (_this.sizeDropdownValues.find(function (test) { return test.value === element.SIZE; }) === undefined) {
                    _this.sizeDropdownValues.push(item);
                }
            }
        });
        if (this.sizeDropdownValues.length > 0) {
            this.selectedSize = this.sizeDropdownValues[0].value;
            if (this.transactionDetailObject != undefined && this.transactionDetailObject.SIZE != 'null')
                this.selectedSize = this.transactionDetailObject.SIZE;
        }
        this.makeColorDropdown();
    };
    VarianceDialog.prototype.makeColorDropdown = function () {
        var _this = this;
        this.colorDropdownValues = [];
        this.productObject.PRODUCT_DETAIL.forEach(function (element) {
            if (_this.selectedSize == element.SIZE
                && element.PRODUCT_COLOR_LABEL != ""
                && element.PRODUCT_COLOR_LABEL != 'null'
                && element.PRODUCT_COLOR != ""
                && element.PRODUCT_COLOR != 'null') {
                _this.dropdownLabelsObject.PRODUCT_COLOR_LABEL = element.PRODUCT_COLOR_LABEL;
                var item = { value: element.PRODUCT_COLOR };
                if (_this.colorDropdownValues.find(function (test) { return test.value === element.PRODUCT_COLOR; }) === undefined) {
                    _this.colorDropdownValues.push(item);
                }
            }
        });
        if (this.colorDropdownValues.length > 0) {
            this.selectedColor = this.colorDropdownValues[0].value;
            if (this.transactionDetailObject != undefined && this.transactionDetailObject.PRODUCT_COLOR != 'null')
                this.selectedColor = this.transactionDetailObject.PRODUCT_COLOR;
        }
        this.makeMaterialDropdown();
    };
    VarianceDialog.prototype.makeMaterialDropdown = function () {
        var _this = this;
        this.materialDropdownValues = [];
        this.productObject.PRODUCT_DETAIL.forEach(function (element) {
            if (_this.selectedSize == element.SIZE
                && _this.selectedColor == element.PRODUCT_COLOR
                && element.MATERIAL_LABEL != ""
                && element.MATERIAL_LABEL != 'null'
                && element.MATERIAL != ""
                && element.MATERIAL != 'null') {
                _this.dropdownLabelsObject.MATERIAL_LABEL = element.MATERIAL_LABEL;
                var item = { value: element.MATERIAL };
                if (_this.materialDropdownValues.find(function (test) { return test.value === element.MATERIAL; }) === undefined) {
                    _this.materialDropdownValues.push(item);
                }
            }
        });
        if (this.materialDropdownValues.length > 0) {
            this.selectedMaterial = this.materialDropdownValues[0].value;
            if (this.transactionDetailObject != undefined && this.transactionDetailObject.MATERIAL != 'null')
                this.selectedMaterial = this.transactionDetailObject.MATERIAL;
        }
        this.getProductDetailsObject();
    };
    VarianceDialog.prototype.getProductDetailsObject = function () {
        var _this = this;
        this.productObject.PRODUCT_DETAIL.forEach(function (element) {
            if (_this.selectedSize == element.SIZE
                && _this.selectedColor == element.PRODUCT_COLOR
                && _this.selectedMaterial == element.MATERIAL) {
                _this.productsDetailObject = element;
            }
        });
    };
    // variant logic changes to here  #variantLogic
    VarianceDialog.prototype.getImageCarouselClassName = function (index) {
        var className = "";
        if (index == 0)
            className = "active";
        return className;
    };
    VarianceDialog.prototype.getClassName = function (index) {
        var className = "carousel-item";
        if (index == 0)
            className = "carousel-item active";
        return className;
    };
    VarianceDialog.prototype.gotoNextStep = function () {
        var _this = this;
        console.log("gotoNextStep()");
        console.log("this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP", this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP);
        console.log("this.transactionDetailObject", this.transactionDetailObject);
        this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.forEach(function (addOnGroup) {
            addOnGroup.NO_OF_ITEMS_SELECTED = 0;
            var productIndex = 0;
            addOnGroup.ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP.forEach(function (addOnProduct) {
                addOnProduct.CHECKED = false; //this is for checkboxes               
                // following is for Radio Button
                // if(addOnGroup.IS_MULTI_SELECT == 'false' && productIndex == 0) addOnGroup.SELECTED_PRODUCT = addOnProduct; 
                // productIndex++;
                // this following is only on clicking on customize from mini cart 
                if (_this.transactionDetailObject != undefined && _this.transactionDetailObject.ADD_ON_DETAIL && _this.transactionDetailObject.ADD_ON_DETAIL.length > 0) {
                    _this.transactionDetailObject.ADD_ON_DETAIL.forEach(function (addOnDetailObject) {
                        // for checkboxes 
                        if (addOnGroup.IS_MULTI_SELECT == 'true' && addOnDetailObject.ADD_ON_PRODUCT_GROUP_ID == addOnGroup.ADD_ON_PRODUCT_GROUP_ID && addOnDetailObject.PRODUCT_DETAIL_ID == addOnProduct.PRODUCT_DETAIL_ID) {
                            addOnProduct.CHECKED = true;
                            addOnGroup.NO_OF_ITEMS_SELECTED++;
                        }
                        console.log("addOnDetailObject.ADD_ON_PRODUCT_GROUP_ID", addOnDetailObject.ADD_ON_PRODUCT_GROUP_ID);
                        //for radio buttons
                        if (addOnGroup.IS_MULTI_SELECT == 'false' && addOnDetailObject.ADD_ON_PRODUCT_GROUP_ID == addOnGroup.ADD_ON_PRODUCT_GROUP_ID && addOnDetailObject.PRODUCT_DETAIL_ID == addOnProduct.PRODUCT_DETAIL_ID) {
                            addOnGroup.SELECTED_PRODUCT = addOnProduct;
                            console.log("addOnGroup.SELECTED_PRODUCT", addOnGroup.SELECTED_PRODUCT);
                        }
                    });
                }
                if (addOnProduct.CHECKED)
                    console.log("addOnProduct", addOnProduct);
            });
        });
        this.displayVarianceBox = false;
    };
    VarianceDialog.prototype.gotoPreviousStep = function () {
        this.displayVarianceBox = true;
    };
    VarianceDialog.prototype.makeAddToCartRequestObject = function () {
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
                                ADD_ON_PRODUCT_GROUP_ID: addOnGroup.ADD_ON_PRODUCT_GROUP_ID
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
    VarianceDialog.prototype.addToCart = function () {
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
    VarianceDialog.prototype.handleAddToCartResponse = function (data) {
        if (data.STATUS == "OK") {
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.transactionService.transactionArray = data.TRANSACTION;
            this.putTransactionDetailsIdInProductDetailsArray(data.TRANSACTION[0].TRANSACTION_DETAIL);
            this.checkOnlyTransactions();
            if (data.TRANSACTION[0].TRANSACTION_DETAIL[0].TRANSACTION_ID > 0) {
                this.commonService.addTransactionIdTols();
            }
        }
        this.singleProductPageProcessBar = false;
    };
    VarianceDialog.prototype.validateMandatory = function () {
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
    VarianceDialog.prototype.checkOnlyTransactions = function () {
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
    VarianceDialog.prototype.refreshCart = function () {
        this.userProfileService.numberOfProductsInCart = this.transactionService.transactionDetailsArray.length;
    };
    VarianceDialog.prototype.makeUpdateCartRequestObject = function (selectedQty) {
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
        if (this.transactionDetailObject != undefined) { // this means this call is from mini cart (for updating addons in the cart )
            var lAddOnProducts_1 = [];
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
                            TRANSACTION_ID: _this.commonService.lsTransactionId(),
                            ADD_ON_PRODUCT_GROUP_ID: addOnGroup.ADD_ON_PRODUCT_GROUP_ID
                        };
                        lAddOnProducts_1.push(singleAddOnObject);
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
                                    TRANSACTION_ID: _this.commonService.lsTransactionId(),
                                    ADD_ON_PRODUCT_GROUP_ID: addOnGroup.ADD_ON_PRODUCT_GROUP_ID
                                };
                                if (addOnProduct.CHECKED == true)
                                    lAddOnProducts_1.push(singleAddOnObject);
                            }
                        });
                    }
                });
            }
            transactionDetails = {
                TRANSACTION_ID: this.commonService.lsTransactionId(),
                TRANSACTION_DETAIL_ID: this.transactionDetailObject.TRANSACTION_DETAIL_ID,
                PRODUCT_DETAIL_ID: this.productsDetailObject.PRODUCT_DETAIL_ID,
                PRODUCT_NAME: this.productsDetailObject.PRODUCT_NAME,
                PRODUCT_PRICE: this.productsDetailObject.PRODUCT_PRICE,
                PRODUCT_FINAL_PRICE: this.productsDetailObject.PRODUCT_FINAL_PRICE,
                PRODUCT_DISCOUNT_ID: this.productsDetailObject.PRODUCT_DISCOUNT_ID,
                PRODUCT_DISCOUNT_AMOUNT: this.productsDetailObject.PRODUCT_DISCOUNT_AMOUNT,
                PRODUCT_GST_PERCENTAGE: this.productsDetailObject.PRODUCT_GST_PERCENTAGE,
                PRODUCT_GST_AMOUNT: this.productsDetailObject.PRODUCT_GST_AMOUNT,
                PRODUCT_GST_ID: this.productsDetailObject.PRODUCT_GST_ID,
                PRODUCT_GST_STATUS: this.productsDetailObject.PRODUCT_GST_STATUS,
                PRODUCT_QUANTITY: this.transactionDetailObject.PRODUCT_QUANTITY,
                PRODUCT_MULTI_FLAG: this.productsDetailObject.PRODUCT_MULTI_FLAG,
                STORE_ID: this.configService.getStoreID(),
                TRANSACTION_DETAIL_TYPE_CODE: 1,
                ADD_ON_DETAIL: lAddOnProducts_1
            };
        }
        var tempObj = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_ID: this.commonService.lsTransactionId(),
            TRANSACTION_DETAIL: transactionDetails
        };
        this.updateCartRequestObject = tempObj;
    };
    VarianceDialog.prototype.updateCart = function (selectedQty, method) {
        var _this = this;
        this.closeDialogue();
        var valid = true;
        if (this.transactionDetailObject != undefined) {
            valid = this.validateMandatory();
        }
        if (valid) {
            this.singleProductPageProcessBar = true;
            if (method == 1) {
                selectedQty = selectedQty + 1;
            }
            else {
                selectedQty = selectedQty - 1;
            }
            if (this.transactionDetailObject != undefined)
                selectedQty = this.transactionDetailObject.PRODUCT_QUANTITY;
            if (selectedQty == 0) {
                this.deleteCart();
            }
            else {
                this.makeUpdateCartRequestObject(selectedQty);
                this.subscriberService.updateCart(this.updateCartRequestObject).subscribe(function (data) { return _this.handleUpdateCartResponse(data, selectedQty); }, function (error) { return error; });
            }
        }
    };
    VarianceDialog.prototype.handleUpdateCartResponse = function (data, selectedQty) {
        if (data.STATUS == "OK") {
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.transactionService.transactionArray = data.TRANSACTION;
            this.checkOnlyTransactions();
        }
        this.singleProductPageProcessBar = false;
    };
    VarianceDialog.prototype.makeDeleteCartRequestObject = function () {
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
    VarianceDialog.prototype.deleteCart = function () {
        var _this = this;
        this.singleProductPageProcessBar = true;
        this.makeDeleteCartRequestObject();
        this.subscriberService.removeFromCart(this.deleteCartRequestObject).subscribe(function (data) { return _this.handleDeleteCartResponse(data); }, function (error) { return error; });
    };
    VarianceDialog.prototype.handleDeleteCartResponse = function (data) {
        if (data.STATUS == "OK") {
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.transactionService.transactionArray = data.TRANSACTION;
            this.checkOnlyTransactions();
        }
        this.singleProductPageProcessBar = false;
    };
    //Delete Cart Ends
    VarianceDialog.prototype.putTransactionDetailsIdInProductDetailsArray = function (transactionArray) {
        var _this = this;
        transactionArray.forEach(function (element) {
            if (_this.productsDetailObject.PRODUCT_DETAIL_ID == element.PRODUCT_DETAIL_ID) {
                _this.productsDetailObject.transactionDetailsId = element.TRANSACTION_DETAIL_ID;
            }
        });
    };
    VarianceDialog.prototype.selectionCount = function (productObject, groupIndex) {
        if (productObject.CHECKED) {
            this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP[groupIndex].NO_OF_ITEMS_SELECTED++;
        }
        else {
            this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP[groupIndex].NO_OF_ITEMS_SELECTED--;
        }
    };
    VarianceDialog.prototype.checkRadioButton = function (productObject, groupIndex, productIndex) {
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
    VarianceDialog.prototype.submit = function () {
        console.log("this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP", this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP);
    };
    VarianceDialog = __decorate([
        core_1.Component({
            selector: 'variance-dialog',
            templateUrl: './variance-dialog.html'
        }),
        __param(2, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], VarianceDialog);
    return VarianceDialog;
}());
exports.VarianceDialog = VarianceDialog;
// Dialog One Ends Here (Variance or AddOns Dialog)
// Dialog One (Variance or AddOns Dialog)
var CustomizationConfirmationDialog = /** @class */ (function () {
    function CustomizationConfirmationDialog(configService, dialogRef, transactionDetailsObject, commonService, productMidLayerService, myWishlistService, subscriberService, transactionService, userProfileService, productService, dialog) {
        this.configService = configService;
        this.dialogRef = dialogRef;
        this.transactionDetailsObject = transactionDetailsObject;
        this.commonService = commonService;
        this.productMidLayerService = productMidLayerService;
        this.myWishlistService = myWishlistService;
        this.subscriberService = subscriberService;
        this.transactionService = transactionService;
        this.userProfileService = userProfileService;
        this.productService = productService;
        this.dialog = dialog;
        // Dialog ends
        this.selectedVarianceAndAddOns = [];
        this.structureVarianceAndAddOnToShow();
    }
    // Dialog
    CustomizationConfirmationDialog.prototype.openVarianceDialog = function (pProductDetail) {
        var dialogRef = this.dialog.open(VarianceDialog, {
            width: '600px',
            data: pProductDetail
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log('The dialog was closed');
        });
    };
    // this function will structure just to display to the user in proper format 
    CustomizationConfirmationDialog.prototype.structureVarianceAndAddOnToShow = function () {
        var _this = this;
        // Variance
        // SIZE
        if (this.transactionDetailsObject.SIZE_LABEL && this.transactionDetailsObject.SIZE_LABEL != 'null' &&
            this.transactionDetailsObject.SIZE && this.transactionDetailsObject.SIZE != 'null') {
            var tempArray = [];
            tempArray.push({ PRODUCT_NAME: this.transactionDetailsObject.SIZE }); // Here i am keeping key as PRODUCT_NAME because in addOns i am using same key so 
            var tempObject = {
                ADD_ON_GROUP_NAME: this.transactionDetailsObject.SIZE_LABEL,
                ADD_ON_PRODUCTS: tempArray
            };
            this.selectedVarianceAndAddOns.push(tempObject);
        }
        // COLOR
        if (this.transactionDetailsObject.PRODUCT_COLOR_LABEL && this.transactionDetailsObject.PRODUCT_COLOR_LABEL != 'null' &&
            this.transactionDetailsObject.PRODUCT_COLOR && this.transactionDetailsObject.PRODUCT_COLOR != 'null') {
            var tempArray = [];
            tempArray.push({ PRODUCT_NAME: this.transactionDetailsObject.PRODUCT_COLOR }); // Here i am keeping key as PRODUCT_NAME because in addOns i am using same key so 
            var tempObject = {
                ADD_ON_GROUP_NAME: this.transactionDetailsObject.PRODUCT_COLOR_LABEL,
                ADD_ON_PRODUCTS: tempArray
            };
            this.selectedVarianceAndAddOns.push(tempObject);
        }
        // MATERIAL
        if (this.transactionDetailsObject.MATERIAL_LABEL && this.transactionDetailsObject.MATERIAL_LABEL != 'null' &&
            this.transactionDetailsObject.MATERIAL && this.transactionDetailsObject.MATERIAL != 'null') {
            var tempArray = [];
            tempArray.push({ PRODUCT_NAME: this.transactionDetailsObject.MATERIAL }); // Here i am keeping key as PRODUCT_NAME because in addOns i am using same key so 
            var tempObject = {
                ADD_ON_GROUP_NAME: this.transactionDetailsObject.MATERIAL_LABEL,
                ADD_ON_PRODUCTS: tempArray
            };
            this.selectedVarianceAndAddOns.push(tempObject);
        }
        // AddOns
        if (this.transactionDetailsObject.ADD_ON_DETAIL && this.transactionDetailsObject.ADD_ON_DETAIL.length > 0) {
            // here i am taking all the groups in one array (without duplicates)
            var lAddOnGroupArray_1 = [];
            this.transactionDetailsObject.ADD_ON_DETAIL.forEach(function (addOnDetail) {
                if (lAddOnGroupArray_1.indexOf(addOnDetail.ADD_ON_PRODUCT_GROUP_NAME) == -1) { // this will prevent duplicates
                    lAddOnGroupArray_1.push(addOnDetail.ADD_ON_PRODUCT_GROUP_NAME);
                }
            });
            if (lAddOnGroupArray_1.length > 0) {
                // here i am looping all the addon group names and taking products speicfic to that from transaction details array 
                lAddOnGroupArray_1.forEach(function (element) {
                    var addOnProducts = [];
                    _this.transactionDetailsObject.ADD_ON_DETAIL.forEach(function (addOnDetail) {
                        var addOnGroupName = addOnDetail.ADD_ON_PRODUCT_GROUP_NAME;
                        if (addOnGroupName == element) {
                            addOnProducts.push(addOnDetail);
                        }
                    });
                    var tempObject = {
                        ADD_ON_GROUP_NAME: element,
                        ADD_ON_PRODUCTS: addOnProducts
                    };
                    _this.selectedVarianceAndAddOns.push(tempObject);
                });
            }
        }
    };
    CustomizationConfirmationDialog.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    CustomizationConfirmationDialog.prototype.closeDialogue = function () {
        this.dialogRef.close();
    };
    CustomizationConfirmationDialog.prototype.makeUpdateCartRequestObject = function () {
        var transactionDetails = {
            TRANSACTION_DETAIL_ID: this.transactionDetailsObject.TRANSACTION_DETAIL_ID,
            PRODUCT_QUANTITY: this.transactionDetailsObject.PRODUCT_QUANTITY + 1
        };
        var tempObj = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_ID: this.commonService.lsTransactionId(),
            TRANSACTION_DETAIL: transactionDetails
        };
        this.updateCartRequestObject = tempObj;
    };
    CustomizationConfirmationDialog.prototype.updateCart = function () {
        var _this = this;
        this.closeDialogue();
        this.makeUpdateCartRequestObject();
        this.subscriberService.updateCart(this.updateCartRequestObject)
            .subscribe(function (data) { return _this.handleUpdateCartResponse(data); }, function (error) { return error; });
    };
    CustomizationConfirmationDialog.prototype.handleUpdateCartResponse = function (data) {
        if (data.STATUS == "OK") {
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.transactionService.transactionArray = data.TRANSACTION;
            this.productMidLayerService.checkOnlyTransactions();
        }
    };
    //Update Cart Ends
    CustomizationConfirmationDialog.prototype.fetchProduct = function () {
        var _this = this;
        this.closeDialogue();
        var requestObject = {
            STORE_ID: this.configService.getStoreID(),
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            PRODUCT_ID: this.transactionDetailsObject.PRODUCT_ID
        };
        this.productService.fetchProductByProductId(requestObject).subscribe(function (data) { return _this.handleFetchProduct(data); }, function (error) { return error; });
    };
    CustomizationConfirmationDialog.prototype.handleFetchProduct = function (pData) {
        if (pData.STATUS == "OK") {
            var productArray = pData.PRODUCT;
            this.openVarianceDialog(productArray[0]);
        }
    };
    CustomizationConfirmationDialog = __decorate([
        core_1.Component({
            selector: 'customization-confirmation-dialog',
            templateUrl: './customization-confirmation-popup.html'
        }),
        __param(2, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], CustomizationConfirmationDialog);
    return CustomizationConfirmationDialog;
}());
exports.CustomizationConfirmationDialog = CustomizationConfirmationDialog;
// Dialog One Ends Here (Variance or AddOns Dialog)
