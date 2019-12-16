import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-clientele',
  templateUrl: './clientele.page.html',
  styleUrls: ['./clientele.page.scss'],
})
export class ClientelePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  go(){
  	this.router.navigate(['/notice'])
  }

}
