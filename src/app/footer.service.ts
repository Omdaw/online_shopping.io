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
export class FooterService {
  constructor(private configService : ConfigService,
              private _http: HttpClient) { }

  fetchQuickLinks(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FetchQuickLinkAPI, requestObject).pipe(map(data => data, error => error));
  }

  fetchSocialMediaAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.fetchSocialMediaAPI, requestObject).pipe(map(data => data, error => error));
  }

  fetchParentBlogs(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FetchBlogsAPI, requestObject).pipe(map(data => data, error => error));
  }

  fetchPages(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.FetchPagesAPI, requestObject).pipe(map(data => data, error => error));
  }

  createNewsletterAPI(requestObject):Observable<any>{
    return this._http.post<any>(this.configService.getApiBaseURL() + ApiConstants.CREATE_NEWSLETTER_API, requestObject).pipe(map(data => data, error => error));
  }
}
