import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'custom-component',
  templateUrl: './user-created.component.html',
  styleUrls: ['./user-created.component.scss']
})
export class UserCreatedComponent implements OnInit {

  component_id: number;

  constructor() { }
  ngOnInit() {
  }

}
