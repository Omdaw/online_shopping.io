import { Component, OnInit } from '@angular/core';
import { FlagsService } from '../flags.service';
import { SignupService } from '../signup.service';
import { EmailandphonenumberverifiationService } from '../emailandphonenumberverifiation.service';
import { CommonService } from '../common.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {
  
  constructor(private configService : ConfigService,
    private flagsService : FlagsService,
    public emailandphonenumberverifiationService : EmailandphonenumberverifiationService,
    public commonService : CommonService,
    public flashMessagesService : FlashMessagesService,
    ) { }
    
    ngOnInit() {
      window.scrollTo(0,0);
      this.flagsService.showSearch();
      this.flagsService.showHeaderFooter();
      if(window.innerWidth < 600){
        this.flagsService.hideFooter();
      }
      
    }
    otp   = "";
    otp1  = "";
    otp2  = "";
    otp3  = "";
    otp4  = "";
    otp5  = "";
    otp6  = "";
    
    verifyOtp(){
      
      // this.emailandphonenumberverifiationService.otp = this.otp1 + this.otp2 + this.otp3 + this.otp4 + this.otp5 + this.otp6 ;
      this.emailandphonenumberverifiationService.otp = this.otp;
      this.emailandphonenumberverifiationService.verifyOtp();
    }
    
    // otpResentNotification(){
    //   // this.commonService.notifyMessage(this.flagsService, "Otp has been resent successfully. ");
    //   this.flashMessagesService.show("OTP has been resent successfully.", {cssClass : 'alert-success', timeout: ApplicationConstants.notification_display_time});
    // }
    
    
  }
  