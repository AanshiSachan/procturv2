import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-employee-sidenav',
  templateUrl: './employee-sidenav.component.html',
  styleUrls: ['./employee-sidenav.component.scss']
})
export class EmployeeSidenavComponent implements OnInit {

  containerWidth: string = "50px";
  displayImage: any = '';
  @Input() employeeData = "";
  @Output() closeAside = new EventEmitter<any>();
  basicDetailOpen: boolean = false;
  leaveDetailOpen: boolean = false;
  profDetailOpen: boolean = false;
  showActionMenu: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.employeeData;
    console.log(this.employeeData);
  }

  closeSideBar() {
    this.closeAside.emit(true);
  }

}
