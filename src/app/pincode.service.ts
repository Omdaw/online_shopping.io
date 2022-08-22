import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiConstants } from 'src/ApiConstants';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})

export class PincodeService {

  constructor(private configService : ConfigService,
              private _http: HttpClient) { }

  checkDeliveryLocationPincodeAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.checkDeliveryLocationPincodeAPI, requestObject).pipe(map(data => data, error => error));
  }
}
