"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = exports.ConfigLoader = void 0;
var config_service_1 = require("./config.service");
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var progress_spinner_1 = require("@angular/material/progress-spinner");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var footer_component_1 = require("./footer/footer.component");
var homepage_component_1 = require("./homepage/homepage.component");
var token_interceptor_directive_1 = require("./token-interceptor.directive");
var auth_service_1 = require("./auth.service");
var animations_1 = require("@angular/platform-browser/animations");
var forms_1 = require("@angular/forms");
var main_nav_component_1 = require("./main-nav/main-nav.component");
var category_nav_component_1 = require("./category-nav/category-nav.component");
var angular2_flash_messages_1 = require("angular2-flash-messages");
var dialog_1 = require("@angular/material/dialog");
var snack_bar_1 = require("@angular/material/snack-bar");
var expansion_1 = require("@angular/material/expansion");
var store_coming_soon_component_1 = require("./store-coming-soon/store-coming-soon.component");
var environment_1 = require("src/environments/environment");
var common_1 = require("@angular/common");
// import { SafePipe } from './SafePipe';
var input_1 = require("@angular/material/input");
var angularx_social_login_1 = require("angularx-social-login");
var ApplicationConstants_1 = require("src/ApplicationConstants");
var internal_common_module_1 = require("./internal-common/internal-common.module");
// import { ClickOutsideModule } from 'ng-click-outside';
function ConfigLoader(configService) {
    return function () { return configService.load(environment_1.environment.storeData); };
}
exports.ConfigLoader = ConfigLoader;
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                footer_component_1.FooterComponent,
                homepage_component_1.HomepageComponent,
                main_nav_component_1.MainNavComponent,
                category_nav_component_1.CategoryNavComponent,
                main_nav_component_1.DialogOverviewExampleDialog,
                category_nav_component_1.InviteDialogForMobile,
                store_coming_soon_component_1.StoreComingSoonComponent,
            ],
            imports: [
                internal_common_module_1.InternalCommonModule,
                platform_browser_1.BrowserModule,
                app_routing_module_1.AppRoutingModule,
                http_1.HttpClientModule,
                animations_1.BrowserAnimationsModule,
                input_1.MatInputModule,
                forms_1.FormsModule,
                progress_spinner_1.MatProgressSpinnerModule,
                angular2_flash_messages_1.FlashMessagesModule.forRoot(),
                dialog_1.MatDialogModule,
                snack_bar_1.MatSnackBarModule,
                angularx_social_login_1.SocialLoginModule,
                expansion_1.MatExpansionModule
                // ClickOutsideModule
            ],
            providers: [
                config_service_1.ConfigService,
                {
                    provide: core_1.APP_INITIALIZER,
                    useFactory: ConfigLoader,
                    deps: [config_service_1.ConfigService],
                    multi: true
                },
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
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
