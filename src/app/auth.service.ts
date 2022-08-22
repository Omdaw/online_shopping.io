import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
// import decode from 'jwt-decod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private configService : ConfigService,) { }

  getToken(){
    return localStorage.getItem('authToken');
  }

  // public isAuthenticated(): boolean {
  //   // get the token
  //   const token = this.getToken();
  //   // return a boolean reflecting 
  //   // whether or not the token is expired
  //   return tokenNotExpired(null, token);
  // }
}
