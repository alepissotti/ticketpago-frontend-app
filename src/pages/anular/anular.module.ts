import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {AnularPage} from './anular';

@NgModule({
  declarations: [
    AnularPage,
  ],
  imports: [
    IonicPageModule.forChild(AnularPage),
  ],
})
export class AnularPageModule {
}
