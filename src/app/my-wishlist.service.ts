import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiConstants } from 'src/ApiConstants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class MyWishlistService {

  constructor(
    private _http                 : HttpClient,
    private route                 : Router,
    private configService : ConfigService,
    private commonService : CommonService,
  ) { }

  addToFavourites(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.ADD_TO_FAVOURITES_API, requestObject).pipe(map(data => data, error => error));
  }

  fetchFavourites(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FETCH_FAVOURITES_API, requestObject).pipe(map(data => data, error => error));
  }

  deleteFavourites(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.DELETE_FAVOURITES_API, requestObject).pipe(map(data => data, error => error));
  }

  wishListProductsArray = [];

  isThisProductsInMyWishlist(productDetailsObject){
    let flag = false;
    this.wishListProductsArray.forEach(wishlist => {
      if(productDetailsObject.PRODUCT_DETAIL_ID == wishlist.PRODUCT_DETAIL.PRODUCT_DETAIL_ID){
          flag = true;
      }
    });
    return flag;
  }

  public addToMyWishlist(productDetailsObject){
    let temparorySubscriberFlag = 0;
    temparorySubscriberFlag = +this.commonService.lsTempSubscriberFlag();
    if(temparorySubscriberFlag == 1) {
      this.route.navigate(['/collections/login']);
    }else{
      let requestObject = {
        // STORE_ID            :   +localStorage.getItem('storeId'),
        STORE_ID : this.configService.getStoreID(),
        SUBSCRIBER_ID       :   this.commonService.lsSubscriberId(),
        PRODUCT_DETAIL_ID   :   productDetailsObject.PRODUCT_DETAIL_ID, 
      }
      this.addToFavourites(requestObject).subscribe(data => this.handleAddToMyWishlistSuccess(data), error => error);
    }
  }


  handleAddToMyWishlistSuccess(data){
    if(data.STATUS == "OK"){
      this.fetchMyWishList();
    }
  }


  getSubscriberFavouriteProductDetailIdFromProductDetailId(productDetailId){
    let subscriberFavouriteProductDetailsId = 0;
    this.wishListProductsArray.forEach(wishlist => {
      if(productDetailId == wishlist.PRODUCT_DETAIL.PRODUCT_DETAIL_ID){
          subscriberFavouriteProductDetailsId = wishlist.SUBSCRIBER_FAVOURITE_PRODUCT_DETAIL_ID;
      }
    });
    return subscriberFavouriteProductDetailsId;
  }

  public deleteMyWishlist(productDetailsObject){
    let requestObject = {
      SUBSCRIBER_FAVOURITE_PRODUCT_DETAIL_ID : this.getSubscriberFavouriteProductDetailIdFromProductDetailId(productDetailsObject.PRODUCT_DETAIL_ID)
    }

    this.deleteFavourites(requestObject).subscribe(data => this.handleDeleteMyWishlistSuccess(data), error => error)
  }

  handleDeleteMyWishlistSuccess(data){
    if(data.STATUS == "OK"){
      this.fetchMyWishList();
    }
  }

  public fetchMyWishList(){
    let requestObject = {
    //   STORE_ID            :   +localStorage.getItem('storeId'),
    STORE_ID : this.configService.getStoreID(),
      SUBSCRIBER_ID       :   this.commonService.lsSubscriberId(),
    }
    this.fetchFavourites(requestObject).subscribe(data => this.handleFetchFavouritesSuccess(data), error => error);
  }


  handleFetchFavouritesSuccess(data){
    if(data.STATUS == "OK"){
      this.wishListProductsArray = [];
      this.wishListProductsArray = data.SUBSCRIBER_FAVOURITE_PRODUCTS;
    }
  }


}
