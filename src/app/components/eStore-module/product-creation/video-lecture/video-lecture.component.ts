import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { MessageShowService } from '../../../../services/message-show.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../../services/http.service';
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
  constructor(
    private router: Router,
    private msgService: MessageShowService,
    private _http: HttpService,
    private http: ProductService) { }

  ngOnInit() {
    this.initProductForm();
  }

  gotoBack() {
    this.router.navigateByUrl('/products');
  }

  gotoNext() {
    if(this.description == undefined ||this.description==''){
      this.msgService.showErrorMessage('error', 'Pleaas add description', '');
      return
    }
    
    if (this.description.length > 1500 ) {
      this.msgService.showErrorMessage('error', 'allowed description limit is 1500 characters', '');
      return;
    }
    if ((!this.isRippleLoad)) {
      //update test List
      let obj={
        "page_type": "Videos",
        "item_list":this.testlist,
        "description":this.description
      }
      this.isRippleLoad = true;
      this.http.postMethod('product-item/update/' + this.entity_id, obj).then(
        (resp: any) => {
          this.isRippleLoad = false;
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
          this.isRippleLoad = false;
          this.msgService.showErrorMessage('error','There is some problem in processing your request.Please try after some time.Or contact us at support@proctur.com for further assistance. ', '');
        });
    }
  }

  subjectListToggle(subject) {
    subject.isExpand = !subject.isExpand;
    subject.parent_topic_id= subject.topic_id;
    if (subject.isExpand && subject.subTopics&&subject.subTopics.length == 0) {
      this.getSubjectTopics(subject);
    }
    else {
      // topic.subTopics.forEach(subtopic => {
      //   subtopic.isExpand = false;
      // });
    }
  }

  toggleObject(topic) {
    topic.isExpand = !topic.isExpand;
    if (topic.isExpand && topic.subTopics.length == 0) {
      this.getSubjectTopics(topic);
    }
    else {
      // topic.subTopics.forEach(subtopic => {
      //   subtopic.isExpand = false;
      // });
    }
  }


  getSlugname(key) {
    let slug = 'Slides';
    switch (key) {
      case "notesList": {
        slug = 'Notes';
        break;
      }
      case "assignmentList": {
        slug = 'Assignment';
        break;
      }
      case "studyMaterialList": {
        slug = 'eBook';
        break;
      }
      case "videosList": {
        slug = 'Videos';
        break;
      }
      case "imageList": {
        slug = 'Images';
        break;
      }
      case "previousYearQuesList": {
        slug = 'Previous_Year_Questions_Paper';
        break;
      }
      case "audioNotesList": {
        slug = 'Audio_Notes';
        break;
      }
      case "slidesList": {
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
    let keys = ["videosList"];
    keys.forEach(key => {
      if (object[key]) {
        let slug = this.getSlugname(key);
        object[key].forEach(element => {
          // element.isSelected = false;
          element.slug = slug;
          element.subject_id =object.subject_id;
          element.course_type_id = object.course_type_id;
          element.parent_topic_id = object.parent_topic_id;
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
            this.isRippleLoad = false;
            if (resp) {
              let response = JSON.parse(resp.result);
              console.log(response);
              this.materialData = response;
              console.log(this.materialData);
              this.materialData && this.materialData.forEach(element => {
                element.isExpand = false;
                if (element.subjectsList) {
                  element.subjectsList.forEach((subject) => {
                    subject.isExpand = false;
                    // subject.isSelected = false;
                    subject.subject_id = subject.subject_id;
                    subject.course_type_id = element.ecourse_id;
                    subject.parent_topic_id = '-1';
                    subject.subTopics = [];
                    this.addMaterialExtension(subject);
                  });
                }
                else {
                  element.subjectsList = [];
                }
              });
            }
          },
          (err) => {
            this.isRippleLoad = false;
            this.msgService.showErrorMessage('error','There is some problem in processing your request.Please try after some time.Or contact us at support@proctur.com for further assistance. ', '');
          });      
    }
  }

  getSubjectTopics(object) {
    let params = {
      "source_subject_id": object.subject_id,
      "product_id": this.entity_id,
      "parent_topic_id": object.parent_topic_id
    }

    if (!this.isRippleLoad) {
      this.isRippleLoad = true;
      this.http.postMethod('ext/get-topic-of-subject/Videos', params, null).then((res: any) => {
        this.isRippleLoad = false;
        if (res && res.body && res.body.result) {
          let responce = JSON.parse(res.body.result);
          console.log(responce);
          object.subTopics = responce;
          object.subTopics.forEach(element => {
            element.isExpand = false;
            // element.isSelected = false
            element.subTopics = [];        
            element.subject_id =object.subject_id;
            element.course_type_id = object.course_type_id;
            element.parent_topic_id = object.parent_topic_id;
            this.addMaterialExtension(element);
          });
        }
      }).catch((err) => {
        this.isRippleLoad = false;
        this.msgService.showErrorMessage('error', err.message, '');
      });
    }
  }

  selectAllDetails($event, object) {
    console.log('object',object);
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
    this.isRippleLoad = true;
    if (this.entity_id && this.entity_id.length > 0) {
      //Fetch Product Info
      this.http.getMethod('product/get/' + this.entity_id, null).subscribe(
        (resp: any) => {
          let response = resp.result;
          if (resp.validate) {
            this.prodForm = response;
            this.description = response.page_description['Videos'];
            this.prodForm.product_item_stats = {};
             this.testlist = this.prodForm.product_item_list;
            this.prodForm.product_items_types.forEach(element => {
              this.prodForm.product_item_stats[element.slug] = true;
            });
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
