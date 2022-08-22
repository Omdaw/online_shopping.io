import { Injectable } from '@angular/core';
import { DeliveryAddressService } from './delivery-address.service';
import { ConfigService } from './config.service';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryAddresssMethodsService {

  constructor(private configService : ConfigService,
    private deliveryAddressService : DeliveryAddressService,
    public commonService         : CommonService
  ) { }

  public deliveryAddressesArray = [];
  fetchDeliveryAddressRequestObject = {};

  makeFetchDeliveryAddressRequestObject(){
    this.fetchDeliveryAddressRequestObject = {
      SUBSCRIBER_ID : + this.commonService.lsSubscriberId()
    }
  }

  public fetchDeliveryAddress(){
    this.makeFetchDeliveryAddressRequestObject();
    this.deliveryAddressService.fetchSubscriberAddress(this.fetchDeliveryAddressRequestObject)
    .subscribe(data => this.handleFetchDeliveryAddressSuccess(data), error => this.handleError(error))
  }

  numberOfRows = [];
  
  handleFetchDeliveryAddressSuccess(data){
  
    if(data.STATUS == "OK"){
  
      this.deliveryAddressesArray = [];
  
      let delArray = data.SUBSCRIBER_ADDRESS;
      // this.deliveryAddressesArray  = data.SUBSCRIBER_ADDRESS;
       let arrayLength= Math.ceil(delArray.length/3);
       
      //  for(let i=0;i<arrayLength;i++){
      //   let addressArray = []
      //  }

      let index =0;
       for(let row =0; row<arrayLength; row++){
        
         let tempArray = [];
         if ( index < delArray.length  ){
          for(let col=0; col<3; col++){
            if(delArray[index]) tempArray.push(delArray[index]);
            index++;
          }
          this.deliveryAddressesArray.push(tempArray);
        }

       }
      //  console.log(this.deliveryAddressesArray);
    }
  }

  handleError(error){

  }
}
