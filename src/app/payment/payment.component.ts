import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators/map'; 
import { ApplicationConstants } from 'src/ApplicationConstants';
import { ProductService } from '../product.service';
import { SubscriberService } from '../subscriber.service';
import { UserProfileService } from '../user-profile.service';
import { PaymentService } from '../payment.service';
import { ConfigService } from '../config.service';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  constructor(private configService : ConfigService, 
    private _router             : Router, 
    private route               : ActivatedRoute, 
    private paymentService      : PaymentService,
    private subscriberService   : SubscriberService,
    private userProfileService  : UserProfileService,
    public commonService         : CommonService
) { }

  ngOnInit() {
  }

  paymentRequestObject = {};

  makeUpdatePaymentRequestObject(){
    this.paymentRequestObject = {
      STORE_ID            : this.configService.getStoreID(),
      SUBSCRIBER_ID       : this.commonService.lsSubscriberId(),
      TRANSACTION_ID      : this.commonService.lsTransactionId(),
      PAYMENT_TYPE_ID     : 2,
      DELIVERY_STATUS_ID  : 1,
    }
  }

  updatePayment(){
    this.makeUpdatePaymentRequestObject();
    this.paymentService.updatePaymentTypeAPI(this.paymentRequestObject).subscribe(data => data, error => error)
  }

  handleUpdatePayment(data){
    if(data.STATUS == "OK"){
      console.log(data);
    }
  }

}
