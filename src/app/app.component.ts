import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, NavigationExtras } from '@angular/router';
import { MenuController, Events } from '@ionic/angular';
import { from } from 'rxjs';

//import { Userdata } from '../app/Provider/Userdata';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent {
  loggedIn = false
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private menuCtrl: MenuController,
    private events: Events
    
  ) {
    this.initializeApp();
    console.log("user_id logged in "+window.localStorage.getItem('user_id'));

    // if(window.localStorage.getItem("user_id")){
    //   this.loggedIn = true;
    // }

    this.events.subscribe('userData', (data)=>{
      console.log("dataaa "+ data)
      if(data === 'login'){
        this.loggedIn = true
      }else if(data === "logout"){
        this.loggedIn = false
      }
           // will show the log out button now
    })
  }
  // async ngOnInit(){
  //   this.checkLoginStatus();
  //   this.listenForLoginEvents();
  // }

  goRouteChange(event){
    console.log("asas "+event)
  }

  goHome(){
    let navigationExtra : NavigationExtras = {
      state:{
        cmsId : 1
      }
    }
    this.router.navigate(['/home1'], navigationExtra);
    this.menuCtrl.toggle();
  }

  goAbout(){
    let navigationExtra : NavigationExtras = {
      state:{
        cmsId : 2
      }
    }
    this.router.navigate(['/about'], navigationExtra);
    this.menuCtrl.toggle();
  }

  goServices(){
    this.router.navigateByUrl('/service');
    this.menuCtrl.toggle();
  }

  goNotice(){
    let navigationExtra : NavigationExtras = {
      state:{
        cmsId : 3
      }
    }
    this.router.navigate(['/notice'], navigationExtra);
    this.menuCtrl.toggle();
  }

  goClientele(){
    this.router.navigateByUrl('/clientele');
    this.menuCtrl.toggle();
  }

   goContact(){
    this.router.navigateByUrl('/contact');
    this.menuCtrl.toggle();
  }

  goSalesLogin(){
    if(window.localStorage.getItem("user_id")!=null){
      this.router.navigateByUrl('/name');
    }else{
      this.router.navigateByUrl('/login1');
    }
    this.menuCtrl.toggle();
  }
  goFeedback(){
    this.router.navigateByUrl('/feedback');
    this.menuCtrl.toggle();
  }
  goAddress(){
    let navigationExtra : NavigationExtras = {
      state:{
        cmsId : 4
      }
    }
    this.router.navigate(['/address'], navigationExtra);
    this.menuCtrl.toggle();
  }
  logout(){
    window.localStorage.clear();
    this.events.publish("userData", "logout")
    this.router.navigateByUrl('/login1')
    this.menuCtrl.toggle();
  }
  
  initializeApp() {
    this.platform.ready().then(() => {
      console.log(" called 33");
      // this.statusBar.overlaysWebView(true);
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
    });
  }

  // checkLoginStatus() {
  //   console.log("login status checked")
  //   return this.userdata.isLoggedIn().then(loggedIn => {
  //     return this.updateLoggedInStatus(loggedIn);
  //   });
  // }

  // updateLoggedInStatus(loggedIn: boolean) {
  //   setTimeout(() => {
  //     this.loggedIn = loggedIn;
  //   }, 300);
  // }

  // listenForLoginEvents() {
  //   console.log("listen called ")
  //   window.addEventListener('user:login', () => {
  //     this.updateLoggedInStatus(true);
  //   });

  //   window.addEventListener('user:signup', () => {
  //     this.updateLoggedInStatus(true);
  //   });

  //   window.addEventListener('user:logout', () => {
  //     this.updateLoggedInStatus(false);
  //   });
  // }
}
