import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {VentaPage} from './venta';
import {NgCircleProgressModule} from "ng-circle-progress";
import {ComponentsModule} from "../../components/components.module";
import {SharedModule} from "../../app/shared/shared.module";
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    VentaPage
  ],
  imports: [
    IonicPageModule.forChild(VentaPage),
    ComponentsModule,
    ReactiveFormsModule,
    SharedModule,
    NgCircleProgressModule.forRoot({
      radius: 21,
      outerStrokeWidth: 4,
      outerStrokeColor: "#f53d3d",
      animationDuration: 300,
      showUnits: false,
      showSubtitle: false,
      showBackground: false,
      innerStrokeColor: "#C7E596",
      innerStrokeWidth: 4,
      space: -4
    })
  ],
  exports: [
    VentaPage
  ]
})
export class VentaPageModule {
}
