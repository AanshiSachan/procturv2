import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';

@Component({
  selector: 'faq-sidenav',
  templateUrl: './faq-sidenav.component.html',
  styleUrls: ['./faq-sidenav.component.scss']
})
export class FAQSidenavComponent implements OnInit, AfterViewInit {

  @ViewChildren('MainElement') element: QueryList<any>;

  private helpList: helpItem[];

  private elementList: any[] = [];

  constructor() { }

  ngOnInit() {
    this.helpList = [
      {
        name: "Enquiry", id: "Enquiry_help", icon: "", children: [
          { name: "Enquiry Add", id: "Enquiry_Add", icon: "" },
          { name: "Enquiry Update", id: "Enquiry_Update", icon: "" },
          { name: "Enquiry Edit", id: "Enquiry_Edit", icon: "" },
          { name: "Enquiry Convert", id: "Enquiry_Convert", icon: "" },
          { name: "Enquiry Delete", id: "Enquiry_Delete", icon: "" },
          { name: "Enquiry Upload", id: "Enquiry_Upload", icon: "" },
          { name: "Enquiry Registration Fee", id: "Enquiry_Registration", icon: "" },
          { name: "Enquiry Export", id: "Enquiry_Export", icon: "" },
          { name: "Enquiry Summary Download", id: "Enquiry_Summary", icon: "" },
        ]
      },
      {
        name: "Student", id: "Student_help", icon: "", children: [
          { name: "Student Admission", id: "Student_Admission", icon: "" },
          { name: "Student Course/Batch Management", id: "Student_Course_Management", icon: "" },
          { name: "Student Fee Management", id: "Student_Fee_Management", icon: "" },
          { name: "Student Upload", id: "Student_Upload", icon: "" },
          { name: "Student Inventory Management", id: "Student_Inventory_Management", icon: "" },
          { name: "Student Delete", id: "Student_Delete", icon: "" },
          { name: "Student Leave Management", id: "Student_Leave_Management", icon: "" },
        ]
      },
      {
        name: "Course", id: "Course_help", icon: "", children: [
          { name: "Standard Management", id: "Standard_Management", icon: "" },
          { name: "Subject Management", id: "Subject_Management", icon: "" },
          { name: "Course Management", id: "Course_Management", icon: "" },
          { name: "Class Management", id: "Class_Management", icon: "" },
          { name: "Exam Management", id: "Exam_Management", icon: "" },
        ]
      },
      {
        name: "Activity", id: "Activity_help", icon: "", children: [
          { name: "Cheque Management", id: "Cheque_Management", icon: "" },
          { name: "Archive", id: "Archive", icon: "" },
          { name: "Monitoring Dashboard", id: "Monitoring_Dashboard", icon: "" },
          { name: "Parent Teacher Meet", id: "PTM", icon: "" },
          { name: "Fee Management", id: "Fee_Management", icon: "" },
        ]
      },
      {
        name: "Report", id: "Report_help", icon: "", children: [
          { name: "SMS Reports", id: "SMS_Reports", icon: "" },
          { name: "Attendance Reports", id: "Attendance_Reports", icon: "" },
          { name: "Fee Reports", id: "Fee_Reports", icon: "" },
          { name: "Exam Reports", id: "Exam_Reports", icon: "" },
          { name: "Time Table", id: "Time_Table", icon: "" },
          { name: "Email Reports", id: "Email_Reports", icon: "" },
          { name: "Enquiry Reports", id: "Enquiry_Reports", icon: "" },
        ]
      },
      {
        name: "Inventory", id: "Inventory_help", icon: "", children: [
          { name: "Category Management", id: "Category_Management", icon: "" },
          { name: "Add/Remove Inventory", id: "AR_Inventory", icon: "" },
          { name: "Multi Branch Inventory Management", id: "MB_Inventory", icon: "" },
          { name: "Employee Inventory Management", id: "E_Inventory", icon: "" },
        ]
      },
      {
        name: "Campaign", id: "Campaign_help", icon: "", children: [
          { name: "Campaign Management", id: "Campaign Management", icon: "" },
          { name: "Campaign Upload", id: "", icon: "" },
          { name: "Campaign SMS Promotion", id: "", icon: "" },
          { name: "Campaign Convertion", id: "", icon: "" },
        ]
      },
    ];


  }

  ngAfterViewInit() {
    this.elementList = [];
    this.element.forEach(e => {
      this.elementList.push(e);
    });
  }

  toggleVisiblity(i) {
    this.elementList.forEach((e,index) => {
      if(index == i){
        e.nativeElement.children[1].classList.toggle('hide');
      }
      else{
        e.nativeElement.children[1].classList.add('hide');
      }
    });
  }



}

export interface helpItem {
  name: string;
  id: string;
  children?: helpItem[];
  icon: string;
}