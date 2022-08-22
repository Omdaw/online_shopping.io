import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiConstants } from 'src/ApiConstants';

@Injectable({
  providedIn: 'root'
})

export class SearchService {
  constructor(private configService : ConfigService,
              private _http: HttpClient) { }

  searchProductByInputIdAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.searchProductByInputIdAPI, requestObject).pipe(map(data => data, error => error));
  }

  public displaySearch = false;

}
