import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastController, LoadingController, AlertController, Platform } from '@ionic/angular';
import { Events } from '@ionic/angular'
import { RadioGroupChangeEventDetail } from '@ionic/core';
import { ApiService } from '../services/api.service';
// GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker,
import { GoogleMaps, GoogleMapOptions, Geocoder }
  from '@ionic-native/google-maps';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
//import { google } from "google-maps";
//import { googlemaps } from "googlemaps";

declare var google;
var map, infoWindow;
var geoCoder;
//var geocoder = new google.maps.Geocoder();
@Component({
  selector: 'app-name',
  templateUrl: './name.page.html',
  styleUrls: ['./name.page.scss'],
})
export class NamePage implements OnInit {

  @ViewChild('Map', { static: false }) mapElement: ElementRef;
  //map: any;
  checkAttendanceUrl = 'http://laraveldevelopers.website/dev21/uhk/public/api/check-attendence';
  submitAttendanceUrl = 'http://laraveldevelopers.website/dev21/uhk/public/api/submit-attendence';
  address = '';
  city = ''
  radio = 'Yes'
  attYes = ''
  comment_input = ''
  attend = ''
  username: any
  isEnabled = true
  clickedYes = false
  clickedNo = false
  clickedOther = false

  isAttended = false

  latitude: number = 0;
  longitude: number = 0;
  latLngValue = null

  myform: FormGroup;

  constructor(private router: Router, formBuilder: FormBuilder, private http: HttpClient, private toastController:
     ToastController, private loadingController: LoadingController, private alertController: AlertController, 
     private elementRef: ElementRef, private apiService: ApiService, private geoLocation: Geolocation, 
     private googleMap: GoogleMaps, private plt: Platform, private nativeGeocoder: NativeGeocoder, private events:Events) {
    this.checkAttendane();
    //console.log('checkUrl '+ ApiConstatnts.baseUrl)
    //geoCoder = new google.maps.Geocoder();

    if (this.router.getCurrentNavigation().extras.state) {
      this.username = this.router.getCurrentNavigation().extras.state.special;
      console.log(this.username)
    }

  }

  ngOnInit() {
    this.initMap();
  }
  ionViewDidLoad(){ 
    this.events.publish('loggedin');
}

  go() {
    this.router.navigate(['/schedule'])
  }
  clickYes(e) {
    this.clickedYes = true;
    this.clickedNo = false
    this.clickedOther = false
    console.log("yes " + this.radio);
  }
  clickNo(event) {
    this.clickedYes = false
    this.clickedNo = true
    this.radio = 'No'
  }

  attendFunc(flag: any) {
    if (this.apiService.getNetworkStatus) {

      if (this.isAttended) {
        this.presentAlert("Attendance already taken");
      } else {
        if (this.clickedNo && this.attend === '') {
          this.presentToast('Please select attendance');
        } else if (this.clickedOther && this.comment_input === '') {
          this.presentToast('Please enter message..')
        } else {
          this.sendPostRequest(flag);
        }
      }

    } else {
      this.presentToast("Please check your internet connection!")
    }

  }
  selectOther() {
    this.attend = 'other'
    this.clickedOther = true
  }
  selectLeave() {
    this.attend = 'leave'
    this.clickedOther = false
    console.log(this.attend)
  }
  selectWeakOff() {
    this.attend = 'weak off'
    this.clickedOther = false
    console.log(this.attend)
  }

  /* To show toast message */
  async presentToast(mess: string) {
    const toast = await this.toastController.create({
      message: mess,
      duration: 1000
    });
    toast.present();
  }
  /*======== api call for check attendance ===========*/
  checkAttendane() {
    let postData = {
      //"user_id": '1',       
      "user_id": window.localStorage.getItem('user_id')
      //"attendence": this.radio,
        //"address": this.address
    }

    this.http.post(this.checkAttendanceUrl, postData, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Basic dWhrOnhpZ21hcHJvMTIz' }) })
      .subscribe(data => {
        let response = JSON.parse(JSON.stringify(data));
        if (response.Ack === 1) {
          // disable attendance button

          this.isEnabled = false;
          this.setStyle('white');
          this.attYes = response.data.attendence;

          if (response.data.attendence === 'Yes') {
            this.isAttended = true;
            console.log("check attendance1 " + response.data.attendence);

            this.presentAlert("Attendance already taken");
          } else if (response.data.attendence === 'No') {
            console.log("check attendance2 " + response.data.attendence);
            this.presentAlert("You are absent today");
          }

        } else if (response.Ack === 0) {
          this.isEnabled = false;
          //this.presentToast(data['message']);
        }

      }, error => {
        this.isEnabled = false;
        this.presentToast(error);
        console.log(error);
        this.presentAlert(error);
      });
  }

  /*========= Api Call for submit attendance ===========*/
  sendPostRequest(flag: any) {
    let postData;

    if (flag === 'yes') {
      console.log('flag is ' + flag)
      postData = {
        "user_id": window.localStorage.getItem('user_id'),
        "attendence": this.radio,
        "address": this.address
      }
    } else {
      console.log('flag in else ' + flag)
      postData = {
        // "user_id": '1',
        "user_id": window.localStorage.getItem('user_id'),
        "attendence": this.radio,
        "description": this.comment_input,
        "cause_of_absent": this.attend
      }
    }

    //alert(this.attend+" "+ this.comment_input+" "+this.radio+ " "+ window.localStorage.getItem('user_id'));

    this.http.post(this.submitAttendanceUrl, postData, { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Basic dWhrOnhpZ21hcHJvMTIz' }) })
      .subscribe(data => {
        let response = JSON.parse(JSON.stringify(data));
        if (response.Ack === 1) {
          this.router.navigate(['/schedule']);
        } else if (response.Ack === 0) {
          this.presentToast(data['message']);
        }
      }, error => {
        this.presentToast(error);
        console.log(error);
      });
  }
  async showDialog(mess: any) {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 5000,
      message: mess,
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

  async presentAlert(mess: any) {
    let navigationExtra: NavigationExtras = {
      state: {
        special: this.isAttended
      }
    }

    const alert = await this.alertController.create({
      header: 'Alert',
      //subHeader: 'Status',
      message: mess,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            if (navigationExtra != null) {
              this.router.navigate(['/schedule'], navigationExtra)
            }
          }
        }
      ]
    });

    await alert.present();
  }
  setStyle(value: any): void {
    this.elementRef.nativeElement.style.setProperty('--background', value);
  }

  // Map initialization
  initMap() {
    console.log("map called")
   

    console.log("map called 1")
    this.geoLocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude
      this.longitude = resp.coords.longitude

      map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: this.latitude, lng: this.longitude },
        zoom: 6
      });
      infoWindow = new google.maps.InfoWindow;
      
      var pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('You are here');
      infoWindow.open(map);
      map.setCenter(pos);

      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
    };

      this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options)
      .then((result: NativeGeocoderResult[]) => this.address = result[0].areasOfInterest+" "+result[0].subThoroughfare+" "+result[0].thoroughfare+" "+result[0].subLocality+" "
      +result[0].locality+" "+result[0].subAdministrativeArea+" "+result[0].administrativeArea+" "+result[0].postalCode+" "+
      result[0].countryName)
      .catch((error: any) => console.log(error));
      

      console.log("aaaaa: "+ this.latitude+" "+this.longitude)
      var latlng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      
      // geoCoder.geocode({ 'latLng': latlng }, function (results, status) {
      //   if (status == google.maps.GeocoderStatus.OK) {
      //     console.log(results)
      //     if (results[1]) {
      //       //formatted address
      //       this.address = results[0].formatted_address;
      //       console.log("current address: " + results[0].formatted_address)
      //       console.log("current address: " +this.address)
      //       //find country name
      //       for (var i = 0; i < results[0].address_components.length; i++) {
      //         for (var b = 0; b < results[0].address_components[i].types.length; b++) {
      //           if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
      //             //this is the object you are looking for
      //             this.city = results[0].address_components[i];
      //             break;
      //           }
      //         }
      //       }
      //       //city data
      //       console.log("city: " + this.city.short_name + " " + this.city.long_name)

      //     } else {
      //       alert("No results found");
      //     }
      //   } else {
      //     alert("Geocoder failed due to: " + status);
      //   }
      // });

    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geoLocation.watchPosition();
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
    });
  }
  //  handleLocationError(browserHasGeolocation, infoWindow, pos) {
  //   infoWindow.setPosition(pos);
  //   infoWindow.setContent(browserHasGeolocation ?
  //                         'Error: The Geolocation service failed.' :
  //                         'Error: Your browser doesn\'t support geolocation.');
  //   infoWindow.open(map);
  //  }

  //  getAddressFromCoords(lattitude: any, longitude: any) {
  //   console.log("getAddressFromCoords11 "+lattitude+" "+longitude);
  //   let options: NativeGeocoderOptions = {
  //     useLocale: true,
  //     maxResults: 5
  //   };

  // }



  // this.geoCoder.reverseGeocode(lattitude, longitude, options)
  //   .then((result: NativeGeocoderResult[]) => {
  //     this.address = "";
  //     let responseAddress = [];
  //     for (let [key, value] of Object.entries(result[0])) {
  //       if(value.length>0)
  //       responseAddress.push(value);

  //     }
  //     responseAddress.reverse();
  //     for (let value of responseAddress) {
  //       this.address += value+", ";
  //     }
  //     this.address = this.address.slice(0, -2);
  //     console.log("address: "+ this.address)
  //   })
  //   .catch((error: any) =>{ 
  //     this.address = "Address Not Available!";
  //   });

}
