import { AlertifyService } from 'src/app/_services/alertify.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Photo } from 'src/app/_models/photo';

import { FileUploadModule } from 'ng2-file-upload';
import { environment } from 'src/environment/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css'],
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos!: Photo[];
  @Output() getMemberPhotoChnage = new EventEmitter<string>();

  uploader: FileUploader;
  hasBaseDropZoneOver: any;
  hasAnotherDropZoneOver: any;
  response: string;
  baseUrl = environment;
  currentMain?: Photo;

  constructor(
    private authservice: AuthService,
    private userservice: UserService,
    private alertify: AlertifyService
  ) {
    this.uploader = new FileUploader({
      disableMultipart: true,
      formatDataFunctionIsAsync: true,
    });

    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;
    this.response = '';
    this.uploader.response.subscribe((res) => (this.response = res));
  }

  ngOnInit() {
  
    this.intializeUploader();
  }

  fileOverBase(e: any): void {

    this.hasBaseDropZoneOver = e; 
  }

  fileOverAnother(e: any): void {
   
    this.hasAnotherDropZoneOver = e;
  }
  intializeUploader() {
    this.uploader = new FileUploader({url:'http://localhost:7178/api/users/' +
        this.authservice.decodedToken.nameid +
        '/photos',
      authToken: 'Bearer' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingAll = (file) => {
   
      file.withCrentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, Headers) => {
      if (response) {
    
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain,
        };

        this.photos?.push(photo);
        if (photo.isMain) {
      
          this.authservice.changeMemberPhoto(photo.url);
          this.getMemberPhotoChnage.emit(photo.url);
          this.authservice.currentUser!.photoUrl = photo.url;
    
        }
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this.userservice
      .setMainPhoto(this.authservice.decodedToken.nameid, photo.id)
      .subscribe(
        () => {
          this.currentMain = this.photos.filter((p) => p.isMain == true)[0];
          this.currentMain.isMain = false;
          photo.isMain = true;
          this.authservice.changeMemberPhoto(photo.url);
          this.getMemberPhotoChnage.emit(photo.url);
          this.authservice.currentUser!.photoUrl = photo.url;
          localStorage.setItem(
            'user',
            JSON.stringify(this.authservice.currentUser)
          );
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  deletePhoto(id: number) {
    this.alertify.confirm('Are You sure want to delete this photo?', () => {
      this.userservice
        .deletePhoto(this.authservice.decodedToken.nameid, id)
        .subscribe(
          () => {
            this.photos.splice(
              this.photos.findIndex((p) => p.id == id),
              1
            );
            this.alertify.success('Photo has been Deleted');
          },
          (error) => {
            this.alertify.error('Failed to deleted the photo');
          }
        );
    });
  }
}
