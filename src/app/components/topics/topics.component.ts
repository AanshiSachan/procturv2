import { Component, OnInit } from '@angular/core';
import { TopicServiceService } from '../../services/topic-service.service';
import { MessageShowService } from '../../services/message-show.service';

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
  pagedTopicsArr: any[] = [];
  selectedRows: any[] = [];
  searchData: any = [];
  createNewTopic: boolean = false;
  searchflag: boolean = false;
  pageIndex: number = 1;
  displayBatchSize: number = 10;
  totalRow: number = 0;
  searchText: string = "";

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

  constructor(
    private topicService: TopicServiceService,
    private msgToast: MessageShowService
  ) { }

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
        this.msgToast.showErrorMessage('error', '', 'An Error Occured');
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
        this.msgToast.showErrorMessage('error', '', 'An Error Occured');
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
        this.msgToast.showErrorMessage('success', 'Saved', 'Topic Created Successfully');
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
    this.pageIndex = 1;
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
      this.msgToast.showErrorMessage('error', '', 'Select A Standard');
      return;
    }
    else if (this.TopicPayload.subject_id == "-1") {
      this.msgToast.showErrorMessage('error', '', 'Select a Subject');
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
      this.msgToast.showErrorMessage('error', '', 'Fill a Topic Name');
      return;
    }
    else {
      this.addTopic();
    }
  }
  deleteTopicNode() {
    //console.log("Row Delete");
  }

  editTopicNode() {
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


}