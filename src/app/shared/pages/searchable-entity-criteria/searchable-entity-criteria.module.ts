import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchableEntityCriteriaPage } from './searchable-entity-criteria';

@NgModule({
  declarations: [
    SearchableEntityCriteriaPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchableEntityCriteriaPage),
  ],
})
export class SearchableEntityCriteriaPageModule {}
