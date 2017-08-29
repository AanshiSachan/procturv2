import { Component,OnInit, trigger, transition, style, animate, state } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'custom-add-enquiry',
  templateUrl: './custom-add-enquiry.component.html',
  styleUrls: ['./custom-add-enquiry.component.css'],
  animations: [
    trigger(
      'Collapse',
      [
        transition(
        ':enter', [
          style({transform: 'translateY(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateY(0)', 'opacity': 1}))
        ]
      ),
      transition(
        ':leave', [
          style({transform: 'translateY(0)', 'opacity': 1}),
          animate('500ms', style({transform: 'translateY(100%)', 'opacity': 0})),
        ]
      )]
    )
  ],
})
export class CustomAddEnquiryComponent implements OnInit {

  source: LocalDataSource;
  constructor() { }

  ngOnInit() { }
  active:boolean = true;
  Genders= [
    {value: 'm', viewValue: 'Male'},
    {value: 'f', viewValue: 'Female'},
    {value: 'na', viewValue: 'Not Applicable'}
  ];

  toggleForm(){
    this.active = !this.active;
    console.log(this.active);
  }
}
