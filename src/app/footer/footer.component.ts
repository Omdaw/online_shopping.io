import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators/map'; 
import { HeaderService } from '../header.service';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { FooterService } from '../footer.service';
import { FlagsService } from '../flags.service';
import { HomePageService } from '../home-page.service';
import { ConfigService } from '../config.service';
import { SubscriberService } from '../subscriber.service';
import { CommonService } from '../common.service';

interface IBlogsRequest {
  BLOG_TYPE                : number,
  STORE_ID                 : any,
  CLIENT_APP_VERSION_CODE  : any,
  CLIENT_APP_VERSION_NAME  : any,
  BUILD_CONFIGURATION_TYPE : any,
  STATUS_CODE              : number,
  BY_DATE                  : boolean
}

interface IPagesRequest {
  STORE_ID                 : any,
  CLIENT_APP_VERSION_CODE  : any,
  CLIENT_APP_VERSION_NAME  : any,
  BUILD_CONFIGURATION_TYPE : any,
  STATUS_CODE              : number,
  BY_DATE                  : boolean
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent implements OnInit {
  
  constructor(private configService : ConfigService,
    private _router       : Router, 
    private route         : ActivatedRoute, 
    private footerService : FooterService,
    public flagsService   : FlagsService,
    public homeService    : HomePageService,
    public subscriberService    : SubscriberService,
    public commonService        : CommonService,
    ) { }
    
    //Variables Used in this Component
    processBar                    = false;
    
    fetchQuickLinksRequestObject  = {};
    quickLinksArray               = [];
    
    blogsArray                    = [];
    
    pagesArray                    = [];
    
    currentYear = 0;
    
    currentDate = new Date();
    
    ngOnInit() {
      
      this.checkSubscriberId();
      this.currentYear = this.currentDate.getFullYear();
    }
    
    subscriberId = 0;
    checkSubscriberId(){
      if(this.commonService.lsSubscriberId())      this.subscriberId     = + this.commonService.lsSubscriberId();
      
      if(this.subscriberId == 0){
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
      this.fetchQuickLinks();
      this.fetchSocialMedia();
      this.fetchBlogs();
      this.fetchPages();
      this.fetchStoreDetails();
    }
    
    makeFetchQuickLinksRequestObject(){
      this.fetchQuickLinksRequestObject = {
        STORE_ID                 : this.configService.getStoreID(),
        CLIENT_APP_VERSION_CODE  : this.configService.getClientAppVersionCode(),
        CLIENT_APP_VERSION_NAME  : this.configService.getClientAppVersionName(),
        BUILD_CONFIGURATION_TYPE : this.configService.getBuildConfigurationType(),
        STATUS_CODE              : ApplicationConstants.STATUS_CODE_ENABLE,
        BY_DATE                  : true
      }
    }
    
    makeFetchBlogsRequestObject(){
      let blogsRequestObj : IBlogsRequest = {
        BLOG_TYPE                : ApplicationConstants.PARENT_BLOG_TYPE_ID,
        STORE_ID                 : this.configService.getStoreID(),
        CLIENT_APP_VERSION_CODE  : this.configService.getClientAppVersionCode(),
        CLIENT_APP_VERSION_NAME  : this.configService.getClientAppVersionName(),
        BUILD_CONFIGURATION_TYPE : this.configService.getBuildConfigurationType(),
        STATUS_CODE              : ApplicationConstants.STATUS_CODE_ENABLE,
        BY_DATE                  : true
      }
      return blogsRequestObj;
    }
    
    makeFetchPagesRequestObject(){
      let pagesRequestObj : IPagesRequest = {
        STORE_ID                 : this.configService.getStoreID(),
        CLIENT_APP_VERSION_CODE  : this.configService.getClientAppVersionCode(),
        CLIENT_APP_VERSION_NAME  : this.configService.getClientAppVersionName(),
        BUILD_CONFIGURATION_TYPE : this.configService.getBuildConfigurationType(),
        STATUS_CODE              : ApplicationConstants.STATUS_CODE_ENABLE,
        BY_DATE                  : true
      }
      return pagesRequestObj;
    }
    
    fetchQuickLinks(){
      this.processBar = true;
      this.makeFetchQuickLinksRequestObject();
      this.footerService.fetchQuickLinks(this.fetchQuickLinksRequestObject).subscribe(data => this.handleFetchQuickLinksSuccess(data), error => this.handleError(error));
    }
    
    handleFetchQuickLinksSuccess(pData){
      // this.quickLinksArray.length = 0;
      if(pData.STATUS ='OK'){
        this.quickLinksArray = pData.QUICK_LINK;
        // pData.QUICK_LINK.forEach(element => {
          
        //   if(new Date(element.QUICK_LINK_END_DATE) >= new Date && element.QUICK_LINK_STATUS_CODE == ApplicationConstants.STATUS_CODE_ENABLE){
        //     this.quickLinksArray.push(element);
        //   }
        // });
      }
      this.processBar = false;
    }
    
    fetchBlogs() {
      this.processBar = true;
      this.footerService.fetchParentBlogs(this.makeFetchBlogsRequestObject())
      .subscribe(data  => this.handleFetchBlogsSuccess(data),
      error => this.handleError(error));
    }
    
    handleFetchBlogsSuccess(pData){
      // this.blogsArray.length = 0;
      if(pData.STATUS == 'OK'){
        this.blogsArray = pData.BLOG;
        // pData.BLOG.forEach(element => {
          
        //   if(element.BLOG_STATUS_CODE == ApplicationConstants.STATUS_CODE_ENABLE){
        //     this.blogsArray.push(element);
        //   }
        // });
      }
      this.processBar = false;
    }
    
    fetchPages() {
      this.processBar = true;
      this.footerService.fetchPages(this.makeFetchPagesRequestObject())
      .subscribe(data  => this.handleFetchPagesSuccess(data),
      error => this.handleError(error));
    }
    
    handleFetchPagesSuccess(pData){
      // this.pagesArray.length = 0;
      if(pData.STATUS ='OK'){
        this.pagesArray = pData.PAGE;
        // pData.PAGE.forEach(element => {
          
        //   if(new Date(element.PAGE_END_DATE) >= new Date && element.PAGE_STATUS_CODE == ApplicationConstants.STATUS_CODE_ENABLE){
        //     this.pagesArray.push(element);
        //   }
        // });
      }
      this.processBar = false;
    }
    
    handleError(error){
      
    }
    
    // Social Media
    fetchSocialMediaRequestObject = {};
    socialMediaDetailsArray       = []
    makeFetchSocialMediaRequestObject(){
      this.fetchSocialMediaRequestObject = {
        STORE_ID                 : this.configService.getStoreID(),
      }
    }
    
    fetchSocialMedia(){
      this.processBar = true;
      this.makeFetchSocialMediaRequestObject();
      this.footerService.fetchSocialMediaAPI(this.fetchSocialMediaRequestObject).subscribe(data => this.handleFetchSocialMediaSuccess(data), error => this.handleError(error));
    }
    
    handleFetchSocialMediaSuccess(pData){
      if(pData.STATUS ='OK'){
        this.socialMediaDetailsArray = pData.SOCIAL_MEDIA;
      }
      
      // stop the progress bar
      this.processBar = false;
    } 
    // Social Media end
    
    fetchStoreDetails() {
      
      this.homeService.fetchStoreByIdAPI(this.configService.getStoreID()).subscribe(data => this.handleStoreData(data),
      error => this.handleError(error));
    }
    
    vendorId                          = 0;
    storeId                           = 0;
    applicationTypeCode               = 0;
    storeName                         = "";
    storeAddress                      = "";
    storeContactNumber                = "";
    storeEmailAddress                 = "";
    store_privacy_policy_url          = "";
    store_terms_and_conditions_url    = "";
    wabiz_domain_url                  = "";
    storeObject                       : any;
    
    handleStoreData(pData) {
      
      this.processBar = false;
      
      if(pData.STATUS == 'OK') {
        
        let storeData = pData.STORE[0];

        this.storeObject = pData.STORE[0];
        
        let addressLine1    = "";
        let addressLine2    = "";
        let addressPincode  = "";
        
        if(storeData.STORE_ADDRESS_LINE1!="") addressLine1 = storeData.STORE_ADDRESS_LINE1;
        if(storeData.STORE_ADDRESS_LINE2!="") addressLine2 = storeData.STORE_ADDRESS_LINE2;
        if(storeData.STORE_ADDRESS_PINCODE!="") addressPincode = storeData.STORE_ADDRESS_PINCODE;
        
        // this.storeAddress       = addressLine1 +" "+ addressLine2 +" "+ addressPincode;
        this.storeAddress       = addressLine1;
        this.storeContactNumber = storeData.STORE_PRIMARY_CONTACT_MOBILE_NR ;
        this.storeEmailAddress  = storeData.STORE_PRIMARY_CONTACT_EMAIL_ID ;
        
        
        this.store_privacy_policy_url             = this.commonService.checkIfNull(storeData.STORE_PRIVACY_POLICY_URL); //  new-checklist-1-soln-3 
        this.store_terms_and_conditions_url       = this.commonService.checkIfNull(storeData.STORE_TERMS_AND_CONDITIONS_URL); //  new-checklist-1-soln-3 
        this.wabiz_domain_url                     = storeData.WABIZ_DOMAIN_URL;
        
        this.storeName                            = storeData.STORE_NAME;
        this.applicationTypeCode                  = storeData.APPLICATION_TYPE_CODE;
        
        this.vendorId                             = storeData.VENDOR_ID;
        this.storeId                              = storeData.STORE_ID;
        
      } 
    }
    
    // sellOnUsUrl(){
    //   return this.configService.getFrontEndURL() + "sell-online/"+this.vendorId+"/"+this.storeId;
    // }
    
    sellOnlinButtonDisplayStatus(){
      let displayFlag = false;
      //Here if Application type code is equals to market place then only we have to show sell online button
      if(this.applicationTypeCode == ApplicationConstants.APPLICATION_TYPE_MARKET_PLACE_WITH_MULTI_VENDOR_CODE) displayFlag = true;
      return displayFlag;
    }

    customerNewsletterEmailID = "";
    newsletterDisplayStatus   = true;
    newsletterSuccessMsg      = "";
    createNewsletterAPI(){
      if(this.customerNewsletterEmailID != ""){
        let requestObject = {
          STORE_ID          : this.configService.getStoreID(),
          CUSTOMER_EMAIL_ID : this.customerNewsletterEmailID,
        }
        this.footerService.createNewsletterAPI(requestObject).subscribe(
          data  => this.handleCreateNewsletterAPISuccess(data), 
          error => this.handleCreateNewsletterAPIFailure(error));
      }
    }

    handleCreateNewsletterAPISuccess(data){
      if(data.STATUS == "OK") {
        this.customerNewsletterEmailID = "";
        this.newsletterDisplayStatus = false;
        this.newsletterSuccessMsg = data.MESSAGE;
      } else if(data.STATUS == "FAIL") {
        this.customerNewsletterEmailID = "";
        this.newsletterDisplayStatus = false;
        this.newsletterSuccessMsg = data.ERROR_MSG;
      }
    }
    handleCreateNewsletterAPIFailure(data){

    }
    
    // Footer logic 
    
    getFooterAddressAndFollowUsDivClass(){
      let className = "col-md-3 col-sm-5 col-12";
      let numberOfCols = this.getNumberOfColumnsToBeDisplayedInFooter();
      if(numberOfCols == 3) className = "col-md-4 col-sm-6 col-12";
      if(numberOfCols == 2) className = "col-md-6 col-sm-6 col-12";
      if(numberOfCols == 1) className = "col-md-12 col-sm-12 col-12";
      return className;
    }
    
    getFooterQuickLinkAndBlogAndPagesDivClass(){
      let className = "col-md-2 col-sm-3 col-12";
      let numberOfCols = this.getNumberOfColumnsToBeDisplayedInFooter();
      if(numberOfCols == 4) className = "col-md-3 col-sm-3 col-12";
      if(numberOfCols == 3) className = "col-md-4 col-sm-3 col-12";
      if(numberOfCols == 2) className = "col-md-6 col-sm-6 col-12";
      if(numberOfCols == 1) className = "col-md-12 col-sm-12 col-12";
      
      return className;
    }
    
    getNumberOfColumnsToBeDisplayedInFooter(){
      let numberOfColumns = 0;
      
      if((this.storeObject!= undefined && this.storeObject.SHOW_STORE_ADDRESS != undefined && 
        this.storeObject.SHOW_STORE_ADDRESS == 'true' && 
        this.isThisStringHasValue(this.storeAddress))||
        this.isThisStringHasValue(this.storeContactNumber)||
        this.isThisStringHasValue(this.storeEmailAddress)) numberOfColumns++;
      if(this.socialMediaDetailsArray.length > 0) numberOfColumns++;
      if(this.quickLinksArray.length > 0) numberOfColumns++;
      if(this.blogsArray.length > 0) numberOfColumns++;
      if(this.pagesArray.length > 0) numberOfColumns++;
      
      return numberOfColumns;
    }
    
    isThisStringHasValue(pString){
      let flag = false;
      if(pString && pString != "null" && pString != null) flag = true;
      return flag; 
    }
    // Footer logic ends 
    
    
  }
  