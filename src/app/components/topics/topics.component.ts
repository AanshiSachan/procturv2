import { Component, OnInit } from '@angular/core';
import { TopicServiceService } from '../../services/topic-service.service';
import { AppComponent } from '../../app.component';
import { TreeNode } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion'; 
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {
  StandardCourses: any = [];
  SubjectCourses: any = [];
  TableData: any[] = [];
  topicsArr: any[] = [];
  createNewTopic: boolean = false;
  pageIndex: number = 1;
  displayBatchSize: number = 10;
  totalRow = 0;
  pagedTopicsArr:any[]=[];
  selectedRows:any[]=[];

  TopicPayload = {
    standard_id: "-1",
    subject_id: "-1"
  }

  addingTopicPayload = {
    description: "",
    name: "",
    parent_topic_id: "-1",
    standard_id: "-1",
    subject_id: "-1"
  }
  
  
  searchText: string = "";
  searchflag: boolean = false;
  searchData: any = [];



  constructor(private topicService: TopicServiceService, private appC: AppComponent) {
    this.removeFullscreen();
  }

  ngOnInit() {
    this.getStandardData();
    this.getListData();
  }

  getStandardData() {
    this.topicService.getSatndard().subscribe(
      data => {
        this.StandardCourses = data;
        console.log(data);
      },
      error => {
        let msg = {
          type: "error",
          title: "",
          body: "An Error Occured"
        }
        this.appC.popToast(msg);
      }
    )
  }

  getSubjectData(i) {
    
    this.topicService.getSubject(i).subscribe(
      data => {
        console.log(data);
        this.SubjectCourses = data;
      },
      error => {
        let msg = {
          type: "error",
          title: "",
          body: "An Error Occured"
        }
        this.appC.popToast(msg);
      }
    )
  }

  fetchTopics() {
    this.topicService.getTopics(this.TopicPayload).subscribe(
      data => {
        this.topicsArr = <any[]>data;
      },
      error => {
        console.log(error)
      }
    )
  }

  addTopic() {
    this.topicService.postTopic(this.addingTopicPayload).subscribe(
      data => {
        let obj = {
          type: "success",
          title: "Saved",
          body: "Topic Created Successfully."
        }
        this.appC.popToast(obj);
        this.createNewTopic = false;
        this.TopicPayload = {
          standard_id: "-1",
          subject_id: "-1"
        }
        this.addingTopicPayload = {
          description: "",
          name: "",
          parent_topic_id: "-1",
          standard_id: "-1",
          subject_id: "-1"
        }
      },
      error => {
        console.log(error)
      }
    )
  }
  getListData() {
    this.searchflag = false;
    this.searchText = "";
    this.pageIndex=1;
    this.topicService.getList().subscribe(
      data => {
        console.log(data);
        this.TableData = data;
        this.totalRow = this.TableData.length;
        this.fetchTableDataByPage(this.pageIndex);
      },
      error => {
        console.log(error);
      })
  }
 toggleCreateNewTopic() {
    if (this.TopicPayload.standard_id == "-1") {
      let msg = {
        type: "error", 
        title: "",
        body: "Select A Standard"
      }
      this.appC.popToast(msg);
      return;
    }
    else if (this.TopicPayload.subject_id == "-1") {
      let msg = {
        type: "error",
        title: "",
        body: "Select a Subject"
      }
      this.appC.popToast(msg);
      return;
    }
    else {
        this.createNewTopic = true;
        this.addingTopicPayload.standard_id = this.TopicPayload.standard_id;
        this.addingTopicPayload.subject_id = this.TopicPayload.subject_id;
        this.fetchTopics();
      }
  }

  createTopic() {
    if (this.addingTopicPayload.name == "") {
      let msg = {
        type: "error",
        title: "",
        body: "Fill a Topic Name"
      }
      this.appC.popToast(msg);
      return;
    }
    else {
      this.addTopic();
    }
  }
  deleteTopicNode(){
    //console.log("Row Delete");
  }

  editTopicNode(){
   // console.log("Row Edit");  
  }
  searchDatabase() {

    if (this.searchText != "" && this.searchText != null) {
      this.pageIndex = 1;
      let searchRes: any;
     
        searchRes = this.TableData.filter(item =>
          Object.keys(item).some(
            k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
        );
      this.searchData = searchRes;
      this.totalRow = searchRes.length;
      this.searchflag = true;
      this.fetchTableDataByPage(this.pageIndex);
    }
    else {
      this.searchflag = false;
      this.fetchTableDataByPage(this.pageIndex);
      this.totalRow = this.TableData.length;
      
    }
  }



  fetchTableDataByPage(index) {
    this.pageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.pagedTopicsArr = this.getClassRoomTableFromSource(startindex);
  }

  fetchNext() {
    this.pageIndex++;
    this.fetchTableDataByPage(this.pageIndex);
  }

  fetchPrevious() {
    if (this.pageIndex != 1) {
      this.pageIndex--;
      this.fetchTableDataByPage(this.pageIndex);
    }
  }
  
  getClassRoomTableFromSource(startindex) {
    if (this.searchflag) {
      let t = this.searchData.slice(startindex, startindex + this.displayBatchSize);
      return t;
    } else {
      let t = this.TableData.slice(startindex, startindex + this.displayBatchSize);
      return t;
    }
  }

  removeFullscreen() {
    var header = document.getElementsByTagName('core-header');
    var sidebar = document.getElementsByTagName('core-sidednav');

    [].forEach.call(header, function (el) {
      el.classList.remove('hide');
    });
    [].forEach.call(sidebar, function (el) {
      el.classList.remove('hide');
    });
  }

  removeSelectionFromSideNav() {
    document.getElementById('lione').classList.remove('active');
    document.getElementById('litwo').classList.remove('active');
    document.getElementById('lithree').classList.remove('active');
    document.getElementById('lifour').classList.remove('active');
    document.getElementById('lifive').classList.remove('active');
    document.getElementById('lisix').classList.remove('active');
    document.getElementById('liseven').classList.remove('active');
    document.getElementById('lieight').classList.remove('active');
    document.getElementById('linine').classList.remove('active');
    document.getElementById('lizero').classList.remove('active');
    /* document.getElementById('liten').classList.remove('active');
    document.getElementById('lieleven').classList.remove('active'); */
  }

}