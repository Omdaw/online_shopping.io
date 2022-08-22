import { Component, OnInit, Inject } from '@angular/core';
import { WalletMethodsService } from '../wallet-methods.service';
import { DeliveryAddresssMethodsService } from '../delivery-addresss-methods.service';
import { SubscriberMethodsService } from '../subscriber-methods.service';
import { UserProfileService } from '../user-profile.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { CommonService } from '../common.service';
import { DeliveryAddressService } from '../delivery-address.service';
import { FlagsService } from '../flags.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MapsService } from '../maps.service';

import $ from "jquery";
import { SubscriberService } from '../subscriber.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personaldetails',
  templateUrl: './personaldetails.component.html',
  styleUrls: ['./personaldetails.component.css']
})
export class PersonaldetailsComponent implements OnInit {
  
  constructor(
    public walletMethodsService             :   WalletMethodsService,
    public deliveryAddresssMethodsService   :   DeliveryAddresssMethodsService,
    public subscriberMethodsService         :   SubscriberMethodsService,
    public userProfileService               :   UserProfileService,
    public flashMessagesService             :   FlashMessagesService,
    public commonService                    :   CommonService,
    public deliveryAddressService           :   DeliveryAddressService,
    public flagsService                     :   FlagsService,
    public dialog                           :   MatDialog,
    public mapsService                      :   MapsService,
    ) { }
    
    
    ngOnInit() {
      // this.flagsService.hideHeader();
      this.flagsService.inDeliveryPageFlag = 1; // Final Checklist
      this.flagsService.showSearch();
      this.flagsService.showHeaderFooter();
      this.deliveryAddresssMethodsService.fetchDeliveryAddress();
      this.subscriberMethodsService.fetchSubcriberDetailsBySubscriberId();
      
    }

  emptyGoogleAddress(){
    $(".googleAddress").val('');
  }

  // Delete Delivery address confirmation Dialog
  link: string;
  openDialog(addressObject): void {
    const dialogRef = this.dialog.open(DeleteDeliveryAddressConfirmation, {
      width: '600px',
      data : addressObject
    });

    dialogRef.afterClosed().subscribe(result => {
      this.deliveryAddresssMethodsService.fetchDeliveryAddress();
    });
  }
  // Delete Delivery address confirmation Dialog ends here 

    // update subscriber mobile number 
    openUpdateSubscriberMobileNumberDialog(): void {
      const dialogRef = this.dialog.open(UpdateSubscriberMobileNumber, {
        width: '600px'
      });
  
      dialogRef.afterClosed().subscribe(result => {
      });
    }
    // update subscriber mobile number ends here 
    
    subscriberPassword            = "";
    subscriberNewPassword         = "";
    subscriberResetPasswordToken  = "";
    updateSubscriberPassword(){
      let tempObject = {
        SUBSCRIBER_ID                   : this.commonService.lsSubscriberId(),
        SUBSCRIBER_PASSWORD             : this.subscriberPassword,
        SUBSCRIBER_NEW_PASSWORD         : this.subscriberNewPassword,
        SUBSCRIBER_RESET_PASSWORD_TOKEN : this.subscriberResetPasswordToken
      }
      this.userProfileService.updateSubscriberPasswordAPI(tempObject).subscribe(data => this.handleUpdateSubscriberPasswordSuccess(data), error => this.handleError(error));
    }
    
    handleUpdateSubscriberPasswordSuccess(data){
      if(data.STATUS == "OK"){
        this.commonService.notifyMessage(this.flashMessagesService, "Your password has changed successfully.");
        this.subscriberPassword = "";
        this.subscriberNewPassword = "";
      }else{
        this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
      }
    }
    
    handleError(error){
      this.commonService.notifyMessage(this.flashMessagesService, error.ERROR_MSG);
    }
    
    checkMandatoryFieldsForPasswrodChange(){
      let disableSaveButton = true;
      if(this.subscriberPassword != "" && this.subscriberNewPassword != "") disableSaveButton = false;
      return disableSaveButton;
    }
    
    // Create Delivery Address 
    subscriberAddressId                       = 0;
    addressLine1                              = "";
    addressLine2                              = "";
    addressPin                                = null;
    addressLabel                              = "Home"; // new-checklist-soln-delivery-address
    addressLabelCode                          = 1; // new-checklist-soln-delivery-address
    contactName                               = "";
    mobileNumber                              = "";
    addressStatus                             = 1;
    customLabel                               = "";
    addressId                                 = 0;
    subscriberId                              = 0; 
    createDeliveryAddressRequestObject        = {};
    
    // new-checklist-soln-delivery-address
    makeCreateDeliveryAddressRequestObject(){
      this.createDeliveryAddressRequestObject = {
        SUBSCRIBER_ID         : + this.commonService.lsSubscriberId(),
        ADDRESS_LINE1         : this.addressLine1,
        ADDRESS_LINE2         : this.addressLine2,
        ADDRESS_PINCODE       : this.addressPin,
        ADDRESS_LATITUDE      : this.lattitude,
        ADDRESS_LONGITUDE     : this.longitude,
        ADDRESS_LABEL         : this.addressLabel,
        CONTACT_NAME          : this.contactName,
        CONTACT_MOBILE_NR     : this.mobileNumber,
        ADDRESS_STATUS        : this.addressStatus,
        ADDRESS_CITY_ID       :     this.cityId,
        ADDRESS_STATE_ID      :     this.stateId,
        ADDRESS_COUNTRY_ID    :     this.countryId
      }
    }
    
    createDeliveryAddress(){
      if(this.subscriberAddressId>0){
        this.updateDeliveryAddress()
      } else {
        this.makeCreateDeliveryAddressRequestObject();
        this.deliveryAddressService.createSubscriberAddress(this.createDeliveryAddressRequestObject)
        .subscribe(data => this.handleCreateDeliveryAddressSuccess(data), error => this.handleError(error))
      }
    }
    
    handleCreateDeliveryAddressSuccess(data){
      if(data.STATUS == "OK"){
        this.refreshForm();
        this.deliveryAddresssMethodsService.fetchDeliveryAddress();
        this.commonService.notifyMessage(this.flashMessagesService, "Delivery Address Added Successfully.");
        this.closeDelAddDialog();
      }
    }
    
    // new-checklist-soln-delivery-address
    refreshForm(){
      this.subscriberAddressId = 0;
      this.addressId      = 0;
      this.subscriberId   = 0;
      this.addressLine1   = "";      
      this.addressLine2   = "";      
      this.addressPin     = 0;  
      this.addressLabel   = "";      
      this.contactName    = "";    
      this.mobileNumber   = "";  
      this.cityName       = "";      
      this.stateName      = "";      
      this.countryName    = "";      
    }
    
    // Create Delivery Address ends 
    
    // new-checklist-soln-delivery-address
    editDeliveryAddress(data){
      this.subscriberAddressId                =   data.SUBSCRIBER_ADDRESS_ID;
      this.addressId                          =   data.ADDRESS_ID;
      this.subscriberId                       =   data.SUBSCRIBER_ID; 
      this.addressLine1                       =   data.ADDRESS_LINE1; 
      this.addressLine2                       =   this.commonService.checkIfNull(data.ADDRESS_LINE2); 
      this.addressPin                         =   data.ADDRESS_PINCODE; 
      this.lattitude                          =   data.ADDRESS_LATITUDE;
      this.longitude                          =   data.ADDRESS_LONGITUDE;
      this.addressLabel                       =   data.ADDRESS_LABEL; 
      this.contactName                        =   data.CONTACT_NAME; 
      this.mobileNumber                       =   data.CONTACT_MOBILE_NR; 
      this.addressStatus                      =   data.ADDRESS_STATUS;
      this.cityName                           =   this.commonService.checkIfNull(data.ADDRESS_CITY_NAME);
      this.stateName                          =   this.commonService.checkIfNull(data.ADDRESS_STATE_NAME);
      this.countryName                        =   this.commonService.checkIfNull(data.ADDRESS_COUNTRY_NAME);
      
      this.highlightDeliveryAddressLabelByLabelName(data.ADDRESS_LABEL)
      
    }
    
    // Update Delivery Address 
    updateDeliveryAddressRequestObject = {};
    // new-checklist-soln-delivery-address
    makeUpdateDeliveryAddressRequestObject(){
      this.updateDeliveryAddressRequestObject = {
        SUBSCRIBER_ADDRESS_ID : this.subscriberAddressId,
        ADDRESS_ID            : this.addressId,
        SUBSCRIBER_ID         : this.subscriberId,
        ADDRESS_LINE1         : this.addressLine1,
        ADDRESS_LINE2         : this.commonService.checkIfNull(this.addressLine2),
        ADDRESS_PINCODE       : this.addressPin,
        ADDRESS_LATITUDE      : this.lattitude,
        ADDRESS_LONGITUDE     : this.lattitude,
        ADDRESS_LABEL         : this.addressLabel,
        CONTACT_NAME          : this.contactName,
        CONTACT_MOBILE_NR     : this.mobileNumber,
        ADDRESS_STATUS        : this.addressStatus,
        ADDRESS_CITY_ID       :     this.cityId,
        ADDRESS_STATE_ID      :     this.stateId,
        ADDRESS_COUNTRY_ID    :     this.countryId
      }
    }
    
    updateDeliveryAddress(){
      this.makeUpdateDeliveryAddressRequestObject();
      this.deliveryAddressService.updateSubscriberAddress(this.updateDeliveryAddressRequestObject)
      .subscribe(data => this.handleUpdateDeliveryAddressSuccess(data), error => this.handleError(error))
    }
    
    handleUpdateDeliveryAddressSuccess(data){
      if(data.STATUS == "OK"){
        
        this.deliveryAddresssMethodsService.fetchDeliveryAddress();
        
        (async () => { 
          
          this.commonService.notifyMessage(this.flashMessagesService, "Delivery Address Updated Successfully.");
          
          await this.commonService.delay(1000);
          
          this.refreshForm();
          this.closeDelAddDialog();
        })();
        
        
      }
    }
    // Update Delivery Address ends 
    
    updateAddressLabel(addressLabel){
      this.addressLabelCode = addressLabel;
      if(addressLabel == 1) this.addressLabel = "Home"; 
      if(addressLabel == 2) this.addressLabel = "Office"; 
      if(addressLabel == 3) this.addressLabel = this.customLabel;
    }
    
    getDeliveryAddressClass(deliveryAddressLabelCode){
      let cls = "";
      if(deliveryAddressLabelCode ==  this.addressLabelCode) cls = "highlightDeliveryAddressLabel";
      return cls;
    }
    
    checkMandatoryFieldsForCreateDeliveryAddress(){
      
      let isDisabled = true;
      if(this.addressLine1 != "" && this.addressPin != 0 &&  this.contactName != "" && this.mobileNumber != "" &&  this.cityName != "" 
      && this.stateName != "" && this.countryName != "") isDisabled = false;
      return isDisabled;
    }
    
    highlightDeliveryAddressLabelByLabelName(addressLabelName){
      if(this.addressLabel == "Home")  this.addressLabelCode = 1;
      else if(this.addressLabel == "Office") this.addressLabelCode = 2;
      else this.addressLabelCode = 3;
    }
    
    // Delete Delivery Address
    deleteDeliveryAddressRequestObject = {};
    deleteDeliveryAddress(addressId, subscriberAddressId){
      this.deleteDeliveryAddressRequestObject = {
        SUBSCRIBER_ID              : this.commonService.lsSubscriberId(),
        ADDRESS_ID                 : addressId,
        SUBSCRIBER_ADDRESS_ID      : subscriberAddressId
      }
      this.deliveryAddressService.deleteSubscriberAddress(this.deleteDeliveryAddressRequestObject)
      .subscribe(data => this.handleDeleteDeliveryAddressSuccess(data), error => this.handleError(error));
    }
    
    handleDeleteDeliveryAddressSuccess(data){
      if(data.STATUS == "OK"){
        this.deliveryAddresssMethodsService.fetchDeliveryAddress();
      }
    }
    // Delete Delivery Address ends 
    
    showDelAdd = false;
    openDelAddDialog(){
      this.showDelAdd = true;
    }
    
    closeDelAddDialog(){
      this.showDelAdd = false;
      this.refreshForm();
    }

    // new-checklist-soln-delivery-address From here
    lattitude                                 = 0;
    longitude                                 = 0;
    cityName                                  = "";
    stateName                                 = "";
    countryName                               = "";
    cityId                                    = 0;
    stateId                                   = 0;
    countryId                                 = 0;
    getCountryStateCityIdAndSave(){
      let requestObject = {
        ADDRESS_COUNTRY_NAME : this.countryName
      }
      this.deliveryAddressService.getCountryIdAPI(requestObject).subscribe(data => this.handleCountry(data), error => error )
    }
  
    handleCountry(pData){
        this.countryId = pData.ADDRESS_COUNTRY_ID;
        this.getStateId();
    }
  
    getStateId(){
      let requestObject = {
        ADDRESS_COUNTRY_ID : this.countryId,
        ADDRESS_STATE_NAME : this.stateName
      }
      this.deliveryAddressService.getStateIdAPI(requestObject).subscribe(data => this.handleState(data), error => error )
    }
  
    handleState(pData){
        this.stateId = pData.ADDRESS_STATE_ID;
        this.getCityId();
    }
  
    getCityId(){
      let requestObject = {
        ADDRESS_COUNTRY_ID  : this.countryId,
        ADDRESS_STATE_ID    : this.stateId,
        ADDRESS_CITY_NAME   : this.cityName
      }
      this.deliveryAddressService.getCityIdAPI(requestObject).subscribe(data => this.handleCity(data), error => error )
    }
  
    handleCity(pData){
        this.cityId = pData.ADDRESS_CITY_ID;
        this.createDeliveryAddress();
    }

    // new-checklist-soln-delivery-address Till Here
    
  }
  
// Delete Delivery Address Confirmation Dialog Code
export interface DialogData {
  link: string;
}

@Component({
  selector: 'delete-delivery-address-confirmation',
  templateUrl: './delete_delivery_address_confirmation.html',
})

export class DeleteDeliveryAddressConfirmation {

  constructor(
    public dialogRef: MatDialogRef<DeleteDeliveryAddressConfirmation>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public flashMessagesService: FlashMessagesService,
    public commonService: CommonService,
    public deliveryAddressService: DeliveryAddressService,
  ) { 
  }

  onNoClick(): void {
    this.dialogRef.close();

  }

  closeDialog(): void {
    this.dialogRef.close();
  }

   // Delete Delivery Address
   deleteDeliveryAddressRequestObject = {};
   deleteDeliveryAddress(){
     this.deleteDeliveryAddressRequestObject = {
       SUBSCRIBER_ID              : this.commonService.lsSubscriberId(),
       ADDRESS_ID                 : this.data.ADDRESS_ID,
       SUBSCRIBER_ADDRESS_ID      : this.data.SUBSCRIBER_ADDRESS_ID,
     }
     this.deliveryAddressService.deleteSubscriberAddress(this.deleteDeliveryAddressRequestObject)
     .subscribe(data => this.handleDeleteDeliveryAddressSuccess(data), error => error);
   }
   
   handleDeleteDeliveryAddressSuccess(data){
     if(data.STATUS == "OK"){
       this.closeDialog();
     }
   }
   // Delete Delivery Address ends 

}
// Delete Delivery Address Confirmation Dialog Code ends here 


// Update subscriber mobiler number Dialog starts here 

@Component({
  selector: 'update-subscriber-mobile-number',
  templateUrl: './update_subscriber_mobile_number.html',
})

export class UpdateSubscriberMobileNumber {

  constructor(
    public dialogRef                      : MatDialogRef<UpdateSubscriberMobileNumber>,
    @Inject(MAT_DIALOG_DATA) public data  : any,
    private commonService                 : CommonService,
    private subscriberService             : SubscriberService,
    private router                        : Router,
    private flagsService                  : FlagsService,
  ) { 
  }

  onNoClick(): void {
    this.dialogRef.close();

  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  updateSubscriberMobileNumber() {
    let requestObject = {
      SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
      SUBSCRIBER_MOBILE_NR: this.data.mobile
    }
    this.subscriberService.updateSubscriberMobileNrAPI(requestObject)
      .subscribe(data => this.handleUpdateSubscriberMobileNumber(data), error => error);
  }
   
  handleUpdateSubscriberMobileNumber(data){
    if(data.STATUS == "OK"){
    this.flagsService.mobileOtpVerficationCallFromUpdateMobile = true;
      this.router.navigate(['/collections/mobile-otp']);
    }
  }

}
// Update subscriber mobiler number Dialog ends here 