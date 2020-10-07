import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ImpresionesPendientesPage} from './impresiones-pendientes';

@NgModule({
  declarations: [
    ImpresionesPendientesPage,
  ],
  imports: [
    IonicPageModule.forChild(ImpresionesPendientesPage),
  ],
})
export class ImpresionesPendientesPageModule {
}
