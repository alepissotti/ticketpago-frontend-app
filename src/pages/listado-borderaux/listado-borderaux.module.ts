import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListadoBorderauxPage } from './listado-borderaux';

@NgModule({
  declarations: [
    ListadoBorderauxPage,
  ],
  imports: [
    IonicPageModule.forChild(ListadoBorderauxPage),
    ComponentsModule
  ],
})
export class ListadoBorderauxPageModule {}
