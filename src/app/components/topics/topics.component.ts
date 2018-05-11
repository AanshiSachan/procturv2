import { Component, OnInit } from '@angular/core';
import { TopicServiceService } from '../../services/topic-service.service';
import { AppComponent } from '../../app.component';
import { TreeNode } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';     //accordion and accordion tab
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {
  StandardCourses: any = [];
  SubjectCourses: any = [];
  TableData:any[] = [];
  createNewTopic:boolean=false;
  TopicPayload = {
    standard_id: -1,
    subject_id: -1
  }
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
    console.log("hello");
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
  getListData() {
    this.topicService.getList().subscribe(
      data => {
        console.log(data);
        this.TableData = data;
      },
      error => {
         console.log(error);
      })
  }

  toggleCreateNewTopic() {
    
    if (this.createNewTopic == false) {
      this.createNewTopic = true;
      document.getElementById('showCloseBtn').style.display = '';
      document.getElementById('showAddBtn').style.display = 'none';
    } else {
      this.createNewTopic = false;
      document.getElementById('showCloseBtn').style.display = 'none';
      document.getElementById('showAddBtn').style.display = '';
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


