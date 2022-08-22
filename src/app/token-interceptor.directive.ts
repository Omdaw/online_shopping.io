import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpHeaders, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UserProfileService } from './user-profile.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})

export class TokenInterceptorService implements HttpInterceptor{
 
  clientAppVersionCode    = "1";
  clientAppVersionName    = "Noque-1.0.0";
  buildConfigurationType  = "debug";
  storeId                 = 1;//lsChanges

  constructor(private configService : ConfigService) {}
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    if(this.configService.getStoreData() != undefined && this.configService.getClientAppVersionCode() != undefined){
      this.clientAppVersionCode = this.configService.getClientAppVersionCode();
    }
 
    if(this.configService.getStoreData() != undefined && this.configService.getClientAppVersionName() != undefined){
      this.clientAppVersionName = this.configService.getClientAppVersionName();
    }

    if(this.configService.getStoreData() != undefined && this.configService.getBuildConfigurationType() != undefined){
      this.buildConfigurationType = this.configService.getBuildConfigurationType();
    }

    if(this.configService.getStoreData() != undefined && this.configService.getStoreID() != undefined){
      this.storeId = this.configService.getStoreID();
    } //lsChanges




      if(request.url.match("tempSubscriberLoginAPI")==null){

        let objectName = "storeData"+this.storeId;

        let storeDataObject:any = JSON.parse(localStorage.getItem(objectName));
        let authToken = ""; //lsChanges
        if(storeDataObject!=null) authToken = storeDataObject.authToken; //lsChanges

        request = request.clone({
          setHeaders: {
            CLIENT_APP_VERSION_CODE  : "" + this.clientAppVersionCode,
            CLIENT_APP_VERSION_NAME  : "" + this.clientAppVersionName,
            BUILD_CONFIGURATION_TYPE : "" + this.buildConfigurationType,
            Authorization            : "Bearer "+authToken, //lsChanges
            'Content-Type': 'application/json'
          }
        });
      }else{
        request = request.clone({
          setHeaders: {
            CLIENT_APP_VERSION_CODE  : "" + this.clientAppVersionCode,
            CLIENT_APP_VERSION_NAME  : "" + this.clientAppVersionName,
            BUILD_CONFIGURATION_TYPE : "" + this.buildConfigurationType,
            // CLIENT_APP_VERSION_CODE  : "1",
            // CLIENT_APP_VERSION_NAME  : "wawbiz-1.0.0",
            // BUILD_CONFIGURATION_TYPE : "release",
            'Content-Type': 'application/json'
            // "Accept-Encoding": "gzip"
          }
        });
      } 
  
      return next.handle(request); 
    
    // } else {

    //   request = request.clone({
    //     setHeaders: {        
    //       Authorization            : "Bearer "+localStorage.getItem("authToken"),
    //       'Content-Type': 'application/json',
    //     }
    //   });

    //   return next.handle(request); 

    // }
  } 

  createAuthHeader(headers: Headers) {
    headers.append('Content-Type', 'application/json');
    // headers.append('Authorization', 'Basic ' + btoa('user-name:password')); 
  }
}