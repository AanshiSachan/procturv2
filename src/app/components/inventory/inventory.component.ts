import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  constructor(
    private router: Router,
  ) {
  }

  ngOnInit() {
    if (this.router.url.includes('category')) {
      this.switchActiveView('category');
    } else {
      this.switchActiveView('item');
    }
  }


  switchActiveView(tabName) {
    document.getElementById('item').classList.remove('active');
    document.getElementById('category').classList.remove('active');
    document.getElementById(tabName).classList.add('active');
  }

}
