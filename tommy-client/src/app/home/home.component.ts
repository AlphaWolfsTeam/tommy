import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {HiChatService} from '../hichat.service'
import { NoUserDialog } from "../nouser-dialog/nouser-dialog.component";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  static chatDisplayFlag: Boolean;

  constructor(private router: Router, private route: ActivatedRoute, public authService: AuthService , public hiChatService: HiChatService, public taskDetailDialog: MatDialog,
    ) { }

  ngOnInit(): void {
    setTimeout(() => {
      if(!this.isUserHasLehavaAccount()) this.openTaskDetailDialog();
    }, 3500);
  }

  public chatTag() {
      document.getElementById("cloack").className = HomeComponent.chatDisplayFlag ? "hidden" : "visible";
      HomeComponent.chatDisplayFlag = !HomeComponent.chatDisplayFlag;
  }

  public getHiChat (){
    return this.hiChatService.openHiChat;
  }

  isUserHasLehavaAccount(): Boolean {
    console.log('this.authService.getUuid', !!this.authService.getUuid())
    return !!this.authService.getUuid();
  }

  openTaskDetailDialog() {
    this.taskDetailDialog.open(NoUserDialog, {
      width: "600px",
      height: "200px",
      disableClose: true
    });
  }

}
