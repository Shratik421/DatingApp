import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import * as alertify from 'alertifyjs';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from '../../_models/pagination';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  users: User[] = [] ;

  user: User = JSON.parse(localStorage.getItem('user') || '{}') ;

  genderList = [
    { value: 'male', display: 'Males' },
    { value: 'female', display: 'Females' },
  ];

  userParams: any = {};
  pagination?: Pagination ;

  constructor(
    private UserService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private cd : ChangeDetectorRef,
      ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      const PaginatedResult : PaginatedResult<User[]> = data['users'];
      this.users=PaginatedResult.result;
      this.pagination = PaginatedResult.pagination;
    });

    
    this.userParams.gender = this.user.gender == 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
  }

  pageChanged(event: any) {
    this.pagination!.currentPage =  event.page;
    this.loadUsers();
  }

  resetFilters() {
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.loadUsers();
  }

  

  loadUsers() {
    this.UserService.getUsers(
       this.pagination!.currentPage,
       this.pagination!.itemsPerPage,
      this.userParams    
    ).subscribe(
      (res: PaginatedResult<User[]>) => {
         this.users = res.result;
         this.pagination = res.pagination;
      
        this.cd.detectChanges();
      },
      (error) => {
        this.alertify.error(error);
      }
    );
  }
}
