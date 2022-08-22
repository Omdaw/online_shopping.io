import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConstants } from 'src/ApiConstants';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(private configService : ConfigService,private _http : HttpClient) { }

  fetchPageById(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FetchPagesAPI, requestObject).pipe(map(data => data, error => error));
  }
}
