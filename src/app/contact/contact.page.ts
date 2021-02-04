import { Component, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import {ReactiveFormsModule, FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  showLoader = false;
  url = "http://laraveldevelopers.website/dev21/uhk/public/api/submit-contact";

  validation_messages = {
    'name':[{type:'required', message: 'Name required'}],
    'email':[{type:'required', message: 'Email required'}],
    'phone':[{type:'required', message: 'Phone required'}],
    'address':[{type:'required', message: 'Firstname required'}],
    'subject':[{type:'required', message: 'subject required'}],
    'message':[{type:'required', message: 'message required'}],
    //'photo':[{type:'required', message: 'Choose photo'}]
  }

  myform: FormGroup;

  //myform = {};
  constructor(private router: Router, private formBuilder: FormBuilder, private apiService: ApiService, private toastController: ToastController) { 
  
    this.myform = formBuilder.group({
      name: new FormControl('',[Validators.required]),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      subject: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required]),
      //photo: new FormControl('', [Validators.required])
    })
  }

  ngOnInit() { 
  }

  formSubmit(){
    console.log("my form");
    if(this.apiService.getNetworkStatus){
      this.sendPostRequest();
    }else{
      this.presentToast("Please check your internet connection !");
    }
    
  }

  /*============= Api call for contact start ============*/
  sendPostRequest() {
    
    this.showLoader = true
     // var headers = new Headers();
     //alert(this.myform.value.name+" "+ this.myform.value.email+" "+this.myform.value.phone)
     console.log(this.myform.value.name+" "+ this.myform.value.email+" "+this.myform.value.phone);
  
      let postData = {
              "name": this.myform.value.name,
              "email": this.myform.value.email,
              "contact_no": this.myform.value.phone,
              "address": this.myform.value.address,
              "subject": this.myform.value.subject,
              "message": this.myform.value.message
              
              //"device_id": "6653f6bc-22d6-56d4-3582-400511111108"
      }
      this.apiService.ApiCall('POST',this.url, postData).subscribe(data =>{
        let response = JSON.parse(JSON.stringify(data));
          if(response.Ack === 1){
            console.log("data submitted successfully")
            this.showLoader = false;
            this.router.navigate(['/home1']);
          }else if(response.Ack === 0){
            this.showLoader = false;
            this.presentToast(data['message']);
          }
         }, error => {
           this.showLoader = false;
          this.presentToast(error);
          console.log(error);
      });
    }
    /*============= Api call for contact end ============*/

    /* To show toast message */
  async presentToast(mess: string) {
    const toast = await this.toastController.create({
      message: mess,
      duration: 1000
    });
    toast.present();
  }
}
