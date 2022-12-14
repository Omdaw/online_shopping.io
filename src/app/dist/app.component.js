"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppComponent = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var operators_1 = require("rxjs/operators");
var AppComponent = /** @class */ (function () {
    function AppComponent(configService, router) {
        this.configService = configService;
        this.title = 'Ecommerce-noque';
        this.storeContactNumber = "";
        this.configService.getStoreData();
        var navEndEvents = router.events.pipe(operators_1.filter(function (event) { return event instanceof router_1.NavigationEnd; }));
        navEndEvents.subscribe(function (event) {
            gtag('config', 'GTM-W2SD9SM', {
                'page_path': event.urlAfterRedirects
            });
        });
    }
    AppComponent.prototype.ngOnInit = function () {
        this.storeContactNumber = localStorage.getItem("storeContactNo");
    };
    AppComponent.prototype.onActivate = function (event) {
        window.scroll(0, 0);
        //or document.body.scrollTop = 0;
        //or document.querySelector('body').scrollTo(0,0)
    };
    AppComponent.prototype.ngOnDestroy = function () {
        localStorage.removeItem("storeContactNo");
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css']
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
