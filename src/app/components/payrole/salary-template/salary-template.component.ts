import { Component, OnInit, ɵclearResolutionOfComponentResourcesQueue } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-salary-template',
  templateUrl: './salary-template.component.html',
  styleUrls: ['./salary-template.component.scss']
})
export class SalaryTemplateComponent implements OnInit {

  constructor( private router: Router) { }

  ngOnInit(): void {
  }
addSalaryPage(){
  this.router.navigateByUrl("/view/payrole/add-edit-salary")
}
}
