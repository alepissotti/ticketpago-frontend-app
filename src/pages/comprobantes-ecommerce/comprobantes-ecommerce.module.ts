import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ComprobantesEcommercePage} from './comprobantes-ecommerce' 

@NgModule({
  declarations: [
    ComprobantesEcommercePage,
  ],
  imports: [
    IonicPageModule.forChild(ComprobantesEcommercePage),
  ]
})
export class ComprobantesEcommerceModule {
}