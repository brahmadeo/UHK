import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'slideshow', pathMatch: 'full' },
  { path: 'slideshow', loadChildren: () => import('./slideshow/slideshow.module').then( m => m.SlideshowPageModule)},
  { path: 'home1', loadChildren: './home1/home1.module#Home1PageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'clientele', loadChildren: './clientele/clientele.module#ClientelePageModule' },
  { path: 'service-inner', loadChildren: './service-inner/service-inner.module#ServiceInnerPageModule' },
  { path: 'contact', loadChildren: './contact/contact.module#ContactPageModule' },
  { path: 'service', loadChildren: './service/service.module#ServicePageModule' },
  { path: 'work', loadChildren: './work/work.module#WorkPageModule' },
  { path: 'about', loadChildren: './about/about.module#AboutPageModule' },
  { path: 'schedule', loadChildren: './schedule/schedule.module#SchedulePageModule' },
  { path: 'login1', loadChildren: './login1/login1.module#Login1PageModule' },
  { path: 'notice', loadChildren: './notice/notice.module#NoticePageModule' },
  { path: 'name', loadChildren: './name/name.module#NamePageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
