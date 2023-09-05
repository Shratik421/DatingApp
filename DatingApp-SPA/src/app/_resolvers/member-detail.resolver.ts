import { Injectable, resolveForwardRef } from '@angular/core';
import { MemberDetailComponent } from '../members/member-detail/member-detail.component';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import * as alertify from 'alertifyjs';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberDetailResolver implements Resolve<User> {
  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) {} 

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    return this.userService.getUser(route.params['id']).pipe(
      catchError(error => {
       
        this.alertify.error('Problem retreving data ');
        this.router.navigate(['/members']);
        return of();
      })
    );
  }
}
