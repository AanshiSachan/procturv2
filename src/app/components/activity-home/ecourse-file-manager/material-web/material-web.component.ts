import { Component, OnInit, ViewChild, OnChanges, Input, TemplateRef } from '@angular/core';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { UploadFileComponent } from '../core/upload-file/upload-file.component';
import { HttpService } from '../../../../services/http.service';
import { ActivatedRoute } from '@angular/router';
import { MessageShowService } from '../../../../services/message-show.service';
import { FileService } from '../file.service';

@Component({
    selector: 'app-material-web',
    templateUrl: './material-web.component.html',
    styleUrls: ['./material-web.component.scss']
})
export class MaterialWebComponent implements OnInit {

    @ViewChild(UploadFileComponent) uploadFile: UploadFileComponent;
    isRippleLoad: boolean = false;
    institute_id: any;
    course_types: any;
    subject_id: any;
    tempfile: any;
    showModal: boolean = false;
    materialData: any = [];
    outputMessage: any = '';

    constructor(
        private _http: HttpService,
        private auth: AuthenticatorService,
        private route: ActivatedRoute,
        private msgService: MessageShowService,
        private _fservice: FileService
    ) {
        this.auth.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });
        this.route.params.subscribe(
            params => {
                console.log(params);
                this.course_types = params.ecourse_id;
                this.subject_id = params.subject_id;
            }
        );

        this.route
            .queryParams
            .subscribe(params => {
                // console.log(window.atob(params['data']));
                let name = window.atob(params['data']);
                if (sessionStorage.getItem('routeListForEcourse')) {
                    this._http.routeList = JSON.parse(sessionStorage.getItem('routeListForEcourse'));
                    this._http.routeList.splice(2, this._http.routeList.length);
                    let obj = { routeLink: '/view/activity/ecourse-file-manager/ecourses/' + this.course_types + '/subjects' + this.subject_id + "/materials", data: { data: params['data'] }, name: name };
                    this._http.routeList.push(obj);
                    sessionStorage.setItem('routeListForEcourse', JSON.stringify(this._http.routeList));
                }
            });
    }

    ngOnInit() {
        this.getTopicListData();
        this._http.updatedDataSelection('material-web');
        this._http.data.subscribe(data => {
            if (data == 'material') {
                this.getTopicListData();
                this._http.updatedDataSelection(null);
            }
        });
    }

    getMaterialData() {
        this.isRippleLoad = true;
        let url = "/api/v1/instFileSystem/subjects/materialData";
        let data =
        {
            "institute_id": this.institute_id,
            "subject_id": this.subject_id,
            "course_types": this.course_types
        }

        this._http.postData(url, data).subscribe((res) => {
            this.isRippleLoad = false;
            this.materialData = res;
            if (this.materialData.length == 0) {
                this.outputMessage = 'No Data Found';
            } else {
                this.materialData.forEach(element => {
                    element.isExpand = false;
                    this.addMaterialExtension(element);
                });
                console.log(this.materialData);
            }
        },
            (err) => {
                this.isRippleLoad = false;
            })
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

    getTopicListData() {
        this.isRippleLoad = true;
        let url = "/api/v1/topic_manager/subject/" + this.subject_id + "/topicMaterials";
        let parent_topic_id = -1;
        let data =
        {
            "institute_id": this.institute_id,
            "parent_topic_id": -1,
        }

        this._http.postData(url, data).subscribe((res) => {
            console.log(res);
            this.isRippleLoad = false;
            this.materialData = res;
            if (this.materialData.length == 0) {
                this.outputMessage = 'No Data Found';
            } else {
                this.materialData.forEach(element => {
                    element.isExpand = false;
                    element.subTopics = [];
                    this.addMaterialExtension(element);
                });
                console.log(this.materialData);
            }
        },
            (err) => {
                this.isRippleLoad = false;
            })
    }

    addMaterialExtension(object) {
        let keys = ["notesList", "assignmentList", "studyMaterialList", "imageList", "previousYearQuesList", "slidesList"];
        keys.forEach(key => {
            if (object[key]) {
                object[key].forEach(element => {
                    let str = element.file_path;
                    let ext = str.substr(str.lastIndexOf(".") + 1, str.length);
                    switch (ext) {
                        case 'epub':
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

    getSubtopicListData(topic) {
        this.isRippleLoad = true;
        let url = "/api/v1/topic_manager/subject/" + this.subject_id + "/topicMaterials";
        let parent_topic_id = -1;
        let data =
        {
            "institute_id": this.institute_id,
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

    uploadPopupOpen(topic) {
        console.log(topic);
        this.uploadFile.showModal = (this.uploadFile.showModal) ? false : true;
        this.uploadFile.varJson.course_types = this.course_types;
        this.uploadFile.material_dataFlag = 'material';
        this.uploadFile.getSubjectsList(this.course_types);
        this.uploadFile.varJson.subject_id = this.subject_id;
        this.uploadFile.getTopicsList(this.subject_id);
        this.uploadFile.material_dataShow = true;
    }

    getSubjectData() {
        this.isRippleLoad = true;
        let url = "/api/v1/topic_manager/" + this.institute_id + "/subjects/" + this.subject_id + "/materials_metadata";
        this._http.getData(url).subscribe((res) => {
            console.log(res);
            this.materialData = res;
            if (this.materialData.length == 0) {
                this.outputMessage = 'No Data Found';
            }
            this.materialData.forEach(element => {
                element.isExpand = false;
                this.addMaterialExtension(element);
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

    setRemoveDataFile(file) {
        this.tempfile = file;
        this.showModal = true;
    }

    /// removed data
    removeData() {
        this.showModal = false;
        this.isRippleLoad = true;
        let url = "/api/v1/instFileSystem/deleteFiles";
        let data =
        {
            "institute_id": this.institute_id,
            "fileIdArray": []
        }

        data.fileIdArray.push(this.tempfile.file_id);
        this._http.deleteData(url, data).subscribe((res) => {
            console.log(res);
            this.isRippleLoad = false;
            this.msgService.showErrorMessage('success', '', "File Deleted Successfully");
            this.getTopicListData();
            this.getDataUsedInCourseList();
        },
            (err) => {
                this.isRippleLoad = false;
                this.msgService.showErrorMessage('error', '', "something  went wrong while deleting file");
            })
    }

    // user data usage get
    getDataUsedInCourseList() {
        let url = "/api/v1/instFileSystem/getUsedSpace/" + this.institute_id;
        this._http.getData(url).subscribe((res: any) => {
            console.log(res);
            this._fservice.storageData.storage_allocated = (Number(res.storage_allocated) * 0.001048576);
            this._fservice.storageData.uploaded_size = (Number(res.uploaded_size) * 0.001048576);
            let width = 1;
            if (this._fservice.storageData.uploaded_size != 0 &&
                this._fservice.storageData.uploaded_size <= this._fservice.storageData.storage_allocated) { width = (100 * this._fservice.storageData.uploaded_size) / this._fservice.storageData.storage_allocated; }
            this._fservice.storageData.width = Math.round(width);
        });
    }

    downloadFile(file) {
        this.isRippleLoad = true;
        let url = "/api/v1/instFileSystem/downloadFile/" + this.institute_id + "?fileId=" + file.file_id;
        this._http.getData(url).subscribe((res) => {
            console.log(res);
            this.msgService.showErrorMessage('success', '', "File Downloaded Successfully");
            this.isRippleLoad = false;
        },
            (err) => {
                this.msgService.showErrorMessage('error', '', "something  went wrong while Downloading file");
                this.isRippleLoad = false;
            })
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

}