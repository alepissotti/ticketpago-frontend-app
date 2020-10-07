import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListadoVentaDiariaPage } from './listado-venta-diaria';

@NgModule({
  declarations: [
    ListadoVentaDiariaPage,
  ],
  imports: [
    IonicPageModule.forChild(ListadoVentaDiariaPage),
    ComponentsModule
  ],
})
export class ListadoVentaDiariaPageModule {}
