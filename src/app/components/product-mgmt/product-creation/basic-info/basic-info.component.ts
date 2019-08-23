import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MessageShowService } from '../../../../services/message-show.service';
import { ProductService } from '../../../../services/products.service';
import { Router } from '../../../../../../node_modules/@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {


  @Input() product_id: any;
  productItems: any = [];
  @Input() product_item_stats: any;

  @Output() nextForm = new EventEmitter<string>();
  @Output() startForm = new EventEmitter<string>();
  @Output() toggleLoader = new EventEmitter<boolean>();
  @Output() previewEvent = new EventEmitter<boolean>();

  items: any = {
    pendrive: 0,
    books: 0,
    tablets: 0
  };

  prodGroupList: any;
  examList: any;
  prodItems: any = {}
  moderatorSettings :any = {
    singleSelection: false,
    idField: 'exam_id',
    textField: 'exam_name',
    // itemsShowLimit: ,
    enableCheckAll: false
  };

  prodForm: any = {
    product_id: 0,
    title: '',
    exams: '',
    product_image: '',
    exam_ids: [1,2],
    // product_group_id: null,
    short_description: '',
    about_product: '',
    has_sectional_tests: 0,
    has_videos: 0,
    has_notes: 0,
    has_assignments: 0,
    has_ebooks: 0,
    has_mock_tests: 0,
    has_online_exams: 0,
    has_live_classes: 0,
    is_free: true,
    is_paid: 0,
    price: 0,
    cateory: 0,
    itemStates: [],
    start_datetime: moment().format('DD-MMM-YYYY'),
    end_datetime:  moment().format('DD-MMM-YYYY'),
    start_timestamp: '',
    end_timestamp: '',
    product_item_stats: {
      mock_test: 0,
      online_exams: 0,
      live_classes: 0,
      assignments: 0
    }
  };

  constructor(
    private http:ProductService,
    private msgService: MessageShowService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getProductItemsData();
    this.toggleLoader.emit(true);
    this.initForm();
    this.previewEvent.emit(this.prodForm);
    this.toggleLoader.emit(false);

  }

  /** get product item details in  */
  getProductItemsData() {
    ///admin/product/item_types
    let resp = {"validate":"true","data":[
      {"prod_item__type_id":11,"title":"Mock Test","slug":"mock_test","is_count_applicable":1,"icon":"https://via.placeholder.com/150","is_online":1},
      {"prod_item__type_id":17,"title":"Live Classes","slug":"live_classes","is_count_applicable":0,"icon":"https://via.placeholder.com/150","is_online":1},
      {"prod_item__type_id":20,"title":"Online Exams","slug":"online_exams","is_count_applicable":1,"icon":"https://via.placeholder.com/150","is_online":1},
      {"prod_item__type_id":21,"title":"Study Material","slug":"stude_material","is_count_applicable":0,"icon":"https://via.placeholder.com/150","is_online":1},
      {"prod_item__type_id":63,"title":"Assignments","slug":"assignments","is_count_applicable":0,"icon":"https://via.placeholder.com/150","is_online":1},{"prod_item__type_id":182,"title":"Ebooks","slug":"ebooks","is_count_applicable":0,"icon":"https://via.placeholder.com/150","is_online":1},{"prod_item__type_id":229,"title":"Notes","slug":"notes","is_count_applicable":0,"icon":"https://via.placeholder.com/150","is_online":1},{"prod_item__type_id":230,"title":"Youtube URL","slug":"youtube_video","is_count_applicable":0,"icon":"https://via.placeholder.com/150","is_online":1},{"prod_item__type_id":231,"title":"Audio Notes ","slug":"audio_notes","is_count_applicable":0,"icon":"https://via.placeholder.com/150","is_online":1},{"prod_item__type_id":232,"title":"Images","slug":"images","is_count_applicable":0,"icon":"https://via.placeholder.com/150","is_online":1},{"prod_item__type_id":233,"title":"Previous Year Question Paper","slug":"previous_yr_question_paper","is_count_applicable":0,"icon":"https://via.placeholder.com/150","is_online":1}],"status":200};
    this.productItems = resp.data;
    this.prodForm.product_item_stats = {};
    this.productItems.forEach(element => {
      this.prodForm.itemStates.push(element);// add states
      this.prodForm.product_item_stats[element.slug] = 0;
      this.prodItems[element.slug] = false;
      this.prodItems[element.slug] = (this.prodForm.product_item_stats[element.slug] > 0) ? true : false;
    });
    // this.http.getMethod('product/item_types', null).then(
    //   (resp) => {
    //     let response = resp['body'];
    //     if (response.validate) {
    //       this.productItems = response.data;
    //       this.prodForm.product_item_stats = {};
    //       this.productItems.forEach(element => {
    //         this.prodForm.itemStates.push(element);// add states
    //         this.prodForm.product_item_stats[element.slug] = 0;
    //         this.prodItems[element.slug] = false;
    //       });
    //     }
    //     else {
    //       this.msgService.showErrorMessage('error', response.errors.message, '');
    //     }
    //   },
    //   (err) => {
    //     this.msgService.showErrorMessage('error',  err['error'].errors.message, '');
    //   });

  }

  initForm() {
    //Fetch Product Groups List
    let rr = {"validate":"true","data":[{"product_group_id":11,"title":"groups 1"},{"product_group_id":12,"title":"groups "},{"product_group_id":26,"title":"Group 1"},{"product_group_id":29,"title":"New Grop"},{"product_group_id":30,"title":"Again Groupef"},{"product_group_id":31,"title":"SSC Test Series"},{"product_group_id":32,"title":"bhfjksd"},{"product_group_id":33,"title":"fixed test"},{"product_group_id":34,"title":"fixed5"},{"product_group_id":35,"title":"fixed8"},{"product_group_id":36,"title":"fixed test177r"},{"product_group_id":37,"title":"SSC Test"},{"product_group_id":38,"title":"Product Test"},{"product_group_id":42,"title":"abc"}]};
    this.prodGroupList = rr.data;
    this.http.getMethod('forms/product_groups', null).subscribe(
      (resp) => {
        let response = resp['body'];
        if (response.validate) {
          this.prodGroupList = response.data;
        }
        else {
          this.msgService.showErrorMessage('error', response.errors.message, '');
        }
      },
      (err) => {
        this.msgService.showErrorMessage('error', err['error'].errors.message, '');
      });
    //Fetch Exams List
    let response = { "validate": "true", "data": [{ "exam_id": 1, "account_id": 51, "exam_name": "RRB - M & I Categoris CEN 03 / 2019", "exam_icon": "https://s3-ap-southeast-1.amazonaws.com/proctur-elearn/common_resources/kpsc.png", "page_url": "pages/excise_sub_inspector_2018", "proctur_course_id": null, "status_id": 1, "created_date": "2018-12-11T06:22:33+00:00", "created_by": 51, "updated_date": "2019-05-07T07:37:48.000Z", "updated_by": 11, "ecourse_id": 87, "ecourse_name": "appium", "subjects": [{ "subject_id": 4, "subject_name": "Aptitude" }] }, { "exam_id": 2, "account_id": 51, "exam_name": "RRB - Level - 1 by RRC CEN 01 / 2019", "exam_icon": "https://s3-ap-southeast-1.amazonaws.com/proctur-elearn/common_resources/kpsc.png", "page_url": "pages/hm&teachers_RPC_2018", "proctur_course_id": null, "status_id": 1, "created_date": "2018-12-11T06:22:33+00:00", "created_by": 51, "updated_date": "2019-04-01T13:23:45.000Z", "updated_by": 11, "ecourse_id": 87, "ecourse_name": "appium", "subjects": [{ "subject_id": 4, "subject_name": "Aptitude" }] }, { "exam_id": 3, "account_id": 51, "exam_name": "KPSC Group A & B", "exam_icon": "https://s3-ap-southeast-1.amazonaws.com/proctur-elearn/common_resources/kpsc.png", "page_url": "pages/HM_& _Teachers_HK_2018", "proctur_course_id": null, "status_id": 1, "created_date": "2018-12-11T06:22:33+00:00", "created_by": 51, "updated_date": "2019-04-01T13:24:18.000Z", "updated_by": 11, "ecourse_id": 6, "ecourse_name": "Bank PO", "subjects": [{ "subject_id": 4, "subject_name": "Aptitude" }] }, { "exam_id": 5, "account_id": 51, "exam_name": "Current Affairs (saturday at 4 pm)", "exam_icon": "https://s3-ap-southeast-1.amazonaws.com/proctur-elearn/common_resources/kpsc.png", "page_url": "pages/HM_& _Teachers_HK_2018", "proctur_course_id": null, "status_id": 1, "created_date": "2018-12-11T06:22:33+00:00", "created_by": 51, "updated_date": "2019-04-01T13:10:39.000Z", "updated_by": 11, "ecourse_id": null, "ecourse_name": null, "subjects": [{ "subject_id": 2, "subject_name": "Physcis" }] }, { "exam_id": 6, "account_id": 51, "exam_name": "RRB -JE CEN 03/2018", "exam_icon": "https://s3-ap-southeast-1.amazonaws.com/proctur-elearn/common_resources/psi.png", "page_url": "pages/staff_selection_commission_ssc", "proctur_course_id": null, "status_id": 1, "created_date": "2018-12-11T06:22:33+00:00", "created_by": 51, "updated_date": "2019-04-01T13:25:02.000Z", "updated_by": 11, "ecourse_id": null, "ecourse_name": null, "subjects": [{ "subject_id": 4, "subject_name": "Aptitude" }] }, { "exam_id": 8, "account_id": 51, "exam_name": "IAS Prelims", "exam_icon": "https://s3-ap-southeast-1.amazonaws.com/proctur-elearn/common_resources/kpsc.png", "page_url": "pages/KAR_TET_2018", "proctur_course_id": null, "status_id": 1, "created_date": "2018-12-11T06:22:33+00:00", "created_by": 51, "updated_date": "2019-04-01T13:14:41.000Z", "updated_by": 11, "ecourse_id": null, "ecourse_name": null, "subjects": [{ "subject_id": 2, "subject_name": "Physcis" }] }] }
    this.examList = response.data;

    // this.http.getMethod('exams', null).then(
    //   (resp) => {
    //     let response = resp['body'];
    //     if (response.validate) {
    //       this.examList = response.data;
    //     }
    //     else {
    //       this.msgService.showErrorMessage('error', response.errors.message, '');
    //     }
    //   },
    //   (err) => {
    //     this.msgService.showErrorMessage('error', err['error'].errors.message, '');
    //   });

    if (this.product_id > 0) {
      //Fetch Product Info
      let response = {"validate":"true","data":{"title":"Online Test","subject_ids":null,"product_image":"https://s3-aws.com/product/pepper-pot.jpg","short_description":"Nice Product to purchase ","about_product":"Nice Product to purchase ","product_group_id":26,"is_paid":1,"price":0,"start_timestamp":1548335000,"end_timestamp":1548355000,"exams":"1","product_item_stats":{"mock_test":1,"live_classes":0,"online_exams":1,"stude_material":0,"assignments":0,"ebooks":0,"notes":0,"youtube_video":0,"audio_notes":0,"images":0,"previous_yr_question_paper":0}},"status":200};

      let productData = response.data;
      this.prodForm = {
        product_id: this.product_id,
        title: response.data.title,
        exams: response.data.exams,
        product_image: response.data.product_image,
        exam_ids: (response.data.exams.length > 0) ? response.data.exams.split(',').map(Number) : [],
        // product_group_id: response.data.product_group_id,
        short_description: response.data.short_description,
        about_product: response.data.about_product,
        is_free: (response.data.is_paid) ? false : true,
        is_paid: response.data.is_paid,
        price: response.data.price,
        start_datetime: new Date(response.data.start_timestamp * 1000),
        end_datetime: new Date(response.data.end_timestamp * 1000),
        start_timestamp: response.data.start_timestamp,
        end_timestamp: response.data.end_timestamp,
        itemStates: this.productItems,
        product_item_stats: response.data.product_item_stats
      };
      let resp = {"validate":"true","data":[{"prod_item__type_id":11,"title":"Mock Test","slug":"mock_test","is_count_applicable":1,"icon":"https://via.placeholder.com/150","is_online":1},{"prod_item__type_id":17,"title":"Live Classes","slug":"live_classes","is_count_applicable":0,"icon":"https://via.placeholder.com/150","is_online":1},{"prod_item__type_id":20,"title":"Online Exams","slug":"online_exams","is_count_applicable":1,"icon":"https://via.placeholder.com/150","is_online":1},{"prod_item__type_id":21,"title":"Study Material","slug":"stude_material","is_count_applicable":0,"icon":"https://via.placeholder.com/150","is_online":1},{"prod_item__type_id":63,"title":"Assignments","slug":"assignments","is_count_applicable":0,"icon":"https://via.placeholder.com/150","is_online":1},{"prod_item__type_id":182,"title":"Ebooks","slug":"ebooks","is_count_applicable":0,"icon":"https://via.placeholder.com/150","is_online":1},{"prod_item__type_id":229,"title":"Notes","slug":"notes","is_count_applicable":0,"icon":"https://via.placeholder.com/150","is_online":1},{"prod_item__type_id":230,"title":"Youtube URL","slug":"youtube_video","is_count_applicable":0,"icon":"https://via.placeholder.com/150","is_online":1},{"prod_item__type_id":231,"title":"Audio Notes ","slug":"audio_notes","is_count_applicable":0,"icon":"https://via.placeholder.com/150","is_online":1},{"prod_item__type_id":232,"title":"Images","slug":"images","is_count_applicable":0,"icon":"https://via.placeholder.com/150","is_online":1},{"prod_item__type_id":233,"title":"Previous Year Question Paper","slug":"previous_yr_question_paper","is_count_applicable":0,"icon":"https://via.placeholder.com/150","is_online":1}],"status":200};
      this.productItems = resp.data;
      this.productItems.forEach(element => {
        this.prodForm.product_item_stats[element.slug] = (response.data.product_item_stats[element.slug] != undefined) ? response.data.product_item_stats[element.slug] : 0;
        this.prodItems[element.slug] = (this.prodForm.product_item_stats[element.slug] > 0) ? true : false;
      });

      // this.http.getMethod('product/' + this.product_id, null).then(
      //   (resp) => {
      //     let response = resp['body'];
      //     if (response.validate) {
      //       let productData = response.data;
      //       this.prodForm = {
      //         product_id: this.product_id,
      //         title: response.data.title,
      //         exams: response.data.exams,
      //         product_image: response.data.product_image,
      //         exam_ids: (response.data.exams.length > 0) ? response.data.exams.split(',').map(Number) : [],
      //         product_group_id: response.data.product_group_id,
      //         short_description: response.data.short_description,
      //         about_product: response.data.about_product,
      //         is_free: (response.data.is_paid) ? false : true,
      //         is_paid: response.data.is_paid,
      //         price: response.data.price,
      //         start_datetime: new Date(response.data.start_timestamp * 1000),
      //         end_datetime: new Date(response.data.end_timestamp * 1000),
      //         start_timestamp: response.data.start_timestamp,
      //         end_timestamp: response.data.end_timestamp,
      //         itemStates: this.productItems,
      //         product_item_stats: {
      //         }
      //       };
      //       this.productItems.forEach(element => {
      //         this.prodForm.product_item_stats[element.slug] = (response.data.product_item_stats[element.slug] != undefined) ? response.data.product_item_stats[element.slug] : 0;
      //         this.prodItems[element.slug] = (this.prodForm.product_item_stats[element.slug] > 0) ? true : false;
      //       });
      //       this.updateProductItemStates(null,null);
      //     }
      //     else {
      //       this.msgService.showErrorMessage('error', response.errors.message, '');
      //     }
      //   },
      //   (err) => {
      //     this.msgService.showErrorMessage('error', err['error'].errors.message, '');
      //   });
    }

  }

  gotoBack() {
    this.router.navigateByUrl('/view/products/details');
  }
  // update parent state data
  updateProductItemStates(event, item) {
    if (item) {
        this.prodForm.product_item_stats[item.slug] = event ? 1 : 0;
    }
    console.log(this.prodForm);
    this.previewEvent.emit(this.prodForm);

  }

  saveProduct() {
    if (this.prodForm.title == "" ||
      this.prodForm.title == null) {
      this.msgService.showErrorMessage('error', 'title should NOT be shorter than 1 characters', '');
      return;
    }

    // if (this.prodForm.product_group_id == null) {
    //   this.msgService.showErrorMessage('error', 'product group should be not null', '');
    //   return;
    // }
    let keys = Object.keys(this.prodItems);
    let notselectedItem = keys.filter(key => this.prodItems[key] == false);
    if (this.productItems.length == notselectedItem.length) {
      this.msgService.showErrorMessage('error', 'select at least one item ', '');
      return;
    }

    this.prodForm.exams =this.prodForm.exam_ids; // (this.prodForm.exam_ids.length > 0) ? this.prodForm.exam_ids.join(',') : '';
    this.prodForm.start_timestamp = Math.floor(new Date(this.prodForm.start_datetime).getTime() / 1000);
    this.prodForm.end_timestamp = Math.floor(new Date(this.prodForm.end_datetime).getTime() / 1000);
    this.prodForm.is_paid = (this.prodForm.is_free) ? 0 : 1;
    this.prodForm.price = (this.prodForm.is_free) ? 0 : this.prodForm.price;
    this.productItems.forEach(element => {
      this.prodForm.product_item_stats[element.slug] = (this.prodItems[element.slug]) ? this.prodForm.product_item_stats[element.slug] : 0;
    });
    if (this.prodForm.product_id < 1) {
      // this.createProduct();
      this.startForm.emit('3');
      this.nextForm.emit();
    }
    else {
      // this.updateProduct();
      this.nextForm.emit();
    }
  }

  createProduct() {

    this.toggleLoader.emit(true);
    let object = {
      "title": this.prodForm.title,
      "exams": this.prodForm.exams,
      "product_image": "",
      "short_description": this.prodForm.short_description,
      "about_product": this.prodForm.about_product,
      // "product_group_id": this.prodForm.product_group_id,
      "is_paid": this.prodForm.is_paid,
      "price": this.prodForm.price,
      "start_timestamp": this.prodForm.start_timestamp,
      "end_timestamp": this.prodForm.end_timestamp,
      "product_item_stats": this.prodForm.product_item_stats
    }


    let body = JSON.parse(JSON.stringify(object));
    this.toggleLoader.emit(true);
    this.http.postMethod('product', body).then(
      (resp) => {
        this.toggleLoader.emit(false);
        let data = resp['body'];
        if (data.validate) {
          this.msgService.showErrorMessage('success', data.message, '');
          this.startForm.emit(data.data.product_id);
          this.nextForm.emit();
        }
        else {
          this.msgService.showErrorMessage('error', data.errors.message, '');
        }
      },
      (err) => {
        this.toggleLoader.emit(false);
        this.msgService.showErrorMessage('error', err['error'].errors.message, '');
      });
  }

  updateProduct() {

    this.toggleLoader.emit(true);
    let body = JSON.parse(JSON.stringify(this.prodForm));
    body.about_product = btoa(body.about_product);
    this.http.putMethod('product/' + this.prodForm.product_id, body).then(
      (resp) => {
        this.toggleLoader.emit(false);
        let data = resp['body'];
        if (data.validate) {
          this.msgService.showErrorMessage('success', data.message, '');

          this.nextForm.emit();
        }
        else {
          this.msgService.showErrorMessage('error', data.errors.message, '');
        }
      },
      (err) => {
        this.toggleLoader.emit(false);
        this.msgService.showErrorMessage('error', err['error'].errors.message, '');
      });
  }

  calc_days() {
    return (this.prodForm.start_datetime != '' && this.prodForm.end_datetime != '') ? Math.ceil(Math.abs((new Date(this.prodForm.end_datetime).getTime()) - (new Date(this.prodForm.start_datetime).getTime())) / (1000 * 3600 * 24)) : 'NA';
  }


}
