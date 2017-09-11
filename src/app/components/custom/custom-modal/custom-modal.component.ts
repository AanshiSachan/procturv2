import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.css']
})

export class CustomModalComponent implements OnInit {
  constructor() { }
  ngOnInit() { }

  city = [
    {value: 'delhi-0', viewValue: 'Delhi'},
    {value: 'mumbai-1', viewValue: 'Mumbai'},
    {value: 'pune-2', viewValue: 'Pune'}
  ];

  nameFormControl = new FormControl('',[Validators.required]);  
  emailFormControl = new FormControl('',[Validators.required,Validators.pattern(EMAIL_REGEX)]);



}
