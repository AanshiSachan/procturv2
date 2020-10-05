import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-toolbar',
  templateUrl: './top-toolbar.component.html',
  styleUrls: ['./top-toolbar.component.scss']
})
export class TopToolbarComponent implements OnInit {
  instituteName: string;
  instituteId:string;
  constructor() { }

  ngOnInit(): void {
    this.instituteName = sessionStorage.getItem('institute_name');
    this.instituteId= sessionStorage.getItem('institute_id');
  }

}
