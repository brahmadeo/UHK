import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GivefeedbackPage } from './givefeedback.page';

const routes: Routes = [
  {
    path: '',
    component: GivefeedbackPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GivefeedbackPage]
})
export class GivefeedbackPageModule {}
