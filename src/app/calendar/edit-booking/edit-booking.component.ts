import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { map } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { Booking } from 'src/app/model/Booking';
import { Layout, Room } from 'src/app/model/Room';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-edit-booking',
  templateUrl: './edit-booking.component.html',
  styleUrls: ['./edit-booking.component.css'],
})
export class EditBookingComponent implements OnInit {
  booking: Booking;
  action: string;
  bookingForm: UntypedFormGroup;
  users: Array<User>;
  layouts = Layout;
  rooms: Array<Room>;
  @Input()
  selectedUser: User;
  @Input()
  selectedRoom: Room;
  dataLoaded = false;
  message = 'Please wait...';

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rooms = this.route.snapshot.data['rooms'];
    this.users = this.route.snapshot.data['users'];
    this.route.queryParamMap.subscribe((params) => {
      const id = params.get('id');
      if (id != null) {
        this.loadBooking(id);
      }
      const action = params.get('action');
      if (action === 'add') {
        this.booking = new Booking();
        this.dataLoaded = true;
        this.message = '';
        this.action = 'edit';
      }
    });
  }

  private loadBooking(id: string) {
    this.dataService
      .getBooking(id)
      .pipe(
        map((booking) => {
          booking.room = this.rooms.find(
            (room) => room.id === booking.room.id
          )!;
          booking.user = this.users.find(
            (user) => user.id === booking.user.id
          )!;
          return booking;
        })
      )
      .subscribe((next) => {
        this.booking = next;
        this.dataLoaded = true;
        this.message = '';
        this.createBookingForm();
      });
  }

  private createBookingForm() {
    this.bookingForm = this.formBuilder.group({
      date: this.booking.date,
      startTime: this.booking.startTime,
      endTime: this.booking.endTime,
      participants: this.booking.participants,
      title: this.booking.title,
      room: this.booking.room,
      layout: this.booking.layout,
      user: this.booking.user,
    });
  }

  onSubmit() {
    this.booking.title = this.bookingForm.controls['title'].value;
    this.booking.date = this.bookingForm.controls['date'].value;
    this.booking.startTime = this.bookingForm.controls['startTime'].value;
    this.booking.endTime = this.bookingForm.controls['endTime'].value;
    this.booking.participants = this.bookingForm.controls['participants'].value;
    this.booking.room = this.bookingForm.controls['room'].value;
    this.booking.user = this.bookingForm.controls['user'].value;
    this.booking.layout = this.bookingForm.controls['layout'].value;
    if (this.booking.id == null) {
      this.dataService
        .addBooking(this.booking)
        .subscribe((booking) => this.router.navigate(['']));
    } else {
      this.dataService
        .editBooking(this.booking)
        .subscribe((booking) => this.router.navigate(['']));
    }
  }
}
