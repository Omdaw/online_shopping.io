import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators/map'; 
import { ApplicationConstants } from 'src/ApplicationConstants';
import { ProductService } from '../product.service';
import { QuickLinkService } from '../quick-link.service';
import { FlagsService } from '../flags.service';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-quick-link',
  templateUrl: './quick-link.component.html',
  styleUrls: ['./quick-link.component.css']
})
export class QuickLinkComponent implements OnInit {
  
  constructor(private configService : ConfigService, 
    private _router        : Router, 
    private route                     : ActivatedRoute, 
    private quickLinkService          : QuickLinkService,
    private flagsService              : FlagsService,
    ) { }
    
    //variables
    processBar                  = false;
    fetchQuickLinkRequestObject = {};
    quickLinkDetails            : any;
    quickLinkId                 = 0;
    ngOnInit() {
      
      this.flagsService.showSearch();
      this.flagsService.showHeaderFooter();
      if(window.innerWidth < 600){
        this.flagsService.hideFooter();
      }
      
      this.GetQuickLinkIdByParam();
      this.fetchQuickLinkById();
      
    }
    
    GetQuickLinkIdByParam(){
      this.route.params.subscribe(params => {
        if(params['id'] != undefined){
          this.quickLinkId = +params['id'];
        }
      });
    }
    
    
    makeFetchQuickLinkByIdRequestObject(){
      this.fetchQuickLinkRequestObject = {
        STORE_ID                 : this.configService.getStoreID(),
        QUICK_LINK_ID            : this.quickLinkId
      }
    }
    
    fetchQuickLinkById(){
      this.processBar = true;
      this.makeFetchQuickLinkByIdRequestObject();
      this.quickLinkService.fetchQuickLinkById(this.fetchQuickLinkRequestObject).subscribe(data => this.handleFetchQuickLinkByIdSuccess(data), error => this.handleError(error));
    }
    
    handleFetchQuickLinkByIdSuccess(pData){
      
      if(pData.STATUS ='OK'){
        this.quickLinkDetails = pData.QUICK_LINK[0];
        
      }
      
      // stop the progress bar
      this.processBar = false;
    } 
    
    handleError(error){
      
    }
    
  }
  