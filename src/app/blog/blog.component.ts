import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuickLinkService } from '../quick-link.service';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { BlogService } from '../blog.service';
import { FlagsService } from '../flags.service';
import { ConfigService } from '../config.service';

interface IBlogsRequest {
  BLOG_TYPE                : number,
  BLOG_ID                  : number,
  STORE_ID                 : any,
  CLIENT_APP_VERSION_CODE  : any,
  CLIENT_APP_VERSION_NAME  : any,
  BUILD_CONFIGURATION_TYPE : any,
  STATUS_CODE              : number
}

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})

export class BlogComponent implements OnInit {
  
  constructor(private configService : ConfigService,
    private route                : ActivatedRoute, 
    private blogService          : BlogService,
    private flagService          : FlagsService) { }
    
    //variables
    processBar                  = false;
    blogDetails            = {
      BLOG_TITLE   : "",
      BLOG_CONTENT : "",
      BLOG_POST    : [ {
        BLOG_ID    : 0, 
        BLOG_TITLE : "", 
      }]
    };
    
    blogId                 = 0;
    
    ngOnInit() {
      
      // this.flagService.hideHeader();
      this.flagService.showSearch();
      this.flagService.showHeaderFooter();
      if(window.innerWidth < 600){
        this.flagService.hideFooter();
      }
      
      this.GetBlogIdByParam();
      this.fetchBlogsById();
    }
    
    GetBlogIdByParam(){
      this.route.params.subscribe(params => {
        if(params['id'] != undefined){
          this.blogId = +params['id'];
        }
      });
    }
    
    makeFetchBlogsRequestObject(){
      let blogsRequestObj : IBlogsRequest = {
        BLOG_TYPE                : ApplicationConstants.PARENT_BLOG_TYPE_ID,
        BLOG_ID                  : this.blogId,
        STORE_ID                 : this.configService.getStoreID(),
        CLIENT_APP_VERSION_CODE  : this.configService.getClientAppVersionCode(),
        CLIENT_APP_VERSION_NAME  : this.configService.getClientAppVersionName(),
        BUILD_CONFIGURATION_TYPE : this.configService.getBuildConfigurationType(),
        STATUS_CODE              : ApplicationConstants.STATUS_CODE_ENABLE,
      }
      return blogsRequestObj;
    }
    
    fetchBlogsById() {
      this.processBar = true;
      this.blogService.fetchBlogById(this.makeFetchBlogsRequestObject())
      .subscribe(data  => this.handleFetchBlogsSuccess(data),
      error => this.handleError(error));
    }
    
    handleFetchBlogsSuccess(pData){
      
      if(pData.STATUS == "OK"){
        this.blogDetails = pData.BLOG[0];
      }
      
      console.log(this.blogDetails.BLOG_TITLE);
      
      // stop the progress bar
      this.processBar = false;
    }
    
    handleError(error){
      console.error(error);
    }
  }
  