import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

declare var $;

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  groupForm : any = {
    product_group_id : 0,
    title: '',
    tagline : '',
    operation: 'New'
  };

  deleteItem: any = {
    product_group_id : 0,
    title : ''
  };

  groupList : any = [];
  groupListLoading: boolean = true;
  total_items: any;

  constructor(
    private http : HttpService
  ){ }

  ngOnInit() {
  }

}
