import { CommonService } from './../common.service';
import { Component, OnInit, Inject } from '@angular/core';
import { ProductsMidLayerService } from '../products-mid-layer.service';
import { TransactionsService } from '../transactions.service';
import { FetchingproductsService } from '../fetchingproducts.service';
import { FlagsService } from '../flags.service';
import { MyWishlistService } from '../my-wishlist.service';
import { BannerService } from '../banner.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfigService } from '../config.service';
import { SubscriberService } from '../subscriber.service';
import { UserProfileService } from '../user-profile.service';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { ProductService } from '../product.service';
import { ViewProductComponent } from '../view-product/view-product.component';

export interface iAddOnProduct {
  TRANSACTION_DETAIL_ID?: number,
  TRANSACTION_ID: number,
  STORE_ID: number,
  PRODUCT_DETAIL_ID: number,
  PRODUCT_NAME: string,
  PRODUCT_PRICE: number,
  PRODUCT_FINAL_PRICE: number,
  PRODUCT_QUANTITY: number,
  TRANSACTION_DETAIL_TYPE_CODE: number,
  ADD_ON_PRODUCT_GROUP_ID: number,
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(
    public productMidLayerService: ProductsMidLayerService,
    public transactionService: TransactionsService,
    public FetchingproductsService: FetchingproductsService,
    public flagsService: FlagsService,
    public myWishlistService: MyWishlistService,
    public commonService: CommonService,
    public bannerService: BannerService,
  ) { }

  ngOnInit() {
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
    this.transactionService.cancelDeliverySlot();
  }

  ngOnDestroy() {
    // localStorage.setItem("showBotViewCart","false");
    localStorage.setItem("categoryIdKey", "0")
    localStorage.setItem("subCategoryIdKey", "0");
  }

  callFromScroll = 0;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  onScrollDown(ev) {

    let tempOffset = this.FetchingproductsService.productOffset;
    if (tempOffset == 0) tempOffset = this.FetchingproductsService.productLimit;
    if (this.productMidLayerService.productsArray.length == tempOffset) {
      this.FetchingproductsService.callFromScroll = 1;

      // if(this.isFilterSelected()) {
      //   this.fetchFilteredProducts()
      // }else{
      this.FetchingproductsService.fetchProductsOnScroll();
      // }
    }
  }
  selectedSortByReferenceCode = 0;
  updateSelectedFilter(sortByReferenceCode) {
    this.selectedSortByReferenceCode = sortByReferenceCode;
  }

  getSortByClassName(sortByReferenceCode) {
    let className = "";
    if (sortByReferenceCode == this.selectedSortByReferenceCode) className = "selectedSortBy";
    return className;
  }


  getSizeDropdown(pData) {

    let sizeDropdownValues = [];
    let selectedSize = '';

    pData.PRODUCT_DETAIL.forEach(element => {
      let tempObj = {
        productDetailsId: element.PRODUCT_DETAIL_ID,
        size: element.SIZE,
      }

      if (sizeDropdownValues.find((tempObj) => tempObj.size === element.SIZE) === undefined) {
        if (element.SIZE != '' && element.SIZE != 'null') sizeDropdownValues.push(tempObj);
      }
    });
    if (sizeDropdownValues.length > 0 && selectedSize == '') selectedSize = sizeDropdownValues[0].value;

    return sizeDropdownValues;
  }

  sortby;
  onsortbychange() {
    this.productMidLayerService.onFilterSelectionChangeSortBy
      (this.sortby.REFERENCE_CODE_NAME, this.sortby.REFERENCE_CODE_LABEL)
  }

  isThisMobile() {
    return (window.innerWidth <= 600);
  }

}
// Products ts Ends here 

// Dialog One (Variance or AddOns Dialog)

@Component({
  selector: 'variance-dialog',
  templateUrl: './variance-dialog.html',
})

export class VarianceDialog {

  constructor(
    private configService                   : ConfigService,
    public dialogRef                        : MatDialogRef<VarianceDialog>,
    @Inject(MAT_DIALOG_DATA) public data    : any, //Prduct Object
    public commonService                    : CommonService,
    public productMidLayerService           : ProductsMidLayerService,
    public myWishlistService                : MyWishlistService,
    public subscriberService                : SubscriberService,
    public transactionService               : TransactionsService,
    public userProfileService               : UserProfileService,
    public dialog                           : MatDialog,
  ) {
    this.productObject = data;
    if (data.TRANSACTION_DETAIL != undefined) this.transactionDetailObject = data.TRANSACTION_DETAIL; // call from mini cart
    this.makeSizeDropdown();
  }

  onNoClick(): void {
    this.dialogRef.close();

  }

  closeDialogue(): void {
    this.dialogRef.close();
  }

  dropdownLabelsObject = {
    SIZE_LABEL: "",
    PRODUCT_COLOR_LABEL: "",
    MATERIAL_LABEL: ""

  };
  sizeDropdownValues = [];
  colorDropdownValues = [];
  materialDropdownValues = [];

  selectedSize = "null";
  selectedColor = "null";
  selectedMaterial = "null";

  transactionDetailObject: any;
  productObject: any;
  productsDetailObject: any;

  onSizeChange(size) {
    this.selectedSize = size;
    this.makeColorDropdown();
  }

  onColorChange(size) {
    this.selectedColor = size;
    this.makeMaterialDropdown();
  }

  onMaterialChange(size) {
    this.selectedMaterial = size;
  }

  getSizeClassName(size) {
    let className = "_2UBURg";
    if (size == this.selectedSize) className = "selectedVariant";
    return className;
  }

  getColorClassName(size) {
    let className = "_2UBURg";
    if (size == this.selectedColor) className = "selectedVariant";
    return className;
  }

  getMaterialClassName(size) {
    let className = "_2UBURg";
    if (size == this.selectedMaterial) className = "selectedVariant";
    return className;
  }

  // variant logic changes from here 
  makeSizeDropdown() {
    this.productObject.PRODUCT_DETAIL.forEach(element => {

      if (element.SIZE_LABEL != "" && element.SIZE_LABEL != 'null' && element.SIZE != "" && element.SIZE != 'null') {
        this.dropdownLabelsObject.SIZE_LABEL = element.SIZE_LABEL;
        let item = { value: element.SIZE };
        if (this.sizeDropdownValues.find((test) => test.value === element.SIZE) === undefined) {
          this.sizeDropdownValues.push(item);
        }

      }

    });

    if (this.sizeDropdownValues.length > 0) {
      this.selectedSize = this.sizeDropdownValues[0].value;
      if (this.transactionDetailObject != undefined && this.transactionDetailObject.SIZE != 'null') this.selectedSize = this.transactionDetailObject.SIZE;
    }

    this.makeColorDropdown();
  }

  makeColorDropdown() {
    this.colorDropdownValues = [];
    this.productObject.PRODUCT_DETAIL.forEach(element => {

      if (this.selectedSize == element.SIZE
        && element.PRODUCT_COLOR_LABEL != ""
        && element.PRODUCT_COLOR_LABEL != 'null'
        && element.PRODUCT_COLOR != ""
        && element.PRODUCT_COLOR != 'null') {
        this.dropdownLabelsObject.PRODUCT_COLOR_LABEL = element.PRODUCT_COLOR_LABEL;
        let item = { value: element.PRODUCT_COLOR };
        if (this.colorDropdownValues.find((test) => test.value === element.PRODUCT_COLOR) === undefined) {
          this.colorDropdownValues.push(item);
        }
      }
    });

    if (this.colorDropdownValues.length > 0) {
      this.selectedColor = this.colorDropdownValues[0].value;
      if (this.transactionDetailObject != undefined && this.transactionDetailObject.PRODUCT_COLOR != 'null') this.selectedColor = this.transactionDetailObject.PRODUCT_COLOR;
    }

    this.makeMaterialDropdown();
  }

  makeMaterialDropdown() {
    this.materialDropdownValues = [];
    this.productObject.PRODUCT_DETAIL.forEach(element => {

      if (
        this.selectedSize == element.SIZE
        && this.selectedColor == element.PRODUCT_COLOR
        && element.MATERIAL_LABEL != ""
        && element.MATERIAL_LABEL != 'null'
        && element.MATERIAL != ""
        && element.MATERIAL != 'null') {
        this.dropdownLabelsObject.MATERIAL_LABEL = element.MATERIAL_LABEL;
        let item = { value: element.MATERIAL };
        if (this.materialDropdownValues.find((test) => test.value === element.MATERIAL) === undefined) {
          this.materialDropdownValues.push(item);
        }
      }
    });

    if (this.materialDropdownValues.length > 0) {
      this.selectedMaterial = this.materialDropdownValues[0].value;
      if (this.transactionDetailObject != undefined && this.transactionDetailObject.MATERIAL != 'null') this.selectedMaterial = this.transactionDetailObject.MATERIAL;
    }
    this.getProductDetailsObject();
  }

  getProductDetailsObject() {
    this.productObject.PRODUCT_DETAIL.forEach(element => {
      if (this.selectedSize == element.SIZE
        && this.selectedColor == element.PRODUCT_COLOR
        && this.selectedMaterial == element.MATERIAL) {
        this.productsDetailObject = element;
      }
    });
  }
  // variant logic changes to here  #variantLogic

  getImageCarouselClassName(index) {
    let className = "";
    if (index == 0) className = "active";
    return className;
  }

  getClassName(index) {
    let className = "carousel-item";
    if (index == 0) className = "carousel-item active"
    return className;
  }

  displayVarianceBox = true;
  gotoNextStep() {
    console.log("gotoNextStep()");
    console.log("this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP", this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP);
    console.log("this.transactionDetailObject", this.transactionDetailObject);

    this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.forEach(addOnGroup => {
      addOnGroup.NO_OF_ITEMS_SELECTED = 0;
      let productIndex = 0;
      addOnGroup.ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP.forEach(addOnProduct => {
        addOnProduct.CHECKED = false; //this is for checkboxes               

        // following is for Radio Button
        // if(addOnGroup.IS_MULTI_SELECT == 'false' && productIndex == 0) addOnGroup.SELECTED_PRODUCT = addOnProduct; 
        // productIndex++;

        // this following is only on clicking on customize from mini cart 
        if (this.transactionDetailObject != undefined && this.transactionDetailObject.ADD_ON_DETAIL && this.transactionDetailObject.ADD_ON_DETAIL.length > 0) {
          this.transactionDetailObject.ADD_ON_DETAIL.forEach(addOnDetailObject => {
            // for checkboxes 
            if (addOnGroup.IS_MULTI_SELECT == 'true' && addOnDetailObject.ADD_ON_PRODUCT_GROUP_ID == addOnGroup.ADD_ON_PRODUCT_GROUP_ID && addOnDetailObject.PRODUCT_DETAIL_ID == addOnProduct.PRODUCT_DETAIL_ID) {
              addOnProduct.CHECKED = true; addOnGroup.NO_OF_ITEMS_SELECTED++;
            }

            console.log("addOnDetailObject.ADD_ON_PRODUCT_GROUP_ID", addOnDetailObject.ADD_ON_PRODUCT_GROUP_ID);

            //for radio buttons
            if (addOnGroup.IS_MULTI_SELECT == 'false' && addOnDetailObject.ADD_ON_PRODUCT_GROUP_ID == addOnGroup.ADD_ON_PRODUCT_GROUP_ID && addOnDetailObject.PRODUCT_DETAIL_ID == addOnProduct.PRODUCT_DETAIL_ID) {
              addOnGroup.SELECTED_PRODUCT = addOnProduct;
              console.log("addOnGroup.SELECTED_PRODUCT", addOnGroup.SELECTED_PRODUCT);
            }


          });
        }
        if (addOnProduct.CHECKED) console.log("addOnProduct", addOnProduct);
      });
    });
    this.displayVarianceBox = false;
  }
  gotoPreviousStep() {
    this.displayVarianceBox = true;
  }

  //Add To Cart
  addToCartRequestObject: any;
  makeAddToCartRequestObject() {

    let transactionId = 0;
    if (this.commonService.lsTransactionId()) { transactionId = + this.commonService.lsTransactionId(); }

    let productDetailObject = this.productsDetailObject;

    let lAddOnProducts = [];
    if (this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP
      && this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.length > 0) {

      this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.forEach(addOnGroup => {

        //this is for radio buttons
        if (addOnGroup.SELECTED_PRODUCT) {
          let singleAddOnObject: iAddOnProduct = {
            PRODUCT_DETAIL_ID: addOnGroup.SELECTED_PRODUCT.PRODUCT_DETAIL_ID,
            PRODUCT_FINAL_PRICE: addOnGroup.SELECTED_PRODUCT.SELLING_PRICE,
            PRODUCT_NAME: addOnGroup.SELECTED_PRODUCT.PRODUCT_NAME,
            PRODUCT_PRICE: addOnGroup.SELECTED_PRODUCT.SELLING_PRICE,
            PRODUCT_QUANTITY: 1,
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_DETAIL_TYPE_CODE: ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_ADD_ON_PRODUCT,
            TRANSACTION_ID: transactionId,
            ADD_ON_PRODUCT_GROUP_ID: addOnGroup.ADD_ON_PRODUCT_GROUP_ID
          }
          lAddOnProducts.push(singleAddOnObject);
        }

        if (addOnGroup.ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP
          && addOnGroup.ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP.length > 0) {
          addOnGroup.ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP.forEach(addOnProduct => {
            //this is for checkboxes
            if (addOnProduct.CHECKED && addOnProduct.CHECKED == true) {
              let singleAddOnObject: iAddOnProduct = {
                PRODUCT_DETAIL_ID: addOnProduct.PRODUCT_DETAIL_ID,
                PRODUCT_FINAL_PRICE: addOnProduct.SELLING_PRICE,
                PRODUCT_NAME: addOnProduct.PRODUCT_NAME,
                PRODUCT_PRICE: addOnProduct.SELLING_PRICE,
                PRODUCT_QUANTITY: 1,
                STORE_ID: this.configService.getStoreID(),
                TRANSACTION_DETAIL_TYPE_CODE: ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_ADD_ON_PRODUCT,
                TRANSACTION_ID: transactionId,
                ADD_ON_PRODUCT_GROUP_ID: addOnGroup.ADD_ON_PRODUCT_GROUP_ID
              }
              lAddOnProducts.push(singleAddOnObject);
            }

          });
        }

      });

    }

    let transactionDetails = {
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
    }

    let addToCartObject = {
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
      TRANSACTION_ID: transactionId,
      TRANSACTION_DETAIL: transactionDetails
    }

    this.addToCartRequestObject = addToCartObject;

  }
  singleProductPageProcessBar = false;
  addToCart() {
    let valid = true;
    valid = this.validateMandatory();
    if (valid) {
      this.closeDialogue();
      this.singleProductPageProcessBar = true;
      this.makeAddToCartRequestObject();
      this.subscriberService.addToCart(this.addToCartRequestObject).subscribe(data => this.handleAddToCartResponse(data), error => error);
    }
  }

  handleAddToCartResponse(data) {
    if (data.STATUS == "OK") {
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;

      this.putTransactionDetailsIdInProductDetailsArray(data.TRANSACTION[0].TRANSACTION_DETAIL)
      this.checkOnlyTransactions();

      if (data.TRANSACTION[0].TRANSACTION_DETAIL[0].TRANSACTION_ID > 0) {
        this.commonService.addTransactionIdTols();
      }
    }
    this.singleProductPageProcessBar = false;
  }

  validateMandatory() {
    let valid = true;
    if (this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP
      && this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.length > 0) {
      let index = 1;
      this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.forEach(addOnGroup => {

        if (addOnGroup.IS_MANDATORY == 'true') {
          if (addOnGroup.IS_MULTI_SELECT == 'true') {
            if (addOnGroup.NO_OF_ITEMS_SELECTED == undefined || addOnGroup.NO_OF_ITEMS_SELECTED == 0) valid = false;
          } else {
            if (addOnGroup.SELECTED_PRODUCT == undefined || addOnGroup.SELECTED_PRODUCT == '') valid = false;
          }
          if (!valid) this.commonService.openAlertBar("Please choose required addons.");
        }

      });
    }
    return valid;
  }

  checkOnlyTransactions() { //This will return only Products 
    let localTransactionArray = [];
    if (this.transactionService.transactionDetailsArray && this.transactionService.transactionDetailsArray.length > 0) {
      this.transactionService.transactionDetailsArray.forEach(element => {
        if (element.TRANSACTION_DETAIL_TYPE_CODE == 1) { //Because we are  also getting Delivery Charge and Convenience fee
          localTransactionArray.push(element);
        }
      });
    }
    this.transactionService.transactionDetailsArray = [];
    this.transactionService.transactionDetailsArray = localTransactionArray;
    this.refreshCart();
  }

  refreshCart() {
    this.userProfileService.numberOfProductsInCart = this.transactionService.transactionDetailsArray.length;
  }

  //Update Cart
  updateCartRequestObject: any;
  makeUpdateCartRequestObject(selectedQty) {

    let transactionDetailId = 0;
    this.transactionService.transactionDetailsArray.forEach(element => {
      if (element.PRODUCT_DETAIL_ID == this.productsDetailObject.PRODUCT_DETAIL_ID) transactionDetailId = element.TRANSACTION_DETAIL_ID;
    });


    let transactionDetails: any = {
      TRANSACTION_DETAIL_ID: transactionDetailId,
      PRODUCT_QUANTITY: selectedQty
    }

    if (this.transactionDetailObject != undefined) {// this means this call is from mini cart (for updating addons in the cart )
      let lAddOnProducts = [];
      if (this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP
        && this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.length > 0) {

        this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP.forEach(addOnGroup => {

          //this is for radio buttons
          if (addOnGroup.SELECTED_PRODUCT) {
            let singleAddOnObject: iAddOnProduct = {
              PRODUCT_DETAIL_ID: addOnGroup.SELECTED_PRODUCT.PRODUCT_DETAIL_ID,
              PRODUCT_FINAL_PRICE: addOnGroup.SELECTED_PRODUCT.SELLING_PRICE,
              PRODUCT_NAME: addOnGroup.SELECTED_PRODUCT.PRODUCT_NAME,
              PRODUCT_PRICE: addOnGroup.SELECTED_PRODUCT.SELLING_PRICE,
              PRODUCT_QUANTITY: 1,
              STORE_ID: this.configService.getStoreID(),
              TRANSACTION_DETAIL_TYPE_CODE: ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_ADD_ON_PRODUCT,
              TRANSACTION_ID: this.commonService.lsTransactionId(),
              ADD_ON_PRODUCT_GROUP_ID: addOnGroup.ADD_ON_PRODUCT_GROUP_ID
            }
            lAddOnProducts.push(singleAddOnObject);
          }

          if (addOnGroup.ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP
            && addOnGroup.ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP.length > 0) {
            addOnGroup.ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP.forEach(addOnProduct => {

              //this is for checkboxes
              if (addOnProduct.CHECKED && addOnProduct.CHECKED == true) {
                let singleAddOnObject: iAddOnProduct = {
                  PRODUCT_DETAIL_ID: addOnProduct.PRODUCT_DETAIL_ID,
                  PRODUCT_FINAL_PRICE: addOnProduct.SELLING_PRICE,
                  PRODUCT_NAME: addOnProduct.PRODUCT_NAME,
                  PRODUCT_PRICE: addOnProduct.SELLING_PRICE,
                  PRODUCT_QUANTITY: 1,
                  STORE_ID: this.configService.getStoreID(),
                  TRANSACTION_DETAIL_TYPE_CODE: ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_ADD_ON_PRODUCT,
                  TRANSACTION_ID: this.commonService.lsTransactionId(),
                  ADD_ON_PRODUCT_GROUP_ID: addOnGroup.ADD_ON_PRODUCT_GROUP_ID
                }
                if (addOnProduct.CHECKED == true) lAddOnProducts.push(singleAddOnObject);
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
        ADD_ON_DETAIL: lAddOnProducts
      }
    }

    let tempObj = {
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
      TRANSACTION_ID: this.commonService.lsTransactionId(),
      TRANSACTION_DETAIL: transactionDetails
    }

    this.updateCartRequestObject = tempObj;

  }

  updateCart(selectedQty, method) {
    this.closeDialogue();
    let valid = true;

    if (this.transactionDetailObject != undefined) {
      valid = this.validateMandatory();
    }

    if (valid) {
      this.singleProductPageProcessBar = true;
      if (method == 1) {
        selectedQty = selectedQty + 1;
      } else {
        selectedQty = selectedQty - 1;
      }

      if (this.transactionDetailObject != undefined) selectedQty = this.transactionDetailObject.PRODUCT_QUANTITY;

      if (selectedQty == 0) {
        this.deleteCart();
      } else {
        this.makeUpdateCartRequestObject(selectedQty)
        this.subscriberService.updateCart(this.updateCartRequestObject).subscribe(data => this.handleUpdateCartResponse(data, selectedQty), error => error)
      }
    }
  }

  handleUpdateCartResponse(data, selectedQty) {
    if (data.STATUS == "OK") {
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.checkOnlyTransactions();
    }
    this.singleProductPageProcessBar = false;
  }
  //Update Cart Ends

  //Delete Cart 
  deleteCartRequestObject: any;
  makeDeleteCartRequestObject() {

    let transactionDetailId = 0;
    this.transactionService.transactionDetailsArray.forEach(element => {
      if (element.PRODUCT_DETAIL_ID == this.productsDetailObject.PRODUCT_DETAIL_ID) transactionDetailId = element.TRANSACTION_DETAIL_ID;
    });

    let transactionDetails = {
      TRANSACTION_DETAIL_ID: transactionDetailId,
    }

    let addToCartObject = {
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
      TRANSACTION_ID: this.commonService.lsTransactionId(),
      TRANSACTION_DETAIL: transactionDetails
    }

    this.deleteCartRequestObject = addToCartObject;

  }

  deleteCart() {
    this.singleProductPageProcessBar = true;
    this.makeDeleteCartRequestObject()

    this.subscriberService.removeFromCart(this.deleteCartRequestObject).subscribe(data => this.handleDeleteCartResponse(data), error => error)
  }

  handleDeleteCartResponse(data) {
    if (data.STATUS == "OK") {
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.checkOnlyTransactions();
    }
    this.singleProductPageProcessBar = false;
  }
  //Delete Cart Ends

  putTransactionDetailsIdInProductDetailsArray(transactionArray) {
    transactionArray.forEach(element => {
      if (this.productsDetailObject.PRODUCT_DETAIL_ID == element.PRODUCT_DETAIL_ID) {
        this.productsDetailObject.transactionDetailsId = element.TRANSACTION_DETAIL_ID;
      }
    });
  }

  selectionCount(productObject, groupIndex) {
    if (productObject.CHECKED) {
      this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP[groupIndex].NO_OF_ITEMS_SELECTED++;
    } else {
      this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP[groupIndex].NO_OF_ITEMS_SELECTED--;
    }
  }

  checkRadioButton(productObject, groupIndex, productIndex) {
    console.log("checkRadioButton");
    // make all the values to false 
    this.productsDetailObject
      .ADD_ON_PRODUCT_GROUP_MAP[groupIndex]
      .ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP
      .forEach(element => {
        element.CHECKED = false;
      });
    this.productsDetailObject
      .ADD_ON_PRODUCT_GROUP_MAP[groupIndex]
      .ADD_ON_PRODUCT_GROUP_PRODUCT_DETAIL_MAP[productIndex]
      .CHECKED = !productObject.CHECKED;

  }

  submit() {
    console.log("this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP", this.productsDetailObject.ADD_ON_PRODUCT_GROUP_MAP);
  }

  //View Product
  openViewProductDialog(productObject): void {
    const dialogRef = this.dialog.open(ViewProductComponent, {
      width: '700px',
      data: productObject
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
    //View Product ends

}
// Dialog One Ends Here (Variance or AddOns Dialog)


// Dialog One (Variance or AddOns Dialog)

@Component({
  selector: 'customization-confirmation-dialog',
  templateUrl: './customization-confirmation-popup.html',
})

export class CustomizationConfirmationDialog {

  constructor(
    private configService: ConfigService,
    public dialogRef: MatDialogRef<VarianceDialog>,
    @Inject(MAT_DIALOG_DATA) public transactionDetailsObject: any,
    public commonService: CommonService,
    public productMidLayerService: ProductsMidLayerService,
    public myWishlistService: MyWishlistService,
    public subscriberService: SubscriberService,
    public transactionService: TransactionsService,
    public userProfileService: UserProfileService,
    public productService: ProductService,
    public dialog: MatDialog,
  ) {
    this.structureVarianceAndAddOnToShow();
  }

  // Dialog
  openVarianceDialog(pProductDetail): void {
    const dialogRef = this.dialog.open(VarianceDialog, {
      width: '600px',
      data: pProductDetail
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  // Dialog ends

  selectedVarianceAndAddOns = [];

  // this function will structure just to display to the user in proper format 
  structureVarianceAndAddOnToShow() {

    // Variance
    // SIZE
    if (
      this.transactionDetailsObject.SIZE_LABEL && this.transactionDetailsObject.SIZE_LABEL != 'null' &&
      this.transactionDetailsObject.SIZE && this.transactionDetailsObject.SIZE != 'null'
    ) {
      let tempArray = [];
      tempArray.push({ PRODUCT_NAME: this.transactionDetailsObject.SIZE }); // Here i am keeping key as PRODUCT_NAME because in addOns i am using same key so 
      let tempObject = {
        ADD_ON_GROUP_NAME: this.transactionDetailsObject.SIZE_LABEL,
        ADD_ON_PRODUCTS: tempArray
      }

      this.selectedVarianceAndAddOns.push(tempObject);
    }
    // COLOR
    if (
      this.transactionDetailsObject.PRODUCT_COLOR_LABEL && this.transactionDetailsObject.PRODUCT_COLOR_LABEL != 'null' &&
      this.transactionDetailsObject.PRODUCT_COLOR && this.transactionDetailsObject.PRODUCT_COLOR != 'null'
    ) {
      let tempArray = [];
      tempArray.push({ PRODUCT_NAME: this.transactionDetailsObject.PRODUCT_COLOR });// Here i am keeping key as PRODUCT_NAME because in addOns i am using same key so 
      let tempObject = {
        ADD_ON_GROUP_NAME: this.transactionDetailsObject.PRODUCT_COLOR_LABEL,
        ADD_ON_PRODUCTS: tempArray
      }

      this.selectedVarianceAndAddOns.push(tempObject);
    }
    // MATERIAL
    if (
      this.transactionDetailsObject.MATERIAL_LABEL && this.transactionDetailsObject.MATERIAL_LABEL != 'null' &&
      this.transactionDetailsObject.MATERIAL && this.transactionDetailsObject.MATERIAL != 'null'
    ) {
      let tempArray = [];
      tempArray.push({ PRODUCT_NAME: this.transactionDetailsObject.MATERIAL });// Here i am keeping key as PRODUCT_NAME because in addOns i am using same key so 
      let tempObject = {
        ADD_ON_GROUP_NAME: this.transactionDetailsObject.MATERIAL_LABEL,
        ADD_ON_PRODUCTS: tempArray
      }

      this.selectedVarianceAndAddOns.push(tempObject);
    }

    // AddOns
    if (this.transactionDetailsObject.ADD_ON_DETAIL && this.transactionDetailsObject.ADD_ON_DETAIL.length > 0) {

      // here i am taking all the groups in one array (without duplicates)
      let lAddOnGroupArray = [];
      this.transactionDetailsObject.ADD_ON_DETAIL.forEach(addOnDetail => {
        if (lAddOnGroupArray.indexOf(addOnDetail.ADD_ON_PRODUCT_GROUP_NAME) == -1) { // this will prevent duplicates
          lAddOnGroupArray.push(addOnDetail.ADD_ON_PRODUCT_GROUP_NAME);
        }
      });

      if (lAddOnGroupArray.length > 0) {
        // here i am looping all the addon group names and taking products speicfic to that from transaction details array 
        lAddOnGroupArray.forEach(element => {

          let addOnProducts = [];
          this.transactionDetailsObject.ADD_ON_DETAIL.forEach(addOnDetail => {

            let addOnGroupName = addOnDetail.ADD_ON_PRODUCT_GROUP_NAME;
            if (addOnGroupName == element) {
              addOnProducts.push(addOnDetail);
            }
          });

          let tempObject = {
            ADD_ON_GROUP_NAME: element,
            ADD_ON_PRODUCTS: addOnProducts
          }

          this.selectedVarianceAndAddOns.push(tempObject);
        });

      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();

  }

  closeDialogue(): void {
    this.dialogRef.close();
  }

  //Update Cart
  updateCartRequestObject: any;
  makeUpdateCartRequestObject() {
    let transactionDetails = {
      TRANSACTION_DETAIL_ID: this.transactionDetailsObject.TRANSACTION_DETAIL_ID,
      PRODUCT_QUANTITY: this.transactionDetailsObject.PRODUCT_QUANTITY + 1,
      // ADD_ON_DETAIL         : this.transactionDetailsObject.ADD_ON_DETAIL
    }

    let tempObj = {
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      STORE_ID: this.configService.getStoreID(),
      TRANSACTION_ID: this.commonService.lsTransactionId(),
      TRANSACTION_DETAIL: transactionDetails
    }

    this.updateCartRequestObject = tempObj;

  }

  updateCart() {
    this.closeDialogue();
    this.makeUpdateCartRequestObject();
    this.subscriberService.updateCart(this.updateCartRequestObject)
      .subscribe(data => this.handleUpdateCartResponse(data), error => error);
  }

  handleUpdateCartResponse(data) {
    if (data.STATUS == "OK") {
      this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
      this.transactionService.transactionArray = data.TRANSACTION;
      this.productMidLayerService.checkOnlyTransactions();
    }
  }
  //Update Cart Ends

  fetchProduct() {
    this.closeDialogue();
    let requestObject = {
      STORE_ID: this.configService.getStoreID(),
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      PRODUCT_ID: this.transactionDetailsObject.PRODUCT_ID
    }
    this.productService.fetchProductByProductId(requestObject).subscribe(data => this.handleFetchProduct(data),
      error => error);
  }

  handleFetchProduct(pData) {
    if (pData.STATUS == "OK") {
      let productArray = pData.PRODUCT;
      this.openVarianceDialog(productArray[0]);
    }
  }

}
// Dialog One Ends Here (Variance or AddOns Dialog)
