import { PipesModule } from './../../pipes/pipes.module';
import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {EnvioPage} from './envio';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    EnvioPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(EnvioPage),
    PipesModule
  ],
})
export class EnvioPageModule {
}
