
import { Component, OnInit } from '@angular/core';
import { ApigetService, updatesModel } from '../apiget.service';


export interface Update {
  date: string,
  text: string
}
@Component({
  selector: 'app-updating',
  templateUrl: './updating.component.html',
  styleUrls: ['./updating.component.css']
})
export class UpdatingComponent implements OnInit {

  updatesArrayFiltered: updatesModel[] = [];
  updatesArrayRes: updatesModel[] = [];
  updatesObjectRes: any;
  array: boolean = true;
  updatesObject: any;

  constructor(public apiget: ApigetService) { }

  ngOnInit() {
    this.apiget.getUpdates().subscribe((res: any) => {
      this.updatesArrayRes = res.collection_cr.cr;
      this.updatesObjectRes = res.collection_cr.cr;
      this.array = Array.isArray(this.updatesArrayRes);
      if(this.array) {
        this.updatesArrayRes.forEach((element: any) => {
          let current_datetime = new Date (element.open_date);
          // var dateString = new Date(OriginalDate.getTime() - (OriginalDate.getTimezoneOffset() * 60000 ))
          // .toISOString()
          // .split("T")[0];
          // console.log(dateString);
          // let current_datetime = new Date()
          let formatted_date = current_datetime.getDate() + "." + (current_datetime.getMonth() + 1) + "." + current_datetime.getFullYear() + "\xa0\xa0·\xa0\xa0" + current_datetime.getHours() + ":" + current_datetime.getMinutes() 
          console.log(formatted_date)
          this.updatesArrayFiltered.push(
            {
              "name": element.category["@COMMON_NAME"],
              "description": element.description,
              "open_date": formatted_date
            } as updatesModel
          )
        });
      }
      else {
        this.updatesObject = {
          "name": this.updatesObjectRes.category["@COMMON_NAME"],
          "description": this.updatesObjectRes.description,
          "open_date": this.updatesObjectRes.open_date
        }
      }
    });
  }

}
