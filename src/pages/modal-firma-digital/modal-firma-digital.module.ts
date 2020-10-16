import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ModalFirmaDigitalPage} from './modal-firma-digital';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  declarations: [
    ModalFirmaDigitalPage,
  ],
  imports: [
    SignaturePadModule,
    IonicPageModule.forChild(ModalFirmaDigitalPage),
  ]
})
export class ModalFirmaDigitalModule {
}