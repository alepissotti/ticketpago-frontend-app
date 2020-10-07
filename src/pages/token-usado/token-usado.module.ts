import { TokenUsadoPage } from './token-usado';
import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';

@NgModule({
  declarations: [
    TokenUsadoPage,
  ],
  imports: [
    IonicPageModule.forChild(TokenUsadoPage),
  ],
  exports: [
    TokenUsadoPage,
  ]
})
export class TokenUsadoPageModule {
}
