import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  constructor(private router: Router) {
   }

  ngOnInit() {
    this.removeFullscreen();
    if(this.router.url.includes('category')){
      this.switchActiveView('category');
    }else{
      this.switchActiveView('item');
    }
  }


  removeFullscreen() {
    var header = document.getElementsByTagName('core-header');
    var sidebar = document.getElementsByTagName('core-sidednav');

    [].forEach.call(header, function (el) {
      el.classList.remove('hide');
    });
    [].forEach.call(sidebar, function (el) {
      el.classList.remove('hide');
    });
  }


  switchActiveView(tabName) {
    document.getElementById('item').classList.remove('active');
    document.getElementById('category').classList.remove('active');
    document.getElementById(tabName).classList.add('active');
  }

}
