import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '../../../../../../node_modules/@angular/router';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService } from '../../../../services/http.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { ProductService } from '../../../../services/products.service';

@Component({
  selector: 'app-study-material',
  templateUrl: './study-material.component.html',
  styleUrls: ['./study-material.component.scss']
})
export class StudyMaterialComponent implements OnInit {

  @Input()
  entity_id: any;
  @Input()
  prodForm: any;
  @Output() nextForm = new EventEmitter<string>();
  @Output() startForm = new EventEmitter<string>();
  @Output() toggleLoader = new EventEmitter<boolean>();
  @Output() previewEvent = new EventEmitter<boolean>();
  isAdvanceProductEdit:boolean = false;
  institute_id: any = sessionStorage.getItem('institute_id');
  description: string = '';
  studyMaterial: any[] = [];
  outputMessage: any = '';
  materialData: any[] = [];
  testlist: any[] = [];
  selectAll: any;
  editorConf = {
    height: 150,
    menubar: false,
    branding: false,
    plugins: [
      'preview anchor',
      'visualblocks code ',
      'insertdatetime  table paste code  wordcount'
    ],
    toolbar: 'undo redo | formatselect | bold italic backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent'
  };

  constructor(
    private router: Router,
    private msgService: MessageShowService,
    private auth:AuthenticatorService,
    private _http: HttpService,
    private http: ProductService) { }

  ngOnInit() {
    this.initProductForm();
  }

  toggleRows(event) {
    console.log(event);
    let operation = event.target.attributes['data'].value;
    let length = event.target.parentNode.parentNode.parentNode.children.length;
    for (let i = 1; i < length; i++) {
      let child_el = event.target.parentNode.parentNode.parentNode.children[i];
      if (operation == 'hide') {
        child_el.classList.remove('fade-in');
        child_el.classList.add('fade-out');

        event.target.classList.remove('btn-close');
        event.target.classList.add('btn-open');
        event.target.attributes['data'].value = 'show';
      }
      else {
        child_el.classList.remove('fade-out');
        child_el.classList.add('fade-in');

        event.target.classList.add('btn-close');
        event.target.classList.remove('btn-open');
        event.target.attributes['data'].value = 'hide';
      }
    }

  }

  gotoBack() {
    this.router.navigateByUrl('/view/e-store/details');
  }

  gotoNext() {
    if (this.description == undefined || this.description == '') {
      this.msgService.showErrorMessage('error', 'Pleaas add description', '');
      return
    }

    if (this.prodForm.about.length > 1500) {
      this.msgService.showErrorMessage('error', 'allowed description limit is 1500 characters', '');
      return;
    }

    if ((!this.auth.isRippleLoad.getValue())) {
      //update test List
      let obj = {
        "page_type": "Study_Material",
        "status": this.prodForm.status,
        "is_advance_product": this.prodForm.is_advance_product,
        "item_list": this.testlist,
        "description": this.description
      }
      this.auth.showLoader();
      this.http.postMethod('product-item/update/' + this.entity_id, obj).then(
        (resp: any) => {
          this.auth.hideLoader();
          let response = resp['body'];
          if (response.validate) {
            let details = response.result;
            this.prodForm.product_item_list = details;
            this.msgService.showErrorMessage('success', "Product updated successfully !", '');
            this.nextForm.emit();
          }
          else {
            this.testlist = [];
            this.msgService.showErrorMessage('error', response.error[0].error_message, '');
          }
        },
        (err) => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage('error', 'There is some problem in processing your request.Please try after some time.Or contact us at support@proctur.com for further assistance. ', '');
        });
    }
  }

  subjectListToggle(subject) {
    subject.isExpand = !subject.isExpand;
    subject.parent_topic_id = subject.topic_id;
    this.getStudyMaterial(subject);
  }

  getTopicData(obj) {
    obj.isExpand = !obj.isExpand;
    if(obj.subtopicList && obj.subtopicList.length){
    obj.subtopicList.forEach(element => {
      this.addMaterialExtension(element);
    });
    }
  }

  toggleObject(topic) {
    topic.isExpand = !topic.isExpand;
  }

  calculateStudyMaterialMapLength(object) {
    return Object.keys(object.studyMaterialMap).length;
  }


  getSlugname(key) {
    let slug = 'Slides';
    switch (key) {
      case "Notes": {
        slug = 'Notes';
        break;
      }
      case "Assignment": {
        slug = 'Assignment';
        break;
      }
      case "EBook": {
        slug = 'eBook';
        break;
      }
      case "videosList": {
        slug = 'Videos';
        break;
      }
      case "Images": {
        slug = 'Images';
        break;
      }
      case "PreviousYearQuestionsPaper": {
        slug = 'Previous Year Questions Paper';
        break;
      }
      case "AudioNotes": {
        slug = 'Audio Notes';
        break;
      }
      case "Slides": {
        slug = 'Slides';
        break;
      }
    }
    return slug;
  }


  addMaterialExtension(object) {
    console.log(object);
    let keys = ["Notes", "Assignment", "EBook", "Images", "PreviousYearQuestionsPaper", "AudioNotes", "Slides"];
    keys.forEach(key => {
      if (object.studyMaterialMap[key]) {
        let slug = this.getSlugname(key);
        object.studyMaterialMap[key].forEach(element => {
          element.slug = slug;
          element.subject_id = object.subjectId;
          element.course_type_id = object.course_type_id;
          element.parent_topic_id = object.parent_topic_id;
          element.is_existed_selected= element.selected && this.isAdvanceProductEdit ? true : false;
          let str = element.file_name;
          element.is_Advance_prod =  this.prodForm.is_advance_product ? true : false;
          // this.isItemSelected(element, key);
          let ext = str && str.substr(str.lastIndexOf(".") + 1, str.length);
          switch (ext) {
            case 'epub': {
              element.extension = "fa fa-file epub-color";
              break;
            }
            case 'pdf': {
              element.extension = "fa fa-file-pdf-o pdf-color";
              break;
            }
            case 'docx':
            case 'doc': {
              element.extension = "fa fa-book assign-color ";
              break;
            }
            case 'xls':
            case 'xlsx': {
              element.extension = "fa fa-file-excel-o assign-color";
              break;
            }
            case 'ppt':
            case 'pptx': {
              element.extension = "fa fa-file-powerpoint-o text-blue";
              break;
            }
            case 'mp3':
            case 'wav':
            case 'aac':
            case 'wma': {
              element.extension = "fa fa-file-audio-o audio-color";
              break;
            }

            case 'jpeg':
            case 'jpg':
            case 'png':
            case 'gif': {
              element.extension = "fa fa-file-image-o img-color";
              break;
            }
            default: {
              element.extension = "fa fa-file-o assign-color";
            }
          }
        });
      }
    });
  }

  initForm() {
    //Fetch Product Groups List
    if (this.entity_id && this.entity_id.length > 0) {
      //Fetch Product Info
      this.http.getMethod('ext/get-subjects-of-ecourses/' + this.entity_id + '/Study_Material', null).subscribe(
        (resp: any) => {
          if (resp) {
            let response = JSON.parse(resp.result);
            this.materialData = response;
            console.log(this.materialData);
            this.materialData.forEach(element => {
              element.isExpand = false;
                element.subjectsList = [];
            });
          }
        },
        (err) => {

          this.msgService.showErrorMessage('error', 'There is some problem in processing your request.Please try after some time.Or contact us at support@proctur.com for further assistance. ', '');
        });
    }


  }

  getStudyMaterial(object) {
    console.log(object);
    let obj = {
      institute_id : this.institute_id,
      ecourse_id: object.ecourse_id,
      product_id: this.entity_id,
      study_material_category: 'other_study_material'
    }
    this.auth.showLoader();
    this._http.postData('/api/v1/instFileSystem/get-study-material', obj).subscribe((res: any) => {
      console.log(res);
      object.subjectsList = res.result;
      if(object.subjectsList) {
        // object.isExpand = false;
        object.subject_id = object.subjectId;
        object.course_type_id = object.ecourse_id;
        object.parent_topic_id = '-1';
        object.subjectsList.forEach((element) => {
          if (element && element.subjectId) {
            element.course_type_id = object.ecourse_id;
            this.addMaterialExtension(element);
            if(element.subtopicList && element.subtopicList.length){
            element.subtopicList.forEach(sub => {
              sub.course_type_id = object.ecourse_id;
              this.addMaterialExtension(sub);
            });
            }
          }

        });
      }
      this.auth.hideLoader();
    }, err => {
      console.log(err);
      this.auth.hideLoader();
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.message);
    });
  }

  selectAllDetails($event, object) {
    console.log($event, object);
    if (object.selected) {
      let obj = {
        "source_item_id": object.file_id,
        "source_subject_id": object.subject_id,
        "course_type_id": object.course_type_id,
        "parent_topic_id": object.parent_topic_id,
        "slug": object.slug
      }
      this.testlist.push(obj);
    } else {
      this.testlist.forEach((item, index) => {
        if (item.source_item_id == object.file_id) {
          this.testlist.splice(index, 1);
          console.log(this.testlist);
        }
      });
    }
    // console.log(this.testlist);
    // console.log($event, object);
  }

  initProductForm() {
    //Fetch Product Groups List

    if (this.entity_id && this.entity_id.length > 0) {
      //Fetch Product Info
      this.auth.showLoader();
      this.http.getMethod('product/get/' + this.entity_id, null).subscribe(
        (resp: any) => {
          this.auth.hideLoader();
          this.initForm();
          let response = resp.result;
          if (resp.validate) {
            this.prodForm = response;
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
            this.prodForm.product_item_stats = {};
            this.isAdvanceProductEdit = (this.prodForm.is_advance_product && this.prodForm.status == 30) ? true : false;
            this.testlist = this.prodForm.product_item_list;
            this.prodForm.logo_url =  productData.logo_url;
              this.prodForm.photo_url = productData.photo_url;
              this.description = response.page_description['Study_Material']
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
          this.auth.hideLoader();
          this.initForm();
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
}
