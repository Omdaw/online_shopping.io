import { Injectable, LOCALE_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { ApiConstants } from 'src/ApiConstants';
import { map } from 'rxjs/operators';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { ConfigService } from './config.service';


@Injectable({
  providedIn: 'root'
})
export class SubscriberService {
notification = "";
  constructor(private configService : ConfigService,private http: HttpClient) { }

  public getJSON(): Observable<any> {
    return this.http.get("../assets/userData.json")
}
 public validateSubscriberService(username, password){
          this.getJSON().subscribe(data => {
              if(username!=null && password!=null){
                    if(data[0].username === username &&  data[0].password === password)
                    {
                          this.notification= "Success";
                          this.setCookie("loggedUserName", username, 1);
                          this.setCookie("session", "exist", 1);
                          
                    }else{
                            this.notification= "Invalid Username/Password.";
                    }
                  }          
            });
            return this.notification;
  }

   setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
   getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
   checkCookie() {
    var user = this.getCookie("username");
    if (user != "") {
      alert("Welcome again " + user);
    } else {
      user = prompt("Please enter your name:", "");
      if (user != "" && user != null) {
        this.setCookie("username", user, 365);
      }
    }
  }

  tempSubscriberLogin(){ //lsChanges

    const uuidv4 = require('uuid/v4');

    
    let tempObject = {DEVICE_UNIQUE_ID : uuidv4()};
    
    return this.http.post<any>(this.configService.getApiBaseURL() + ApiConstants.TempSubscriberLoginAPI, tempObject).pipe(map(data => data, error => error));
  }

  addToCart(requestObject){
    return this.http.post<any>(this.configService.getApiBaseURL() + ApiConstants.addItemAPI, requestObject).pipe(map(data => data, error => error));
  }

  updateCart(requestObject){
    return this.http.post<any>(this.configService.getApiBaseURL() + ApiConstants.updateItemAPI, requestObject).pipe(map(data => data, error => error));
  }

  removeFromCart(requestObject){
    return this.http.post<any>(this.configService.getApiBaseURL() + ApiConstants.deleteItemAPI, requestObject).pipe(map(data => data, error => error));
  }

  fetchCartInProgressTransactionsBySubscriberIdAPI(requestObject){
    return this.http.post<any>(this.configService.getApiBaseURL() + ApiConstants.fetchCartInProgressTransactionsBySubscriberIdAPI, requestObject).pipe(map(data => data, error => error));
  }

  fetchTransactionsByTransactionIdAPI(requestObject){
    return this.http.post<any>(this.configService.getApiBaseURL() + ApiConstants.fetchTransactionsByTransactionIdAPI, requestObject).pipe(map(data => data, error => error));
  }

  checkoutAPI(requestObject){
    return this.http.post<any>(this.configService.getApiBaseURL() + ApiConstants.checkoutAPI, requestObject).pipe(map(data => data, error => error));
  }

  applyPromoCodeAPI(requestObject){
    return this.http.post<any>(this.configService.getApiBaseURL() + ApiConstants.applyPromoCodeAPI, requestObject).pipe(map(data => data, error => error));
  }

  cancelPromoCodeAPI(requestObject){
    return this.http.post<any>(this.configService.getApiBaseURL() + ApiConstants.cancelPromoCodeAPI, requestObject).pipe(map(data => data, error => error));
  }

  fetchGoogleTagManagerAPI(requestObject){
    return this.http.post<any>(this.configService.getApiBaseURL() + ApiConstants.fetchGoogleTagManagerAPI, requestObject).pipe(map(data => data, error => error));
  }
  
  fetchSubscriberAPI(requestObject){
    return this.http.post<any>(this.configService.getApiBaseURL() + ApiConstants.fetchSubscriberAPI, requestObject).pipe(map(data => data, error => error));
  }

  updateSubscriberMobileNrAPI(requestObject){
    return this.http.post<any>(this.configService.getApiBaseURL() + ApiConstants.updateSubscriberMobileNrAPI, requestObject).pipe(map(data => data, error => error));
  }

  updateSubscriberEmailIdAPI(requestObject){
    return this.http.post<any>(this.configService.getApiBaseURL() + ApiConstants.updateSubscriberEmailIdAPI, requestObject).pipe(map(data => data, error => error));
  }

}
