import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {ListadoConsultaOperacionesPage} from './listado-consulta-operaciones';

@NgModule({
  declarations: [
    ListadoConsultaOperacionesPage,
  ],
  imports: [
    IonicPageModule.forChild(ListadoConsultaOperacionesPage),
  ],
})
export class ListadoConsultaOperacionesPageModule {}