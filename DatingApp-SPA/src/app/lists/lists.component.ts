import { Component, OnInit } from '@angular/core';
import { PaginatedResult, Pagination } from '../_models/pagination';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { ActivatedRoute } from '@angular/router';
import * as alertify from 'alertifyjs';
import { AlertifyService } from '../_services/alertify.service';
import { User } from '../_models/user';
import { HttpHeaderResponse } from '@angular/common/http';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class ListsComponent implements OnInit {
  users: User[] =[];
  pagination?: Pagination;
  likesParam?: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      const paginatedResult : PaginatedResult<User[]> = data['users'];
      this.users = paginatedResult.result;
      this.pagination = paginatedResult.pagination;
    });
    this.likesParam = 'Likers';
  }

  pageChanged(event: any): void {
    this.pagination!.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers() {
    this.userService
      .getUsers(
        this.pagination?.currentPage,
        this.pagination?.itemsPerPage,
        null,
         this.likesParam
      ).subscribe(
        (res: PaginatedResult<User[]>) => {
          this.users = res.result;
          this.pagination = res.pagination;
        
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  userParams() {
    throw new Error('Method not implemented.');
  }
}
