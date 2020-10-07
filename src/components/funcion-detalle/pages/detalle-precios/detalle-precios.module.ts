import { PipesModule } from './../../../../pipes/pipes.module';
import { DetallePreciosPage } from './detalle-precios';
import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ComponentsModule} from "../../../../components/components.module";

@NgModule({
  declarations: [
    DetallePreciosPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(DetallePreciosPage),
    PipesModule
  ],
})
export class DetallePreciosPageModule {
}
