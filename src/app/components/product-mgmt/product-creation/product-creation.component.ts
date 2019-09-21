import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/products.service';
import { Router, ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { MessageShowService } from '../../../services/message-show.service';
import { product_details } from './product.model';

@Component({
  selector: 'app-product-creation',
  templateUrl: './product-creation.component.html',
  styleUrls: ['./product-creation.component.scss']
})
export class ProductCreationComponent implements OnInit {


  formLoading: boolean = false;
  activeForm: number = 3;
  entity_id: any = 0;
  productItems: any = [];
  jsonData={
    padding_right:34,
    padding_left:34
  }
  // prodForm: product_details = new product_details();
  prodForm: any = {
    entity_id: 0,
    title: '',
    exams: '',
    product_image: '',
    exam_ids: [],
    product_group_id: {},
    short_description: '',
    about_product: '',
    is_free: true,
    is_paid: 0,
    price: 0,
    start_datetime: '',
    end_datetime: '',
    start_timestamp: '',
    end_timestamp: '',
    itemStates: [],
    product_item_stats: {
      mock_test: 0,
      online_exams: 0,
      live_classes: 0,
      assignments: 0
    }
  };

  formSequence: any = {
    1: {
      slug: 'basic',
      show: true,
      is_completed: true,
      index: 1
    },
    2: {
      slug: 'Study_Material',
      show: false,
      is_completed: false,
      index: 2
    },
    3: {
      slug: 'Videos',
      show: false,
      is_completed: false,
      index: 3
    },
    4: {
      slug: 'Mock_Test',
      show: false,
      is_completed: false,
      index: 4
    },
    5: {
      slug: 'Online_Test',
      show: false,
      is_completed: false,
      index: 5
    },
    6: {
      slug: 'Online_Class',
      show: false,
      is_completed: false,
      index: 6
    },
    7: {
      slug: 'Offline_Material',
      show: false,
      is_completed: false,
      index: 7
    },
    8: {
      slug: 'Classroom_Class',
      show: false,
      is_completed: false,
      index: 8
    },
    9: {
      slug: 'review',
      show: true,
      is_completed: false,
      index: 9
    }
  };

  constructor(
    private router: Router,
    private http: ProductService,
    private route: ActivatedRoute,
    private msgService: MessageShowService
  ) {
    this.route.params.subscribe(params => {
      console.log(params);
      if (Object.keys(params).length > 0) {
        this.entity_id = params.entity_id;
        switch (params.form) {
          case 'basic': this.activeForm = 1; break;
          case 'Study_Material': this.activeForm = 2; break;
          case 'Videos': this.activeForm = 3; break;         
          case 'Mock_Test': this.activeForm = 4; break;
          case 'Online_Test': this.activeForm = 5; break;
          case 'Online_Class': this.activeForm = 6; break;
          case 'Offline_Material': this.activeForm = 7; break;
          case 'review': this.activeForm = 8; break;
          default:
            this.router.navigate(['/error404'], { replaceUrl: true }); break;
        }
      }
      else {
        this.activeForm = 1;
      }
    });

  }

  ngOnInit() {
    if (this.entity_id > 0) {
      this.initFormSequence();
    }

  }

  /** get product item details in  */
  getProductItemsData() {
    this.productItems = [];
    this.http.getMethod('master/item-type/get', null).subscribe(
      (resp: any) => {
        let response = resp.result;
        if (resp.validate) {
          this.productItems = response;
          this.prodForm.product_item_stats = {};
          this.productItems.forEach((element, index) => {
            this.prodForm.product_item_stats[element.slug] = 0;
          });

          this.prodForm.product_items_types.forEach(se_state => {
            this.productItems.forEach(actual_state => {
              if (actual_state.entity_id == se_state.entity_id) {
                this.prodForm.product_item_stats[actual_state.slug] = 1;
              }
            });
          });
          let keys = Object.keys(this.formSequence)
          keys.forEach((element, index) => {
            let i = index + 1;
            this.formSequence[i].show = (this.prodForm.product_item_stats[this.formSequence[i].slug] > 0) ? true : false;
          });
          this.formSequence[1].show = true;
          this.formSequence[9].show = true;
        }
        else {
          this.msgService.showErrorMessage('error', response.errors.message, '');
        }
      },
      (err) => {
        this.msgService.showErrorMessage('error', err['error'].errors.message, '');
      });

  }

  // get value of previedata and set 
  previewSetter($event) {
    this.prodForm = $event;
    let keys = Object.keys(this.formSequence);
    keys.forEach((element, index) => {
      let i = index + 1;
      this.formSequence[i].show = (this.prodForm.product_item_stats[this.formSequence[i].slug] > 0) ? true: false;
    });
    this.formSequence[1].show = true;
    this.formSequence[9].show = true;
      this.setPaddingDetails();
  }

   setPaddingDetails(){
    this.jsonData.padding_left =35;
    let obj={1:37,2:37,3:34,4:29,5:26,6:22,7:18,8:14,9:11};
    let keys = Object.keys(this.formSequence);
    let flag_count=0;
   keys.forEach((element, index) => {
     let i = index + 1;
     if(this.formSequence[i].show){
       flag_count++;
       this.jsonData.padding_left = obj[flag_count];
     }
   });
   }

  toggleLoader(show) {
    this.formLoading = show;
  }

  visitForm(form_id, data) {
    //console.log(this.formSequence);
    let moveForward = false;
    for (let index = data.index - 1; index > 0; index--) {
      let form = this.formSequence[index];
      console.log(form);
      if (!form.show) {
        continue;
      }
      else if (form.is_completed) {
        moveForward = true;
        break;
      }
      else {
        break;
      }
    }

    if (form_id > this.activeForm && !moveForward) {
      this.msgService.showErrorMessage('error', 'Please complete previous forms first', '');
    }
    else {
      let formUrl = this.formSequence[form_id].slug;
      this.router.navigate(['../' + formUrl], { relativeTo: this.route });
    }

  }

  startForm(data) {
    this.entity_id = data.entity_id;
    console.log('Called - ' + data.entity_id);
  }

  initFormSequence() {
    //Fetch Product Info
    this.http.getMethod('product/get/' + this.entity_id, null).subscribe(
      (resp: any) => {
        if (resp.validate) {
          let product = resp.result;
          let keys = Object.keys(this.formSequence)
          keys.forEach((element, index) => {
            let i = index + 1;
            this.formSequence[i].show = (product.product_item_stats[this.formSequence[i].slug] > 0) ? true : false;
          });
          this.formSequence[1].show = true;
          this.formSequence[9].show = true;
        }
        else {
          this.msgService.showErrorMessage('error', resp.errors.message, '');
        }
      },
      (err) => {
        this.msgService.showErrorMessage('error', err['error'].errors.message, '');
      });
  }

  nextForm() {
    console.log('Called');
    // this.initFormSequence();
    this.formSequence[this.activeForm].is_completed = true;
    let index = this.activeForm + 1;
    for (; index <= Object.keys(this.formSequence).length; index++) {
      if (this.formSequence[index].show) {
        break;
      }
      else {
        continue;
      }
    }
    let nextFormUrl = this.formSequence[index].slug;
    this.router.navigate(['/view/products/create/' + this.entity_id + '/' + nextFormUrl]
    );
  }
}
