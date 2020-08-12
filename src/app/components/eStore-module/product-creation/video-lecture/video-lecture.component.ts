import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService } from '../../../../services/http.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { ProductService } from '../../../../services/products.service';

@Component({
  selector: 'app-video-lecture',
  templateUrl: './video-lecture.component.html',
  styleUrls: ['./video-lecture.component.scss']
})
export class VideoLectureComponent implements OnInit {

  @Input()
  entity_id: any;
  @Input()
  prodForm: any;
  isRippleLoad: boolean = false;
  @Output() nextForm = new EventEmitter<string>();
  @Output() startForm = new EventEmitter<string>();
  @Output() toggleLoader = new EventEmitter<boolean>();
  @Output() previewEvent = new EventEmitter<boolean>();
  institute_id: any = sessionStorage.getItem('institute_id');
  description:string='';
  // subjectList: any[] = [{ name: 'History' }, { name: 'Geography' }, { name: 'Physics' }];
  studyMaterial: any[] = [];
  outputMessage: any = '';
  materialData: any[] = [];
  testlist: any[] = [];
  isPaid: string;
  isAdvanceProductEdit:boolean=false;
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

  gotoBack() {
    this.router.navigateByUrl('/view/e-store/details');
  }

  gotoNext() {
    if(this.description == undefined ||this.description==''){
      this.msgService.showErrorMessage('error', 'Pleaas add description', '');
      return
    }

    if (this.description.length > 5000 ) {
      this.msgService.showErrorMessage('error', 'allowed description limit is 5000 characters', '');
      return;
    }
    if ((!this.isRippleLoad)) {
      //update test List
      let obj={
        "page_type": "Videos",
        "status": this.prodForm.status,
        "is_advance_product": this.prodForm.is_advance_product,
        "item_list":this.testlist,
        "description":this.description
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
          this.msgService.showErrorMessage('error','There is some problem in processing your request.Please try after some time.Or contact us at support@proctur.com for further assistance. ', '');
        });
    }
  }

  subjectListToggle(subject) {
    subject.isExpand = !subject.isExpand;
    subject.parent_topic_id= subject.topic_id;
    this.getStudyMaterial(subject);
  }

  getStudyMaterial(object) {
    console.log(object);
    let obj = {
      institute_id : this.institute_id,
      ecourse_id: object.ecourse_id,
      product_id: this.entity_id,
      study_material_category: 'video_study_material'
    }
    this.auth.showLoader();
    this._http.postData('/api/v1/instFileSystem/get-study-material', obj).subscribe((res: any) => {
      console.log(object);
      object.subjectsList = res.result;
      if(object.subjectsList) {
        // object.isExpand = false;
        // object.subject_id = object.subjectId;
        // object.course_type_id = object.ecourse_id;
        object.parent_topic_id = '-1';
        object.subjectsList.forEach((element) => {
          if (element && element.subjectId) {
            element.course_type_id = object.ecourse_id;
            element.parent_topic_id = object.parent_topic_id;
            this.addMaterialExtension(element);
            if(element.subtopicList && element.subtopicList.length){
            element.subtopicList.forEach(sub => {
              sub.course_type_id = object.ecourse_id;
              sub.subjectId = element.subjectId;
              sub.parent_topic_id = element.parent_topic_id;
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

  toggleObject(topic) {
    topic.isExpand = !topic.isExpand;
  }

  getTopicData(obj) {
    obj.isExpand = !obj.isExpand;
    if(obj.subtopicList && obj.subtopicList.length){
    obj.subtopicList.forEach(element => {
      element.course_type_id = obj.course_type_id;
      element.parent_topic_id = element.topicId;
      element.subjectId = obj.subjectId;
      this.addMaterialExtension(element);
    });
    }
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
      case "VDOCipher": {
        slug = 'Videos';
        break;
      }
      case "YoutubeURL": {
        slug = 'Videos';
        break;
      }
      case "Images": {
        slug = 'Images';
        break;
      }
      case "PreviousYearQuestionsPaper": {
        slug = 'Previous_Year_Questions_Paper';
        break;
      }
      case "AudioNotes": {
        slug = 'Audio_Notes';
        break;
      }
      case "Slides": {
        slug = 'Slides';
        break;
      }
    }
    return slug;
  }

  isItemSelected(item, key) {
    if(this.prodForm){
      this.prodForm.product_item_list && this.prodForm.product_item_list.forEach((object) => {
        if (object.source_item_id == item.file_id && item.slug == object.slug) {
          // item.isSelected = true;
          // this.testlist.push(object);
        }
      });
    }
  }


  addMaterialExtension(object) {
    let keys = ["YoutubeURL", "VDOCipher"];
    keys.forEach(key => {
      if (object.studyMaterialMap[key]) {
        let slug = this.getSlugname(key);
        object.studyMaterialMap[key].forEach(element => {
          // element.isSelected = false;
          element.slug = slug;
          element.subjectId =object.subjectId;
          element.course_type_id = object.course_type_id;
          element.parent_topic_id = object.parent_topic_id;
          element.is_existed_selected= (element.selected && this.isAdvanceProductEdit)? true : false;
          let str = element.file_name;
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
    //Fetch Product List
    if (this.entity_id && this.entity_id.length > 0) {
        this.http.getMethod('ext/get-subjects-of-ecourses/' + this.entity_id+'/Videos', null).subscribe(
          (resp: any) => {
            this.auth.hideLoader();
            if (resp) {
              let response = JSON.parse(resp.result);
              console.log(response);
              this.materialData = response;
              console.log(this.materialData);
              this.materialData && this.materialData.forEach(element => {
                element.isExpand = false;
                element.subjectsList = [];
              });
            }
          },
          (err) => {
            this.auth.hideLoader();
            this.msgService.showErrorMessage('error','There is some problem in processing your request.Please try after some time.Or contact us at support@proctur.com for further assistance. ', '');
          });
    }
  }

  selectAllDetails($event, object) {
    console.log('object',object);
    if (object.selected) {
      let obj = {
        "source_item_id": object.file_id,
        "source_subject_id": object.subjectId,
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
    this.auth.showLoader();
    if (this.entity_id && this.entity_id.length > 0) {
      //Fetch Product Info
      this.http.getMethod('product/get/' + this.entity_id, null).subscribe(
        (resp: any) => {
          let response = resp.result;
          if (resp.validate) {
            this.prodForm = response;
            this.isPaid = this.prodForm.is_paid;
            this.description = response.page_description['Videos'];
            this.prodForm.product_item_stats = {};
             this.testlist = this.prodForm.product_item_list;
            this.prodForm.product_items_types.forEach(element => {
              this.prodForm.product_item_stats[element.slug] = true;
            });
            this.isAdvanceProductEdit = (this.prodForm.is_advance_product && this.prodForm.status == 30) ? true : false;
            this.updateProductItemStates(null, null);
            this.initForm();
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
    this.previewEvent.emit(this.prodForm);
  }
}
