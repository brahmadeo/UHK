import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { RadioGroupChangeEventDetail } from '@ionic/core';
@Component({
  selector: 'app-name',
  templateUrl: './name.page.html',
  styleUrls: ['./name.page.scss'],
})
export class NamePage implements OnInit {

  radio = 'Yes'
  attYes = ''
  comment_input: string = 'hello'
  attend = ''
  isEnabled = true

  isAttended = false

  myform: FormGroup;

  constructor(private router: Router, formBuilder: FormBuilder, private http: HttpClient, private toastController: ToastController, private loadingController: LoadingController, private alertController: AlertController, private elementRef: ElementRef) { 
    this.checkAttendane();
   
  }

  ngOnInit() {
    
  }

  go(){
    console.log("method clicked")
  	this.router.navigate(['/schedule'])
  }
  clickYes(e){

    console.log("yes "+this.radio);
  }
  clickNo(event){
    this.radio = 'No'
    console.log("no "+ this.radio );
  }
  attendFunc(firstnumber){
    if(this.isAttended){
      this.presentAlert();
    }else{
      this.sendPostRequest();
      console.log(firstnumber.value)
    }
   
  }
  selectYes(){
    this.attend = 'yes'
    console.log(this.attend)
  }
  selectNo(){
    this.attend = 'no'
    console.log(this.attend)
  }
  selectLeave(){
    this.attend = 'leave'
    console.log(this.attend)
  }
  selectWeakOff(){
    this.attend = 'weak off'
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
  /* api call for check attendance  */ 

  checkAttendane() {
     let postData = {
             "user_id": '1',       
     }

     this.http.post("http://laraveldevelopers.website/dev21/uhk/public/api/check-attendence", postData, {headers: new HttpHeaders({'Content-Type': 'application/json','Authorization': 'Basic dWhrOnhpZ21hcHJvMTIz'})})
       .subscribe(data => {
         let response = JSON.parse(JSON.stringify(data));
         if(response.Ack === 1){
           // disable attendance button
            console.log(response)
           this.isEnabled = false;
           this.setStyle('white');
           this.attYes = response.data['attendence']
           this.isAttended = true
           this.presentAlert()
    
         }else if(response.Ack === 0){

           this.isEnabled = false;
           //this.presentToast(data['message']);
         }
        }, error => {
          this.isEnabled = false;
         this.presentToast(error);
         console.log(error);
         this.presentAlert();
       });
   }

  /* Api Call for submit attendance */
  sendPostRequest() {
     let postData = {
             "user_id": '1',
             "attendence": this.attend,
             "description": this.comment_input,
             "weekly_off": this.radio
     }

     alert(this.attend+" "+ this.comment_input+" "+this.radio);
 
     this.http.post("http://laraveldevelopers.website/dev21/uhk/public/api/submit-attendence", postData, {headers: new HttpHeaders({'Content-Type': 'application/json','Authorization': 'Basic dWhrOnhpZ21hcHJvMTIz'})})
       .subscribe(data => {
         let response = JSON.parse(JSON.stringify(data));
         if(response.Ack === 1){
           this.router.navigate(['/schedule']);
         }else if(response.Ack === 0){
           this.presentToast(data['message']);
         
         }
        }, error => {
         this.presentToast(error);
         console.log(error);
       });
   }
   async showDialog(){
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 5000,
      message: 'Already attendance taken...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      //subHeader: 'Status',
      message: 'Attendance already taken',
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
            this.router.navigate(['/schedule'])
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }
  setStyle(value: any): void {
    this.elementRef.nativeElement.style.setProperty('--background', value); 
  }
  
}
