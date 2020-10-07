import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MediosTicketPagoPage} from './medios-ticket-pago'

@NgModule({
  declarations: [
    MediosTicketPagoPage,
  ],
  imports: [
    IonicPageModule.forChild(MediosTicketPagoPage),
  ]
})
export class MediosTicketPagoModule {
}