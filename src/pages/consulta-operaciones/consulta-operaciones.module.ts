import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {ConsultaOperacionesPage} from './consulta-operaciones';

@NgModule({
  declarations: [
    ConsultaOperacionesPage,
  ],
  imports: [
    IonicPageModule.forChild(ConsultaOperacionesPage),
  ],
})
export class ConsultaOperacionesPageModule {}