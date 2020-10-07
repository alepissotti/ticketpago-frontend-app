import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {EcommercePage} from './e-commerce';

@NgModule({
  declarations: [
    EcommercePage,
  ],
  imports: [
    IonicPageModule.forChild(EcommercePage),
  ]
})
export class EcommerceModule {
}