import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-notice',
  templateUrl: './notice.page.html',
  styleUrls: ['./notice.page.scss'],
})
export class NoticePage implements OnInit {


  validation_messages = {
    'name':[{type:'required', message: 'Name required'}],
    'email':[{type:'required', message: 'Email required'}],
    'phone':[{type:'required', message: 'Phone required'}],
    //'address':[{type:'required', message: 'Firstname required'}],
    'qualification':[{type:'required', message: 'Qualification required'}],
    'skill':[{type:'required', message: 'Skills required'}],
    'photo':[{type:'required', message: 'Choose photo'}]
  }

  myform: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder) { 
    this.myform = formBuilder.group({
      name: new FormControl('',[Validators.required]),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      qualification: new FormControl('', [Validators.required]),
      skill: new FormControl('', [Validators.required]),
      photo: new FormControl('', [Validators.required])
    })
  }

  ngOnInit() {
  }

  go(){
  	this.router.navigate(['/contact'])
  }
  formSubmit(){
    console.log(this.myform.value.name+" ", this.myform.value.email);
  }

}
