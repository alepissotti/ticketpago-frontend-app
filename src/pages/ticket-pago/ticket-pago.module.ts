import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {TicketPagoPage} from './ticket-pago';

@NgModule({
  declarations: [
    TicketPagoPage,
  ],
  imports: [
    IonicPageModule.forChild(TicketPagoPage),
  ]
})
export class TicketPagoModule {
}