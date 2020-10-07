import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetallesOperacionPage } from './detalles-operacion';

@NgModule({
  declarations: [
    DetallesOperacionPage,
  ],
  imports: [
    IonicPageModule.forChild(DetallesOperacionPage),
    ComponentsModule
  ],
})
export class DetallesOperacionPageModule {}
