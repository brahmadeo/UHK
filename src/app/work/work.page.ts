import { Component, OnInit, NgModule, ViewChild, ElementRef, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController, LoadingController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ApiService } from '../services/api.service';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { finalize } from 'rxjs/operators';
import { promise } from 'protractor';
import { NgZone } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions,  NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { ReactiveFormsModule } from '@angular/forms';

declare var google;
var map, infoWindow;
var geoCoder;
//Geocoder configuration

@NgModule({
  imports:[ReactiveFormsModule]
})
@Component({
  selector: 'app-work',
  templateUrl: './work.page.html',
  styleUrls: ['./work.page.scss'],
})
export class WorkPage implements OnInit {
  @ViewChild('Map', { static: false }) mapElement: ElementRef;
  data: any
  //formData: any
  showProgressbar = false
  userId = ''
  appointmentId = ''
  text_area : string = ''
  imageFile: string;

  correctPath: any
  imageLocation: string = ''
 
  //file: File
  
  currentImage: any
  nameText: string = ''
  address: string = ""
  email: string = ""
  phone: string = ''
  date: string = ''

  imgBlob = null
  filename = ''

  latitude: number = 0;
  longitude: number = 0;

  in_image_available = false
  out_image_available = false
  selected_in_image = false
  selected_out_image = false
  geoAddress = ""

  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  constructor(private router: Router, private actRoute: ActivatedRoute, private http: HttpClient, 
    private apiService: ApiService, private actionSheetController: ActionSheetController, private toastController:
     ToastController, private camera: Camera, private platform: Platform, private webview: WebView, private file: File,
      private filePath: FilePath,private ngZone: NgZone, private geoLocation: Geolocation, 
      private nativeGeocoder:NativeGeocoder, private loadingController: LoadingController) { 

    // this.actRoute.queryParams.subscribe(params => {
    //   if(params && params.special){
    //     this.data = JSON.parse(JSON.stringify(params.special))
    //     console.log('work');
    //     console.log(this.data);
    //   }
    // });
    
    this.actRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.special;
        
        console.log("lower"+JSON.stringify(this.data))

        this.nameText = this.data.name;
        this.address = this.data.address;
        this.phone = this.data.mobile;
        this.date = this.data.date;
        this.text_area = this.data.description;
        this.userId = this.data.user_id;
        this.appointmentId = this.data.id;

        

      }
    });
  }

  ngOnInit() {
    this.initMap();
    if (this.apiService.getNetworkStatus) {
          
      this.ApiCallForUpdateSchedule("firstCall");
    }else{
      this.presentToast("Please check your internet connection!");
    }
  }
  logRatingChange(rating){
    console.log("changed rating: ",rating);
    // do your stuff
}

  inImage(e: any){
    this.file = e.target.value;
    console.log(this.file)
  }
  outImage(e: any){
    this.file = e.target.value;
    console.log(this.file)
  }


  /* Api call for Appointment update */
  ApiCallForUpdateSchedule(flag: string){

    if(flag !== 'firstCall'){
      if(this.validation()){
        this.ApiCallMethod(flag);
      }
    }else{
      this.ApiCallMethod(flag);
    }
  }

  ApiCallMethod(flag: string){
    console.log(this.text_area)
    
    this.showProgressbar = true;

    var formData = new FormData();

    formData.append('user_id', this.userId);
    formData.append('appointment_id', this.appointmentId);
    formData.append('metting_description', this.text_area);
   
    if(flag !== 'firstCall' && !this.in_image_available){
      formData.append('in_image', this.imgBlob, this.filename);
      formData.append('in_time_lat', this.latitude+"");
      formData.append('in_time_long', this.latitude+"");
      formData.append('in_time_address', this.geoAddress);
    }else if(flag !== 'firstCall' && !this.out_image_available){
      formData.append('out_image', this.imgBlob, this.filename);
      formData.append('out_time_lat', this.latitude+"");
      formData.append('out_time_long', this.longitude+"");
      formData.append('out_time_address', this.geoAddress);
    }
    console.log(this.userId+" , "+ this.latitude+ " ,"+ this.longitude);
    //alert(this.userId+" , "+ this.latitude+ " ,"+ this.longitude+" ,"+ this.geoAddress);

    console.log(formData.get('user_id')+ " ,"+ formData.get('appointment_id')+" , "+formData.get('in_image'+
    " , "+formData.get('in_time_lat') +" , "+ formData.get('out_time_lat')));
    
    this.http.post("http://laraveldevelopers.website/dev21/uhk/public/api/appointment-update", formData, {headers: new HttpHeaders({'Authorization': 'Basic dWhrOnhpZ21hcHJvMTIz'})})
       .subscribe(data => {
         let response = JSON.parse(JSON.stringify(data));
         console.log(response.data.in_image);
         if(response.Ack === 1){
          this.showProgressbar = false
          this.presentToast(response.message)
          if (flag !== 'firstCall') {
            this.ngZone.run(()=>{
              this.router.navigate(['/schedule']);
            })
          }
          if (response.data.description!=null) {
            document.getElementById('subject').innerHTML = response.data.description;
          }
          
          // check in image availability
          if(response.data.in_image !=null){
            this.in_image_available = true
          }else{
            this.in_image_available = false
          }

          // check out image availability
          if(response.data.out_image!=null){
            this.out_image_available = true
          }else{
            this.out_image_available = false
          }

           //this.router.navigate(['/home1']);
         }else if(response.Ack === 0){
           
           this.showProgressbar = false;
           //alert(response.Ack + " " +data['message'])
           //this.presentToast("ack 0 "+data['message']);
         }

        }, error => {
          this.showProgressbar = false
          alert(error)
         this.presentToast("error "+error);
         console.log(error);
       });

  }
  // validation
   validation(){
    //alert(this.userId+" , "+ this.latitude+ " ,"+ this.longitude+" ,"+ this.geoAddress);
    console.log('validation called '+ this.latitude+" , "+this.longitude+" , "+this.geoAddress)
    if(!this.in_image_available && !this.selected_in_image){
      this.presentToast('select in image first')
      return false
    }else if(this.in_image_available){
      if(!this.out_image_available && !this.selected_out_image){
        this.presentToast('select out image first')
        return false
      }
    }
    return true
  }
    /* To show toast message */
    async presentToast(mess: string) {
      const toast = await this.toastController.create({
        message: mess,
        duration: 1000
      });
      toast.present();
    }

pathForImage(img) {
  if (img === null) {
    return '';
  } else {
    let converted = this.webview.convertFileSrc(img);
    return converted;
  }
}

// open camera or gallery window
async selectImage(buttonType: string) {
  // to take current coordinates
  
  const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [
          {
              text: 'Use Camera',
              handler: () => {
                  this.takePicture(this.camera.PictureSourceType.CAMERA, buttonType);
              }
          },
          {
              text: 'Cancel',
              role: 'cancel'
          }
      ]
  });
  await actionSheet.present();
}

takePicture(sourceType: any, buttonType: string) {
  this.imageLocation = ""
  var options: CameraOptions = {
    quality: 100,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true
};

this.camera.getPicture(options).then(imagePath => {
    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
            .then(filePath => {
                  this.correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                  console.log(" if path   "+this.correctPath);
                let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                this.imageLocation = this.pathForImage(this.correctPath+ currentName);
                 // check which button is clicked
                if(buttonType === 'inPicture'){
                    document.getElementById('firstImage').innerHTML = currentName;
                    this.selected_in_image = true
                    this.selected_out_image = false
                }else{
                    document.getElementById('secondImage').innerHTML = currentName;
                    this.selected_out_image = true
                    this.selected_in_image = false
                }

                this.startUpload(this.correctPath+ currentName)
                this.copyFileToLocalDir(this.correctPath, currentName, this.createFileName());
            });

    } else {
          var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          this.correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        
          // path for setting selected images in html
          this.imageLocation = this.pathForImage(imagePath);
          
          console.log("corerect path   "+this.correctPath);
          console.log("else path   "+this.imageLocation);
          
          // start uploading image 
          this.startUpload(this.correctPath + currentName)
        this.copyFileToLocalDir(this.correctPath, currentName, this.createFileName());

        // check which button is clicked
        if(buttonType === 'inPicture'){
          document.getElementById('firstImage').innerHTML = currentName;
            this.selected_in_image = true
            this.selected_out_image = false
        }else{
          document.getElementById('secondImage').innerHTML = currentName;
            this.selected_out_image = true
            this.selected_in_image = false
        }
    }
});

}
createFileName() {
  var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
  return newFileName;
}
 
copyFileToLocalDir(namePath, currentName, newFileName) {
  if(this.file){
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      //this.updateStoredImages(newFileName);
      //alert("copy file to directory"+ JSON.stringify(success))
  }, error => {
      this.presentToast('Error while storing file.');
  });

  } 
}
 
startUpload(path: string) {
  if(this.file){
    this.file.resolveLocalFilesystemUrl(path)
      .then(entry => {
          ( < FileEntry > entry).file(file => 
            this.readFile(file))
      })
      .catch(err => {
          this.presentToast('Error while reading file.');
      });
  }
}

  readFile(file: any) {
    const reader = new FileReader();
    reader.onload = () => {
         this.imgBlob = new Blob([reader.result], {
            type: file.type
        });
        this.filename = file.name;
    };
    reader.readAsArrayBuffer(file);
  }

  /*=========== Start map ===========*/
  async initMap() {
    console.log("map called")
  
    geoCoder = await new google.maps.Geocoder();

    console.log("map called 1" +geoCoder)
   await this.geoLocation.getCurrentPosition({ timeout: 30000, enableHighAccuracy: true }).then((resp) => {
      this.latitude = resp.coords.latitude
      this.longitude = resp.coords.longitude
      
      console.log("aaaaa: "+ this.latitude+" "+this.longitude)
      var latlng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
    };

      this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options)
      .then((result: NativeGeocoderResult[]) => this.geoAddress = result[0].areasOfInterest+" "+result[0].subThoroughfare+" "+result[0].thoroughfare+" "+result[0].subLocality+" "
      +result[0].locality+" "+result[0].subAdministrativeArea+" "+result[0].administrativeArea+" "+result[0].postalCode+" "+
      result[0].countryName)
      .catch((error: any) => console.log(error));
      
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geoLocation.watchPosition();
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
       data.coords.latitude
       data.coords.longitude
    });
  }
   /*=========== End map ===========*/

}
