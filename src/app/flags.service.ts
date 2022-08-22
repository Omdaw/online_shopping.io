import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})

export class FlagsService {

  constructor(private configService : ConfigService,) { }

  public mobileOtpVerficationCallFromUpdateMobile = false;

  public continueShoppingCallFromInvoice  = 0; //continue Shopping from invoice should take u to Home Page
  public inDeliveryPageFlag               = 0;
  public orderStatusCodePopUp             = false;
  public showFooterFlag                   = true;
  public showHeaderFlag                   = true;
  public completelyWalletPaymentFlag      = false;
  public showSearchInMobile               = true;
  public showSecondaryHeaderFlag          = true;

  public resetFlags(){
    this.continueShoppingCallFromInvoice  = 0;
    this.inDeliveryPageFlag               = 0;
  }

  public showHeaderFooter(){
    this.showFooterFlag = true;
    this.showHeaderFlag = true;
  }

  public hideHeaderFooter(){
    this.showFooterFlag = false;
    this.showHeaderFlag = false;
  }

  public hideFooter(){
    this.showFooterFlag = false;
  }

  public hideHeader(){
    this.showHeaderFlag = false;
  }

  showSearch(){
    this.showSearchInMobile = true;
  }

  hideSearch(){
    this.showSearchInMobile = false;
  }
}
