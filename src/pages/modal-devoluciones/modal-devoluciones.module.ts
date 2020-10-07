import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ModalDevolucionesPage} from './modal-devoluciones';

@NgModule({
  declarations: [
    ModalDevolucionesPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalDevolucionesPage),
  ]
})
export class ModalDevolucionesModule {
}