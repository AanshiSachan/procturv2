import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '../../../../../../node_modules/@angular/router';
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
  isRippleLoad: boolean = false;
  @Output() nextForm = new EventEmitter<string>();
  @Output() startForm = new EventEmitter<string>();
  @Output() toggleLoader = new EventEmitter<boolean>();
  @Output() previewEvent = new EventEmitter<boolean>();
  institute_id: any = sessionStorage.getItem('institute_id');
  subjectList: any[] = [{ name: 'History' }, { name: 'Geography' }, { name: 'Physics' }];
  studyMaterial: any[] = [{ "course_type": "PG-DAC", "is_test_series": "N", "course_type_id": 512, "total_assigned_student_count": 0, "master_course_ids": null, "eCourseMapping": null, "categoryList": [] }, { "course_type": "New Db Migrationgvf", "is_test_series": "N", "course_type_id": 736, "total_assigned_student_count": 0, "master_course_ids": null, "eCourseMapping": null, "categoryList": [] }, { "course_type": "New Db Migration", "is_test_series": "N", "course_type_id": 737, "total_assigned_student_count": 0, "master_course_ids": null, "eCourseMapping": null, "categoryList": [] }, { "course_type": "testiii", "is_test_series": "N", "course_type_id": 706, "total_assigned_student_count": 0, "master_course_ids": null, "eCourseMapping": null, "categoryList": ["Assignment", "Audio Notes", "EBook", "Images", "Notes", "Youtube URL"] }, { "course_type": "Primary", "is_test_series": "N", "course_type_id": 676, "total_assigned_student_count": 0, "master_course_ids": null, "eCourseMapping": null, "categoryList": ["Assignment", "Audio Notes", "EBook", "Images", "Notes", "Youtube URL"] }, { "course_type": "HTML", "is_test_series": "N", "course_type_id": 612, "total_assigned_student_count": 0, "master_course_ids": null, "eCourseMapping": null, "categoryList": ["Assignment", "Audio Notes", "EBook", "Images", "Notes", "Youtube URL"] }, { "course_type": "Gate Review :D", "is_test_series": "N", "course_type_id": 4, "total_assigned_student_count": 0, "master_course_ids": null, "eCourseMapping": null, "categoryList": [] }, { "course_type": "Primary-EE", "is_test_series": "N", "course_type_id": 677, "total_assigned_student_count": 0, "master_course_ids": null, "eCourseMapping": null, "categoryList": ["Assignment", "Audio Notes", "EBook", "Images", "Notes", "Youtube URL"] }, { "course_type": "GATE New", "is_test_series": "N", "course_type_id": 5, "total_assigned_student_count": 0, "master_course_ids": null, "eCourseMapping": null, "categoryList": [] }, { "course_type": "CDAC", "is_test_series": "N", "course_type_id": 678, "total_assigned_student_count": 0, "master_course_ids": null, "eCourseMapping": null, "categoryList": [] }, { "course_type": "aditya", "is_test_series": "N", "course_type_id": 616, "total_assigned_student_count": 0, "master_course_ids": null, "eCourseMapping": null, "categoryList": ["Assignment", "Audio Notes", "EBook", "Images", "Notes", "Youtube URL"] }, { "course_type": "Gogo", "is_test_series": "N", "course_type_id": 501, "total_assigned_student_count": 0, "master_course_ids": null, "eCourseMapping": null, "categoryList": [] }, { "course_type": "New db migrationbf", "is_test_series": "N", "course_type_id": 735, "total_assigned_student_count": 0, "master_course_ids": null, "eCourseMapping": null, "categoryList": [] }];
  outputMessage: any = '';
  materialData: any[] = [
    {
      "ecourse_id": 4,
      "ecourse_name": "course access ",
      "subjects": null,
      "subjectsList": [
        {
          "subject_id": 1251,
          "is_readonly": "N",
          "file_id": null,
          "file_name": null,
          "file_path": null,
          "size": null,
          "desc": null,
          "title": "subjeect 1",
          "uploadedBy": null,
          "video_url": null,
          "youtubeVideoID": null,
          "subject_name": "Bio",
          "videosList": [
            {
              "is_readonly": "N",
              "file_id": "793",
              "file_name": null,
              "file_path": null,
              "size": "0.0",
              "desc": null,
              "title": "aaakrosh_12306",
              "uploadedBy": "admin",
              "video_url": null,
              "youtubeVideoID": null
            }],
          "notesList": [
            {
              "is_readonly": "N",
              "file_id": "792",
              "file_name": "https://s3-ap-southeast-1.amazonaws.com/testeduimspro/100058/aaakrosh_12306_539_661.pdf",
              "file_path": "100058/aaakrosh_12306_539_661.pdf",
              "size": "0.0",
              "desc": null,
              "title": "aaakrosh_12306",
              "uploadedBy": "admin",
              "video_url": null,
              "youtubeVideoID": null
            },
            {
              "is_readonly": "N",
              "file_id": "796",
              "file_name": "https://s3-ap-southeast-1.amazonaws.com/testeduimspro/100058/aaakrosh_12306_539_661.pdf",
              "file_path": "100058/aaakrosh_12306_539_661.pdf",
              "size": "0.0",
              "desc": null,
              "title": "aaakrosh_12306",
              "uploadedBy": "admin",
              "video_url": null,
              "youtubeVideoID": null
            }
          ]
        }
        ,
        {
          "subject_id": 1250,
          "is_readonly": "N",
          "file_id": null,
          "file_name": null,
          "file_path": null,
          "size": null,
          "desc": null,
          "title": "subjeect 2",
          "uploadedBy": null,
          "video_url": null,
          "youtubeVideoID": null,
          "subject_name": "Chem"
        },
        {
          "subject_id": 339,
          "is_readonly": "N",
          "file_id": null,
          "file_name": null,
          "file_path": null,
          "size": null,
          "desc": null,
          "title": "subjeect 3",
          "uploadedBy": null,
          "video_url": null,
          "youtubeVideoID": null,
          "subject_name": "Maths"
        }
      ]
    },
    {
      "ecourse_id": 5,
      "ecourse_name": "aniket course ",
      "subjects": null,
      "subjectsList": [
        {
          "subject_id": 1251,
          "is_readonly": "N",
          "file_id": null,
          "file_name": null,
          "file_path": null,
          "size": null,
          "desc": null,
          "title": "subjeect 21",
          "uploadedBy": null,
          "video_url": null,
          "youtubeVideoID": null,
          "subject_name": "Bio",
          "videosList": [{
            "is_readonly": "N",
            "file_id": "793",
            "file_name": null,
            "file_path": null,
            "size": "0.0",
            "desc": null,
            "title": "aaakrosh_12306",
            "uploadedBy": "admin",
            "video_url": null,
            "youtubeVideoID": null
          }],
          "notesList": [
            {
              "is_readonly": "N",
              "file_id": "792",
              "file_name": "https://s3-ap-southeast-1.amazonaws.com/testeduimspro/100058/aaakrosh_12306_539_661.pdf",
              "file_path": "100058/aaakrosh_12306_539_661.pdf",
              "size": "0.0",
              "desc": null,
              "title": "aaakrosh_12306",
              "uploadedBy": "admin",
              "video_url": null,
              "youtubeVideoID": null
            },
            {
              "is_readonly": "N",
              "file_id": "796",
              "file_name": "https://s3-ap-southeast-1.amazonaws.com/testeduimspro/100058/aaakrosh_12306_539_661.pdf",
              "file_path": "100058/aaakrosh_12306_539_661.pdf",
              "size": "0.0",
              "desc": null,
              "title": "aaakrosh_12306",
              "uploadedBy": "admin",
              "video_url": null,
              "youtubeVideoID": null
            }
          ]
        }
        ,
        {
          "subject_id": 1250,
          "is_readonly": "N",
          "file_id": null,
          "file_name": null,
          "file_path": null,
          "size": null,
          "desc": null,
          "title": "subjeect 22",
          "uploadedBy": null,
          "video_url": null,
          "youtubeVideoID": null,
          "subject_name": "Chem"
        },
        {
          "subject_id": 339,
          "is_readonly": "N",
          "file_id": null,
          "file_name": null,
          "file_path": null,
          "size": null,
          "desc": null,
          "title": "subjeect 23",
          "uploadedBy": null,
          "video_url": null,
          "youtubeVideoID": null,
          "subject_name": "Maths"
        }
      ]
    }
  ]
  
  constructor(
    private router: Router,
    private msgService: MessageShowService,
    private _http: HttpService,
    private http: ProductService) { }

  ngOnInit() {
    this.materialData.forEach(element => {
      element.isExpand = false;
      if (element.subjectsList) {
        element.subjectsList.forEach((subject) => {
          subject.isExpand = false;
          this.addMaterialExtension(subject);
        });
      }
      else{
        element.subjectsList=[];
      }
      // if (element.subTopics == undefined) {
      //   element.subTopics = [];
      // }
    });
    this.initForm();
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
    this.router.navigateByUrl('/products');
  }

  gotoNext() {
    this.nextForm.emit();
  }
   
  subjectListToggle(subject){
    subject.isExpand = !subject.isExpand;
  }

  toggleObject(topic) {
    topic.isExpand = !topic.isExpand;
    if (topic.isExpand && topic.subTopics.length == 0) {
      this.getSubtopicListData(topic);
    }
    else {
      topic.subTopics.forEach(subtopic => {
        subtopic.isExpand = false;
      });
    }
  }

  getSubtopicListData(topic) {
    this.isRippleLoad = true;
    let url = "/api/v1/topic_manager/subject/6685/topicMaterials";
    let parent_topic_id = -1;
    topic.topic_id = -1;
    let data =
    {
      "institute_id": sessionStorage.getItem('institute_id'),
      "parent_topic_id": topic.topic_id,
    }

    this._http.postData(url, data).subscribe((res) => {
      console.log(res);
      topic.subTopics = res;
      topic.subTopics.forEach(element => {
        element.isExpand = false;
        element.subTopics = [];
        this.addMaterialExtension(element);
      });
      this.isRippleLoad = false;
    },
      (err) => {
        this.isRippleLoad = false;
      })
  }

  getSubjectData() {
    this.isRippleLoad = true;
    let url = "/api/v1/topic_manager/" + this.institute_id + "/subjects/2577/materials_metadata";
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.materialData = res;
      if (this.materialData.length == 0) {
        this.outputMessage = 'No Data Found';
      }
      this.materialData.forEach(element => {
        element.isExpand = false;
        if (element.subjectsList) {
          element.subjectsList.forEach((subject) => {
            subject.isExpand = false;
            this.addMaterialExtension(subject);
          })
        }

        if (element.subTopics == undefined) {
          element.subTopics = [];
        }
      });
      console.log(this.materialData);
      this.isRippleLoad = false;
    },
      (err) => {
        this.isRippleLoad = false;
      })
  }

  addMaterialExtension(object) {
    let keys = ["notesList", "assignmentList", "studyMaterialList", "videosList", "imageList", "previousYearQuesList", "audioNotesList", "slidesList"];
    keys.forEach(key => {
      if (object[key]) {
        object[key].forEach(element => {
          let str = element.file_path;
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
      let object = {
        "productId": this.entity_id,
        "proc-authorization": "MTc3MTV8MDphZG1pbmE1OjEwMDA1OA=="
      }
      this.http.getMethod('ext/get-subjects-of-ecourses', object).subscribe(
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
            this.prodForm.product_item_stats = {};
            this.prodForm.product_items_types.forEach(
              element => {
                this.prodForm.product_item_stats[element.slug] = true;
              });
            this.updateProductItemStates(null, null);
          }
          else {
            this.msgService.showErrorMessage('error', response.errors.message, '');
          }
        },
        (err) => {
          this.msgService.showErrorMessage('error', err['error'].message, '');
        });
    }


  }


  initProductForm() {
    //Fetch Product Groups List

    if (this.entity_id && this.entity_id.length > 0) {
      //Fetch Product Info
      this.http.getMethod('product/get/' + this.entity_id, null).subscribe(
        (resp: any) => {
          let response = resp.result;
          if (resp.validate) {
            this.prodForm = response;
              let productData = response;
              // this.prodForm.entity_id = productData.entity_id;
              // this.prodForm.title = productData.title;
              // this.prodForm.about = productData.about;
              // this.prodForm.is_paid = productData.is_paid;
              // this.prodForm.price = productData.price;
              // this.prodForm.start_datetime = productData.valid_from_date;
              // this.prodForm.end_datetime = productData.valid_to_date;
              // this.prodForm.status = productData.status;
              // this.prodForm.purchase_limit = productData.purchase_limit;
              // this.prodForm.product_ecourse_maps = productData.product_ecourse_maps;
              // this.prodForm.product_items_types = productData.product_items_types;
            this.prodForm.product_item_stats = { };
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
}
