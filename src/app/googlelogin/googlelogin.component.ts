import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-googlelogin',
  templateUrl: './googlelogin.component.html',
  styleUrls: ['./googlelogin.component.css']
})
export class GoogleloginComponent implements OnInit {
  
  user: any;
  constructor(private configService : ConfigService,
    private _socioAuthServ: SocialAuthService
  ) { }

  // Method to sign in with google.
  singIn(platform : string): void {
    platform = GoogleLoginProvider.PROVIDER_ID;
    this._socioAuthServ.signIn(platform).then(
      (response) => {
        console.log(platform + " logged in user data is= " , response);
        this.user = response;
      }
    );
  }

  // Method to log out.
  signOut(): void {
    this._socioAuthServ.signOut();
    this.user = null;
    console.log('User signed out.');
  }

  ngOnInit() {
  }

}
