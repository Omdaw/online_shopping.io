import { SearchService } from './../search.service';
import { CommonService } from './../common.service';

import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../header.service';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { UserProfileService } from '../user-profile.service';
import { SubscriberService } from '../subscriber.service';
import { TransactionsService } from '../transactions.service';
import { FlagsService } from '../flags.service';
import { WalletMethodsService } from '../wallet-methods.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReferenceMethodsService } from '../reference-methods.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ConfigService } from '../config.service';
import * as $ from 'jquery';
import { ProductsMidLayerService } from '../products-mid-layer.service';

@Component({
  selector: 'app-category-nav',
  templateUrl: './category-nav.component.html',
  styleUrls: ['./category-nav.component.css']
})
export class CategoryNavComponent implements OnInit {

  constructor(private configService: ConfigService,
    private _router: Router,
    private headerService: HeaderService,
    public userProfileService: UserProfileService,
    private subscriberService: SubscriberService,
    public transactionService: TransactionsService,
    public flagsService: FlagsService,
    public walletMethodsService: WalletMethodsService,
    public commonService: CommonService,
    public dialog: MatDialog,
    public referenceMethodsService: ReferenceMethodsService,
    public SearchService: SearchService,
    public productMidLayerService: ProductsMidLayerService,
  ) { }

  // Dialog
  openDialog(): void {
    // this._router.navigate(['/']);
    const dialogRef = this.dialog.open(InviteDialogForMobile, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  // Dialog ends


  //variables
  processBar = false;
  categoriesArray = [];
  mobileCategoriesArray = [];//final checklist
  selectedTopLevelCategory = { SUB_CATEGORY: [] };
  searchText = "";

  hideWAHeader = "";
  // showBotViewCartValue = "";
  ngOnInit() {
    // this.showBotViewCartValue = localStorage.getItem("showBotViewCart");
    this.commonService.hideWAHeader.subscribe(message => {
      this.hideWAHeader = message;
      this.callforVertDrop();
    });

    this.checkSubscriberId();
  }

  // showBotViewCart = false;
  // showBotViewCartFun() {
  //   if (this.showBotViewCartValue == 'true') {
  //     this.showBotViewCart = true;
  //   } else {
  //     this.showBotViewCart = false;
  //   }
  // }

  displayWAHeader = true;
  callforVertDrop() {
    if (this.hideWAHeader == "hideFM") {
      this.displayWAHeader = false;
    }
    else {
      this.displayWAHeader = true;
    }
  }


  isSticky: boolean = false;
  categoriesShadow = "";
  animation="";
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    if (this.flashMessageStatusCode == 1) {
      this.isSticky = window.pageYOffset >= 10;
      if ((window.pageYOffset) >= 10) {
        this.categoriesShadow = "categoriesShadow";
        this.animation="animate__animated animate__slideInDown";
      }
      else {
        this.categoriesShadow = "";
        this.animation="";
      }
    } else {
      this.isSticky = window.pageYOffset >= 2;
      if ((window.pageYOffset) >= 2) {
        this.categoriesShadow = "categoriesShadow";
        this.animation="animate__animated animate__slideInDown";
      }
      else {
        this.categoriesShadow = "";
        this.animation="";
      }
    }

  }

  subscriberId = 0;
  checkSubscriberId() {
    if (this.commonService.lsSubscriberId()) this.subscriberId = + this.commonService.lsSubscriberId();

    if (this.subscriberId == 0) {
      this.temporarySubscriberLogin();
    } else {
      this.loadDefaultMethods();
    }
  }

  loadDefaultMethods() {
    this.fetchCategories();
    this.fetchStore();
  }

  temporarySubscriberLogin() {

    this.subscriberService.tempSubscriberLogin().subscribe(data => this.handleTemporarySubscriberLoginSuccess(data), error => this.handleError(error));
  }

  handleTemporarySubscriberLoginSuccess(data) {
    if (data.STATUS == "OK") {

      let authToken = data.SUBSCRIBER.AUTHENTICATION_TOKEN;
      let subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
      let tempSubscriberFlag = 1;
      let transactionId = 0;
      this.commonService.addStoreData(authToken, subscriberId, tempSubscriberFlag, transactionId);

      this.loadDefaultMethods();
    }
  }

  searchDisplayFlag = true;


  showSubCat(object) {
    this.selectedTopLevelCategory = object;
    if (this.selectedTopLevelCategory.SUB_CATEGORY.length > 0) {
      this.userProfileService.displaySubMenu = true;
    } else {
      this.userProfileService.displaySubMenu = false;
    }
  }


  fetchCategoriesRequest = {};
  makeFetchCategoriesRequestObject() {
    this.fetchCategoriesRequest = {
      STORE_ID: this.configService.getStoreID(),
    }
  }

  fetchCategories() {
    this.processBar = true;
    this.makeFetchCategoriesRequestObject();
    this.headerService.fetchProductCategoryAPI(this.fetchCategoriesRequest)
      .subscribe(data => this.handleFetchCategoriesSuccess(data), error => this.handleError(error));
  }

  moreCategories = [];
  handleFetchCategoriesSuccess(pData) {

    if (pData.STATUS = 'OK') {
      let tempCategoryArray = pData.PRODUCT_CATEGORY;
      this.mobileCategoriesArray = pData.PRODUCT_CATEGORY;
      let maxItemsToShow = this.numberOfItemsToDisplayInMenu(tempCategoryArray);
      let arrayLength = maxItemsToShow;

      if (maxItemsToShow >= tempCategoryArray.length) {
        arrayLength = tempCategoryArray.length;
      } else {
        for (let i = maxItemsToShow; i < tempCategoryArray.length; i++) {
          this.moreCategories.push(tempCategoryArray[i]);
        }
      }

      for (let i = 0; i < arrayLength; i++) {
        this.categoriesArray.push(tempCategoryArray[i]);
      }
      this.makeMobileShowHide();
    }

    // stop the progress bar
    this.processBar = false;
  }


  numberOfItemsToDisplayInMenu(tempCategoryArray) {
    console.log(window.innerWidth);


    let maxCharsWeToShow = 52;
    let numberOfChars = 0;
    let arrayIndex = 1;

    maxCharsWeToShow = this.getMaxCharsForCurrentScreen();

    tempCategoryArray.forEach(element => {
      numberOfChars += element.PRODUCT_CATEGORY_NAME.length;
      if (numberOfChars >= maxCharsWeToShow) return arrayIndex;
      arrayIndex++;
    });
    return arrayIndex;
  }

  getMaxCharsForCurrentScreen() {
    let windowWidth = window.innerWidth;
    if (windowWidth <= 834) return 20;
    if (windowWidth <= 1600) return 54;
    if (windowWidth > 1600) return 62;
  }


  makeMobileShowHide() {

    this.mobileCategoriesArray.forEach(element => {
      element.showHide = 0;
      this.showMobileSubMenu.push(false);
    });
  }

  handleError(error) {
    console.log("Error", error);
  }

  // showMobileSubCategory(i) {
  //   if (this.mobileCategoriesArray[i].showHide == 1) this.mobileCategoriesArray[i].showHide = 0; else this.mobileCategoriesArray[i].showHide = 1;
  // }

  invoiceTotal = 0;
  invoiceAmount = 0;
  invoiceDiscountAmount = 0;
  deliveryCharge = 0;
  convenienceFee = 0;
  gst = 0;

  refreshCartAmountDetail() {
    let data = this.transactionService.transactionArray[0];
    this.invoiceAmount = data.INVOICE_AMOUNT;
    this.invoiceDiscountAmount = data.INVOICE_DISCOUNT_AMOUNT;
    this.invoiceTotal = data.INVOICE_FINAL_AMOUNT;
  }


  //Store Details 
  fetchStoreRequest = {};
  storeDetailsObject = {};
  storeLogo = "";
  storeName = "";
  storeStatusTitleAndDesc = "";
  storeStatusTitle = "";
  storeStatusDesc = "";
  storeStatus = 0;
  storeLogoForMobile = ""
  flashMessage: string;
  flashMessageStatusCode: number;
  makeFetchStoreRequestObject() {
    this.fetchStoreRequest = {
      STORE_ID: this.configService.getStoreID(),
      LATITUDE: 0,
      LONGITUDE: 0,
      COUNTRY_ID: 0,
      STATE_ID: 0,
      CITY_ID: 0,
      AREA_ID: 0,
      // AREA_NAME                : "",
      CLIENT_APP_VERSION_CODE: this.configService.getClientAppVersionCode(),
      CLIENT_APP_VERSION_NAME: this.configService.getClientAppVersionName(),
      BUILD_CONFIGURATION_TYPE: this.configService.getBuildConfigurationType()
    }
  }
  processBarLogo = false;
  fetchStore() {
    this.processBarLogo = true;
    this.makeFetchStoreRequestObject();
    this.headerService.fetchStore(this.fetchStoreRequest).subscribe(data => this.handleFetchStoreResponse(data),
      error => this.handleError(error));
  }

  handleFetchStoreResponse(pData) {
    if (pData.STATUS == "OK") {
      this.storeDetailsObject = pData.STORE[0];

      if (pData.STORE[0].STORE_CHECK_PINCODE_AT_CHECKOUT_FLAG == 1) {
        this.commonService.STORE_CHECK_PINCODE_AT_CHECKOUT_FLAG = true;
      }

      //Required things
      this.storeStatus              = pData.STORE[0].STORE_STATUS_CODE;
      this.storeName                = pData.STORE[0].STORE_NAME;
      this.storeLogo                = pData.STORE[0].STORE_LOGO_URL;
      this.commonService.storeLogo  = pData.STORE[0].STORE_LOGO_URL;
      this.storeLogoForMobile       = pData.STORE[0].MOBILE_LOGO_IMAGE_URL;

      // new-checklist-soln-for-default-logo from here 
      if(this.storeLogo == null || this.storeLogo == "null" || this.storeLogo == ""){
        this.storeLogo                = "assets\logo\Website-Logo-Redone-3.jpeg";
        this.commonService.storeLogo  = "assets\logo\Website-Logo-Redone-3.jpeg";
      }
      if(this.storeLogoForMobile == null || this.storeLogoForMobile == "null" || this.storeLogoForMobile == "") this.storeLogoForMobile       = "assets/images/default/logo.jpg";
      // new-checklist-soln-for-default-logo till here 
      
      // new-checklist-soln-page-title-favicon from here 
      let favIconImage = this.commonService.checkIfNull(pData.STORE[0].STORE_FAV_ICON_IMAGE_URL);
      if(favIconImage == '') favIconImage = "assets\logo\Website-Logo-Redone-3.jpeg"; // new-checklist-soln-for-default-favicon
      $("#faviconLink").attr("href", favIconImage); 
      // new-checklist-soln-page-title-favicon till here 

      document.documentElement.style.setProperty(`--theme-color`, pData.STORE[0].STORE_THEME_HEX_COLOR_CODE); //checklist-2

      this.storeStatusTitleAndDesc = "";
      this.storeStatusTitle = "";
      this.storeStatusDesc = "";
      if (pData.STORE[0].STORE_STATUS_TITLE && pData.STORE[0].STORE_STATUS_TITLE != 'null') this.storeStatusTitle = pData.STORE[0].STORE_STATUS_TITLE;
      if (pData.STORE[0].STORE_STATUS_DESC && pData.STORE[0].STORE_STATUS_DESC != 'null') this.storeStatusDesc    = pData.STORE[0].STORE_STATUS_DESC;

      this.flashMessage = "";
      this.flashMessageStatusCode = 0;

      if (pData.STORE[0].FLASH_MESSAGE && pData.STORE[0].FLASH_MESSAGE != 'null') this.flashMessage = pData.STORE[0].FLASH_MESSAGE;
      if (pData.STORE[0].FLASH_MESSAGE_STATUS_CODE && pData.STORE[0].FLASH_MESSAGE_STATUS_CODE != 'null') this.flashMessageStatusCode = pData.STORE[0].FLASH_MESSAGE_STATUS_CODE;

      // if (pData.STORE[0].STORE_STATUS_TITLE && pData.STORE[0].STORE_STATUS_TITLE != 'null') this.storeStatusTitleAndDesc = pData.STORE[0].STORE_STATUS_TITLE;
      // if (pData.STORE[0].STORE_STATUS_DESC && pData.STORE[0].STORE_STATUS_DESC != 'null') this.storeStatusTitleAndDesc = this.storeStatusTitleAndDesc + " " + pData.STORE[0].STORE_STATUS_DESC;
    }
    this.processBarLogo = false;
  }

  // Hide/Show Mobile Sub Menu
  showMobileSubMenu = [];
  hideMobileSubMenu = [];

  showMobileSubMenuFunction(index) {
    this.showMobileSubMenu.length = 0;
    this.mobileCategoriesArray.forEach(element => {
      this.showMobileSubMenu.push(false);
    });

    this.showMobileSubMenu[index] = true;
  }

  hideMobileSubMenuFunction(index) {
    this.showMobileSubMenu[index] = false;
  }
  // Hide/Show Mobile Sub Menu ends 

  searchProducts() {
    this.showsearch = false;
    if (this.searchText != '') {
      this._router.navigate(['/AllCollections/search', this.searchText]);
      this.SearchService.displaySearch = false;
      this.searchText = "";
    }
  }

  searchCategoryId = 0;
  searchText1 = "";
  searchProductsList() {
    if (this.searchText1 != '') {
      this.hidesearch();
      this._router.navigate(['search', this.searchText1]);
      this.searchText1 = ""; //<!-- Final Checklist -->
    }
  }

  hideClass = "";
  hideClassName() {
    return this.hideClass
  }
  hideDropdownContent() {
    // window.location.reload();
  }

  // selectedCateIndex = -1;
  getClassNameForButton(mainIndex) {
    let className = "";
    if (mainIndex == this.selectedCateIndex) className = "underlineCategory";
    return className;
  }
  addClassName(mainIndex) {
    this.selectedCateIndex = mainIndex;
  }
  removeClassName() {
    this.selectedCateIndex = -1;
  }

  selectedCateIndex = -1;
  getClassForHighlightingSelectedCategory(categoryId: number, rightIndex: number) {
    let classname = "";
    if (categoryId == this.productMidLayerService.productCategoryId) {
      let categoryIdKey = localStorage.getItem("categoryIdKey");
      if (categoryIdKey == "1") {
        classname = "highlightCategory";
      }
      else {
        classname = '';
      }
      return classname;
    }
  }
  selectedSubCateIndex = -1;
  getClassForHighlightingSelectedSubCategory(subCategoryId: number) {
    let classname = "";
    if (subCategoryId == this.productMidLayerService.productCategoryId) {
      let subCategoryIdKey = localStorage.getItem("subCategoryIdKey");
      if (subCategoryIdKey == "1") {
        classname = "highlightSubCategory";
      }
      else {
        classname = '';
      }
      return classname;
    }
  }


  showsearch = false;

  displaysearch() {
    this.showsearch = true;
  }

  hidesearch() {
    this.searchText1 = "";
    this.showsearch = false;
  }

  getMobileBar() {
    let componentName = this.commonService.getComponentName();
    let display = false;
    if (componentName == '/') display = true;
    return display;
  }

  displayMoresSubCategory = false;
  showMoresSubCategory() {
    this.displayMoresSubCategory = true;
  }

  hideMoresSubCategory() {
    this.displayMoresSubCategory = false;
  }

  logout() {

    this.commonService.addTransactionIdTols();
    this.commonService.addSubscriberIdTols(0);
    this.commonService.addTempSubscriberFlagTols(0);
    this.commonService.addLoggedInUsernameTols("");

    if (this.flagsService.inDeliveryPageFlag) {

      this._router.navigate(['/']);
      // window.location.reload();
    } else {
      this._router.navigate(['/']);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }

  }



  getClassName(productCategoryId) {
    let border_bottom = "";
    if (this.commonService.currentPageCategoruId == productCategoryId) border_bottom = "activeli";
    return border_bottom;
  }

  isStoreInTestingMode() {
    let testingFlag = false;
    if (this.storeStatus == ApplicationConstants.STORE_STATUS_CODE_TESTING) testingFlag = true;
    return testingFlag;
  }

  inviteToMyApplication() {
    this.referenceMethodsService.fetchReferralURLBySubscriberId();

  }
  showcategory() {
    let flag = false;
    let componentName = this.commonService.getComponentName();
    let parts = componentName.split("/");
    if (parts[1] == "" || parts[1] == "product" || parts[1] == "product-view" || parts[1] == "banner-products") {
      flag = true;

    }

    return flag;
  }
  hideLogo() {
    let flag = true;
    let componentName = this.commonService.getComponentName();
    let parts = componentName.split("/");
    if (parts[1] == "banner-products") {
      flag = false;

    }

    return flag;
  }
  getClassnameForHighlightingCategory(productCategoryId) {
    let classname = "";
    let componentName = this.commonService.getComponentName();
    let parts = componentName.split("/");
    if (parts[1] == "product") {
      if (productCategoryId == parts[2]) {
        classname = "HighlightCategory";
      }

    }

    return classname;
  }
}


// Dialog Code

export interface DialogData {
  link: string;
}

@Component({
  selector: 'invite-dialog-for-mobile',
  templateUrl: './referel-dialog.html',
})

export class InviteDialogForMobile {


  /* To copy Text from Textbox */
  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.commonService.notifySuccessMessage(this.flashMessagesService, "Copied");
  }




  constructor(private configService: ConfigService,
    public dialogRef: MatDialogRef<InviteDialogForMobile>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public referenceMethodsService: ReferenceMethodsService,
    public flashMessagesService: FlashMessagesService,
    public commonService: CommonService,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();

  }

  closeDialogue(): void {
    this.dialogRef.close();
  }

  copyLink() {
    this.commonService.notifySuccessMessage(this.flashMessagesService, "Copied");
  }

}

    // Dialog Code ends