import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-add',
  templateUrl: './student-add.component.html',
  styleUrls: ['./student-add.component.scss']
})
export class StudentAddComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  /* Function to navigate through the Student Add Form, the input provide details for view to be set active */
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
