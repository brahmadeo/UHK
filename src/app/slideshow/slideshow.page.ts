import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { IonSlides, Platform,ToastController, AlertController } from '@ionic/angular';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Uid } from '@ionic-native/uid/ngx';
import { map } from 'rxjs/operators';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { ApiService } from '../services/api.service';
import { Observable, from } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Network } from '@ionic-native/network/ngx';

import { FCM } from '@ionic-native/fcm/ngx';



@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.page.html',
  styleUrls: ['./slideshow.page.scss'],
})
export class SlideshowPage implements OnInit {
  currentImage: any
  isShowingSpinner = false
  UUID = '';
  url: string = 'http://laraveldevelopers.website/dev21/uhk/public/api/check-device-id';

@ViewChild('slideWithNav', { read: true, static: false }) slideWithNav: IonSlides;
sliderOne: any;

result: Observable<any>
connect = null;

 slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay:true
  };

  constructor(private router: Router, private platform: Platform, private alertCtrl: AlertController, private toastController:ToastController, private uniqueDeviceId: UniqueDeviceID, private http:HttpClient, private apiService: ApiService, private camera: Camera, private network: Network, private fcm: FCM) { 

    // checking internet connectivity    
    this.network.onConnect().subscribe(() => {
      console.log("connected");
     
    });

    this.platform.ready().then(()=>{
      this.showPushNotification();
    })

          // watch network for a connection
        let connectSubscription = this.network.onConnect().subscribe(() => {
          console.log('network connected!');
          setTimeout(() => {
            if (this.network.type === 'wifi') {
             
              console.log('we got a wifi connection, woohoo!');
            }
          }, 3000);
      });

      // watch network for a disconnect
      this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      
    });
    
    platform.ready().then(()=>{
      platform.backButton.subscribe(()=>{
         //console.log("back button pressed");
       //  this.presentAlertConfirm();
       
      })
    });


//Item object for sliding
    this.sliderOne =
      {
        isBeginningSlide: true,
        isEndSlide: false,
        slidesItems: [
          {
            id: 1,
            image: '../../assets/images1/1.jpg',
            title1: 'Security Awareness',
            title2: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry'
          },
          {
            id: 2,
            image: '../../assets/images1/2.jpg',
            title1: 'Human behaviour',
            title2: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry'
          },
          {
            id: 3,
            image: '../../assets/images1/3.jpg',
            title1: 'End to end Services',
            title2: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry'
          }
        ]
      };
  }
  
  async alertConfirm(header:string, message: string){
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ["OK"]
  });
  await alert.present();
}

  async presentAlertConfirm(message: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
            //this.presentToast("Confirm cancel");
          }
        }, {
          text: 'Okay',
          handler: () => {
            //console.log('Confirm Okay');
            this.presentToast("Confirm okey");
            // to exit app 
            navigator['app'].exitApp();
          }
        }
      ]
    });

    await alert.present();
  }
  async presentToast(mess: string) {
    const toast = await this.toastController.create({
      message: mess,
      duration: 1000
    });
    toast.present();
  }

  ngOnInit() {
   
  }
  //  for next page
  go(){

   // this.getUUId();
    if(this.apiService.getNetworkStatus){
      this.getUUId();
    }else{
      this.presentToast("Please check your internet connection!")
    }
    
  }

   //Method called when slide is changed by drag or navigation
   SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }
//Call methods to check if slide is first or last to enable disbale navigation  
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }
  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }

  getUUId(){
    this.uniqueDeviceId.get()
    .then((uuid: any) => this.ApiCallForUuid(uuid))
    .catch((error: any) => alert(error))
  }

  ApiCallForUuid(uuid: any){
    // save device id locally
    localStorage.setItem("device_id", uuid);

    console.log("device id: "+uuid);
    this.isShowingSpinner = true
    let postData = {
            //"device_id": "6653f6bc-22d6-56d4-3582-400511111108"
           "device_id": uuid
    }
    //this.takePicture();
    this.apiService.ApiCall('POST',this.url, postData).subscribe(data =>{
      let response = JSON.parse(JSON.stringify(data));
        if(response.Ack === 1){
          console.log("response: "+ response)
          this.isShowingSpinner = false
          let navigationExtra : NavigationExtras = {
            state : {
              special: response.data.username
            }
          }
          this.router.navigate(['/home1']);
        }else if(response.Ack === 0 && response.message === "Not Found"){
          this.isShowingSpinner = false
          //this.presentToast(response.message)
          this.router.navigate(['/login'])
        }
      }, error => { 
        this.isShowingSpinner = false
        console.log(error);
        //this.router.navigate(['/login'])
    });

  }
  showPushNotification(){
    console.log("notify method called");
    this.fcm.subscribeToTopic('manpower');

    this.fcm.getToken().then(token => {
      console.log("token: "+ token);
      localStorage.setItem("fcm_token", token);
      //backend.registerToken(token);
    });
    
    this.fcm.onNotification().subscribe(data => {
      if(data.wasTapped){
        console.log("Received in background");
      } else {
        console.log("Received in foreground");
      };
    });
    
    this.fcm.onTokenRefresh().subscribe(token => {
      console.log("token1: "+ token);
      //backend.registerToken(token);
    });
    
    this.fcm.unsubscribeFromTopic('manpower');
  }
}
  
