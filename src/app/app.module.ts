import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { CalendarComponent } from './calendar/calendar.component';
import { RoomsComponent } from './admin/rooms/rooms.component';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RoomDetailComponent } from './admin/rooms/room-detail/room-detail.component';
import { UsersDetailComponent } from './users/users-detail/users-detail.component';
import { UsersComponent } from './users/users.component';
import { UserEditComponent } from './admin/users/user-edit/user-edit.component';
import { RoomEditComponent } from './admin/rooms/room-edit/room-edit.component';
import { EditBookingComponent } from './calendar/edit-booking/edit-booking.component';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { HttpClientModule } from '@angular/common/http';
import { PrefetchRoomsService } from './prefetch-rooms.service';
import { PrefetchUsersService } from './prefetch-users.service';
import { LoginComponent } from './login/login.component';
import { AuthRouteGuardService } from './auth-route-guard.service';

registerLocaleData(localeDe);

const routes: Routes = [
  {path : 'admin/users', component : UsersComponent, canActivate : [AuthRouteGuardService]},
  {path : 'admin/rooms', component : RoomsComponent, canActivate : [AuthRouteGuardService]},
  {path: '', component: CalendarComponent},
  {path: 'login', component : LoginComponent},
  {path: '404', component: PageNotFoundComponent},
  {path: 'booking', component : EditBookingComponent, canActivate : [AuthRouteGuardService], resolve : {rooms : PrefetchRoomsService, users : PrefetchUsersService}},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    CalendarComponent,
    RoomsComponent,
    UsersComponent,
    PageNotFoundComponent,
    RoomDetailComponent,
    UsersComponent,
    UsersDetailComponent,
    UserEditComponent,
    RoomEditComponent,
    EditBookingComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
