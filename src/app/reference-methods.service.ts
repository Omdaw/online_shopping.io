import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { ReferenceService } from './reference.service';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ReferenceMethodsService {

  constructor(private configService : ConfigService,
              public referenceService    : ReferenceService,
              public commonService         : CommonService
            ) { }

   // Fetch Referal URL By Subscriber API
   fetchReferralURLBySubscriberIdAPIRequestObject = {};
   public referalLinkObject = {
      REFERRAL_CODE            : "",
      ANDROID_APP_LINK         : "",
      DELIVERY_APP_LINK        : "",
      IOS_APP_LINK             : "",
      BACK_END_APP_LINK        : "",
      FRONT_END_APP_LINK       : "",
   };
   makeFetchReferralURLBySubscriberIdAPIRequestObject(){
     this.fetchReferralURLBySubscriberIdAPIRequestObject = {
       SUBSCRIBER_ID  : this.commonService.lsSubscriberId(),
       STORE_ID       : this.configService.getStoreID() 
     }
   }
 
   public fetchReferralURLBySubscriberId(){
     
    this.makeFetchReferralURLBySubscriberIdAPIRequestObject();
    
    this.referenceService.genarateReferralCodeApi(this.fetchReferralURLBySubscriberIdAPIRequestObject)
     .subscribe(data => this.handleGenarateReferralCodeApiSuccess(data), error => error);
   }  
 
   handleGenarateReferralCodeApiSuccess(data){
       this.referalLinkObject = data;

       //Now write a logic to share this url with friends 
   }
 // Fetch Referal URL By Subscriber API ends 

    public encodedSubscriberId  = "";
    public referralFlag         = false;
    public referralUrl         = "";

}
