import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {TransaccionTicketPagoPage} from './transaccion-ticketpago'; 

@NgModule({
  declarations: [
    TransaccionTicketPagoPage,
  ],
  imports: [
    IonicPageModule.forChild(TransaccionTicketPagoPage),
  ]
})
export class TransaccionTicketPagoModule {
}