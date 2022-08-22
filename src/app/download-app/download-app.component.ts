import { Component, OnInit } from '@angular/core';
import { FlagsService } from '../flags.service';
import { CommonService } from '../common.service';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { EnquiryService } from '../enquiry.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ConfigService } from '../config.service';

export interface ISendAppLinkSmsRequestObject {
  STORE_ID   : any,
  CONTACT_NO : string
}
@Component({
  selector: 'app-download-app',
  templateUrl: './download-app.component.html',
  styleUrls: ['./download-app.component.css']
})
export class DownloadAppComponent implements OnInit {



  constructor(private configService : ConfigService,
    private flagsService: FlagsService,
    public commonService: CommonService,
    public enquiryService: EnquiryService,
    private flashMessagesService: FlashMessagesService,
  
  ) {}
  
  ngOnInit() {
    // this.flagsService.hideHeader();
    this.flagsService.showSearch();
    this.flagsService.showHeaderFooter();
    this.fetchAndroidAppLinkApi();
    this.fetchIosAppLinkApi();
  }
  
  formInvalid = true;
  validateForm(ngObject) {
    this.formInvalid = true;
    if (ngObject._parent.form.status == "VALID") {
      this.formInvalid = false;
    }
  }
  
  // Enquiry Form Submission 
  formRequestObject: ISendAppLinkSmsRequestObject;
  contactNumber = "";
  
  makeSendAppLinkSmsFormRequest() {
    this.formRequestObject = {
      STORE_ID: this.configService.getStoreID(),
      CONTACT_NO: this.contactNumber
    }
  }
  
  sendAppLinkSms() {
    if (this.formInvalid == false) {
      this.makeSendAppLinkSmsFormRequest();
      this.enquiryService.sendAppLinkSMSAPI(this.formRequestObject).subscribe(data => this.handleSendAppLinkSmsSuccess(data), error => this.handleError(error));
    } else {
      this.commonService.notifyMessage(this.flashMessagesService, "Please enter the valid mobile number.");
    }
  }
  
  handleSendAppLinkSmsSuccess(data) {
    if (data.STATUS == 'OK') {
  
  
      (async() => {
        this.commonService.notifySuccessMessage(this.flashMessagesService, "App link has been sent successfully to your mobile.");
        await this.commonService.delay(ApplicationConstants.notification_display_time);
        window.location.reload();
      })();
    }
  }
  
  handleError(error) {
    this.commonService.notifyMessage(this.flashMessagesService, error);
  }
  
  // Enquiry Form Submission ends
  
  
  //Fetch App Link 
  //Android
  androidAppLink = "";
  fetchAndroidAppLinkApi() {
    let requestObject = {
      STORE_ID: this.configService.getStoreID(),
      APP_LINK_CODE: ApplicationConstants.ANDROID_APP_LINK_CODE
    }
    this.enquiryService.fetchAppLinkAPI(requestObject).subscribe(data => this.handleFetchAndroidAppLinkApiSuccess(data), error => this.handleError(error));
  }
  handleFetchAndroidAppLinkApiSuccess(data) {
    if (data.STATUS == "OK") {
      this.androidAppLink = data.APP_LINK;
    }
  }
  
  //IOS
  iosAppLink = "";
  fetchIosAppLinkApi() {
    let requestObject = {
      STORE_ID: this.configService.getStoreID(),
      APP_LINK_CODE: ApplicationConstants.IOS_APP_LINK_CODE
    }
    this.enquiryService.fetchAppLinkAPI(requestObject).subscribe(data => this.handleFetchIosAppLinkApiSuccess(data), error => this.handleError(error));
  }
  handleFetchIosAppLinkApiSuccess(data) {
    if (data.STATUS == "OK") {
      this.iosAppLink = data.APP_LINK;
    }
  }
  //Fetch App Link Ends
  
  

}
