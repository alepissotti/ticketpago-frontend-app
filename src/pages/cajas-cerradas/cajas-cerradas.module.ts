import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CajasCerradasPage } from './cajas-cerradas';

@NgModule({
  declarations: [
    CajasCerradasPage,
  ],
  imports: [
    IonicPageModule.forChild(CajasCerradasPage),
    ComponentsModule
  ],
})
export class CajasCerradasPageModule {}
