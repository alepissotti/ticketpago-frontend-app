import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {EditorTextoPage} from "./editor-texto";
import {SharedModule} from "../../shared.module";

@NgModule({
  declarations: [
    EditorTextoPage,
  ],
  imports: [
    IonicPageModule.forChild(EditorTextoPage),
    SharedModule
  ],
})
export class EditorTextoPageModule {}
