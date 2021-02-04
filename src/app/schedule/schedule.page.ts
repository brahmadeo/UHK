import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { NavController, ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker/ngx';



@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  radio = "today";
  showSpinner = true;
  result = []

  // result = [
  //   {
  //     date: "2020-02-13",
  //     contact_person_name: "brahmadeo",
  //     address: "Kolkata",
  //     mobile: "9875422437",
  //     description: "description..",
  //     status: "unread"
  //   },
  //   {
  //     date: "2020-02-13",
  //     contact_person_name: "brahmadeo",
  //     address: "Kolkata",
  //     mobile: "9875422437",
  //     description: "description..",
  //     status: "read"
  //   },
  //   {
  //     date: "2020-02-13",
  //     contact_person_name: "brahmadeo",
  //     address: "Kolkata",
  //     mobile: "9875422437",
  //     description: "description..",
  //     status: "completed"
  //   }
  // ]
  today: string
  yesterday: string
  tomorrow: string
  checked_date: string
  userId: string = ''
  date: Date


  // Create schedule by sales person
  name = ''
  contact_person = ''
  mobile = ''
  address = ''
  user_id = ''
  create_date = ''
  create_time =''
  description = ''
  showCreate_date = ''
  selectedDate = ''
  isCreatingSchedule = false
  isShowSpinner = false

  isUserAttended = false

  url: string = "http://laraveldevelopers.website/dev21/uhk/public/api/get-appointment";

  addAppointUrl = "http://laraveldevelopers.website/dev21/uhk/public/api/add-appointment";

  
  validation_messages = {
    'name':[{type:'required', message: 'Name required'}],
    'contact_person':[{type:'required', message: 'Contact Person Name required'}],
    'mobile':[{type:'required', message: 'Phone required'}],
    'address':[{type:'required', message: 'Address required'}],
    'create_date':[{type:'required', message: 'Date required'}],
    'create_time':[{type:'required', message: 'Time required'}],
    //'subject':[{type:'required', message: 'Write a comment'}],
    'description': [{type: 'required', message: 'Write a comment'}]
  }

   myform: FormGroup;

  constructor(private router: Router, private datepipe: DatePipe, private navParam: NavController, private http:  HttpClient, private apiService: ApiService, private toastController: ToastController, private formBuilder: FormBuilder, private datePicker: DatePicker) { 
    this.date=new Date();
    this.checked_date =this.datepipe.transform(this.date, 'dd-MM-yyyy');
    this.apiCallForSchedule();
    
    //this.userId = window.localStorage.getItem('user_id');
    //console.log('user iddd '+window.localStorage.getItem('user_id'));

    console.log("constructor called when back")
    if(this.router.getCurrentNavigation().extras.state){
      this.isUserAttended = this.router.getCurrentNavigation().extras.state.special;
    }
    console.log("user attend: "+ this.isUserAttended)

    this.myform = formBuilder.group({
      name: new FormControl('',[Validators.required]),
      contact_person: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      create_date: new FormControl('', [Validators.required]),
      create_time: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required])
      
    })
   
  }

  ngOnInit() {
    
  }
  
  // form fill up by sales person
  formSubmit(){
    
    console.log(this.myform.value.name+" ", this.myform.value.description);
    this.createSchedule()
  }

  // Date picker
  ChooseDate(event){
    var  options = {
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }
    this.datePicker.show(options).then((date)=>{
      this.selectedDate = this.datepipe.transform(date, "dd-MM-yyyy");
    })
  }
  // Api search schedule
  ApiCallForSearchSchedule(){

    if (this.apiService.getNetworkStatus) {
      this.result = []
      this.showSpinner = true
      console.log('here '+this.userId, this.checked_date);
      let postData = {
        user_id: window.localStorage.getItem('user_id'),
        date: this.selectedDate
        //date: this.latest_date
      }

      this.apiService.ApiCall('POST', this.url, postData).subscribe(data =>{
        if(data.Ack === 1){
          this.showSpinner = false
          //console.log("dataaa", data.data)
          this.result = data.data;
          console.log("resultArray: ", data.data)
          //document.getElementById('comment_id').innerHTML = data.data.metting_description
        }else if(data.Ack === 0){
          this.showSpinner = false
        }
      }, error =>{
        this.showSpinner = false
      });
      
    }else{
      this.presentToast("Please check your internet connection!");
    }
  }

  todayCheck(){
    this.isCreatingSchedule = false
    this.date=new Date();
    this.checked_date =this.datepipe.transform(this.date, 'dd-MM-yyyy');
    this.apiCallForSchedule();
    console.log(this.checked_date)
  }

  tomorrowCheck(){
    this.isCreatingSchedule = false
    this.date=new Date();
    this.checked_date = this.datepipe.transform(this.date.setDate(this.date.getDate() + 1),'dd-MM-yyyy');
    this.apiCallForSchedule();
    console.log(this.checked_date)
  }

  prevCheck(){
    this.isCreatingSchedule = false
    this.date=new Date();
    this.checked_date = this.datepipe.transform(this.date.setDate(this.date.getDate() - 1),'dd-MM-yyyy');
    this.apiCallForSchedule();
    console.log(this.checked_date)
  }
  // Api call for getting schedule
  
  apiCallForSchedule(){
    if (this.apiService.getNetworkStatus) {
      this.result = []
      this.showSpinner = true
      console.log('here '+this.userId, this.checked_date);
      let postData = {
        user_id: window.localStorage.getItem('user_id'),
        date: this.checked_date
        //status: "Unread"
        //date: this.latest_date
      }
      this.apiService.ApiCall('POST', this.url, postData).subscribe(data =>{
        if(data.Ack === 1){
          this.showSpinner = false
          console.log("dataaa", data.data)
          this.result = data.data;
          //document.getElementById('comment_id').innerHTML = data.data.metting_description
        }else if(data.Ack === 0){
          this.showSpinner = false
        }
      }, error =>{
        this.showSpinner = false
      });
      
    }else{
      this.presentToast("Please check your internet connection!");
    }

  }

  createIconClicked(){
    this.isCreatingSchedule = true;
  }
  // Schedule creating by sales person
  createSchedule(){
    this.showSpinner = true
    console.log("description: " + this.myform.value.description+" "+this.myform.value.name+" "+this.myform.value.contact_person+" "+
    this.myform.value.create_date+" "+this.myform.value.create_time+" "+this.myform.value.address+" "+this.myform.value.mobile+" "+window.localStorage.getItem('user_id'));
   

    let postData = {
        "name": this.myform.value.name,
        "contact_person_name": this.myform.value.contact_person,
        "date": this.myform.value.create_date,
        "time": this.myform.value.create_time,
        "address": this.myform.value.address,
        "mobile": this.myform.value.mobile,
        "sales_person": window.localStorage.getItem('user_id'),
        "description": this.myform.value.description
    }

    this.apiService.ApiCall("POST", this.addAppointUrl, postData).subscribe(data =>{
      console.log("ack:  "+data.Ack);
      if (data.Ack === 1) {
        this.presentToast(data.Message);
        this.showSpinner = false;
        this.isCreatingSchedule = false
        this.router.navigate(['/name'])
       // this.apiCallForSchedule();

      }else if(data.Ack === 0){
        this.showSpinner = false;
        this.presentToast(data.Message);
      }
    },error =>{
      console.log("error: "+ error);
      this.showSpinner = false;
    });
  }

  // update schedule
  goUpdateSchedule(item: any){
    console.log(item)
    let navigationExtras: NavigationExtras = {
      state: {
        special: item
      }
    };

    console.log("schedule "+ JSON.stringify(item))
    if(this.isUserAttended){
      this.router.navigate(['/work'], navigationExtras)
    }else{
      this.presentToast("You are absent today");
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
}
