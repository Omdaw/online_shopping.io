import { ApiConstants } from './../ApiConstants';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { map } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { SubscriberService } from './subscriber.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  
  // Menu hide/show
  public displaySubMenu = false;

  hideSubMenu(){
    this.displaySubMenu = false;
  }
  // Menu hide/show

  public loggedIn = 0;

  public loginCallFromCheckoutPage = 0;

  /* 
      user profile Id
  */
  public profileId : number;
  
  /*
    All eligible forms 
   */
  public formObject;

   /*
    this member variable controls the view component
   */
  public formEnable = 1;

  public transactionObj = null;

  constructor(private configService : ConfigService,
              private _http: HttpClient) { }

  

  public getHeader(){
    let headers = new HttpHeaders({'Content-Type':'Application/json'});    
    return headers;
  }

  // Start 
    public numberOfProductsInCart = 0;
  // End 

  public imgURL = [];
  public selectedFile             : File = null;
  public imageFileUploadType      : string;
  public imageUploadFileName      : string;
  public imageUploadApplicationId : string;
  public imageUploadVendorId      : string;
  public imageUploadStoreId       : string;
  public processingMode           = "INSERT";
  public imageUploadBannerId      : string;
  public imageUploadProductCategoryId : string;
  public imageUploadProductId         :string;
  public imageUploadProductImageId    :string;
  public imageUploadReviewId          : number;
  
  public BuSelectedFile     : File;
  public BuFileName         : string;   
  public BuFileTypeId       : string;      
  // public BuFileTypeName     : string;        
  public BuWhenToSchedule   : string;          
  public BuFileProcessMode  : string;           
  public BuApplicationId    : string;        
  public BuVendorId         : string;  
  public BuStoreId          : string; 
  public BuContextId        : string;

  public BuFileProcessId    : number;

  public invoiceAmount    = 0;
  public invoiceDiscount  = 0;
  public invoiceTotal     = 0;

  fetchMyOrdersBySubscriberId(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.fetchMyOrderBySubscriberIdAPI, requestObject).pipe(map(data => data, error => error));
  }

  // Filters related (Mobile View)
  public productCategoryIdForFilters          =     0;
  public filterSelectedCategoryArray          =     [];
  public filterSelectedBrandArray             =     [];
  public filterSelectedDiscountObject         =     {DISCOUNT_TO : 0, DISCOUNT_TYPE: ""}; //Selected discounts in filter
  public filterAttributeNamesArray            =     [];
  public filterAttributeValuesArray           =     [];
  // Filters related ends (Mobile View) 

  updateSubscriberPasswordAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.updateSubscriberPasswordAPI, requestObject).pipe(map(data => data, error => error));
  }

  forgotPasswordAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FORGOT_PASSWORD_API, requestObject).pipe(map(data => data, error => error));
  }

public   referralCode = "";
public referralFlag(){
    let refFalg = false;
    if(this.referralCode != null || this.referralCode != "") refFalg = true;

    return refFalg;
  }

}