import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MediosDePagoPage} from './medios-de-pago';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    MediosDePagoPage,
  ],
  imports: [
    IonicPageModule.forChild(MediosDePagoPage),
    ComponentsModule
  ],
})
export class MediosDePagoPageModule {
}
