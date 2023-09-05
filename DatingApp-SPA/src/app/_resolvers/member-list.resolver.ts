import { Injectable, resolveForwardRef } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PaginatedResult } from '../_models/pagination';

@Injectable()
export class MemberListResolver implements Resolve<PaginatedResult<User[]>> {
  pageNumber = 1;
  pageSize = 5;
  
  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<PaginatedResult<User[]>> {
   
    return this.userService.getUsers(this.pageNumber , this.pageSize ).pipe(
      catchError(error => {
       
        this.alertify.error('Problem retreving data member list reslver');
        this.router.navigate(['/home']);
        return EMPTY;
      })
    
      );

  }
}
