import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  public lattitude   = 0;
  public longitude   = 0;
  public zoom  = 18;
  progressBar = false;
  googleAddress = "";

  constructor(private configService : ConfigService,) { }

  getPosition(): Promise<any>
  {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {

          resolve({lng: resp.coords.longitude, lat: resp.coords.latitude, details: resp});
        },
        err => {
          reject(err);
        });
    });

  }
}
