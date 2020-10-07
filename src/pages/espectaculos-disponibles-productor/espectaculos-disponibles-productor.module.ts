import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EspectaculosDisponiblesProductorPage } from './espectaculos-disponibles-productor';
import {ComponentsModule} from "../../components/components.module";
import {NgCircleProgressModule} from "ng-circle-progress";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    EspectaculosDisponiblesProductorPage,
  ],
  imports: [
    IonicPageModule.forChild(EspectaculosDisponiblesProductorPage),
    NgCircleProgressModule.forRoot({
      radius: 21,
      outerStrokeWidth: 4,
      outerStrokeColor: "#f53d3d",
      animationDuration: 300,
      percent: 0,
      showUnits: false,
      showSubtitle: false,
      showBackground: false,
      innerStrokeColor: "#C7E596",
      innerStrokeWidth: 4,
      space: -4
    }),
    PipesModule,
    ComponentsModule,
  ],
})
export class EspectaculosDisponiblesProductorPageModule {}
