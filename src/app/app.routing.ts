import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

const APP_ROUTES: Routes = [
  {path: '', component: AppComponent, pathMatch: 'full'}
]

export const routing = RouterModule.forRoot(APP_ROUTES);
