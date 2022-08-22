import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentComponent } from '../payment/payment.component';
import { AboutComponent } from '../about/about.component';
import { ContactComponent } from '../contact/contact.component';
import { FaqsComponent } from '../faqs/faqs.component';
import { HelpComponent } from '../help/help.component';
import { PrivacyComponent } from '../privacy/privacy.component';
import { TermsComponent } from '../terms/terms.component';
import { QuickLinkComponent } from '../quick-link/quick-link.component';
import { BlogComponent } from '../blog/blog.component';
import { BlogPostComponent } from '../blog-post/blog-post.component';
import { PageComponent } from '../page/page.component';
import { SignupComponent } from '../signup/signup.component';
import { LoginComponent } from '../login/login.component';
import { DeliveryAddressComponent } from '../delivery-address/delivery-address.component';
import { MyordersComponent } from '../myorders/myorders.component';
import { ProductViewComponent } from '../product-view/product-view.component';
import { DeliveryAndPaymentsComponent } from '../delivery-and-payments/delivery-and-payments.component';
import { PosOneComponent } from '../pos-one/pos-one.component';
import { ReviewComponent } from '../review/review.component';
import { FilterComponent } from '../filter/filter.component';
import { MobilecartComponent } from '../mobilecart/mobilecart.component';
import { OtpComponent } from '../otp/otp.component';
import { GoogleloginComponent } from '../googlelogin/googlelogin.component';
import { CheckoutNewComponent } from '../checkout-new/checkout-new.component';
import { PersonaldetailsComponent } from '../personaldetails/personaldetails.component';
import { TransactionDetailViewComponent } from '../transaction-detail-view/transaction-detail-view.component';
import { CustomerInvoiceComponent } from '../customer-invoice/customer-invoice.component';
import { BulkOrderComponent } from '../bulk-order/bulk-order.component';
import { DownloadAppComponent } from '../download-app/download-app.component';
import { GooglePlacesComponent } from '../google-places/google-places.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ProductReviewComponent } from '../product-review/product-review.component';
import { WishlistComponent } from '../wishlist/wishlist.component';
import { ViewcartComponent } from '../viewcart/viewcart.component';
import { MobileOtpComponent } from '../mobile-otp/mobile-otp.component';
import { CheckoutPageLoginComponent } from '../checkout-page-login/checkout-page-login.component';
import { CheckoutPageSignupComponent } from '../checkout-page-signup/checkout-page-signup.component';
import { CheckoutPageOtpLoginComponent } from '../checkout-page-otp-login/checkout-page-otp-login.component';

const routes: Routes = [
  { path: 'payment', component: PaymentComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'faqs', component: FaqsComponent  },
  { path: 'help', component: HelpComponent  },
  { path: 'privacy', component: PrivacyComponent  },
  { path: 'terms', component: TermsComponent  },
  { path: 'quick-link/:id/:name', component: QuickLinkComponent },
  { path: 'blog/:id/:name', component: BlogComponent },
  { path: 'blog-post/:id/:name', component: BlogPostComponent },
  { path: 'page/:id/:name', component: PageComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:subscriberId', component: LoginComponent },
  { path: 'delivery-address', component: DeliveryAddressComponent },
  { path: 'myorders', component: MyordersComponent },
  // { path: 'invoice', component: InvoiceComponent },
  { path: 'invoice/:id/:product_detail_id', component: ProductViewComponent },
  { path: 'delivery-and-payments', component: DeliveryAndPaymentsComponent },
  { path: 'product-view/:id', component: ProductViewComponent },
  { path: 'product-view/:id/:product_detail_id', component: ProductViewComponent },
  { path: 'product-view/:id/:product_detail_id/:product_category_name/:product_name', component: ProductViewComponent },
  // { path: 'search/:key', component: SearchComponent },
  // { path: 'product/:id', component: ProductComponent },
  // { path: 'banner-products/:id', component: BannerProductsComponent },
  // { path: 'brand-products/:id', component: BrandProductsComponent },
  { path: 'pos-one', component: PosOneComponent },
  { path: 'review', component: ReviewComponent },
  { path: 'filter', component: FilterComponent },
  { path: 'signin', component: LoginComponent },
  { path: 'mobilecart', component: MobilecartComponent },
  { path: 'otp', component: OtpComponent },
  { path: 'google-login', component: GoogleloginComponent },
  { path: 'checkout-new', component: CheckoutNewComponent },
  { path: 'checkout-new-login', component: CheckoutPageLoginComponent },
  { path: 'checkout-new-otp-login', component: CheckoutPageOtpLoginComponent },
  { path: 'checkout-new-signup', component: CheckoutPageSignupComponent },
  { path: 'personaldetails', component: PersonaldetailsComponent },
  { path: 'transactionDetailsView/:id', component: TransactionDetailViewComponent },
  { path: 'customer-invoice', component: CustomerInvoiceComponent },
  { path: 'customer-invoice/:id', component: CustomerInvoiceComponent },
  { path: 'customer-invoice/:id/:product_detail_id', component: CustomerInvoiceComponent },
  { path: 'bulk-order', component: BulkOrderComponent },
  { path: 'download-app', component: DownloadAppComponent },
  { path: 'google-places', component: GooglePlacesComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'product-review/:id', component: ProductReviewComponent },
  {path: 'wishlist', component: WishlistComponent },
  { path: 'viewcart', component: ViewcartComponent },
  { path: 'second/profile', component: PersonaldetailsComponent },
  { path: 'mobile-otp', component: MobileOtpComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecondRoutingModule { }
