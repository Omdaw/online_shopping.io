import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileService } from '../user-profile.service';
import { CommonService } from '../common.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FlagsService } from '../flags.service';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  emailId            : string;
  saveButtonDisabled : boolean;

  constructor(private configService : ConfigService,
    private _router                     : ActivatedRoute,
              private route                       : Router,
              private userProfileService          : UserProfileService,
              private commonService               : CommonService,
              private flashMessagesService        : FlashMessagesService,
              private flagsService                : FlagsService,
              ) { }

  ngOnInit() {

    this.saveButtonDisabled = false;
    // this.flagsService.hideHeaderFooter();
    this.flagsService.showSearch();
    this.flagsService.showHeaderFooter();
    // if(window.innerWidth < 600){
    //   this.flagsService.hideFooter();
    // }
  }

  resetPassword() {

    if(this.emailId == undefined || this.emailId == '') {
      this.commonService.notifyMessage(this.flashMessagesService, 'Please enter your Registered Email ID.');
      return;
    } else {

      let tempObject = {
        SUBSCRIBER_EMAIL_ID : this.emailId
      }

      this.userProfileService.forgotPasswordAPI(tempObject)
      .subscribe(data  => this.handleResetResponse(data),
                  error => this.handleError(error));
    }

    // this.saveButtonDisabled = true;
  }

  handleResetResponse(pData) {
    
    if(pData.STATUS == "OK") {
      
      this.commonService.notifySuccessMessage(this.flashMessagesService, "Password has been updated, please check your registered mail and follow the procedure.");
      
      (async () => { 
        await this.commonService.delay(ApplicationConstants.notification_display_time);
        this.route.navigate(['/collections/change-password']);
      })();

    } else if(pData.STATUS == "FAIL") {

      this.saveButtonDisabled = false;
      this.commonService.notifyMessage(this.flashMessagesService, pData.ERROR_MSG);

    } else {

      this.saveButtonDisabled = false;
      this.commonService.notifyMessage(this.flashMessagesService, 'Something went wrong, please try again.');
    }
  }

  handleError(error){

    if(error.ERROR_MSG != null) {
      this.commonService.notifyMessage(this.flashMessagesService, error.ERROR_MSG);
    }
    this.saveButtonDisabled = false;
  }
}
