import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ModalListadoOperacionesPage} from './modal-listado-operaciones';

@NgModule({
  declarations: [
    ModalListadoOperacionesPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalListadoOperacionesPage),
  ]
})
export class ModalListadoOperacionesModule {
}