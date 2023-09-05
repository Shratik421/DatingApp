import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

import { Token } from '@angular/compiler';
import * as alertify from 'alertifyjs';
import { AlertifyService } from '../_services/alertify.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl?: string;

  constructor(
    public authService: AuthService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  get decodedToken() : any {
    return this.authService?.decodedToken || null ;
  }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(
      (photoUrl) => (this.photoUrl = photoUrl)
    );
  }

  login() {
    this.authService.login(this.model).subscribe(
      () => {  
        alertify.success('Logged in SuccessFully');
      },
      (err) => {
        alertify.error('Failed to login');
      },()=>{
        this.router.navigate(['/members']);
      }
    );
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
    //return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser;
  
    alertify.message('Logged out');
    this.router.navigate(['/home']);
  }
}
