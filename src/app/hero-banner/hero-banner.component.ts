import { Component, OnInit } from '@angular/core';
import { BannerService } from '../banner.service';
import { CommonService } from '../common.service';
import { ProductsMidLayerService } from '../products-mid-layer.service';
import { TransactionsService } from '../transactions.service';
import * as $ from 'jquery';
import { ProductBannerCartService } from '../product-banner-cart.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-hero-banner',
  templateUrl: './hero-banner.component.html',
  styleUrls: ['./hero-banner.component.css']
})
export class HeroBannerComponent implements OnInit {

  constructor(
    public bannerService: BannerService,
    public productBannerCartService: ProductBannerCartService,
    public commonService: CommonService,
    public productMidLayerService: ProductsMidLayerService,
    public transactionService: TransactionsService,
    public sanitizer: DomSanitizer,
  ) {
   }

  ngOnInit() {
    this.headersHeight = this.getHeadersHeight();
  }

  headersHeight: number;

  getHeaderBannerClassName(index) {
    let className = "";
    if (index == 0) className = 'active';
    return className;
  }

  // Hero Banner 
  getHeroBannerHeightInPixels(heightInPercentage) {
    if (heightInPercentage > 0) {
      let availableHeight = screen.availHeight - this.headersHeight;
      return (heightInPercentage * availableHeight) / 100;
    } else {
      return null; // this is when adopt to image is selected
    }
  }

  getBannerWidthInPercentage(rowObject) {

    if (rowObject.SECTION_HEIGHT_IN_PERCENTAGE > 0) {
      if (window.innerWidth <= 600) return 100; // In Mobile all banners will have 100% width
      return rowObject.SECTION_WIDTH_IN_PERCENTAGE;
    } else {
      return null; // this is when adopt to image is selected
    }
  }

  getHeadersHeight() {
    let headerHeight = 60;
    let secondHeaderheight = 60;
    let additionalHeight = 0;
    if (window.innerWidth < 600) {
      let headerDomObject = document.getElementById("mobileHeader");
      if(headerDomObject){
        let headerObject = window.getComputedStyle(headerDomObject);
        if(headerObject) {
           let header = +headerObject.height.replace('px', '');
            if(header) headerHeight = header;
        }
      }
      
    } else {
      let headerDomObject = document.getElementById("firstHeader");
      if(headerDomObject){
        let headerObject = window.getComputedStyle(headerDomObject);
        if(headerObject){
          let firstHeader = +headerObject.height.replace('px', '');
          if(firstHeader) headerHeight = firstHeader;
          console.log("headerHeight", headerHeight);
        }
      }
      

      let secondHeaderDomObject = document.getElementById("secondHeader");
      if(secondHeaderDomObject){
        let secondHeaderObject = window.getComputedStyle(secondHeaderDomObject);
        if(secondHeaderObject){
          let secondHeader = +secondHeaderObject.height.replace('px', '');
          if(secondHeader) secondHeaderheight = secondHeader;
          console.log("secondHeaderheight", secondHeaderheight);
        }
      }
      additionalHeight = 80;
    }


    return (headerHeight + secondHeaderheight + additionalHeight);
  }

}
