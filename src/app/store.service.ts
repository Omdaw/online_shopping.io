import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConstants } from 'src/ApiConstants';
import { environment } from 'src/environments/environment';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(
    private configService : ConfigService,
    private _http         : HttpClient
  ) { }

  fetchStoreDetailsByApplicationUrl(requestObject):Observable<any>{
    return this._http.post<any>(environment.apiBaseUrl + ApiConstants.fetchStoreDetailsByUrlAPI, requestObject).pipe(map(data => data, error => error));
  }
}
