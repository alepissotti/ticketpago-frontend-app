import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CajaSistemaPage } from './caja-sistema';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    CajaSistemaPage,
  ],
  imports: [
    IonicPageModule.forChild(CajaSistemaPage),
    ComponentsModule,
    PipesModule,
  ],
})
export class CajaSistemaPageModule {}
