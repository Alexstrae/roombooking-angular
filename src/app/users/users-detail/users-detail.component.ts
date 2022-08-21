import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-users-detail',
  templateUrl: './users-detail.component.html',
  styleUrls: ['./users-detail.component.css'],
})
export class UsersDetailComponent implements OnInit {
  @Input()
  user!: User;

  @Output()
  datachangedEvent = new EventEmitter();

  message: string;

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit(): void {}

  editUser() {
    this.router.navigate(['admin', 'users'], {
      queryParams: { action: 'edit', id: this.user.id },
    });
  }

  deleteUser(id: number) {
    this.dataService.deleteUser(id).subscribe(
      (next) => {
        this.datachangedEvent.emit();
        this.router.navigate(['admin', 'users']);
      },
      (error) => (this.message = 'Sorry - something went wrong')
    );
  }

  resetPassword(id: number) {
    this.dataService.resetUserPassword(id).subscribe(
      (next) => {
        this.message = 'The password has been reset';
      },
      (error) => {
        this.message = 'Sorry - something went wrong';
      }
    );
  }
}
