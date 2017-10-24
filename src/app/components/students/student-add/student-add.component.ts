import { Component, OnInit } from '@angular/core';
import {AddStudentPrefillService} from '../../../services/student-services/add-student-prefill.service';


@Component({
  selector: 'app-student-add',
  templateUrl: './student-add.component.html',
  styleUrls: ['./student-add.component.scss']
})
export class StudentAddComponent implements OnInit {

  private studentAddFormData = {
    sname: "",
    cNumber: "",
    sEmail: "",
    parentName: "",
    parentContactNo: "",
    parentEmail: "",
    sdob: "",
    currentAdd: "",
    currentAdd2: "",
    gurdianName: "",
    gurdianContact: "",
    gurdianEmail: "",
    addCommentNote: ""

  }
  private additionalBasicDetails: boolean = false;

  constructor(private studentPrefillService: AddStudentPrefillService) { }

  ngOnInit() {

    this.fetchPrefillFormData();

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



  /* Fetch and store the prefill data to be displayed on dropdown menu */
  fetchPrefillFormData(){

    this.studentPrefillService.fetchInventoryList().subscribe(data => {
      console.log(data);
    })

  }

  /* Function to show/hide Addition Details Form section */
  toggleAdditionalBasicDetails(){
    this.additionalBasicDetails = !this.additionalBasicDetails;
  }
}
