import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { CommonService } from '../common.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { UserProfileService } from '../user-profile.service';
import { FlagsService } from '../flags.service';
import { ApplicationConstants } from 'src/ApplicationConstants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  
  subscriberFirstName   :   string;
  subscriberLastName    :   string;
  subscriberFullName    :   string;
  emailId               :   string;
  currentPassword       :   string;
  newPasswordField1     :   string;
  newPasswordField2     :   string;
  
  hideCurrentPassword : boolean;
  hidePasswordField1  : boolean;
  hidePasswordField2  : boolean;
  saveButtonDisabled  : boolean;
  
  constructor(
    private route                   : Router,
    private commonService           : CommonService,
    private flashMessagesService    : FlashMessagesService,
    private userProfileService      : UserProfileService,
    private flagsService            : FlagsService,
    ) { }
    
    ngOnInit() {
      this.hideCurrentPassword = true;
      this.hidePasswordField1  = true;
      this.hidePasswordField2  = true;
      this.saveButtonDisabled  = false;
      this.flagsService.showSearch();
      this.flagsService.showHeaderFooter();
      if(window.innerWidth < 600){
        this.flagsService.hideFooter();
      }
    }
    
    savedData() {
      
      if(this.validateData()) {
        
        this.saveButtonDisabled = true;
        
        this.userProfileService.updateSubscriberPasswordAPI(this.convertFormData())
        .subscribe(data  => this.handleSuccessResponse(data),
        error => this.handleError(error));
      }
    }
    
    validateData() {
      
      if(this.currentPassword == undefined || this.currentPassword == '') {
        
        this.commonService.notifyMessage(this.flashMessagesService, "Enter the otp");
        return false;
      }
      
      if(this.newPasswordField1 == undefined || this.newPasswordField1 == '') {
        
        this.commonService.notifyMessage(this.flashMessagesService, "Enter the New Password");
        return false;
      }
      
      if(this.newPasswordField2 == undefined || this.newPasswordField2 == '') {
        
        this.commonService.notifyMessage(this.flashMessagesService, "Re-enter the New Password");
        return false;
      }
      
      if(this.newPasswordField1 != this.newPasswordField2) {
        
        this.commonService.notifyMessage(this.flashMessagesService, "New Passwords should be same");
        return false;
      }
      
      if(this.currentPassword == this.newPasswordField1) {
        
        this.commonService.notifyMessage(this.flashMessagesService, "Current Password and New Passwords should not be same");
        return false;
      }
      
      return true;
    }
    subscriberId = 0;
    convertFormData() {
      
      let requestObj  = {
        SUBSCRIBER_ID                       : 0,
        SUBSCRIBER_NEW_PASSWORD             : this.newPasswordField1,
        SUBSCRIBER_RESET_PASSWORD_TOKEN     : this.currentPassword
      }
      return requestObj;
    }
    
    handleSuccessResponse(pData) {
      
      if(pData.STATUS == "OK") {
        
        // localStorage.removeItem("Token");
        localStorage.setItem("Token", undefined);
        this.commonService.notifySuccessMessage(this.flashMessagesService, "Password Successfully Updated.");
        (async () => { 
          await this.commonService.delay(ApplicationConstants.notification_display_time);
          this.route.navigate(['/']);
        })();
        
        
      } else if(pData.STATUS == "FAIL") {
        
        this.commonService.notifyMessage(this.flashMessagesService, pData.ERROR_MSG);
        this.saveButtonDisabled = false;
        
      } else {
        
        this.commonService.notifyMessage(this.flashMessagesService, "Something went wrong, please try again");
        this.saveButtonDisabled = false;
      }
    }
    
    handleError(error){
      
      if(error.ERROR_MSG != null) {
        this.commonService.notifyMessage(this.flashMessagesService, error.ERROR_MSG);
      }
      this.saveButtonDisabled = false;
    }
    
    skipUpdate() {
      
      this.route.navigate(['/']);
    }
  }