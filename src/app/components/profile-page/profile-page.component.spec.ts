import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfilePageComponent} from './profile-page.component';
import {ProfileIndicatorComponent} from '../profile-indicator/profile-indicator.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {RouterTestingModule} from '@angular/router/testing';
import {environment} from '../../../environments/environment';
import {of} from "rxjs";
import {User} from "../../models/user";

describe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FontAwesomeModule,
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFireStorageModule,
        AngularFireDatabaseModule
      ],
      declarations: [ProfilePageComponent, ProfileIndicatorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;

    // Sets the test bed to actually set a user when onAuthStateChanged is subscribed to
    spyOn(component['firebaseAuth'].auth, 'onAuthStateChanged').and.callFake((callback) => {
      return callback({displayName: 'test', email: 'test@test.com', photoURL: 'string', uid: 'string'} as User);
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call selectFile', () => {
    const checkSelectedImageSpy = spyOn(component, 'checkSelectedImage').and.returnValue(true);
    spyOn(component, 'deSelectFile');
    spyOn(component['eventService'], 'setSelectedImages');

    // If
    component.selectFile('');
    expect(component.deSelectFile).toHaveBeenCalled();
    // Else
    checkSelectedImageSpy.and.returnValue(false);
    component.selectFile('');
    expect(component['eventService'].setSelectedImages).toHaveBeenCalled();

  });

  it('should call deSelectFile', () => {
    spyOn(component['eventService'], 'removeSelectedImage');

    component.deSelectFile('');
    expect(component['eventService'].removeSelectedImage).toHaveBeenCalled();
  });

  it('should call checkSelectedImage', () => {
    spyOn(component['eventService'], 'getSelectedImages').and.returnValue('');

    component.checkSelectedImage('');
    expect(component['eventService'].getSelectedImages).toHaveBeenCalled();
  });

  it('should call toggleDelete', () => {
    spyOn(component['eventService'], 'setDeleteMode');

    component.toggleDelete();
    expect(component['eventService'].setDeleteMode).toHaveBeenCalled();
  });

  it('should call logOut', () => {
    spyOn(component['firebaseAuth'].auth, 'signOut');

    component.logOut();
    expect(component['firebaseAuth'].auth.signOut).toHaveBeenCalled();
  });

});
