import { Component, OnInit, ViewChild, ElementRef, Renderer2, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthenticatorService } from '../../../services/authenticator.service';
import * as Muuri from 'muuri/muuri';
import { ToDoListService } from '../../../services/to-do-list.service';
import * as moment from 'moment';
import { CommonServiceFactory } from '../../../services/common-service';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ToDoListComponent implements OnInit {

  public grid: any;
  taskInput: string = "";
  // toDoListDisplay: boolean = false;
  public order: string[] = [];
  sortDate: any;
  editDate: any =[];
  public isProfessional: boolean = false;
  defaultToDoList: any;
  completedToDoList: any;
  toDoListOpenStatus: boolean = false;
  gridlength: any;
  dataId: any;
  defaultSequence = [];
  toDoListForReset: any;
  addTaskStatus: boolean = false;
  noRecord: boolean = false;
  is_edit : boolean = false;

  // @Output() loaderOn = new EventEmitter<boolean>(false);

  constructor(
    private router: Router,
    private toDoService: ToDoListService,
    private auth: AuthenticatorService,
    private commonService : CommonServiceFactory,
    private appC: AppComponent,
    private elementRef: ElementRef
  ) {
    if (sessionStorage.getItem('userid') == null) {
      this.router.navigate(['/authPage']);
    }
  }

  onClick(event) {
   if (!this.elementRef.nativeElement.contains(event.target)) // or some similar check
    console.log("clicked")
     //alert('clicked')
     //doSomething();
  }

  ngOnInit() {

    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )

    this.getAllTask();

  }

  showAddOption(){
    if (this.taskInput != null && this.taskInput != "") {
      this.addTaskStatus = true;
    }
    else{
      this.addTaskStatus = false;
    }
  }

  openCalendar(id) {
    document.getElementById(id).click();
  }


  changeDate(date,index,task_id){
    let d = moment(date).format("YYYY-MM-DD");

    if(date != null && date != ""){
      let currentDate = new Date();
      if(currentDate <= date){
        this.defaultToDoList.forEach(e => {
            if(e.task_id == task_id){
              let obj = {
                task_name: e.task_name,
                is_completed: "N",
                task_id: task_id,
                task_squence: e.task_squence,
                task_date: d
              }

              this.toDoService.updateToDo(obj).subscribe(
                res => {
                  let obj = {
                    type: 'success',
                    title: 'Updated Successfully',
                    body: ''
                  }
                  this.appC.popToast(obj);
                  this.editDate[index] = "";
                  this.getAllTask();
                },
                err => {
                  console.log(err)
                }
              )
            }
        })
      }
      else{
        let obj = {
          type: 'error',
          title: 'Please choose appropriate date',
          body: ''
        }
        this.appC.popToast(obj);
        this.editDate[index] = "";

      }

    }

  }

  sortByDate() {
    let d = moment(this.sortDate).format("DD-MMM-YYYY");
    if(this.sortDate != "" && this.sortDate != null){
      document.getElementById("sortDateSpan").innerHTML = "&nbsp;&nbsp;"+ d +"&nbsp;&nbsp;&nbsp;";
      document.getElementById("refresh-icon").style.color = "#1283f4";
      document.getElementById("refresh-icon").style.cursor = "pointer";
    }
    else{
      document.getElementById("sortDateSpan").innerHTML = "&nbsp;&nbsp; Sort by date   &nbsp;&nbsp;&nbsp;";
      document.getElementById("refresh-icon").style.color = "gray";
      document.getElementById("refresh-icon").style.cursor = "default";
    }

    let currentDate = new Date();
    if(currentDate <= this.sortDate){
      this.is_edit = false;
      // (document.getElementById("taskInput") as HTMLInputElement).disabled  = false;
    }
    else{
      this.is_edit = true;
      // (document.getElementById("taskInput") as HTMLInputElement).disabled = true;
    }

    this.defaultSequence = [];
    this.defaultToDoList = this.toDoListForReset.filter(el => el.task_date == d && el.is_completed == "N");
    this.completedToDoList = this.toDoListForReset.filter(el => el.task_date == d && el.is_completed == "Y");

    this.defaultToDoList.sort((a, b) => {
      var textA = a.task_squence;
      var textB = b.task_squence;
      return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
    });
    this.defaultToDoList.forEach(e => {
      this.defaultSequence.push(e.task_squence);
    })

    let items = this.grid._items;
    let shownItems = [];
    let hiddenItems = [];

    this.grid._items.forEach(e => {
      this.defaultToDoList.forEach(el => {
        if (e._element.id == el.task_squence) {
          shownItems.push(e._element)
        } else if (e._element.id != el.task_squence && e._element.id != "") {
          hiddenItems.push(e._element)
        } else if (e._element.id == "" || e._element.id == null) {
          shownItems.push(e._element)
        }
      })
    });

    this.grid._items.forEach(e => {
      this.completedToDoList.forEach(el => {
        if (e._element.id == el.task_id) {
          shownItems.push(e._element)
        }
      })
    })

    if(shownItems.length > 0){
      this.noRecord = true;
    }
    else{
      this.noRecord = false;
    }

    this.grid.hide(hiddenItems);
    this.grid.show(shownItems);

    this.grid.refreshItems();
    this.grid.layout(true);


  }

  resetSortByDate() {
    this.sortDate = "";
    this.noRecord = true;
    this.is_edit = false;
    this.getAllTask();
  }

  editToDo(task_id){
    document.getElementById("name_"+task_id).style.display = "none";
    document.getElementById(task_id).style.display = "block";
    document.getElementById(task_id).focus();
    document.getElementById("fa_"+task_id).style.display = "block";
  }

  getAllTask() {
    // this.loaderOn.emit(true);
    this.toDoService.getAllToDoList().subscribe(
      res => {
        // res = this.commonService.changeUiSelectedKeyValue(res,'date',new Date);
        this.defaultToDoList = res;
        if(this.defaultToDoList.length > 0){
          this.noRecord = true;
        }
        else{
          this.noRecord = false;
        }
        this.is_edit = false;
        this.toDoListForReset = res;
        this.defaultSequence = [];
        this.defaultToDoList = this.toDoListForReset.filter(el => el.is_completed == "N");
        this.completedToDoList = this.toDoListForReset.filter(el => el.is_completed == "Y");
        this.defaultToDoList.sort((a, b) => {
          var textA = a.task_squence;
          var textB = b.task_squence;
          return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
        });

        // console.log(this.defaultToDoList);

        this.defaultToDoList.forEach(e => {
          this.defaultSequence.push(e.task_squence);
        })
        // console.log(this.defaultSequence);
        this.gridlength = this.defaultToDoList.length;
        // if(!this.toDoListOpenStatus){
        setTimeout(() => {
          // this.loaderOn.emit(false);
          this.toDoListDrag();

          if(this.sortDate != "" && this.sortDate != null){
            this.sortByDate();
          }
        }, 1000);

        this.toDoListOpenStatus = true;
        // }
      },
      err => {
        // this.loaderOn.emit(false)
        console.log(err)
      }
    )
  }

  // showToDoList() {
  //   if (this.toDoListDisplay) {
  //     this.toDoListDisplay = false;
  //     this.grid.destroy(true);
  //   }
  //   else {
  //     this.toDoListDisplay = true;
  //     this.getAllTask();
  //   }
  //
  // }

  updateToDo(toDo){

    let task_name = (<HTMLInputElement>document.getElementById(toDo.task_id)).value;
    if(task_name != null && task_name != ""){
      let obj = {
        task_name: task_name,
        is_completed: "N",
        task_id: toDo.task_id,
        task_squence: toDo.task_squence,
        task_date: moment(toDo.task_date).format("YYYY-MM-DD")
      }

      this.toDoService.updateToDo(obj).subscribe(
        res => {
          let msg = {
            type: 'success',
            title: 'Updated Successfully',
            body: ''
          }
          this.appC.popToast(msg);
          this.getAllTask();
          // (<HTMLInputElement>document.getElementById("name_"+toDo.task_id)).innerHTML = task_name;
          // document.getElementById("name_"+toDo.task_id).style.display = "block";
          // document.getElementById(toDo.task_id).style.display = "none";
          // document.getElementById("fa_"+toDo.task_id).style.display = "none";

        },
        err => {
          console.log(err)
          let msg = {
            type: 'error',
            title: '',
            body: 'Failed to update'
          }
          this.appC.popToast(msg);
          document.getElementById("name_"+toDo.task_id).style.display = "block";
          document.getElementById(toDo.task_id).style.display = "none";
          document.getElementById("fa_"+toDo.task_id).style.display = "none";
        }
      )

    }

  }

  addTask() {

    if (this.taskInput != null && this.taskInput != "") {
      // this.loaderOn.emit(true);
      let date;
      if(this.sortDate != "" && this.sortDate != null){
        date = moment(this.sortDate).format("YYYY-MM-DD");
      }
      else{
        date = new Date();
        date = moment(date).format("YYYY-MM-DD")
      }

      let maxValue;
      if(this.defaultToDoList.length > 0){
        maxValue = Math.max.apply(Math, this.defaultToDoList.map(function (o) { return o.task_squence; }));
      }
      else{
        maxValue = 0;
      }

      let obj = {
        task_name: this.taskInput,
        is_completed: "N",
        task_squence: maxValue + 1,
        task_date: date
      }

      this.toDoService.addToDoList(obj).subscribe(
        res => {
          // console.log(res)
          this.defaultToDoList = [];
          let msg = {
            type: 'success',
            title: 'Added Successfully',
            body: ''
          }
          this.appC.popToast(msg);
          this.getAllTask();
          this.taskInput = "";
        },
        err => {
          console.log(err)
          let msg = {
            type: 'error',
            title: 'Failed to add',
            body: ''
          }
          this.appC.popToast(msg);
        }
      )
    }
    // else{
    //   let msg = {
    //     type: 'error',
    //     title: 'Enter Task Name',
    //     body: ''
    //   }
    //   this.appC.popToast(msg);
    // }

  }

  deleteToDo(task_id) {
    this.toDoService.deleteToDo(task_id).subscribe(
      res => {
        console.log(res)
        let msg = {
          type: 'success',
          title: 'Deleted Successfully',
          body: ''
        }
        this.appC.popToast(msg);
        this.defaultSequence = [];
        this.getAllTask();
      },
      err => {
        console.log(err)
      }
    )
  }

  taskCompleted(task_id) {

    let selectedTaskDate;
    let selectedTaskName;
    this.defaultToDoList.forEach(e => {
      if (e.task_id == task_id) {
        e.is_completed = "Y"
        selectedTaskDate = e.task_date;
        selectedTaskName = e.task_name;
      }
    });

    let tempList = this.defaultToDoList;
    this.defaultToDoList = tempList.filter(el => el.is_completed == "N");
    let newCom = tempList.filter(el => el.is_completed == "Y");

    this.completedToDoList.push(newCom[0])

    let obj = {
      task_name: selectedTaskName,
      is_completed: "Y",
      task_id: task_id,
      task_squence: '',
      task_date: moment(selectedTaskDate).format("YYYY-MM-DD")
    }

    this.toDoService.updateToDo(obj).subscribe(
      res => {
        this.getAllTask();
      },
      err => {
        console.log(err)
      }
    )

  }

  toDoListDrag() {

    this.grid = new Muuri('.toDoList', {
      items: '.item, .completed-item',
      // itemPositioningClass: 'muuri-item-positioning',
      // itemDraggingClass: 'muuri-item-dragging',
      // itemReleasingClass: 'muuri-item-releasing',
      // dragEnabled: false,
      // dragAxis: 'y',
      // showDuration: 200,
      // dragSortInterval: 0,
      // dragReleaseDuration: 200,
      // dragReleaseEasing: 'ease',
      dragSort: [this.grid],
      // dragStartPredicate: {
      //   distance: 0,
      //   delay: 0,
      //   handle: '.toDoList-selection'
      // },
      // dragSortPredicate: {
      //   threshold: 90,
      //   action: 'swap'
      // },
      layout: {
        fillGaps: true,
        horizontal: false,
        alignRight: false,
        alignBottom: false,
        rounding: true
      },
      // layoutOnResize: 100,
      // layoutOnInit: true,
      // layoutDuration: 300,
      // layoutEasing: 'ease',
      sortData: {
        id: (item, element) => {
          return this.order.indexOf(element.getAttribute('id'));
        }
      }
    })

    this.getOrder();


  }

  getOrder() {
    this.order = this.grid.getItems().map(item => item.getElement().getAttribute('id'));

    // let sequenceFlag = false;
    // let changedIds = [];
    // this.order.forEach((elem1, index) => {
    //   if (elem1 == this.defaultSequence[index]) {
    //   }
    //   else {
    //     sequenceFlag = true;
    //     changedIds.push(elem1)
    //   }
    // });
    //
    // if (sequenceFlag && changedIds.length > 0) {
    //   let taskIds = [];
    //   let sequenceIds = [];
    //   this.defaultToDoList.forEach((elem1, index) => {
    //     changedIds.forEach((e,i) => {
    //       if (elem1.task_squence == changedIds[i]) {
    //         taskIds.push(elem1.task_id);
    //         sequenceIds.push(changedIds[index])
    //       }
    //     })
    //
    //   });
    //
    //   sequenceIds = sequenceIds.map(Number);
    //   // console.log(taskIds);
    //   // console.log(sequenceIds);
    //
    //   let obj = {
    //     taskIdArray: taskIds,
    //     sequenceArray: sequenceIds
    //   }
    //
    //   this.toDoService.updateSequence(obj).subscribe(
    //     res => {
    //       this.defaultSequence = this.order;
    //     },
    //     err => {
    //       console.log(err)
    //     }
    //   )
    // }
  }

  // clickedOut(event){
  //   if(event.target.className === "black-bg") {
  //     // this.showToDoList();
  //   }
  // }

}
