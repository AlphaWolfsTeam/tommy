import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { ApigetService } from './apiget.service';
import { EventEmiterService } from './event.emmiter.service';
import { PostReqService } from './open-request/post-req.service';
import { isArray } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tommy';
  userName: string;
  messages: any[] = [];
  openChat: boolean = false;
  phoneNumber: string;
  userT: string;
  @Output() exampleOutput = new EventEmitter<string>();
  userUUID: string;

  constructor(@Inject(DOCUMENT) document, public apigetService: ApigetService, private router: Router, private route: ActivatedRoute, private http: HttpClient, public authService: AuthService, public _eventEmmiter: EventEmiterService, private postReqService: PostReqService) { }

  ngOnInit() {
    this.authService.loginSub().subscribe((res: any) => {
      console.log(res);
      this.userName = res.name.firstName + " " + res.name.lastName;
      this.userT = res.adfsId.split("@")[0];
      this.phoneNumber = res.phoneNumbers;
      this.authService.setUser(this.userT);
      this.authService.setUserShraga(res);
      this._eventEmmiter.sendUser(res);
      this._eventEmmiter.sendTuser(this.userT);
      this._eventEmmiter.sendPhone(this.phoneNumber);
      this.apigetService.getUUID(this.userT).subscribe((res: any) => {
        if (Array.isArray(res.collection_cnt.cnt)) {
          this.userUUID = res.collection_cnt.cnt[1]['@id'];
        }
        else {
          this.userUUID = res.collection_cnt.cnt['@id'];
        }
        this.authService.setUUID(this.userUUID);
        this.postReqService.userT = this.userT;
        this.postReqService.userUUID = this.userUUID;
        console.log(this.userUUID);
        this._eventEmmiter.sendMsg(this.userUUID);
      });
    });
    // console.clear();
  }


  onHome() {
    this.router.navigateByUrl('/', { relativeTo: this.route });
  }

  phoneFilter(phone: string){
   if(Array.isArray(phone)){
     phone = "0" + phone[1];
     return phone;
   }
   else{
    return phone;
   }
  }




}
