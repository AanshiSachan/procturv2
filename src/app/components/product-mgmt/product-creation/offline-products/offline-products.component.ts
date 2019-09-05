import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-offline-products',
  templateUrl: './offline-products.component.html',
  styleUrls: ['./offline-products.component.scss']
})
export class OfflineProductsComponent implements OnInit {

  @Input() entity_id: any;
  @Input() prodForm: any;
  @Output() nextForm = new EventEmitter<string>();
  @Output() startForm = new EventEmitter<string>();
  @Output() toggleLoader = new EventEmitter<boolean>();
  
  constructor() { }

  ngOnInit() {
  }

}
