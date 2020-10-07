import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PuntosDeVentaPage} from './puntos-de-venta';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    PuntosDeVentaPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(PuntosDeVentaPage),
  ],
})
export class PuntosDeVentaPageModule {
}
