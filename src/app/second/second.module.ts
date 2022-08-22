import { NgModule } from '@angular/core';

import { SecondRoutingModule } from './second-routing.module';
import { AboutComponent } from '../about/about.component';
import { ContactComponent } from '../contact/contact.component';
import { HelpComponent } from '../help/help.component';
import { FaqsComponent } from '../faqs/faqs.component';
import { TermsComponent } from '../terms/terms.component';
import { PrivacyComponent } from '../privacy/privacy.component';
import { QuickLinkComponent } from '../quick-link/quick-link.component';
import { SignupComponent } from '../signup/signup.component';
import { LoginComponent } from '../login/login.component';
import { DeliveryAddressComponent } from '../delivery-address/delivery-address.component';
import { MyordersComponent, CancelOrderDialog } from '../myorders/myorders.component';
import { DeliveryAndPaymentsComponent } from '../delivery-and-payments/delivery-and-payments.component';
import { ProductViewComponent, AddonDialog } from '../product-view/product-view.component';
import { PosOneComponent } from '../pos-one/pos-one.component';
import { ReviewComponent } from '../review/review.component';
import { FilterComponent } from '../filter/filter.component';
import { MobilecartComponent } from '../mobilecart/mobilecart.component';
import { OtpComponent } from '../otp/otp.component';
import { GoogleloginComponent } from '../googlelogin/googlelogin.component';
import { CheckoutNewComponent, UnavailableProductsDialog, Deliverypincode } from '../checkout-new/checkout-new.component';
import { PersonaldetailsComponent, DeleteDeliveryAddressConfirmation, UpdateSubscriberMobileNumber } from '../personaldetails/personaldetails.component';
import { TransactionDetailViewComponent } from '../transaction-detail-view/transaction-detail-view.component';
import { CustomerInvoiceComponent } from '../customer-invoice/customer-invoice.component';
import { BulkOrderComponent } from '../bulk-order/bulk-order.component';
import { DownloadAppComponent } from '../download-app/download-app.component';
import { GooglePlacesComponent } from '../google-places/google-places.component';
import { BlogComponent } from '../blog/blog.component';
import { BlogPostComponent } from '../blog-post/blog-post.component';
import { PageComponent } from '../page/page.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ProductReviewComponent } from '../product-review/product-review.component';
import { ProductReviewDialogComponent } from '../product-review-dialog/product-review-dialog.component';
import { ViewcartComponent } from '../viewcart/viewcart.component';
import { WishlistComponent } from '../wishlist/wishlist.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonModule, DatePipe } from '@angular/common';  
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { GoogleLoginProvider, FacebookLoginProvider, SocialAuthServiceConfig } from 'angularx-social-login';
import { MatGridListModule } from '@angular/material/grid-list';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { AgmCoreModule } from '@agm/core';
import { AuthService } from '../auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from '../token-interceptor.directive';
import { InternalCommonModule } from '../internal-common/internal-common.module';
import {MatRadioModule} from '@angular/material/radio';
import { MobileOtpComponent } from '../mobile-otp/mobile-otp.component';
import { BrowserModule } from '@angular/platform-browser';
import {MatTooltipModule} from '@angular/material/tooltip';


@NgModule({
  declarations: [
    AboutComponent,
    ContactComponent,
    HelpComponent,
    FaqsComponent,
    TermsComponent,
    PrivacyComponent,
    QuickLinkComponent,
    SignupComponent,
    LoginComponent,
    DeliveryAddressComponent,
    MyordersComponent,
    CancelOrderDialog,
    DeliveryAndPaymentsComponent,
    ProductViewComponent,
    AddonDialog,
    PosOneComponent,
    ReviewComponent,
    FilterComponent,
    MobilecartComponent,
    OtpComponent,
    GoogleloginComponent,
    CheckoutNewComponent,
    PersonaldetailsComponent,
    DeleteDeliveryAddressConfirmation,
    UpdateSubscriberMobileNumber,
    TransactionDetailViewComponent,
    CustomerInvoiceComponent,
    BulkOrderComponent,
    DownloadAppComponent,
    GooglePlacesComponent,
    BlogComponent,
    BlogPostComponent,
    PageComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    ProductReviewComponent,
    ProductReviewDialogComponent,
    ViewcartComponent,
    WishlistComponent,
    UnavailableProductsDialog,
    Deliverypincode,
    MobileOtpComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    SecondRoutingModule,
    InfiniteScrollModule,
    MatButtonModule,
    MatRadioModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    FlashMessagesModule.forRoot(),
    MatGridListModule,
    AgmCoreModule.forRoot({
      apiKey : ApplicationConstants.googleMapsKey
    }),
    InternalCommonModule
  ],
  providers: [
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
  ]
})
export class SecondModule { }
