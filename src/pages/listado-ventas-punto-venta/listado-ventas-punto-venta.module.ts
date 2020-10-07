import { ListadoVentasPuntoVentaPage } from './listado-ventas-punto-venta';
import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    ListadoVentasPuntoVentaPage,
  ],
  imports: [
    IonicPageModule.forChild(ListadoVentasPuntoVentaPage),
    ComponentsModule
  ],
})
export class ListadoVentasPuntoVentaPageModule {}
