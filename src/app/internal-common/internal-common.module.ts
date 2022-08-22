import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannersComponent } from '../banners/banners.component';
import { HeroBannerComponent } from '../hero-banner/hero-banner.component';
import { InternalCommonRoutingModule } from '../internal-common-routing/internal-common-routing.module';
import { TruncatePipe } from '../exponential-strength.pipe';
import { SafePipe } from '../SafePipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    SafePipe,
    TruncatePipe,
    BannersComponent,
    HeroBannerComponent,
  ],
  imports: [
    CommonModule,
    InternalCommonRoutingModule,
    MatProgressSpinnerModule
  ],
  exports: [
    BannersComponent,
    HeroBannerComponent,
    TruncatePipe,
    SafePipe
  ]
})
export class InternalCommonModule { }
