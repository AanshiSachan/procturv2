import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FetchenquiryService } from '../../services/fetchenquiry.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enquiry-home',
  templateUrl: './enquiry-home.component.html',
  styleUrls: ['./enquiry-home.component.css']
})
export class EnquiryHomeComponent implements OnInit {

  form: FormGroup;
  datepre: any = 0; datepost: any = 0; post: any;
  data = {};
  daterange = {
    updateDateFrom: '',
    updateDateTo: ''
  };


  constructor(private fb: FormBuilder, private enquire: FetchenquiryService, private router: Router) {

    this.form = this.fb.group({
      datepre: moment().startOf('month').format('YYYY-MM-DD'),
      datepost: moment().format('YYYY-MM-DD'),
    });
  }

    ngOnInit() {

     this.daterange = this.enquire.daterange;
  /*   console.log(this.daterange); */
      this.enquire.loadenquiry(this.daterange)
      .subscribe(
      result => this.data = {
        totalcount: result.totalcount,
        newenquiry: result.newEnqcount,
        close: result.statusMap.Closed,
        inprogress: result.statusMap['In Progress'],
        converted: result.statusMap.Converted,
        open: result.statusMap.Open,
        studentadmitted: result.statusMap['Student Admitted'],
      }
      ); 
  }

  submit(post) {
    this.daterange.updateDateFrom = moment(post.datepre).format('YYYY-MM-DD');
    this.daterange.updateDateTo = moment(post.datepost).format('YYYY-MM-DD');
    if (post.datepre > post.datepost) {
      alert("Please revalidate the date submitted");
    }
    else {
      this.enquire.loadenquiry(this.daterange)
        .subscribe(
        result => this.data = {
          totalcount: result.totalcount,
          newenquiry: result.newEnqcount,
          close: result.statusMap.Closed,
          inprogress: result.statusMap['In Progress'],
          converted: result.statusMap.Converted,
          open: result.statusMap.Open,
          studentadmitted: result.statusMap['Student Admitted'],
        }
        );
    }
  }

  addEnquiry() {

    this.router.navigate(['enquiry/lead']);
  }
  addManage() {

    this.router.navigate(['enquiry/manage']);
  }
  addMaster() {

    this.router.navigate(['enquiry/master']);
  }
  addReport() {

    this.router.navigate(['enquiry/report']);
  }
  filterByCount(){
    this.router.navigate(['enquiry/manage']);
  }
}