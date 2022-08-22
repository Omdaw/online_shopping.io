import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { CommonService } from '../common.service';
import { ConfigService } from '../config.service';
import { EmailandphonenumberverifiationService } from '../emailandphonenumberverifiation.service';
import { FlagsService } from '../flags.service';
import { LoginService } from '../login.service';
import { ReferenceMethodsService } from '../reference-methods.service';
import { SocialSignupService } from '../social-signup.service';
import { TransactionsService } from '../transactions.service';
import { WalletMethodsService } from '../wallet-methods.service';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../myorders/myorders.component';


@Component({
  selector: 'app-checkout-page-login',
  templateUrl: './checkout-page-login.component.html',
  styleUrls: ['./checkout-page-login.component.css']
})
export class CheckoutPageLoginComponent implements OnInit {

  loginEmail = "";
  loginPassword = "";
  otp: number;

  constructor(
    private flagsService: FlagsService,
    public commonService: CommonService,
    private _router: Router,
    public socialSignupService: SocialSignupService,
    public configService: ConfigService,
    public referenceMethodsService: ReferenceMethodsService,
    public loginservice: LoginService,
    public flashMessagesService: FlashMessagesService,
    public emailandphonenumberverifiationService: EmailandphonenumberverifiationService,
    public walletMethodsService: WalletMethodsService,
    public transactionsService: TransactionsService,
    public dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.commonService.sendMessage("hideFM");
    this.flagsService.hideHeader();
    this.flagsService.hideFooter();
    this.flagsService.hideHeaderFooter();
  }

  loginRequestObject = {};

  makeLoginRequestObject() {
    this.loginRequestObject = {
      APPLICATION_ID: this.commonService.applicationId,
      SUBSCRIBER_EMAIL_ID: this.loginEmail,
      SUBSCRIBER_PASSWORD: this.loginPassword,
    }
  }

  makeDeleteTempSubscriberRequestObject() {
    this.loginRequestObject = {
      APPLICATION_ID: this.commonService.applicationId,
      TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      SUBSCRIBER_EMAIL_ID: this.loginEmail,
      SUBSCRIBER_PASSWORD: this.loginPassword,
      STORE_ID: this.configService.getStoreID(),
      REFERRAL_FLAG: this.referenceMethodsService.referralFlag,
      REFERRAL_URL: this.referenceMethodsService.referralUrl,
    }
  }

  login() {
    let tempSubscriberFlag = 0;
    tempSubscriberFlag = +this.commonService.lsTempSubscriberFlag();
    if (tempSubscriberFlag > 0) {
      this.makeDeleteTempSubscriberRequestObject();
      this.loginservice.deleteTemporarySubscriberAndLogInAPI(this.loginRequestObject).subscribe(data => this.handleTempSubscriberLoginSuccess(data), error => this.handleError(error));
    } else {
      this.makeLoginRequestObject();
      this.loginservice.subscriberLoginAPI(this.loginRequestObject).subscribe(data => this.handleLoginSuccess(data), error => this.handleError(error));
    }
  }
  handleError(error) {
  }

  handleLoginSuccess(data) {
    if (data.STATUS == "OK") {
      this.commonService.notifyMessage(this.flashMessagesService, "User Login Success.");
      this.commonService.addSubscriberIdTols(data.SUBSCRIBER.SUBSCRIBER_ID)
      this.commonService.addLoggedInUsernameTols(data.SUBSCRIBER.SUBSCRIBER_FIRST_NAME + data.SUBSCRIBER.SUBSCRIBER_LAST_NAME);
      this.commonService.addTempSubscriberFlagTols(0);
      this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
      this.commonService.isUserLoggedIn();
      this.afterSuccessfullLogin();
    } else {
      this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
    }
  }

  handleTempSubscriberLoginSuccess(data) {
    if (data.STATUS == "OK") {
      if (data.SUBSCRIBER.SUBSCRIBER_EMAIL_OTP_STATUS == 1) { // this means otp is verified
        let authToken = data.SUBSCRIBER.AUTHENTICATION_TOKEN;
        let subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
        let tempSubscriberFlag = 0;
        let transactionId = 0;
        this.commonService.addStoreData(authToken, subscriberId, tempSubscriberFlag, transactionId);

        let subscriberObject = {
          name: data.SUBSCRIBER.SUBSCRIBER_FIRST_NAME + " " + this.commonService.checkIfNull(data.SUBSCRIBER.SUBSCRIBER_LAST_NAME),
          email: data.SUBSCRIBER.SUBSCRIBER_EMAIL_ID,
          mobile: data.SUBSCRIBER.SUBSCRIBER_MOBILE_NR
        }

        this.commonService.addSubscriberObjectTols(subscriberObject);
        this.loginservice.checkTransactionArrayAndUpdate(data);
        this.afterSuccessfullLogin();
        this.commonService.isUserLoggedIn();
      } else {

        this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
        this.emailandphonenumberverifiationService.deleteTempSubsReqObject = {
          APPLICATION_ID: this.commonService.applicationId,
          TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
          SUBSCRIBER_EMAIL_ID: this.loginEmail,
          SUBSCRIBER_PASSWORD: this.loginPassword,
          STORE_ID: this.configService.getStoreID()
        }
        this._router.navigate(['/collections/otp']);
      }
      this.walletMethodsService.fetchWalletMoneyBySubscriberIdAPI();

      this.referenceMethodsService.referralFlag = false;

    } else {
      this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
    }
  }

  afterSuccessfullLogin() {
    (async () => {
      this.transactionsService.checkoutApi();
      this.commonService.notifySuccessMessage(this.flashMessagesService, "User Login Success.");
      await this.delay(ApplicationConstants.notification_display_time);
      this._router.navigate(['/collections/checkout-new'], { replaceUrl: true });

      (async () => {
        await this.commonService.delay(ApplicationConstants.wait_time);
        if (this.transactionsService.unavailableProductsArray.length > 0) {
          this.openDialog();
        }
      })();
    })();
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Dialog
  link: string;
  openDialog(): void {
    const dialogRef = this.dialog.open(UnavailableProductsDialog, {
      width: '1200px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.transactionsService.checkCartItems();
    });
  }
  // Dialog ends

  ngOnDestroy() {
    this.commonService.sendMessage("showFM");
  }

}

export class UnavailableProductsDialog {

  /* To copy Text from Textbox */
  copyInputMessage(inputElement) {

    console.log("Hello");
    console.log(inputElement);

    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  constructor(private configService: ConfigService,
    public unavailableProdDialog: MatDialogRef<UnavailableProductsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public transactionsService: TransactionsService
  ) { }

  onNoClick(): void {
    this.unavailableProdDialog.close();
  }

  closeDialogue(): void {
    this.unavailableProdDialog.close();
  }
}
