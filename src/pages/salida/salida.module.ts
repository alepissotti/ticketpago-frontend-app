import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalidaPage } from './salida';

@NgModule({
  declarations: [
    SalidaPage,
  ],
  imports: [
    IonicPageModule.forChild(SalidaPage),
  ],
})
export class SalidaPageModule {}
