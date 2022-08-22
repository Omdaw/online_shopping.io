import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { Configuration } from './Configuration';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StoreService } from './store.service';

export interface iStoreDetailsResponse {
  STORE_ID                   : number,
  APPLICATION_ID             : number,
  VENDOR_ID                  : number,
  CLIENT_APPLICATION_NAME    : string,
  STATUS                     : string
}
 
@Injectable({
  providedIn: 'root'
}) 
 
export class ConfigService {

  private config: Configuration;

  constructor(
    private http          : HttpClient,
    private storeService  : StoreService,
    ) {
  }

  load(url) {
    localStorage.removeItem("APPLICATION_NAME_BY_URL");
    this.fetchStoreDetailsByUrl();
    return new Promise((resolve) => {   this.http.get(url).pipe(map(res => res)).subscribe(data => { 
                                                                                                      this.convertToConfigData(data) 
                                                                                                      resolve(1);
                                                                                                    }
                                                                                          )
                                    });
  }
  
  storeNameByUrl : string; 
  fetchStoreDetailsByUrl(){

    // let url         = `${window.location.protocol}//${window.location.host}`

    let url            = 'https://pooja.wawbizstores.com';

        let storeRequestObject = {
          URL : url
        }
        this.storeService.fetchStoreDetailsByApplicationUrl(storeRequestObject).subscribe(data=>this.handleFetchStoreDetailsByUrl(data), error=>error);

  }

  handleFetchStoreDetailsByUrl(pData:iStoreDetailsResponse){
    if(pData.STATUS == "OK"){
      let storeObject = {
        STORE_ID                  : pData.STORE_ID,
        APPLICATION_ID            : pData.APPLICATION_ID,
        VENDOR_ID                 : pData.VENDOR_ID,
        CLIENT_APPLICATION_NAME   : pData.CLIENT_APPLICATION_NAME +"-1.0.0"
      }

      this.storeNameByUrl = pData.CLIENT_APPLICATION_NAME;
      localStorage.setItem("APPLICATION_NAME_BY_URL", this.storeNameByUrl);
      if(localStorage.getItem(this.storeNameByUrl) == null){
        localStorage.setItem(this.storeNameByUrl, JSON.stringify(storeObject));
        location.reload();
      }


    }
  }

  convertToConfigData(data) {
    this.config = data; 
  }

  getConfiguration(): Configuration {
    return this.config;
  }

  public getStoreData(): Configuration {
      return this.config;
  } 

  getStoreID() {
    return environment.storeId;
  }

  public getBuildConfigurationType() {
    return environment.buildConfigurationType;
  }
 
  public getApiBaseURL() { 
    return environment.apiBaseUrl;
  }

  public getClientAppVersionName() { 
    return environment.clientAppVersionName;
  }

  public getClientAppVersionCode() { 
    return environment.clientAppVersionCode;
  }

  public getVersionCheckURL() { 
    let data : any = this.config;
    return data.VERSION_CHECK_URL; 
  } 

  // public getFrontEndURL() { 
  //   return environment.frontEndUrl;
  // } 
}