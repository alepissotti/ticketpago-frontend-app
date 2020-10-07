import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DespachosPage } from './despachos';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    DespachosPage,
  ],
  imports: [
    IonicPageModule.forChild(DespachosPage),
    ComponentsModule
  ],
})
export class DespachosPageModule {}
