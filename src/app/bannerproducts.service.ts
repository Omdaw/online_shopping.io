import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiConstants } from 'src/ApiConstants';
import { ConfigService } from './config.service';
@Injectable({
  providedIn: 'root'
})
export class BannerproductsService {
  constructor(private configService : ConfigService,private _http: HttpClient) { }

  fetchProductByBannerIdAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.fetchProductByBannerIdAPI, requestObject).pipe(map(data => data, error => error));
  }
}
