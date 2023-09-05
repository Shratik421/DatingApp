import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { AuthService } from '../../_services/auth.service';
import { Message } from 'src/app/_models/message';
import { tap } from 'rxjs';


@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css'],
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId!: number;
  messages!: Message[];
  newMessage: any= {};
  //newMessage: Message = {};
  messagetxt:string='';

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private authService: AuthService,
   
  ) {}

  ngOnInit() {
    this.loadMessage();
  }

  loadMessage() {
    const currentId = +this.authService.decodedToken.nameid;
    this.userService.getMessageThread(this.authService.decodedToken.nameid, this.recipientId).pipe(
        tap((messages) => {
          for (let i = 0; i < messages.length; i++) {
            if (
              messages[i].isRead === false &&
              messages[i].recipientId === currentId
            ) {
              this.userService.markAsRead(currentId, messages[i].id);
            }} })
      )
      .subscribe(
        (messages) => {
          this.messages = messages;
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  clearinput(){
    this.messagetxt = '';
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
  //  this.sendMessage = true;
    this.userService
      .sendMessage(this.authService.decodedToken.nameid, this.newMessage)
      .subscribe( (response: any) => { 
        console.log(response);
        const message: Message = response as Message;
        this.messages?.unshift(message); 
        this.newMessage.content = '';  
        //this.sendMessage = false;
        this.alertify.success("Message was Sent!!");
      },
        (error) => {
          this.alertify.error(error);
        }
      );
  }
}
