import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApigetService, taskModel1, model1 } from '../apiget.service';
import { AuthService } from '../auth.service';
import { EventEmiterService } from '../event.emmiter.service';
import { TaskDetailDialog } from './../task-detail/task-detail.component';

export interface Pnia {
  title: string;
  date: Date;
  id: number;
  time: Date;
}


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  selectedOpenTasks: Boolean = true;
  tasksArray: taskModel1[] = [];
  tasksArrayClosed: taskModel1[] = [];
  tasksByIdArray: taskModel1[] = [];
  tasksByIdArrayClosed: taskModel1[] = [];
  tasksToDisplay: taskModel1[] = [];
  tasksToDisplayClosed: taskModel1[] = [];
  tasks: taskModel1[];
  open = true;
  searchText: string = "";
  subscription: any;
  taskobj: any;
  isArrayOpen: boolean = false;


  constructor(private router: Router, private route: ActivatedRoute, public aPIgetService: ApigetService, public _eventEmmitter: EventEmiterService, public authService: AuthService, public taskDetailDialog: MatDialog) { }

  ngOnInit() {
    this._eventEmmitter.dataStr.subscribe(data => {
      this._eventEmmitter.str = data;
      this.getopen();
      this.getClosed();
    });
    if (this._eventEmmitter.str) {
      this.getopen();
      this.getClosed();
    }
    console.log(this.tasksToDisplay);
  }



  getopen() {
    this.subscription = this.aPIgetService.getOpenTasks(this._eventEmmitter.str).subscribe((res: any) => {
      console.log(res);
      this.taskobj = res.collection_cr.cr;
      this.tasksArray = res.collection_cr.cr;
      this.isArrayOpen = Array.isArray(this.tasksArray);
      if (this.isArrayOpen) {
        this.tasksArray.forEach((element: any) => {
          let current_datetime = new Date(element.open_date + 1585699200000);
          let formatted_date = current_datetime.getDate() + "." + (current_datetime.getMonth() + 1) + "." + current_datetime.getFullYear()
          console.log(element);
          this.tasksByIdArray.push(
            {
              "id": element["@COMMON_NAME"],
              "description": element.description,
              "status": element.status["@COMMON_NAME"],
              "category": element.description,
              "open_date": formatted_date,
              "icon": this.iconGenerator()
            } as taskModel1
          );
        })
        this.tasksToDisplay = this.tasksByIdArray;
      }
      else {
        let current_datetime = new Date(this.taskobj.open_date);
        let formatted_date = current_datetime.getDate() + "." + (current_datetime.getMonth() + 1) + "." + current_datetime.getFullYear()
        this.tasksToDisplay.push(
          {
            "id": this.taskobj["@COMMON_NAME"],
            "description": this.taskobj.description,
            "status": this.taskobj.status["@COMMON_NAME"],
            "category": this.taskobj.description,
            "open_date": formatted_date,
            "icon": this.iconGenerator()
          } as taskModel1
        );
      }
    });
  }

  async getOpenInReturn(event) {
    if (event) {
      this.tasksByIdArray = [];
      await this.aPIgetService.getOpenTasks(event).subscribe((res: any) => {
        this.tasksArray = res.collection_cr.cr;
        this.tasksArray.forEach((element: any) => {
          let current_datetime = new Date(element.open_date + 1585699200000);
          let formatted_date = current_datetime.getDate() + "." + (current_datetime.getMonth() + 1) + "." + current_datetime.getFullYear()
          this.tasksByIdArray.push(
            {
              "id": element["@COMMON_NAME"],
              "description": element.description,
              "status": element.status["@COMMON_NAME"],
              "category": element.summary,
              "open_date": formatted_date,
              "icon": this.iconGenerator()
            } as taskModel1
          );
        });
        this.tasksToDisplay = this.tasksByIdArray;
      });
    }
  }

  async getClosed() {
    await this.aPIgetService.getClosedTasks(this._eventEmmitter.str).subscribe((res: any) => {
      this.tasksArrayClosed = res.collection_cr.cr;
      this.tasksArrayClosed.forEach((element: any) => {
        let current_datetime = new Date(element.open_date + 1585699200000);
        let formatted_date = current_datetime.getDate() + "." + (current_datetime.getMonth() + 1) + "." + current_datetime.getFullYear()
        this.tasksByIdArrayClosed.push(
          {
            "id": element["@COMMON_NAME"],
            "description": element.description,
            "status": element.status["@COMMON_NAME"],
            "category": element.summary,
            "open_date": formatted_date,
            "icon": this.iconById()
          } as taskModel1
        );
      })
    });
  }

  async getClosedinReturn(event) {
    if (event) {
      this.tasksByIdArrayClosed = [];
      await this.aPIgetService.getClosedTasks(event).subscribe((res: any) => {
        this.tasksArrayClosed = res.collection_cr.cr;
        this.tasksArrayClosed.forEach((element: any) => {
          let current_datetime = new Date(element.open_date + 1585699200000);
          let formatted_date = current_datetime.getDate() + "." + (current_datetime.getMonth() + 1) + "." + current_datetime.getFullYear()
          this.tasksByIdArrayClosed.push(
            {
              "id": element["@COMMON_NAME"],
              "description": element.description,
              "status": element.status["@COMMON_NAME"],
              "category": element.summary,
              "open_date": formatted_date,
              "icon": this.iconById(element.status["@id"])
            } as taskModel1
          );
        })
      });
    }
  }

  iconById(statusId) {
    return `../../assets/status${statusId}.png`;
  }

  onOpenDialog() {
    this.router.navigateByUrl('newtask', { relativeTo: this.route });
  }

  clickedOpenTasks() {
    if (!this.open) {
      this.open = true;
      this.tasksToDisplay = this.tasksByIdArray;
      this.searchTextChanged(this.searchText);
      if (!this.selectedOpenTasks) this.selectedOpenTasks = true;
    }
  }

  clickedClosedTasks() {
    if (this.open) {
      this.open = false;
      this.tasksToDisplay = this.tasksByIdArrayClosed;
      this.searchTextChanged(this.searchText);
      if (this.selectedOpenTasks) this.selectedOpenTasks = false;
    }
  }

  openTaskDetailDialog(task: taskModel1, status: boolean) {
    let dataObj = {
      "task": task,
      "status": status
    };
    this.taskDetailDialog.open(TaskDetailDialog, { width: "720px", height: "400px", data: dataObj });
  }

  searchTextChanged(text: string) {
    this.searchText = this.stripWhiteSpaces(text);
    this.tasksToDisplay = [];
    this.open ? this.addTasksToDisplay(this.tasksByIdArray) : this.addTasksToDisplay(this.tasksByIdArrayClosed);

  }

  addTasksToDisplay(tasksArray: taskModel1[]) {
    tasksArray.forEach((task: taskModel1) => {
      if (this.getTaskTitle(task).includes(this.searchText) || (task.id).startsWith(this.searchText)) {
        this.tasksToDisplay.push(task);
      }
    })
  }

  stripWhiteSpaces(str) {
    return str.replace(/^\s+|\s+$/g, '');
  }

  getTaskTitle(task: taskModel1) {
    let taskDescription = task.description
    if ((task.description).split("\n")[1]) {
      taskDescription = (task.description).split("\n")[1];
    }
    return taskDescription.length <= 30 ? taskDescription : '...' + taskDescription.substring(0, 30);
  }

  ngOnDestroy() {
  }
}
