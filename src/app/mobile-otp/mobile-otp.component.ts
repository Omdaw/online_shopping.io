import { Component, OnInit } from '@angular/core';
import { EmailandphonenumberverifiationService } from '../emailandphonenumberverifiation.service';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-mobile-otp',
  templateUrl: './mobile-otp.component.html',
  styleUrls: ['./mobile-otp.component.css']
})
export class MobileOtpComponent implements OnInit {

  constructor(
    public emailandphonenumberverifiationService : EmailandphonenumberverifiationService,
    public commonService : CommonService,
  ) { }

  ngOnInit() {
  }

  mobileOtp = "";

  verifyMobileOtp(){
    this.emailandphonenumberverifiationService.mobileOtp = this.mobileOtp;
    this.emailandphonenumberverifiationService.verifyMobileOtp();
  }

}
