import { Injectable } from '@angular/core';
import { SubscriberService } from './subscriber.service';
import { ConfigService } from './config.service';
import { CommonService } from './common.service';

export interface IFetchSubscriberDetails{
  SUBSCRIBER_ID                        : number,
  SUBSCRIBER_FIRST_NAME                : string,
  SUBSCRIBER_LAST_NAME                 : string,
  SUBSCRIBER_MOBILE_NR                 : string,
  SUBSCRIBER_EMAIL_ID                  : string,
  SUBSCRIBER_PASSWORD                  : string,
  SUBSCRIBER_STATUS_CODE               : number,
  SUBSCRIBER_STATUS_NAME               : string,
  SUBSCRIBER_PICTURE_NAME              : string,
  SUBSCRIBER_EMAIL_OTP_CODE            : string,
  SUBSCRIBER_EMAIL_OTP_GENERATED_DATE  : string,
  SUBSCRIBER_EMAIL_OTP_STATUS          : string,
  SUBSCRIBER_SMS_OTP_CODE              : string,
  SUBSCRIBER_SMS_OTP_GENERATED_DATE    : string,
  SUBSCRIBER_SMS_OTP_STATUS            : string,
  SUBSCRIBER_TOKEN                     : string,
  RESET_PASSWORD_TOKEN                 : string,
  SUBSCRIBER_CREATED_DATE              : string,
  SUBSCRIBER_LAST_MODIFIED             : string,
  CREATED_DATE                         : string,
  LAST_MODIFIED_DATE                   : string,
  APPLICATION_ID                       : string,
  APPLICATION_NAME                     : string,
  PROVIDER_CODE                        : string,
  PROVIDER_CODE_NAME                   : string,
  PROFILE_ID                           : number,
  PROFILE_NAME                         : string,
}

@Injectable({
  providedIn: 'root'
})


export class SubscriberMethodsService {

  constructor(private configService : ConfigService,
    private subscriberService : SubscriberService,
    public commonService         : CommonService
  ) { }

    public subscriberDetailsObject  : IFetchSubscriberDetails;
    public fetchSubcriberDetailsBySubscriberId(){

      let tempObj = {
        APPLICATION_ID  : this.commonService.applicationId,
        SUBSCRIBER_ID   : this.commonService.lsSubscriberId()
      }

      this.subscriberService.fetchSubscriberAPI(tempObj).subscribe(data => this.handleFetchSubcriberDetailsBySubscriberIdSuccess(data), error => error);
    }

    handleFetchSubcriberDetailsBySubscriberIdSuccess(data){

      console.log(data);

      if(data.STATUS == "OK"){
        this.subscriberDetailsObject = data.SUBSCRIBER[0];
      }
    }

}
