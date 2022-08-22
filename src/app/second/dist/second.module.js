"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SecondModule = void 0;
var core_1 = require("@angular/core");
var second_routing_module_1 = require("./second-routing.module");
var about_component_1 = require("../about/about.component");
var contact_component_1 = require("../contact/contact.component");
var help_component_1 = require("../help/help.component");
var faqs_component_1 = require("../faqs/faqs.component");
var terms_component_1 = require("../terms/terms.component");
var privacy_component_1 = require("../privacy/privacy.component");
var quick_link_component_1 = require("../quick-link/quick-link.component");
var signup_component_1 = require("../signup/signup.component");
var login_component_1 = require("../login/login.component");
var delivery_address_component_1 = require("../delivery-address/delivery-address.component");
var myorders_component_1 = require("../myorders/myorders.component");
var delivery_and_payments_component_1 = require("../delivery-and-payments/delivery-and-payments.component");
var product_view_component_1 = require("../product-view/product-view.component");
var pos_one_component_1 = require("../pos-one/pos-one.component");
var review_component_1 = require("../review/review.component");
var filter_component_1 = require("../filter/filter.component");
var mobilecart_component_1 = require("../mobilecart/mobilecart.component");
var otp_component_1 = require("../otp/otp.component");
var googlelogin_component_1 = require("../googlelogin/googlelogin.component");
var checkout_new_component_1 = require("../checkout-new/checkout-new.component");
var personaldetails_component_1 = require("../personaldetails/personaldetails.component");
var transaction_detail_view_component_1 = require("../transaction-detail-view/transaction-detail-view.component");
var customer_invoice_component_1 = require("../customer-invoice/customer-invoice.component");
var bulk_order_component_1 = require("../bulk-order/bulk-order.component");
var download_app_component_1 = require("../download-app/download-app.component");
var google_places_component_1 = require("../google-places/google-places.component");
var blog_component_1 = require("../blog/blog.component");
var blog_post_component_1 = require("../blog-post/blog-post.component");
var page_component_1 = require("../page/page.component");
var reset_password_component_1 = require("../reset-password/reset-password.component");
var change_password_component_1 = require("../change-password/change-password.component");
var product_review_component_1 = require("../product-review/product-review.component");
var product_review_dialog_component_1 = require("../product-review-dialog/product-review-dialog.component");
var viewcart_component_1 = require("../viewcart/viewcart.component");
var wishlist_component_1 = require("../wishlist/wishlist.component");
var ngx_infinite_scroll_1 = require("ngx-infinite-scroll");
var common_1 = require("@angular/common");
var button_1 = require("@angular/material/button");
var checkbox_1 = require("@angular/material/checkbox");
var input_1 = require("@angular/material/input");
var forms_1 = require("@angular/forms");
var card_1 = require("@angular/material/card");
var icon_1 = require("@angular/material/icon");
var select_1 = require("@angular/material/select");
var expansion_1 = require("@angular/material/expansion");
var progress_spinner_1 = require("@angular/material/progress-spinner");
var angular2_flash_messages_1 = require("angular2-flash-messages");
var angularx_social_login_1 = require("angularx-social-login");
var grid_list_1 = require("@angular/material/grid-list");
var ApplicationConstants_1 = require("src/ApplicationConstants");
var core_2 = require("@agm/core");
var auth_service_1 = require("../auth.service");
var http_1 = require("@angular/common/http");
var token_interceptor_directive_1 = require("../token-interceptor.directive");
var internal_common_module_1 = require("../internal-common/internal-common.module");
var radio_1 = require("@angular/material/radio");
var tooltip_1 = require("@angular/material/tooltip");
var SecondModule = /** @class */ (function () {
    function SecondModule() {
    }
    SecondModule = __decorate([
        core_1.NgModule({
            declarations: [
                about_component_1.AboutComponent,
                contact_component_1.ContactComponent,
                help_component_1.HelpComponent,
                faqs_component_1.FaqsComponent,
                terms_component_1.TermsComponent,
                privacy_component_1.PrivacyComponent,
                quick_link_component_1.QuickLinkComponent,
                signup_component_1.SignupComponent,
                login_component_1.LoginComponent,
                delivery_address_component_1.DeliveryAddressComponent,
                myorders_component_1.MyordersComponent,
                myorders_component_1.CancelOrderDialog,
                delivery_and_payments_component_1.DeliveryAndPaymentsComponent,
                product_view_component_1.ProductViewComponent,
                product_view_component_1.AddonDialog,
                pos_one_component_1.PosOneComponent,
                review_component_1.ReviewComponent,
                filter_component_1.FilterComponent,
                mobilecart_component_1.MobilecartComponent,
                otp_component_1.OtpComponent,
                googlelogin_component_1.GoogleloginComponent,
                checkout_new_component_1.CheckoutNewComponent,
                personaldetails_component_1.PersonaldetailsComponent,
                personaldetails_component_1.DeleteDeliveryAddressConfirmation,
                transaction_detail_view_component_1.TransactionDetailViewComponent,
                customer_invoice_component_1.CustomerInvoiceComponent,
                bulk_order_component_1.BulkOrderComponent,
                download_app_component_1.DownloadAppComponent,
                google_places_component_1.GooglePlacesComponent,
                blog_component_1.BlogComponent,
                blog_post_component_1.BlogPostComponent,
                page_component_1.PageComponent,
                reset_password_component_1.ResetPasswordComponent,
                change_password_component_1.ChangePasswordComponent,
                product_review_component_1.ProductReviewComponent,
                product_review_dialog_component_1.ProductReviewDialogComponent,
                viewcart_component_1.ViewcartComponent,
                wishlist_component_1.WishlistComponent,
                checkout_new_component_1.UnavailableProductsDialog,
                checkout_new_component_1.Deliverypincode
            ],
            imports: [
                common_1.CommonModule,
                progress_spinner_1.MatProgressSpinnerModule,
                second_routing_module_1.SecondRoutingModule,
                ngx_infinite_scroll_1.InfiniteScrollModule,
                button_1.MatButtonModule,
                radio_1.MatRadioModule,
                tooltip_1.MatTooltipModule,
                checkbox_1.MatCheckboxModule,
                expansion_1.MatExpansionModule,
                input_1.MatInputModule,
                forms_1.FormsModule,
                card_1.MatCardModule,
                icon_1.MatIconModule,
                select_1.MatSelectModule,
                angular2_flash_messages_1.FlashMessagesModule.forRoot(),
                grid_list_1.MatGridListModule,
                core_2.AgmCoreModule.forRoot({
                    apiKey: ApplicationConstants_1.ApplicationConstants.googleMapsKey
                }),
                internal_common_module_1.InternalCommonModule
            ],
            providers: [
                auth_service_1.AuthService,
                {
                    provide: http_1.HTTP_INTERCEPTORS,
                    useClass: token_interceptor_directive_1.TokenInterceptorService,
                    multi: true
                },
                {
                    provide: 'SocialAuthServiceConfig',
                    useValue: {
                        autoLogin: false,
                        providers: [
                            {
                                id: angularx_social_login_1.GoogleLoginProvider.PROVIDER_ID,
                                provider: new angularx_social_login_1.GoogleLoginProvider(ApplicationConstants_1.ApplicationConstants.googleClientId)
                            },
                            {
                                id: angularx_social_login_1.FacebookLoginProvider.PROVIDER_ID,
                                provider: new angularx_social_login_1.FacebookLoginProvider(ApplicationConstants_1.ApplicationConstants.facebookClientId)
                            }
                        ]
                    }
                },
                common_1.DatePipe
            ]
        })
    ], SecondModule);
    return SecondModule;
}());
exports.SecondModule = SecondModule;
