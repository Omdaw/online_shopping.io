import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from '../product/product.component';
import { BannerProductsComponent } from '../banner-products/banner-products.component';
import { BrandProductsComponent } from '../brand-products/brand-products.component';
import { SearchComponent } from '../search/search.component';

const routes: Routes = [
  { path: 'product/:id', component: ProductComponent },
  { path: 'product/:id/:name', component: ProductComponent },
  { path: 'banner-products/:id', component: BannerProductsComponent },
  { path: 'banner-products/:id/:name', component: BannerProductsComponent },
  { path: 'brand-products/:id', component: BrandProductsComponent },
  { path: 'brand-products/:id/:name', component: BrandProductsComponent },
  { path: 'search/:key', component: SearchComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
