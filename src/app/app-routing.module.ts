
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomepageComponent } from './homepage/homepage.component';
import { StoreComingSoonComponent } from './store-coming-soon/store-coming-soon.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'AllCollections', loadChildren: () => import('./product/product.module').then(m => m.ProductModule) },
  { path: 'collections', loadChildren: () => import('./second/second.module').then(m => m.SecondModule) },
  { path: 'store-coming-soon', component: StoreComingSoonComponent },
  
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  

 }
