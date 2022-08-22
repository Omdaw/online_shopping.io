import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiConstants } from 'src/ApiConstants';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  
  constructor(private configService : ConfigService,
              private _http: HttpClient) { }

  fetchProductCategoryAndProduct(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FetchProductCategoryAndProduct, requestObject).pipe(map(data => data, error => error));
  }

  fetchProductsByCategoryId(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FETCH_PRODUCT_BY_CATEGORY_ID, requestObject).pipe(map(data => data, error => error));
  }

  fetchProductByProductId(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FetchProductAPI, requestObject).pipe(map(data => data, error => error));
  }

  fetchProductsByBrandId(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.fetchProductsByBrandIdAPI, requestObject).pipe(map(data => data, error => error));
  }

  fetchProductDetailByProductDetailIdAPI(pProductDetailId) {
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.fetchProductDetailByProductDetailIdAPI,
                                {PRODUCT_DETAIL_ID: pProductDetailId}).pipe(map(data => data, error => error));
  }
}
