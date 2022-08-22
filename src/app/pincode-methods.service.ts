import { Injectable } from '@angular/core';
import { PincodeService } from './pincode.service';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { ConfigService } from './config.service';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class PincodeMethodsService {

  constructor(private configService : ConfigService,
    private pincodeService :PincodeService,
    public commonService         : CommonService
  ) { }

  public pincodeAvailablity = ApplicationConstants.PINCODE_AVAILABLITY_DID_NOT_CHECK;

  public checkDeliveryLocationPincodeResultObject = {
      DELIVERY_LOCATION_PINCODE_ID  : 0,
      STORE_ID                      : 0,
      STATE_NAME_CODE               : 0,
      DISTRICT_NAME_CODE            : 0,
      PINCODE                       : 0,
      DELIVERY_IND_CODE             : 0,
      DELIVERY_CHARGE               : 0,
      DELIVERY_DURATION_UNIT        : 0,
      DELIVERY_DURATION_UNIT_TYPE   : "",
      DELIVERY_NOTES                : "",
      STATUS_CODE                   : 0,
      CREATED_DATE                  : "",
      LAST_MODIFIED_DATE            : ""
  };

  public checkDeliveryLocationPincodeFailureResultObject = {
    ERROR_MSG : ""
  }

  public enteredPincode = 0;
  public checkDeliveryLocationPincodeAPIRequestObject = {
    SUBSCRIBER_ID   : this.commonService.lsSubscriberId(),
    STORE_ID        : this.configService.getStoreID(),
    PINCODE         : this.enteredPincode,
    TRANSACTION_ID  : this.commonService.lsTransactionId()
  };
  
  public checkDeliveryLocationPincodeAPI(){
    this.pincodeService.checkDeliveryLocationPincodeAPI(this.checkDeliveryLocationPincodeAPIRequestObject).subscribe(data => this.handleCheckDeliveryLocationPincodeAPI(data), error => this.handleError(error));
  }

  handleCheckDeliveryLocationPincodeAPI(data){
    if(data.STATUS == "OK"){
      this.pincodeAvailablity = ApplicationConstants.PINCODE_AVAILABLITY_AVAILABLE;
      this.checkDeliveryLocationPincodeResultObject = data.DELIVERY_LOCATION_PINCODE;
    }else if(data.STATUS == "FAIL"){
      this.pincodeAvailablity = ApplicationConstants.PINCODE_AVAILABLITY_NOT_AVAILABLE;
      this.checkDeliveryLocationPincodeFailureResultObject.ERROR_MSG = data.ERROR_MSG;
    }
  }

  handleError(error){

  }
}
