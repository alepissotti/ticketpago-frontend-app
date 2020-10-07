import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {DevolucionesLinePage} from './devoluciones-line'; 

@NgModule({
  declarations: [
    DevolucionesLinePage,
  ],
  imports: [
    IonicPageModule.forChild(DevolucionesLinePage),
  ]
})
export class DevolucionesLineModule {
}