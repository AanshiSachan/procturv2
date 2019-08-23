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

  @Input()
  product_id: any;
  @Input()
  prodForm: any;

  @Output() nextForm = new EventEmitter<string>();
  @Output() startForm = new EventEmitter<string>();
  @Output() toggleLoader = new EventEmitter<boolean>();

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
  }

  initOnlineTests() {
    //Fetch Product Groups List
    this.http.getMethod('products/' + this.product_id + '/online_exams', null).subscribe(
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

      let response = {
        "validate": true,
        "data": [
          {
            "test_id": 819,
            "test_name": "Testtststst",
            "test_description": "testtststst",
            "test_type_id": 1,
            "difficulty_title": "Easy",
            "duration": "20",
            "total_question": 2,
            "total_marks": 2,
            "start_timestamp": 1565893800,
            "end_timestamp": 1567276140
          },
          {
            "test_id": 824,
            "test_name": "Testtststst",
            "test_description": "testtststst",
            "test_type_id": 1,
            "difficulty_title": "Easy",
            "duration": "20",
            "total_question": 2,
            "total_marks": 2,
            "start_timestamp": 1565980200,
            "end_timestamp": 1567276140
          },
          {
            "test_id": 825,
            "test_name": "New Mock Test With All Types Of Question",
            "test_description": "New mock test with all types of question",
            "test_type_id": 1,
            "difficulty_title": "Medium",
            "duration": "20",
            "total_question": 10,
            "total_marks": 10,
            "start_timestamp": 1565980200,
            "end_timestamp": 1566671340
          },
          {
            "test_id": 827,
            "test_name": "Passage Added In Test",
            "test_description": "passage added in test",
            "test_type_id": 1,
            "difficulty_title": "Easy",
            "duration": "20",
            "total_question": 2,
            "total_marks": 2,
            "start_timestamp": 1565980200,
            "end_timestamp": 1567276140
          },
          {
            "test_id": 831,
            "test_name": "Passage Added In Test",
            "test_description": "new ",
            "test_type_id": 1,
            "difficulty_title": "Medium",
            "duration": "20",
            "total_question": 2,
            "total_marks": 2,
            "start_timestamp": 1565980200,
            "end_timestamp": 1566671340
          },
          {
            "test_id": 835,
            "test_name": "Anushka Test",
            "test_description": "Anushka test ",
            "test_type_id": 1,
            "difficulty_title": "Easy",
            "duration": "20",
            "total_question": 10,
            "total_marks": 10,
            "start_timestamp": 1565980200,
            "end_timestamp": 1567276140
          },
          {
            "test_id": 839,
            "test_name": "All Types Of Marks Test",
            "test_description": "all types of marks test",
            "test_type_id": 1,
            "difficulty_title": "Medium",
            "duration": "20",
            "total_question": 5,
            "total_marks": 10,
            "start_timestamp": 1565980200,
            "end_timestamp": 1567276140
          },
          {
            "test_id": 840,
            "test_name": "Mathjax Support Testing",
            "test_description": "Mathjax support testing",
            "test_type_id": 1,
            "difficulty_title": "Hard",
            "duration": "20",
            "total_question": 2,
            "total_marks": 2,
            "start_timestamp": 1565980200,
            "end_timestamp": 1566671340
          },
          {
            "test_id": 842,
            "test_name": "New Practice Test",
            "test_description": "new practice test",
            "test_type_id": 1,
            "difficulty_title": "Hard",
            "duration": "20",
            "total_question": 2,
            "total_marks": 2,
            "start_timestamp": 1565980200,
            "end_timestamp": 1567276140
          },
          {
            "test_id": 850,
            "test_name": "Auto Submitted",
            "test_description": "Auto submitted",
            "test_type_id": 1,
            "difficulty_title": "Easy",
            "duration": "2",
            "total_question": 2,
            "total_marks": 2,
            "start_timestamp": 1566153000,
            "end_timestamp": 1567276140
          },
          {
            "test_id": 852,
            "test_name": "Web Test Panel Test Settings",
            "test_description": "Web test panel test settings",
            "test_type_id": 1,
            "difficulty_title": "Easy",
            "duration": "20",
            "total_question": 2,
            "total_marks": 2,
            "start_timestamp": 1566153000,
            "end_timestamp": 1566671340
          },
          {
            "test_id": 854,
            "test_name": "Mock 1",
            "test_description": "dfsd",
            "test_type_id": 1,
            "difficulty_title": "Easy",
            "duration": "40",
            "total_question": 3,
            "total_marks": 3,
            "start_timestamp": 1566153000,
            "end_timestamp": 1567276140
          },
          {
            "test_id": 855,
            "test_name": "Show Question Timer",
            "test_description": "Show question timer",
            "test_type_id": 1,
            "difficulty_title": "Medium",
            "duration": "20",
            "total_question": 2,
            "total_marks": 2,
            "start_timestamp": 1566153000,
            "end_timestamp": 1567276140
          },
          {
            "test_id": 856,
            "test_name": "Show Ansswer",
            "test_description": "show ansswer",
            "test_type_id": 1,
            "difficulty_title": "Medium",
            "duration": "20",
            "total_question": 2,
            "total_marks": 2,
            "start_timestamp": 1566153000,
            "end_timestamp": 1567189740
          },
          {
            "test_id": 860,
            "test_name": "Allow Back Button Moment Testing",
            "test_description": "Allow back button moment testing",
            "test_type_id": 1,
            "difficulty_title": "Medium",
            "duration": "20",
            "total_question": 5,
            "total_marks": 5,
            "start_timestamp": 1566153000,
            "end_timestamp": 1567276140
          },
          {
            "test_id": 861,
            "test_name": "Allow Back Button Movement",
            "test_description": "Allow back button movement",
            "test_type_id": 1,
            "difficulty_title": "Medium",
            "duration": "20",
            "total_question": 2,
            "total_marks": 2,
            "start_timestamp": 1566153000,
            "end_timestamp": 1566498540
          },
          {
            "test_id": 862,
            "test_name": "Allow Back Button Movement",
            "test_description": "Allow back button movement",
            "test_type_id": 1,
            "difficulty_title": "Medium",
            "duration": "20",
            "total_question": 5,
            "total_marks": 5,
            "start_timestamp": 1566153000,
            "end_timestamp": 1566584940
          },
          {
            "test_id": 863,
            "test_name": "Allow 22Back Button Movement",
            "test_description": "Allow back button movement",
            "test_type_id": 1,
            "difficulty_title": "Medium",
            "duration": "20",
            "total_question": 5,
            "total_marks": 5,
            "start_timestamp": 1566153000,
            "end_timestamp": 1567276140
          },
          {
            "test_id": 874,
            "test_name": "Mock Test",
            "test_description": "Mock test",
            "test_type_id": 1,
            "difficulty_title": "Medium",
            "duration": "20",
            "total_question": 2,
            "total_marks": 2,
            "start_timestamp": 1566153000,
            "end_timestamp": 1567276140
          },
          {
            "test_id": 875,
            "test_name": "Guest User Allow Back Button Movement Applicable",
            "test_description": "Guest user allow back button movement applicable",
            "test_type_id": 1,
            "difficulty_title": "Easy",
            "duration": "20",
            "total_question": 5,
            "total_marks": 5,
            "start_timestamp": 1566153000,
            "end_timestamp": 1567016940
          },
          {
            "test_id": 877,
            "test_name": "Mock Testaaa",
            "test_description": "Mock testaaa",
            "test_type_id": 1,
            "difficulty_title": "Medium",
            "duration": "20",
            "total_question": 5,
            "total_marks": 5,
            "start_timestamp": 1566239400,
            "end_timestamp": 1567276140
          },
          {
            "test_id": 881,
            "test_name": "Question Timer Setting Testing",
            "test_description": "question timer setting testing",
            "test_type_id": 1,
            "difficulty_title": "Very Hard",
            "duration": "20",
            "total_question": 2,
            "total_marks": 2,
            "start_timestamp": 1566239400,
            "end_timestamp": 1567276140
          },
          {
            "test_id": 884,
            "test_name": "Match Matrix And Match The Following",
            "test_description": "match matrix and match the following",
            "test_type_id": 1,
            "difficulty_title": "Hard",
            "duration": "20",
            "total_question": 2,
            "total_marks": 2,
            "start_timestamp": 1566239400,
            "end_timestamp": 1567276140
          },
          {
            "test_id": 889,
            "test_name": "Mock Test",
            "test_description": "mock test",
            "test_type_id": 1,
            "difficulty_title": "Hard",
            "duration": "20",
            "total_question": 2,
            "total_marks": 2,
            "start_timestamp": 1566239400,
            "end_timestamp": 1566498540
          },
          {
            "test_id": 896,
            "test_name": "New Mock Test",
            "test_description": "new mock test",
            "test_type_id": 1,
            "difficulty_title": "Hard",
            "duration": "20",
            "total_question": 5,
            "total_marks": 5,
            "start_timestamp": 1566239400,
            "end_timestamp": 1567103340
          },
          {
            "test_id": 901,
            "test_name": "Mock Test123456",
            "test_description": "Mock test123456",
            "test_type_id": 1,
            "difficulty_title": "Medium",
            "duration": "20",
            "total_question": 2,
            "total_marks": 2,
            "start_timestamp": 1566239400,
            "end_timestamp": 1567276140
          },
          {
            "test_id": 903,
            "test_name": "Mock Test Aniket",
            "test_description": "mock test Aniket",
            "test_type_id": 1,
            "difficulty_title": "Medium",
            "duration": "20",
            "total_question": 5,
            "total_marks": 5,
            "start_timestamp": 1566239400,
            "end_timestamp": 1566584940
          }
        ]
      };
      this.testlist = response.data;
      this.testlist.filter((item) => item.isChecked == true);
      this.http.getMethod('subjects/1/online_exams', null).subscribe(
      (resp) => {
        let response = resp['body'];
        if (response.validate) {
          this.testlist = response.data;
        }
        else {
          this.msgService.showErrorMessage('error', response.errors.message, '');
        }
      },
      (err) => {
        this.msgService.showErrorMessage('error',  err['error'].errors.message, '');
      });
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
            this.msgService.showErrorMessage('success',response.message, '');
            this.nextForm.emit();
          }
          else {
            this.msgService.showErrorMessage('error', response.errors.message, '');
          }
        },
          (err) => {
            this.msgService.showErrorMessage('error',  err['error'].errors.message, '');
          });
      }
      else {
        this.nextForm.emit();
        // this.toaster.error('error',);
      }
    }
    else {
      this.msgService.showErrorMessage('error',  " select only " + this.prodForm.product_item_stats.mock_test + " Mock Test", '');
      return;
    }


  }
}
