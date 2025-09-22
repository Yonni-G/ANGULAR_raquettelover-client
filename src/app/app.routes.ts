import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SigninComponent } from './pages/auth/signin/signin.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { PlayerHomeComponent } from './pages/dashboard/player/player-home/player-home.component';
import { AuthGuard } from './guards/auth.guard';
import { PlaceListComponent } from './pages/dashboard/place/place-list/place-list.component';
import { PlaceFormComponent } from './pages/dashboard/place/place-form/place-form.component';
import { CourtFormComponent } from './pages/dashboard/court/court-form/court-form.component';
import { Error404Component } from './pages/error-404/error-404.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'signup/:signUpAs',
    component: SignupComponent,
  },
  {
    path: 'dashboard',
    children: [
      {
        path: 'place',
        children: [
          {
            path: 'list',
            component: PlaceListComponent,
          },
          {
            path: 'create',
            component: PlaceFormComponent,
          },
          {
            path: ':placeId/edit',
            component: PlaceFormComponent,
          },
          {
            path: ':placeId/court',
            children: [
              {
                path: 'create',
                component: CourtFormComponent,
              },
              {
                path: ':courtId/edit',
                component: CourtFormComponent,
              },
            ],
          },
        ],
        data: { roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] },
        canActivate: [AuthGuard],
      },
      {
        path: 'player',
        children: [
          {
            path: '',
            component: PlayerHomeComponent,
          },
        ],
        data: { roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_USER'] },
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: '404',
    component: Error404Component,
  },
  { path: '**', component: Error404Component },
];
