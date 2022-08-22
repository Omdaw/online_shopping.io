import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiConstants } from 'src/ApiConstants';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})

export class HeaderService {
  
  constructor(private configService : ConfigService,
    private _http: HttpClient) { }
    
    fetchTopLevelProductCategories(requestObject):Observable<any>{
      return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FetchTopLevelProductCategory, requestObject).pipe(map(data => data, error => error));
    }
    
    fetchProductCategoryAPI(requestObject):Observable<any>{
      return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.fetchProductCategoryAPI, requestObject).pipe(map(data => data, error => error));
    }

    fetchProductCategoryByIdAPI(requestObject):Observable<any>{
      return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.fetchProductCategoryByIdAPI, requestObject).pipe(map(data => data, error => error));
    }
    
    fetchStore(requestObject){
      return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FetchStore, requestObject).pipe(map(data => data, error => error));
    }
    
    searchProductByInputId(requestObject){
      return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.searchProductByInputIdAPI, requestObject).pipe(map(data => data, error => error));
    }
    fetchStoreParameterAPI(requestObject){
      return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FETCH_STORE_PARAMETER_API, requestObject).pipe(map(data => data, error => error));
    }
  }
  