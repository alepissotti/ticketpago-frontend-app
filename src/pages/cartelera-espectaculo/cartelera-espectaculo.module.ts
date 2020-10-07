import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarteleraEspectaculoPage } from './cartelera-espectaculo';
import {ComponentsModule} from "../../components/components.module";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    CarteleraEspectaculoPage
  ],
  imports: [
    IonicPageModule.forChild(CarteleraEspectaculoPage),
    ComponentsModule,
    PipesModule,

  ]
})
export class CarteleraEspectaculoPageModule {}
