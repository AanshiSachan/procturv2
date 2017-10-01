import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.scss']
})
export class StudentHomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  navigateTo(text){
    console.log(text);
    if(text === "kyc"){
      document.getElementById('li-one').classList.remove('active');
      document.getElementById('li-three').classList.remove('active');
      document.getElementById('li-four').classList.remove('active');
      document.getElementById('li-two').classList.add('active');
      document.getElementById('studentForm').classList.add('hide');
      document.getElementById('feeDetails').classList.add('hide');
      //document.getElementById('inventory').classList.add('hide');
      document.getElementById('kyc').classList.remove('hide');
    }
    else if(text === "studentForm"){
      document.getElementById('li-two').classList.remove('active');
      document.getElementById('li-three').classList.remove('active');
      document.getElementById('li-four').classList.remove('active');
      document.getElementById('li-one').classList.add('active');
      document.getElementById('kyc').classList.add('hide');
      document.getElementById('feeDetails').classList.add('hide');
      //document.getElementById('inventory').classList.add('hide');
      document.getElementById('studentForm').classList.remove('hide');
    }
    else if(text === "feeDetails"){
      document.getElementById('li-one').classList.remove('active');
      document.getElementById('li-two').classList.remove('active');
      document.getElementById('li-four').classList.remove('active');
      document.getElementById('li-three').classList.add('active');
      document.getElementById('kyc').classList.add('hide');
      document.getElementById('studentForm').classList.add('hide');
      //document.getElementById('inventory').classList.add('hide');
      document.getElementById('feeDetails').classList.remove('hide');
    }
  }
}
