import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { ApiConstants } from 'src/ApiConstants';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private configService : ConfigService,
              private _http         : HttpClient) { }


  uploadFile(pFileData): any{

    return this._http.post(this.configService.getApiBaseURL() + ApiConstants.UPLOAD_FILE_API, pFileData)
                     .pipe(map(data => data, error => error));
  }
}
