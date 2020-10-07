import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ClientesPage} from './clientes';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    ClientesPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ClientesPage),
  ],
})
export class ClientesPageModule {
}
