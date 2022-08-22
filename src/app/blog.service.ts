import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConstants } from 'src/ApiConstants';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private configService : ConfigService,private _http: HttpClient) { }

  fetchBlogById(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FetchBlogsAPI, requestObject).pipe(map(data => data, error => error));
  }

  fetchBlogPostById(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FetchBlogsAPI, requestObject).pipe(map(data => data, error => error));
  }
}
