import { Component, OnInit } from '@angular/core';
import { FlagsService } from '../flags.service';
import { CommonService } from '../common.service';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { EnquiryService } from '../enquiry.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ConfigService } from '../config.service';

export interface IEnquiryFormRequestObject{
  STORE_ID            : any,
  SUBJECT             : string,
  BODY                : string,
  BODY_CONTENT_FLAG   : number
}

@Component({
  selector: 'app-bulk-order',
  templateUrl: './bulk-order.component.html',
  styleUrls: ['./bulk-order.component.css']
})
export class BulkOrderComponent implements OnInit {

  constructor(private configService : ConfigService,
    private   flagsService            :     FlagsService,
    public    commonService           :     CommonService,
    public    enquiryService          :     EnquiryService,
    private   flashMessagesService    :     FlashMessagesService,

    ) { }

  ngOnInit() {
    // this.flagsService.hideHeader();
    this.flagsService.showSearch();
    this.flagsService.showHeaderFooter();
  }

  enquiryFormInvalid = true;
  validateEnquiryForm(ngObject){
    this.enquiryFormInvalid = true;
    if(ngObject._parent.form.status == "VALID"){
      this.enquiryFormInvalid = false;
    }
  }

  // Enquiry Form Submission 
  enquiryFormRequestObject  : IEnquiryFormRequestObject;
  body                      = "";
  
  emailAddress              = "";
  subscriberName            = "";
  phoneNumber               = "";
  enquiryContent            = "";

  makeEnquiryFormRequest()
  {
    this.enquiryFormRequestObject = {
      STORE_ID          : this.configService.getStoreID(),
      SUBJECT           : "Bulk/Party Order Enquiry",
      BODY              : "Email : "+ this.emailAddress + " Name : "+this.subscriberName+" Mobile : "+this.phoneNumber+" Enquiry : "+this.enquiryContent,
      BODY_CONTENT_FLAG : 0 // 0 = plain text and 1 = Html
    }
  }

  submitEnquiryForm(){
    if(this.enquiryFormInvalid == false){
      this.makeEnquiryFormRequest();
      this.enquiryService.sendEMailAPI(this.enquiryFormRequestObject).subscribe(data => this.handleSubmitEnquiryFormSuccess(data), error => this.handleError(error));
    }
  }

  handleSubmitEnquiryFormSuccess(data){
    if(data.STATUS == 'OK'){
      
      
      (async () => { 
        this.commonService.notifySuccessMessage(this.flashMessagesService, "Your enquiry is submitted successfully.");
        await this.commonService.delay(ApplicationConstants.notification_display_time);
        window.location.reload();  
      })();
    }
  }

  handleError(error){
    this.commonService.notifyMessage(this.flashMessagesService, error);
  }

  // Enquiry Form Submission ends

}
