import { Component, OnInit } from '@angular/core';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';

@Component({
  selector: 'app-create-custom-comp',
  templateUrl: './create-custom-comp.component.html',
  styleUrls: ['./create-custom-comp.component.scss']
})
export class CreateCustomCompComponent implements OnInit {

  componentShell: any[] = [];
  userCreatedComponent: any[] = [];

  constructor(private prefill: FetchprefilldataService) { 

    

  }

  ngOnInit() {

    this.fetchPrefillData()

  }


  fetchPrefillData(){

    this.prefill.fetchComponentGenerator().subscribe(
      res => {
        this.componentShell = res
      }
    );

    this.prefill.fetchUserCreatedComponent().subscribe(
      res => {
        this.userCreatedComponent = res
      }
    );

  }

}
