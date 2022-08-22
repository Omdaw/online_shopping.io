import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageService } from '../page.service';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { FlagsService } from '../flags.service';
import { ConfigService } from '../config.service';

interface IPagesRequest {
  PAGE_ID                  : number,
  STORE_ID                 : any,
  CLIENT_APP_VERSION_CODE  : any,
  CLIENT_APP_VERSION_NAME  : any,
  BUILD_CONFIGURATION_TYPE : any,
}

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  
  constructor(private configService : ConfigService,private route       : ActivatedRoute,
    private pageService : PageService,
    private flagService : FlagsService) { }
    
    
    processBar             = false;
    pageDetails            = { PAGE_TITLE   : "",
    PAGE_CONTENT : "", };
    
    pageId                 = 0;
    
    
    ngOnInit() {
      // this.flagService.hideHeader();
      this.flagService.showSearch();
      this.flagService.showHeaderFooter();
      if(window.innerWidth < 600){
        this.flagService.hideFooter();
      }
      this.GetPageIdByParam();
      this.fetchPage();
    }
    
    GetPageIdByParam(){
      this.route.params.subscribe(params => {
        if(params['id'] != undefined){
          this.pageId = +params['id'];
        }
      });
    }
    
    makeFetchPageRequestObject(){
      let blogsRequestObj : IPagesRequest = {
        PAGE_ID                  : this.pageId,
        STORE_ID                 : this.configService.getStoreID(),
        CLIENT_APP_VERSION_CODE  : this.configService.getClientAppVersionCode(),
        CLIENT_APP_VERSION_NAME  : this.configService.getClientAppVersionName(),
        BUILD_CONFIGURATION_TYPE : this.configService.getBuildConfigurationType()
      }
      return blogsRequestObj;
    }
    
    fetchPage() {
      this.processBar = true;
      this.pageService.fetchPageById(this.makeFetchPageRequestObject())
      .subscribe(data  => this.handleFetchPageSuccess(data),
      error => this.handleError(error));
    }
    
    handleFetchPageSuccess(pData){
      
      if(pData.STATUS == "OK"){
        this.pageDetails = pData.PAGE[0];
      }
      
      // stop the progress bar
      this.processBar = false;
    }
    
    handleError(error){
      console.error(error);
    }
  }
  