import { Component, OnInit } from '@angular/core';
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


@Component({
  selector: 'app-work',
  templateUrl: './work.page.html',
  styleUrls: ['./work.page.scss'],
})
export class WorkPage implements OnInit {

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
  nameText: string = 'brahmadeo'
  address: string = "Kolkata"
  email: string = "brahmadeo@xigmapro.com"
  phone: string = '9875422437'
  date: string = '2019-11-25'

  imgBlob = null
  filename = ''

  in_image_available = false
  out_image_available = false
  selected_in_image = false
  selected_out_image = false

  constructor(private router: Router, private actRoute: ActivatedRoute, private http: HttpClient, private apiService: ApiService, private actionSheetController: ActionSheetController, private toastController: ToastController, private camera: Camera, private platform: Platform, private webview: WebView, private file: File, private filePath: FilePath, private loadingController: LoadingController) { 

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

        this.ApiCallForUpdateSchedule("firstCall");
      }
    });
  }

  ngOnInit() {

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
    if(flag !== 'firstCall'){
      formData.append('in_image', this.imgBlob, this.filename);
    }
    
    console.log(this.userId+" , "+ this.appointmentId+ " ,"+ this.text_area);

    console.log(formData.get('user_id')+ " ,"+ formData.get('appointment_id')+" , "+formData.get('in_image'));
    //alert(this.userId+" "+ this.appointmentId+" "+this.text_area+" ");
    //alert(this.formData.get('user_id')+" , "+this.formData.get('appointment_id')+" , "+this.formData.get('metting_description')+" , "+this.formData.get('in_image'))
 
 
     this.http.post("http://laraveldevelopers.website/dev21/uhk/public/api/appointment-update", formData, {headers: new HttpHeaders({'Authorization': 'Basic dWhrOnhpZ21hcHJvMTIz'})})
       .subscribe(data => {
         let response = JSON.parse(JSON.stringify(data));

          console.log(response.data.in_image);
         
         if(response.Ack === 1){
          this.showProgressbar = false

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
           alert(response.Ack + " " +data['message'])
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
    console.log('validation called')
    if(!this.in_image_available && !this.selected_in_image){
      this.presentToast('select in image first')
      return false
    }else if(!this.out_image_available && !this.selected_out_image){
      this.presentToast('select out image first')
      return false
    }
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

  const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
              text: 'Load from Library',
              handler: () => {
                  this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, buttonType);
              }
          },
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
          
          this.startUpload(this.correctPath + currentName)

          alert(this.correctPath);
          
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
      alert("copy file to directory"+ JSON.stringify(success))
  }, error => {
      this.presentToast('Error while storing file.');
  });

  }
    
}
 
startUpload(path: string) {
console.log("submit "+ path)
  console.log("before ")
  if(this.file){
    console.log("after ")
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

}
