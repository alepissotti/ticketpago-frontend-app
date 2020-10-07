import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarteleraPage } from './cartelera';
import {ComponentsModule} from "../../components/components.module";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    CarteleraPage,
  ],
  imports: [
    IonicPageModule.forChild(CarteleraPage),
    ComponentsModule,
    PipesModule,
  ],
})
export class CarteleraPageModule {}
