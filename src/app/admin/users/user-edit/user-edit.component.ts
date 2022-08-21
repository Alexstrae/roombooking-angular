import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
  @Input()
  user: User;

  formUser: User;

  password: string = '';
  password2: string = '';
  nameIsValid = false;
  passwordIsNotBlank = false;
  password2DoesMatch = false;
  message: string;
  @Output()
  dataChangedEvent = new EventEmitter();

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.formUser = Object.assign({}, this.user);
    this.checkIfNameIsValid();
    this.checkifPasswordIsValid();
  }

  onSubmit() {
    this.message = 'saving...';
    if (this.formUser.id == null) {
      this.dataService.addUser(this.formUser, this.password).subscribe((u) => {
        this.dataChangedEvent.emit();
        this.router.navigate(['admin', 'users'], {
          queryParams: { action: 'view', id: u.id },
        });
      }, error => this.message = 'Something went wrong.');
    } else {
      this.dataService.updateUser(this.formUser).subscribe((user) => {
        this.dataChangedEvent.emit();
        this.router.navigate(['admin', 'users'], {
          queryParams: { action: 'view', id: user.id },
        });
      }, error => this.message = 'Something went wrong.');
    }
  }

  checkIfNameIsValid() {
    if (this.formUser.name) {
      this.nameIsValid = this.formUser.name.trim().length > 0;
    } else {
      this.nameIsValid = false;
    }
  }

  checkifPasswordIsValid() {
    if (this.formUser.id != null) {
      this.passwordIsNotBlank = true;
      this.password2DoesMatch = true;
    }
    this.passwordIsNotBlank = this.password.trim().length > 0;
    this.password2DoesMatch = this.password === this.password2;
  }
}
