import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
@Component({
  selector: 'core-header', 
  templateUrl: './core-header.component.html',
  styleUrls: ['./core-header.component.scss']
})
export class CoreHeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  routeHome(){
    this.router.navigate(['/']);
  }

}
