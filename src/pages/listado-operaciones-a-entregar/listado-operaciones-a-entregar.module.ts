import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListadoOperacionesAEntregarPage } from './listado-operaciones-a-entregar';

@NgModule({
  declarations: [
    ListadoOperacionesAEntregarPage,
  ],
  imports: [
    IonicPageModule.forChild(ListadoOperacionesAEntregarPage),
    ComponentsModule
  ],
})
export class ListadoOperacionesAEntregarPageModule {}
