import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FetchenquiryService } from '../../../services/enquiry-services/fetchenquiry.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enquiry-home',
  templateUrl: './enquiry-home.component.html',
  styleUrls: ['./enquiry-home.component.scss']
})
export class EnquiryHomeComponent implements OnInit {
  constructor(private fb: FormBuilder, private enquire: FetchenquiryService, private router: Router) {}

  ngOnInit() {}


}