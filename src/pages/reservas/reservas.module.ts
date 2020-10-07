import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ReservasPage} from './reservas';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ReservasPage,
  ],
  imports: [
    IonicPageModule.forChild(ReservasPage),
    ComponentsModule
  ],
})
export class ReservasPageModule {
}
