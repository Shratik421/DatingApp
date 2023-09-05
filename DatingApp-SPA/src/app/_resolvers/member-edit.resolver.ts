import { Injectable, resolveForwardRef } from '@angular/core';
import { MemberDetailComponent } from '../members/member-detail/member-detail.component';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import * as alertify from 'alertifyjs';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MemberEditResolver implements Resolve<User> {
  constructor(
    private userService: UserService,
    private AuthService:AuthService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    const userId = this.AuthService.decodedToken.nameid;
    return this.userService.getUser(userId).pipe(
      catchError(error=> {
     
        this.alertify.error('Problem retreving data ');
        this.router.navigate(['/members']);
        return of();
      })
    );
  }
}
