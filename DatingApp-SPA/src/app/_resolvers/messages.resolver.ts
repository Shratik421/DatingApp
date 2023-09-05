import { Injectable, resolveForwardRef } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Message } from '../_models/message';
import { AuthService } from '../_services/auth.service';
import { PaginatedResult } from '../_models/pagination';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
  pageNumber = 1;
  pageSize = 5;
  messageContainer = 'Unread';

  constructor(
    private userService: UserService,
    private authService:AuthService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
    const userId = route.params['id'];
    return this.userService.getMessages(this.authService.decodedToken.nameid ,this.pageNumber , this.pageSize,this.messageContainer).pipe(
    map((result : PaginatedResult<Message[]>)=> result.result || [] ),
      catchError(error => {
   
        this.alertify.error('Problem retreving messages message resolver');
        this.router.navigate(['/home']);
        return of([] as Message[]);
      })
    );
  }
}
