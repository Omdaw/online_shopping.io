"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProductModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var product_component_1 = require("../product/product.component");
var products_component_1 = require("../products/products.component");
var brand_products_component_1 = require("../brand-products/brand-products.component");
var banner_products_component_1 = require("../banner-products/banner-products.component");
var ngx_infinite_scroll_1 = require("ngx-infinite-scroll");
var product_routing_module_1 = require("./product-routing.module");
var button_1 = require("@angular/material/button");
var checkbox_1 = require("@angular/material/checkbox");
var input_1 = require("@angular/material/input");
var forms_1 = require("@angular/forms");
var card_1 = require("@angular/material/card");
var icon_1 = require("@angular/material/icon");
var grid_list_1 = require("@angular/material/grid-list");
var search_component_1 = require("../search/search.component");
var progress_spinner_1 = require("@angular/material/progress-spinner");
var internal_common_module_1 = require("../internal-common/internal-common.module");
var ProductModule = /** @class */ (function () {
    function ProductModule() {
    }
    ProductModule = __decorate([
        core_1.NgModule({
            declarations: [
                product_component_1.ProductComponent,
                products_component_1.ProductsComponent,
                brand_products_component_1.BrandProductsComponent,
                banner_products_component_1.BannerProductsComponent,
                search_component_1.SearchComponent
            ],
            imports: [
                common_1.CommonModule,
                progress_spinner_1.MatProgressSpinnerModule,
                product_routing_module_1.ProductRoutingModule,
                ngx_infinite_scroll_1.InfiniteScrollModule,
                button_1.MatButtonModule,
                checkbox_1.MatCheckboxModule,
                input_1.MatInputModule,
                forms_1.FormsModule,
                card_1.MatCardModule,
                icon_1.MatIconModule,
                grid_list_1.MatGridListModule,
                internal_common_module_1.InternalCommonModule
            ]
        })
    ], ProductModule);
    return ProductModule;
}());
exports.ProductModule = ProductModule;
