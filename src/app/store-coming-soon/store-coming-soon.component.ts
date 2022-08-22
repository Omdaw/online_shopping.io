import { Component, OnInit, ViewChild } from '@angular/core';
import { FlagsService } from '../flags.service';
import { HomePageService } from '../home-page.service';
import { UserProfileService } from '../user-profile.service';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-store-coming-soon',
  templateUrl: './store-coming-soon.component.html',
  styleUrls: ['./store-coming-soon.component.css']
})
export class StoreComingSoonComponent implements OnInit {

  processBar   : boolean;
  
  imageUrl     : string;
  title        : string;
  description  : string;
  currentYear  : number;
  statusCode   : number;
  storeLogoUrl : string;

  constructor(private configService : ConfigService,private _router     : Router,
              private flagService : FlagsService,
              private commonService : CommonService,
              private homeService : HomePageService) { }

  ngOnInit() {

    this.processBar = true;

    this.flagService.hideHeaderFooter();
    this.flagService.showSecondaryHeaderFlag = false;

    let currentDate  = new Date();
    this.currentYear = currentDate.getFullYear();

    this.title = ApplicationConstants.STORE_COMING_SOON_DEFAULT_TITLE; // checklist-store-coming-soon-default-title

    this.fetchStoreDetails();
  }


  fetchStoreDetails() {

    this.homeService.fetchStoreByIdAPI(this.configService.getStoreID()).subscribe(data => this.handleStoreData(data),
                                                                                error => this.handleError(error));
  }


  handleStoreData(pData) {

    this.processBar = false;

    if(pData.STATUS == 'OK') {

      let storeData = pData.STORE[0];

      this.statusCode = storeData.STORE_STATUS_CODE;

      if(this.statusCode != ApplicationConstants.STORE_STATUS_CODE_ACTIVE && 
        this.statusCode != ApplicationConstants.STORE_STATUS_CODE_TESTING ) {

          this.imageUrl     = storeData.STORE_STATUS_IMAGE_URL;

          // checklist-store-coming-soon-default-title
          if(storeData.STORE_STATUS_TITLE != "" && storeData.STORE_STATUS_TITLE != null && storeData.STORE_STATUS_TITLE != "null"){
            this.title        = storeData.STORE_STATUS_TITLE;
          }
          
          this.description  = storeData.STORE_STATUS_DESC;
          this.storeLogoUrl = this.commonService.checkIfNull(storeData.STORE_LOGO_URL);
        
        } else {

          this._router.navigate(['']);
        }

    } else {

      this.handleError("Please reload the page.");
    }
  }

  handleError(errorData){
    
  }
}
