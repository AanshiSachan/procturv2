import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.css']
})
export class EnquiryComponent implements OnInit {

  constructor() {
  }

  /* OnInit recheck the status of li tab and set it to active here */
  ngOnInit() {

      let array = ['litwo','lithree','lifour','lifive','lisix','liseven','lieight','linine','lizero']
      if(document.getElementById('lione')){
        document.getElementById('lione').classList.add('active');
      }
  
     array.forEach((id)=>{
       if(document.getElementById(id)){
        document.getElementById(id).classList.remove('active');
       }
     });
  }

}