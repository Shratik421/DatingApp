import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { AuthService } from '../../_services/auth.service';
import { UserService } from '../../_services/user.service';
import * as alertify from 'alertifyjs';
import { AlertifyService } from '../../_services/alertify.service';
import { ErrorInterceptorProvider } from '../../_services/error.interceptor';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent implements OnInit {
  @Input() user!: User ;

  constructor(
    private AuthService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
  ) {}
 
  ngOnInit() {}

  sendLike(id: number) {
    this.userService
      .sendLike(this.AuthService.decodedToken.nameid, id)
      .subscribe(
        data => {
          this.alertify.success('you have liked:  ' + this.user.knownAs);
        },  error => {
         
          this.alertify.error("You are Already Liked This User");
          }  );}
}
