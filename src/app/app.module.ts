import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import {HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { Camera } from '@ionic-native/camera/ngx'
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { DatePipe } from '@angular/common';
import { Network } from '@ionic-native/network/ngx';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
//import { google } from "google-maps";
import { GoogleMaps, GoogleMapOptions }
 from '@ionic-native/google-maps';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import Rating from 'material-ui-rating';
import { IonicRatingModule } from 'ionic4-rating';
import { StarRatingModule } from 'ionic4-star-rating';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

//import { IonicStorageModule } from '@ionic/storage';

 // Your web app's Firebase configuration
 var firebaseConfig = {
  apiKey: "AIzaSyChwtD_qLtFnzdSPS22ZnXk0sgW_XU9_6o",
  authDomain: "uhk-manpower.firebaseapp.com",
  databaseURL: "https://uhk-manpower.firebaseio.com",
  projectId: "uhk-manpower",
  storageBucket: "uhk-manpower.appspot.com",
  messagingSenderId: "383013725302",
  appId: "1:383013725302:web:07bbfa31406efd140cab57"
};
// Initialize Firebase
//firebase.initializeApp(firebaseConfig);


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, ReactiveFormsModule, StarRatingModule],
  providers: [
    StatusBar,
    SplashScreen,
    UniqueDeviceID,
    Uid,
    AndroidPermissions,
    Camera,
    WebView,
    File,
    FilePath,
    FileChooser,
    FileTransfer,
    DatePipe,
    Network,
    Geolocation,
    NativeGeocoder,
    GoogleMaps,
    DatePicker,
    FCM,
    HttpClientModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
