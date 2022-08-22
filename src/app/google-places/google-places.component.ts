/// <reference types="@types/googlemaps" />
import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input } from '@angular/core';
import { MapsService } from '../maps.service';

import $ from "jquery";

// declare function initMap(param1,param2): any;
declare function getReverseGeocodingData(param1, param2):any;

@Component({
  selector: 'app-google-places',
  templateUrl: './google-places.component.html',
  styleUrls: ['./google-places.component.css']
})
export class GooglePlacesComponent implements OnInit, AfterViewInit {

  @Input() adressType: string;
    @Output() setAddress: EventEmitter<any> = new EventEmitter();
    @ViewChild('addresstext', {static: false}) addresstext: any;

    autocompleteInput: string;
    queryWait: boolean;

  constructor(
    public mapsService : MapsService
  ) { }

  ngOnInit() {
    this.autocompleteInput = $(".googleAddress").val();
  }

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  private getPlaceAutocomplete() {
    
      const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
          {
              componentRestrictions: { country: 'IND' },
              types: [this.adressType]  // 'establishment' / 'address' / 'geocode'
          });

      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        if (place.geometry === undefined || place.geometry === null) {
          return;
        }
          this.mapsService.googleAddress = place.formatted_address;
          this.invokeEvent(place);

          this.mapsService.lattitude = place.geometry.location.lat();
          this.mapsService.longitude = place.geometry.location.lng();

      });
  }

  addressSelected(event){
    this.mapsService.progressBar = true;
  }

  invokeEvent(place: Object) {
      this.setAddress.emit(place);
      this.mapsService.progressBar = false;
  }

  // Map
  locateMe(){
    this.mapsService.getPosition().then(pos=>
      {
        // console.log("Details");
        // console.log(pos);

        //  console.log(`Positon: ${pos.lng} ${pos.lat}`);
          this.mapsService.lattitude = pos.lat;
          this.mapsService.longitude = pos.lng;

          // initMap(this.mapsService.lattitude, this.mapsService.longitude);

          getReverseGeocodingData(pos.lat, pos.lng); // this function is in my.js

          (async () => { 

            await this.delay(1000);

            this.autocompleteInput          = $(".addressSearchInputCls").val(); 
            this.mapsService.googleAddress  = this.autocompleteInput;

        })();
      });
  }  
  // Map ends 

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
