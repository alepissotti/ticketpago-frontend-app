import { SortPipe } from './pipes/sort/sort';
import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { IonicModule } from "ionic-angular";
import { HttpModule } from "@angular/http";
import { SearchableEntityComponent } from "./components/searchable-entity/searchable-entity";
import { SearchableEntityProvider } from "./providers/searchable-entity/searchable-entity";
import {MensajeProvider} from "./providers/mensaje/mensaje";
import {ErrorDisplayComponent} from "./components/error-display/error-display";
import {RichTextComponent} from "./rich-text/rich-text";
import {RichTextEditorComponent} from "./components/rich-text-editor/rich-text-editor";
import { SafeHtmlPipe } from './pipes/safe-html/safe-html';


@NgModule({
  imports: [CommonModule, IonicModule, HttpModule],
  declarations: [
    SearchableEntityComponent,
    ErrorDisplayComponent,
    RichTextComponent,
    RichTextEditorComponent,
    SafeHtmlPipe,
    SortPipe,
  ],
  providers: [
    SearchableEntityProvider,
    MensajeProvider
  ],
  exports: [
    CommonModule,
    IonicModule,
    RichTextComponent,
    RichTextEditorComponent,
    SearchableEntityComponent,
    ErrorDisplayComponent,
    SafeHtmlPipe,
    SortPipe,
  ]
})
export class SharedModule { }
