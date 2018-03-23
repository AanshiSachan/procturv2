import { Component, OnInit } from '@angular/core';
import { AcademicyearService } from '../../services/academicYearService/academicyear.service';
import { error } from 'selenium-webdriver';
@Component({
  selector: 'app-academic-year',
  templateUrl: './academic-year.component.html',
  styleUrls: ['./academic-year.component.scss']
})
export class AcademicYearComponent implements OnInit {

  academicDetails: any = [];
  slotTableList:any = [];
  constructor(private academicyearservice: AcademicyearService) { }


  ngOnInit() {
    this.getAllSlotsFromServer();
  } 

  getAllSlotsFromServer() {
    this.academicyearservice.getServices().subscribe(
      (data: any) => {
        this.slotTableList = data;
      },
      error => {
        console.log(error);
      }
    )
  }


}
