"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SecondRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var payment_component_1 = require("../payment/payment.component");
var about_component_1 = require("../about/about.component");
var contact_component_1 = require("../contact/contact.component");
var faqs_component_1 = require("../faqs/faqs.component");
var help_component_1 = require("../help/help.component");
var privacy_component_1 = require("../privacy/privacy.component");
var terms_component_1 = require("../terms/terms.component");
var quick_link_component_1 = require("../quick-link/quick-link.component");
var blog_component_1 = require("../blog/blog.component");
var blog_post_component_1 = require("../blog-post/blog-post.component");
var page_component_1 = require("../page/page.component");
var signup_component_1 = require("../signup/signup.component");
var login_component_1 = require("../login/login.component");
var delivery_address_component_1 = require("../delivery-address/delivery-address.component");
var myorders_component_1 = require("../myorders/myorders.component");
var product_view_component_1 = require("../product-view/product-view.component");
var delivery_and_payments_component_1 = require("../delivery-and-payments/delivery-and-payments.component");
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
var reset_password_component_1 = require("../reset-password/reset-password.component");
var change_password_component_1 = require("../change-password/change-password.component");
var product_review_component_1 = require("../product-review/product-review.component");
var wishlist_component_1 = require("../wishlist/wishlist.component");
var viewcart_component_1 = require("../viewcart/viewcart.component");
var checkout_page_login_component_1 = require("../checkout-page-login/checkout-page-login.component");
var checkout_page_signup_component_1 = require("../checkout-page-signup/checkout-page-signup.component");
var checkout_page_otp_login_component_1 = require("../checkout-page-otp-login/checkout-page-otp-login.component");
var routes = [
    { path: 'payment', component: payment_component_1.PaymentComponent },
    { path: 'about', component: about_component_1.AboutComponent },
    { path: 'contact', component: contact_component_1.ContactComponent },
    { path: 'faqs', component: faqs_component_1.FaqsComponent },
    { path: 'help', component: help_component_1.HelpComponent },
    { path: 'privacy', component: privacy_component_1.PrivacyComponent },
    { path: 'terms', component: terms_component_1.TermsComponent },
    { path: 'quick-link/:id/:name', component: quick_link_component_1.QuickLinkComponent },
    { path: 'blog/:id/:name', component: blog_component_1.BlogComponent },
    { path: 'blog-post/:id/:name', component: blog_post_component_1.BlogPostComponent },
    { path: 'page/:id/:name', component: page_component_1.PageComponent },
    { path: 'signup', component: signup_component_1.SignupComponent },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'login/:subscriberId', component: login_component_1.LoginComponent },
    { path: 'delivery-address', component: delivery_address_component_1.DeliveryAddressComponent },
    { path: 'myorders', component: myorders_component_1.MyordersComponent },
    // { path: 'invoice', component: InvoiceComponent },
    { path: 'invoice/:id/:product_detail_id', component: product_view_component_1.ProductViewComponent },
    { path: 'delivery-and-payments', component: delivery_and_payments_component_1.DeliveryAndPaymentsComponent },
    { path: 'product-view/:id', component: product_view_component_1.ProductViewComponent },
    { path: 'product-view/:id/:product_detail_id', component: product_view_component_1.ProductViewComponent },
    { path: 'product-view/:id/:product_detail_id/:product_category_name/:product_name', component: product_view_component_1.ProductViewComponent },
    // { path: 'search/:key', component: SearchComponent },
    // { path: 'product/:id', component: ProductComponent },
    // { path: 'banner-products/:id', component: BannerProductsComponent },
    // { path: 'brand-products/:id', component: BrandProductsComponent },
    { path: 'pos-one', component: pos_one_component_1.PosOneComponent },
    { path: 'review', component: review_component_1.ReviewComponent },
    { path: 'filter', component: filter_component_1.FilterComponent },
    { path: 'signin', component: login_component_1.LoginComponent },
    { path: 'mobilecart', component: mobilecart_component_1.MobilecartComponent },
    { path: 'otp', component: otp_component_1.OtpComponent },
    { path: 'google-login', component: googlelogin_component_1.GoogleloginComponent },
    { path: 'checkout-new', component: checkout_new_component_1.CheckoutNewComponent },
    { path: 'checkout-new-login', component: checkout_page_login_component_1.CheckoutPageLoginComponent },
    { path: 'checkout-new-otp-login', component: checkout_page_otp_login_component_1.CheckoutPageOtpLoginComponent },
    { path: 'checkout-new-signup', component: checkout_page_signup_component_1.CheckoutPageSignupComponent },
    { path: 'personaldetails', component: personaldetails_component_1.PersonaldetailsComponent },
    { path: 'transactionDetailsView/:id', component: transaction_detail_view_component_1.TransactionDetailViewComponent },
    { path: 'customer-invoice', component: customer_invoice_component_1.CustomerInvoiceComponent },
    { path: 'customer-invoice/:id', component: customer_invoice_component_1.CustomerInvoiceComponent },
    { path: 'customer-invoice/:id/:product_detail_id', component: customer_invoice_component_1.CustomerInvoiceComponent },
    { path: 'bulk-order', component: bulk_order_component_1.BulkOrderComponent },
    { path: 'download-app', component: download_app_component_1.DownloadAppComponent },
    { path: 'google-places', component: google_places_component_1.GooglePlacesComponent },
    { path: 'reset-password', component: reset_password_component_1.ResetPasswordComponent },
    { path: 'change-password', component: change_password_component_1.ChangePasswordComponent },
    { path: 'product-review/:id', component: product_review_component_1.ProductReviewComponent },
    { path: 'wishlist', component: wishlist_component_1.WishlistComponent },
    { path: 'viewcart', component: viewcart_component_1.ViewcartComponent },
    { path: 'second/profile', component: personaldetails_component_1.PersonaldetailsComponent },
];
var SecondRoutingModule = /** @class */ (function () {
    function SecondRoutingModule() {
    }
    SecondRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule]
        })
    ], SecondRoutingModule);
    return SecondRoutingModule;
}());
exports.SecondRoutingModule = SecondRoutingModule;
