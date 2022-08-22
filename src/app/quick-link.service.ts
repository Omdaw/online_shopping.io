import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiConstants } from 'src/ApiConstants';
import { ConfigService } from './config.service';
@Injectable({
  providedIn: 'root'
})
export class QuickLinkService {
  
  constructor(private configService : ConfigService,
              private _http: HttpClient) { }

  fetchQuickLinkById(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FetchQuickLinkAPI, requestObject).pipe(map(data => data, error => error));
  }

}
