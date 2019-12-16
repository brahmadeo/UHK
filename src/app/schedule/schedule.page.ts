import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { NavController } from '@ionic/angular';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  radio = "today";
  showSpinner = true;
  result = []
  today: string
  yesterday: string
  tomorrow: string
  checked_date: string

  userId: string = ''

  date: Date

  url: string = "http://laraveldevelopers.website/dev21/uhk/public/api/get-appointment";

  constructor(private router: Router, private datepipe: DatePipe, private navParam: NavController, private http:  HttpClient, private apiService: ApiService) { 
    this.date=new Date();
    this.checked_date =this.datepipe.transform(this.date, 'yyyy-MM-dd');
    this.apiCallForSchedule();

    //this.userId = window.localStorage.getItem('user_id');
    console.log('user iddd '+window.localStorage.getItem('user_id'));

  }

  ngOnInit() {

  }

  todayCheck(){
    this.date=new Date();
    this.checked_date =this.datepipe.transform(this.date, 'yyyy-MM-dd');
    this.apiCallForSchedule();
    console.log(this.checked_date)
  }
  tomorrowCheck(){
    this.date=new Date();
    this.checked_date = this.datepipe.transform(this.date.setDate(this.date.getDate() + 1),'yyyy-MM-dd');
    this.apiCallForSchedule();
    console.log(this.checked_date)
  }
  prevCheck(){
    this.date=new Date();
    this.checked_date = this.datepipe.transform(this.date.setDate(this.date.getDate() - 1),'yyyy-MM-dd');
    this.apiCallForSchedule();
    console.log(this.checked_date)
  }


  go(){
  	this.router.navigate(['/work'])
  }
  // Api call for getting schedule
  apiCallForSchedule(){
    this.result = []
    this.showSpinner = true
    console.log('here '+this.userId, this.checked_date);
    let postData = {
      user_id: window.localStorage.getItem('user_id'),
      date: this.checked_date
      //date: this.latest_date
    }

    this.apiService.ApiCall('POST', this.url, postData).subscribe(data =>{
      if(data.Ack === 1){
        this.showSpinner = false
        this.result = data.data;
      }else if(data.Ack === 0){
        this.showSpinner = false
      }
    }, error =>{
      this.showSpinner = false
    });

  }
  goUpdateSchedule(item: any){
    console.log(item-1)
    let navigationExtras: NavigationExtras = {
      state: {
        special: this.result[item-1]
      }
    };
    console.log("schedule "+ JSON.stringify(this.result[item-1]))
    this.router.navigate(['/work'], navigationExtras)
  }
}
