import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { NotFoundResourceComponent } from './not-found-resource/not-found-resource.component';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { TabsComponent } from './tabs/tabs.component';

import { RunningComponent } from './session/running/running.component';
import { WalkingComponent } from './session/walking/walking.component';
import { CyclingComponent } from './session/cycling/cycling.component';
import { GymComponent } from './session/gym/gym.component';
import { SwimmingComponent } from './session/swimming/swimming.component';
import { IndoorRunComponent } from './session/indoor-run/indoor-run.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'tabs', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) },
  { path: 'running', component: RunningComponent },
  { path: 'walking', component: WalkingComponent },
  { path: 'cycling', component: CyclingComponent },
  { path: 'gym', component: GymComponent },
  { path: 'swimming', component: SwimmingComponent },
  { path: 'indoor-run', component: IndoorRunComponent },
  { path: '**', component: NotFoundResourceComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
