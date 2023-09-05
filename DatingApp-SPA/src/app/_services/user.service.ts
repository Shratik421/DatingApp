import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../_models/user';
import { environment } from '../../environment/environment';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { Message } from '../_models/message';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  baseUrl = environment.apiUrl;
  token = localStorage.getItem('token');

  getUsers(
    page?: number,
    itemsPerPage?: any,
    userParams?: any,
    likesParam?: any
  ): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<
      User[]
    >();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (likesParam === 'Likers') {
      params = params.append('likers', 'true');
    }

    if (likesParam === 'Likees') {
      params = params.append('likees', 'true');
    }

    // "http://localhost:7178/api/users"
    return this.http
      .get<User[]>('http://localhost:7178/api/users', {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          paginatedResult.result = response.body || [];
         
          if (response.headers.get('Pagination') != null) {
          
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination') || '[]'
            );
          }
          return paginatedResult;
        })
      );
  }

  getUser(id: any): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'users/ ' + id, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(
      'http://localhost:7178/api/users/' +  userId + '/photos/' + id +'/setMain',{}); }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(
      'http://localhost:7178/api/users/' + userId + '/photos/' + id); }

  sendLike(id: number, recipientId: number) {
    return this.http.post(
      'http://localhost:7178/api/users/' + id + '/like/' + recipientId,
      {});}

  getMessages(
    id: number,
    page?: number,
    itemsPerPage?: number,
    messageContainer?: any
  ): Observable<PaginatedResult<Message[]>> {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();


    let params = new HttpParams();
    params = params.append('MessageContainer', messageContainer);

    if (messageContainer)
      params = params.append('MessageContainer', messageContainer);

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http.get<Message[]>('http://localhost:7178/api/users/' + id + '/messages', {observe: 'response',params}).pipe(
        map((response) => {
          paginatedResult.result = response.body || [];
          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination') || '{}'
            );
          }
          return paginatedResult;
        })
      );
  }

  getMessageThread(id: number, recipientId: number) {
    return this.http.get<Message[]>(
      'http://localhost:7178/api/users/' + id +'/messages/thread/' + recipientId);}

  sendMessage(id: number, message: Message) {
    console.log("Send message calleeed");
    return this.http.post(
      'http://localhost:7178/api/users/' + id + '/messages', message );
    }

  deleteMessage(id: number, userId: number) {
    return this.http.post(
      'http://localhost:7178/api/users/' + userId + '/messages/' + id, {} );}

  markAsRead(userId: number, messageId: number) {
    this.http.post('http://localhost:7178/api/users/' +   userId + '/messages/ ' + messageId +'/read', {}  ) .subscribe(); }
}
