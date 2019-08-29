import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ProductService } from '../../../../services/products.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { Router } from '../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-online-exam',
  templateUrl: './online-exam.component.html',
  styleUrls: ['./online-exam.component.scss']
})
export class OnlineExamComponent implements OnInit {

  @Input()  entity_id: any;
  @Input()  prodForm: any;

  @Output() nextForm = new EventEmitter<string>();
  @Output() startForm = new EventEmitter<string>();
  @Output() toggleLoader = new EventEmitter<boolean>();
  @Output() previewEvent = new EventEmitter<boolean>();
  testlist: any = [];
  checkedList: any = [];
  selectAll: boolean = false;
  constructor(
    private http: ProductService,
    private msgService: MessageShowService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initOnlineTests();
    this.initForm();
  }

  initOnlineTests() {
    //Fetch Product Groups List
    this.http.postMethod('ext/get-examdesk', ["Mock_Test"]).then(
      (resp: any) => {
        let response = resp['body'];
        if (response.validate) {
          let details = JSON.parse(response.result['Mock Test']);
          this.testlist = details.data;
          this.selectAllDetails(false);
        }
        else {
          this.checkedList = [];
          this.msgService.showErrorMessage('error', response.errors.message, '');
        }
      },
      (err) => {
        this.msgService.showErrorMessage('error', err['error'].errors.message, '');
      });
  }

  initForm() {
    //Fetch Product Groups List

    if (this.entity_id && this.entity_id.length > 0) {
      //Fetch Product Info
      this.http.getMethod('product/get/' + this.entity_id, null).subscribe(
        (resp: any) => {
          let response = resp.result;
          if (resp.validate) {
            let productData = response;
            this.prodForm.entity_id = productData.entity_id;
            this.prodForm.title = productData.title;
            this.prodForm.about = productData.about;
            this.prodForm.is_paid = productData.is_paid;
            this.prodForm.price = productData.price;
            this.prodForm.start_datetime = productData.valid_from_date;
            this.prodForm.end_datetime = productData.valid_to_date;
            this.prodForm.status = productData.status;
            this.prodForm.purchase_limit = productData.purchase_limit;
            this.prodForm.product_ecourse_maps = productData.product_ecourse_maps;
            this.prodForm.product_items_types = productData.product_items_types;
            this.prodForm.product_item_stats= {};
            this.prodForm.product_items_types.forEach(element => {
              this.prodForm.product_item_stats[element.slug] = true;
            });
            this.updateProductItemStates(null, null);
          }
          else {
            this.msgService.showErrorMessage('error', response.errors.message, '');
          }
        },
        (err) => {
          this.msgService.showErrorMessage('error', err['error'].errors.message, '');
        });
    }
    

  }

    // update parent state data
    updateProductItemStates(event, item) {
      if (item) {
        this.prodForm.product_item_stats[item.slug] = event ? 1 : 0;
      }
      // console.log(this.prodForm);
      this.previewEvent.emit(this.prodForm);
    }

  selectAllDetails($event) {
    this.testlist.forEach(element => { element.isChecked = $event });
  }

  selectVlaue($event) {
    this.selectAll = false;
    let array = this.testlist.filter(element => element.isChecked == true);
    if (array.length == this.testlist.length) {
      this.selectAll = true;
    }
  }

  gotoBack() {
    this.router.navigateByUrl('/view/products/details');
  }

  gotoNext() {
    let array = this.testlist.filter((item) => item.isChecked == true);
    if (this.testlist.length == 0) {
      this.nextForm.emit();
    } else {
      if (this.prodForm.product_item_stats.mock_test === array.length) {
        array = [];
        this.testlist.forEach(element => {
          if (element.isChecked) {
            let object = {
              "source_item_id": element.test_id,
              "prod_item_type_id": 11,
              "source_subject_id": 0
            }
            array.push(object);
          }
        });

        if (array.length) {
          this.http.postMethod('product/' + this.entity_id + '/items', array).then((resp) => {
            let response = resp['body'];
            if (response.validate) {
              this.msgService.showErrorMessage('success', response.message, '');
              this.nextForm.emit();
            }
            else {
              this.msgService.showErrorMessage('error', response.errors.message, '');
            }
          },
            (err) => {
              this.msgService.showErrorMessage('error', err['error'].errors.message, '');
            });
        }
        else {
          this.nextForm.emit();
          // this.toaster.error('error',);
        }
      }
      else {
        this.nextForm.emit();
        this.msgService.showErrorMessage('error', " select at least one Online Test", '');
        return;
      }
    }
  }
}
