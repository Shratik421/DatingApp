import { Injectable, resolveForwardRef } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { PaginatedResult, Pagination } from '../_models/pagination';

@Injectable()
export class ListsResolver implements Resolve<PaginatedResult<User[]>> {
  pageNumber = 1;
  pageSize = 5;
  likesParam = 'Likers';

  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<PaginatedResult<User[]>> {
    return this.userService
      .getUsers(this.pageNumber, this.pageSize,null,this.likesParam ).pipe(
        catchError((error) => {
      
          this.alertify.error('Problem retreving data list resolver');
          this.router.navigate(['/home']);
          return of();
        })
      );
  }
}
