import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'custom-student',
  templateUrl: './user-student.component.html',
  styleUrls: ['./user-student.component.scss']
})
export class UserStudentComponent implements OnInit {

  component_id: number;
 
  constructor() { }
  ngOnInit() {
  }

}
