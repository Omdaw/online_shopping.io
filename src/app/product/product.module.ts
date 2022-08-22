import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from '../product/product.component';
import { ProductsComponent, VarianceDialog, CustomizationConfirmationDialog } from '../products/products.component';
import { BrandProductsComponent } from '../brand-products/brand-products.component';
import { BannerProductsComponent } from '../banner-products/banner-products.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ProductRoutingModule } from './product-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { SearchComponent } from '../search/search.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InternalCommonModule } from '../internal-common/internal-common.module';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [
    ProductComponent,
    ProductsComponent,
    BrandProductsComponent,
    BannerProductsComponent,
    SearchComponent,
    VarianceDialog,
    CustomizationConfirmationDialog,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    ProductRoutingModule,
    InfiniteScrollModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule,
    InternalCommonModule,
    MatRadioModule
  ]
})
export class ProductModule { }
