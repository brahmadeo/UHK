import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private menuCtrl: MenuController
  ) {
    this.initializeApp();

  }

  goHome(){
    this.router.navigateByUrl('/Home1');
    this.menuCtrl.toggle();
  }

  goAbout(){
    this.router.navigateByUrl('/about');
    this.menuCtrl.toggle();
  }

  goServices(){
    this.router.navigateByUrl('/service');
    this.menuCtrl.toggle();
  }

  goNotice(){
    this.router.navigateByUrl('/notice');
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
    this.router.navigateByUrl('/login1');
    this.menuCtrl.toggle();
  }
  
  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.overlaysWebView(true);
      this.statusBar.styleLightContent();
    });
  }
}
