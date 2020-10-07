import { Component } from '@angular/core';

/**
 * Generated class for the SideMenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'side-menu',
  templateUrl: 'side-menu.html',
  inputs: ['menuItems']
})
export class SideMenuComponent {

  menuItems: any[];

  constructor() {
    console.log(this.menuItems);
  }

  ngOnInit() {
    console.log(this.menuItems);
  }

}
