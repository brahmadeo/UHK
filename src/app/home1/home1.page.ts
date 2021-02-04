import { Component,ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController, Events } from '@ionic/angular';

import { IonSlides } from '@ionic/angular';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-home1',
  templateUrl: './home1.page.html',
  styleUrls: ['./home1.page.scss'],
})
export class Home1Page implements OnInit {
  @ViewChild('slideWithNav', { read: true, static: false }) slideWithNav: IonSlides;
sliderOne: any;

 slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay:true
  };
  url = "http://laraveldevelopers.website/dev21/uhk/public/api/cms-details";

  showSpinner = false;
  response = [];
  result = {};
  cmsId = 0

  constructor(private router: Router, private statusBar: StatusBar, private menu: MenuController, private apiService: ApiService,
     private events: Events) { 

      if(this.router.getCurrentNavigation().extras.state){
        this.cmsId = this.router.getCurrentNavigation().extras.state.cmsId;
        console.log("cms id: "+ this.cmsId);
        
      }

    //Item object for sliding
    this.sliderOne =
      {
        isBeginningSlide: true,
        isEndSlide: false,
        slidesItems: [
          {
            id: 1,
            image: '../../assets/images1/1.jpg'
          },
          {
            id: 2,
            image: '../../assets/images1/2.jpg'
          },
          {
            id: 3,
            image: '../../assets/images1/3.jpg'
          }
        ]
      };
  }

  ngOnInit() {
    this.apiCallForCms();
  }
  ionViewDidLoad(){ 
    this.events.publish('loggedin');
}


  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  } 

  //Move to Next slide
  slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  //Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });;
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
           document.getElementById("homeDescription").innerHTML = data.data.description;
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
}
