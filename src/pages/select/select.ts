import { Component } from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-select',
  templateUrl: 'select.html',
})
export class SelectPage {
  items: Array<any>;

  constructor(private viewCtrl: ViewController,
              private navParams: NavParams) {
    this.items = this.navParams.get('items');
  }

  itemClicked(i) {
    this.viewCtrl.dismiss(i);
  }

}
