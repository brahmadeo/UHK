import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'slideshow', pathMatch: 'full' },
  { path: 'slideshow', loadChildren: () => import('./slideshow/slideshow.module').then( m => m.SlideshowPageModule)},
  { path: 'home1', loadChildren: './home1/home1.module#Home1PageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'clientele', loadChildren: './clientele/clientele.module#ClientelePageModule' },
  { path: 'service', loadChildren: './service/service.module#ServicePageModule' },
  { path: 'service/:id', loadChildren: './service-inner/service-inner.module#ServiceInnerPageModule' },
  { path: 'contact', loadChildren: './contact/contact.module#ContactPageModule' },
  { path: 'service', loadChildren: './service/service.module#ServicePageModule' },
  { path: 'work', loadChildren: './work/work.module#WorkPageModule' },
  { path: 'about', loadChildren: './about/about.module#AboutPageModule' },
  { path: 'schedule', loadChildren: './schedule/schedule.module#SchedulePageModule' },
  { path: 'login1', loadChildren: './login1/login1.module#Login1PageModule' },
  { path: 'notice', loadChildren: './notice/notice.module#NoticePageModule' },
  { path: 'name', loadChildren: './name/name.module#NamePageModule' },
  { path: 'google-map', loadChildren: './google-map/google-map.module#GoogleMapPageModule' },
  { path: 'forgotpassword', loadChildren: './forgotpassword/forgotpassword.module#ForgotpasswordPageModule' },
  { path: 'changepassword', loadChildren: './changepassword/changepassword.module#ChangepasswordPageModule' },
  { path: 'feedback', loadChildren: './feedback/feedback.module#FeedbackPageModule' },
  { path: 'givefeedback', loadChildren: './givefeedback/givefeedback.module#GivefeedbackPageModule' },
  { path: 'address', loadChildren: './address/address.module#AddressPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
