import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-inner',
  templateUrl: './service-inner.page.html',
  styleUrls: ['./service-inner.page.scss'],
})
export class ServiceInnerPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  go(){
  	this.router.navigate(['/clientele'])
  }

}
