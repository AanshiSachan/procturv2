import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ProductService } from '../../../../services/products.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { Router } from '../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-mock-test',
  templateUrl: './mock-test.component.html',
  styleUrls: ['./mock-test.component.scss']
})
export class MockTestComponent implements OnInit {

  @Input() product_id: any;
  @Input() prodForm: any;
  @Output() nextForm = new EventEmitter<string>();
  @Output() startForm = new EventEmitter<string>();
  @Output() toggleLoader = new EventEmitter<boolean>();

  testlist: any = [];
  checkedList: any = [];
  selectAll: boolean = false;
  constructor(
    private http:ProductService,
    private msgService: MessageShowService,
    private router: Router,
  ) { }

  ngOnInit() {
    console.log(this.prodForm);
    this.initMockTests();
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

  initMockTests() {
    //Fetch Product Groups List
    this.http.getMethod('products/' + this.product_id + '/mock_test', null).subscribe(
      (resp) => {
        let response = resp['body'];
        if (response.validate) {
          this.checkedList = response.data;
        }
        else {
          this.checkedList = [];
          this.msgService.showErrorMessage('error', response.errors.message, '');
        }
      },
      (err) => {
        this.msgService.showErrorMessage('error', err['error'].errors.message, '');
      });

    let response = { "validate": true, "data": [{ "test_id": 2502, "test_name": "Test", "test_description": "Test with Report", "test_type_id": 1, "difficulty_title": "Medium", "duration": "10", "total_question": 10, "total_marks": 10, "start_timestamp": 1565289000, "end_timestamp": 1572546540 }, { "test_id": 2507, "test_name": "Test-2", "test_description": "Test", "test_type_id": 1, "difficulty_title": "Medium", "duration": "10", "total_question": 10, "total_marks": 10, "start_timestamp": 1565548200, "end_timestamp": 1567276140 }, { "test_id": 2511, "test_name": "Test-3", "test_description": "Test-3", "test_type_id": 1, "difficulty_title": "Medium", "duration": "50", "total_question": 50, "total_marks": 50, "start_timestamp": 1565634600, "end_timestamp": 1567276140 }] };
    this.testlist = response.data;
    this.selectAllDetails(false);
    this.http.getMethod('subjects/1/mock_test', null).subscribe(
      (resp) => {
        let response = resp['body'];
        if (response.validate) {
          this.testlist = response.data;
          this.selectAllDetails(false);
        }
        else {
          this.msgService.showErrorMessage('error', response.errors.message, '');
        }
      },
      (err) => {
        this.msgService.showErrorMessage('error', err['error'].errors.message, '');
      });
  }

  gotoBack() {
      this.router.navigateByUrl('/view/products/details');
  }

  gotoNext() {
    let array = this.testlist.filter((item) => item.isChecked == true);
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
        this.http.postMethod('product/' + this.product_id + '/items', array).then((resp) => {
          let response = resp['body'];
          if (response.validate) {
            this.nextForm.emit();
            this.msgService.showErrorMessage('success',response.message, '');
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
      this.msgService.showErrorMessage('error', " select only " + this.prodForm.product_item_stats.mock_test + " Mock Test", '');
      return;
    }
  }
}
