import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProductService } from '../../../../services/products.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-classroom-class',
  templateUrl: './classroom-class.component.html',
  styleUrls: ['./classroom-class.component.scss']
})
export class ClassroomClassComponent implements OnInit {

  @Input() entity_id: any;
  @Input() prodForm: any;

  @Output() nextForm = new EventEmitter<string>();
  @Output() startForm = new EventEmitter<string>();
  @Output() toggleLoader = new EventEmitter<boolean>();
  @Output() previewEvent = new EventEmitter<boolean>();
  description: string = '';
  selectAll: boolean = false;
  isRippleLoad: boolean = false;
  constructor(
    private http: ProductService,
    private msgService: MessageShowService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  gotoBack() {
    this.router.navigateByUrl('/view/products/details');
  }

  gotoNext() {
    if ((!this.isRippleLoad)) {
      //update test List
      let obj = {
        "page_type": "Classroom_Class",
        "item_list": [],
        "description": this.description
      }
      this.isRippleLoad = true;
      this.http.postMethod('product-item/update/' + this.entity_id, obj).then(
        (resp: any) => {
          this.isRippleLoad = false;
          let response = resp['body'];
          if (response.validate) {
            let details = response.result;
            this.prodForm.product_item_list = details;
            this.msgService.showErrorMessage('success', "classroom class data updated successfully", '');
            this.nextForm.emit();
          }
          else {
            response.error && this.msgService.showErrorMessage('error', response.error[0].error_message, '');
          }
        },
        (err) => {
          this.isRippleLoad = false;
          this.msgService.showErrorMessage('error', 'something went wrong ty again ', '');
        });
    }
  }
}
