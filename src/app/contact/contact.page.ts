import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  inputFirstname: string = "";
  inputLastname: string = "";
  inputSubject: string = "";
  inputMessage: string = "";

  //myform = {};
  constructor(private router: Router) { }

  ngOnInit() { 
  }

  logForm(){
    console.log("my form");
  }

  go(){
    console.log(this.inputFirstname);
  	this.router.navigate(['/login1']);
  }

}
