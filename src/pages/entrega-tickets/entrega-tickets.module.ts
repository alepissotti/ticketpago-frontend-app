import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntregaTicketsPage } from './entrega-tickets';

@NgModule({
  declarations: [
    EntregaTicketsPage,
  ],
  imports: [
    IonicPageModule.forChild(EntregaTicketsPage),
  ],
})
export class EntregaTicketsPageModule {}
