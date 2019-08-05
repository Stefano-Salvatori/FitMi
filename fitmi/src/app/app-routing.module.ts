import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { NotFoundResourceComponent } from './not-found-resource/not-found-resource.component';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { TabsComponent } from './tabs/tabs.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sign-in', component: SignInComponent },
  {
    path: 'tabs', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: '**', component: NotFoundResourceComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
