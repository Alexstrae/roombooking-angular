import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { Booking } from '../model/Booking';
import { User } from '../model/User';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  bookings: Array<Booking>;
  selectedDate: string;
  message: string;
  dataLoaded = false;

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.processQueryParams();
  }

  private processQueryParams() {
    this.route.queryParams.subscribe((params) => {
      this.message = '';
      this.selectedDate = params['date'];
      if (!this.selectedDate) {
        this.selectedDate = formatDate(new Date(), 'yyyy-MM-dd', 'de_DE');
      }
      this.loadData();
    });
  }

  private loadData() {
    this.dataService.getBookings(this.selectedDate).subscribe((bookings) => {
      this.bookings = bookings;
      this.dataLoaded = true;
    });
  }

  editBooking(id: number) {
    this.router.navigate(['booking'], { queryParams: { id, action: 'edit' } });
  }

  addBooking() {
    this.router.navigate(['booking'], { queryParams: { action: 'add' } });
  }

  deleteBooking(id: number) {
    this.message = 'deleting...';
    this.dataService.deleteBooking(id).subscribe(
      (next) => {
        this.loadData();
        this.router.navigate(['']);
        this.message = '';
      },
      (error) => {
        this.message = 'Sorry - something went wrong';
      }
    );
  }

  dateChanged() {
    this.router.navigate([''], { queryParams: { date: this.selectedDate } });
  }
}
