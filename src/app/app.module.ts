import { ConfigService } from './config.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HomepageComponent } from './homepage/homepage.component';
import { TokenInterceptorService } from './token-interceptor.directive';
import { AuthService } from './auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MainNavComponent, DialogOverviewExampleDialog } from './main-nav/main-nav.component';
import { CategoryNavComponent, InviteDialogForMobile } from './category-nav/category-nav.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import { StoreComingSoonComponent } from './store-coming-soon/store-coming-soon.component';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
// import { SafePipe } from './SafePipe';
import { MatInputModule } from '@angular/material/input';
import { SocialLoginModule, GoogleLoginProvider, FacebookLoginProvider, SocialAuthServiceConfig } from 'angularx-social-login';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { InternalCommonModule } from './internal-common/internal-common.module';
import { CheckoutPageLoginComponent } from './checkout-page-login/checkout-page-login.component';
import { CheckoutPageSignupComponent } from './checkout-page-signup/checkout-page-signup.component';
import { CheckoutPageOtpLoginComponent } from './checkout-page-otp-login/checkout-page-otp-login.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { TestComponent } from './test/test.component';
// import { ClickOutsideModule } from 'ng-click-outside';

export function ConfigLoader(configService: ConfigService) {
  return () => configService.load(environment.storeData);
}


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HomepageComponent,
    MainNavComponent,
    CategoryNavComponent,
    DialogOverviewExampleDialog,
    InviteDialogForMobile,
    StoreComingSoonComponent,
    CheckoutPageLoginComponent,
    CheckoutPageSignupComponent,
    CheckoutPageOtpLoginComponent,
    ViewProductComponent,
    TestComponent,
    // SafePipe
  ],
  imports: [
    InternalCommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule,
    FlashMessagesModule.forRoot(),
    MatDialogModule,
    MatSnackBarModule,
    SocialLoginModule,
    MatExpansionModule
    // ClickOutsideModule
  ],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: ConfigLoader,
      deps: [ConfigService],
      multi: true
    },
    AuthService,
    
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              ApplicationConstants.googleClientId
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(ApplicationConstants.facebookClientId)
          }
        ]
      } as SocialAuthServiceConfig,
    },
    DatePipe
  ],
  bootstrap: [AppComponent]

})
export class AppModule {

}







