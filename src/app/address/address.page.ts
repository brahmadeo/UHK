import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoderOptions, NativeGeocoder, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

declare var google;
var map, infoWindow;
@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {
  @ViewChild('Map', { static: false }) mapElement: ElementRef;

  address = "";
  latitude: number = 0;
  longitude: number = 0;

  url = "http://laraveldevelopers.website/dev21/uhk/public/api/cms-details";

  showSpinner = false;
  response = [];
  result = {};
  cmsId = 0

  constructor(private router: Router, private geoLocation: Geolocation, private nativeGeocoder: NativeGeocoder, private apiService: ApiService) {
    if(this.router.getCurrentNavigation().extras.state){
      this.cmsId = this.router.getCurrentNavigation().extras.state.cmsId;
      console.log("cms id: "+ this.cmsId);
      
    }

   }

  ngOnInit() {
    this.initMap();
    this.apiCallForCms();
  }

  /*============  Api call for cms listing start============*/
  apiCallForCms(){
    let actualUrl = this.url +"/"+ this.cmsId;
    this.showSpinner = true;
    console.log("urllll "+actualUrl)
    this.apiService.ApiCall('POST', actualUrl, null).subscribe(data =>{
      console.log(typeof data)
      //let responseResult = JSON.parse(JSON.stringify(data));
      console.log("hereee "+JSON.stringify(data))
      if(data.Ack === 1){
        this.showSpinner = false
        this.result = data.data
        this.response = JSON.parse(JSON.stringify(data)).data;
        if(data.data.description!=null){
           document.getElementById("addressDescription").innerHTML = data.data.description;
        }
      }else if(data.Ack === 0){
        this.showSpinner = false
        this.result = {};
      }
      //console.log("aa1",this.serviceList);
      console.log("result cms",this.result);
    
      //alert(this.result['message']);
      //document.getElementById('abc').innerHTML = this.result['message'];

    });
  }
  /*============  Api call for cms listing end ============*/

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
      

      console.log("aaaaa address: "+ this.latitude+" "+this.longitude)
      var latlng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      

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

}
