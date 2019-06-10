import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

import { StorageService } from 'src/app/services/storage.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-create-post-page',
  templateUrl: './create-post-page.component.html',
  styleUrls: ['./create-post-page.component.scss']
})
export class CreatePostPageComponent implements OnInit {
  photoSrc: any;
  photoFile: File;
  description: string;
  user: User;
  isMakingPost = false;

  constructor(
    private storage: StorageService,
    private firebase: AngularFireDatabase,
    private firebaseAuth: AngularFireAuth) { }

  ngOnInit() {
    this.firebaseAuth.user.subscribe(
      user => this.user = user
    );
  }

  loadFile($event: any): void {
    this.photoFile = $event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => this.photoSrc = reader.result;
    reader.readAsDataURL(this.photoFile);
  }

  makePost(): void {
    this.isMakingPost = true;
    const fileId = Date.now().toString();
    this.storage.uploadFile(this.photoFile, fileId)
      .then(() => {
        this.firebase.database.ref(this.user.uid + '/files/' + fileId).update({
          description: this.description
        })
          .then(() => {
            this.isMakingPost = false;
            this.photoFile = null;
            this.photoSrc = '';
            this.description = '';
          });
      });
  }
}
