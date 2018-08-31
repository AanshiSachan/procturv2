import { Component, OnInit } from '@angular/core';
import { CommonServiceFactory } from '../../services/common-service';

@Component({
  selector: 'app-fee-template',
  templateUrl: './fee-template.component.html',
  styleUrls: ['./fee-template.component.scss']
})
export class FeeTemplateHomeComponent implements OnInit {

  constructor(
    private commonService: CommonServiceFactory
  ) { }

  ngOnInit() {
    this.commonService.removeSelectionFromSideNav();
  }

}
