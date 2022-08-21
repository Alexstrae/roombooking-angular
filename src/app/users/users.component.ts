import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UserEditComponent } from '../admin/users/user-edit/user-edit.component';
import { DataService } from '../data.service';
import { User } from '../model/User';
import { UsersDetailComponent } from './users-detail/users-detail.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users!: Array<User>;
  selectedUser!: User;
  action!: string;
  @ViewChild('userEditComponent') private userEditComponent: UserEditComponent;
  message = 'Please wait. Getting the list of users';
  reloadAttempts = 0;
  loadingData = true;

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private processUrlParams() {
    this.route.queryParamMap.subscribe((params) => {
      this.action = '';
      const id = params.get('id');
      const action = params.get('action');
      if (id) {
        const user = this.users.find((user) => user.id === +id);
        if (user) {
          this.selectedUser = user;
        }
      }
      if (action) {
        this.action = action;
      }
    });
  }

   loadData() {
    this.dataService.getUsers().subscribe({
      next: (next) => {this.users = next; this.loadingData = false; this.processUrlParams();},
      error: (error) => {
        this.message = 'Sorry - something went wrong, trying again...';
        this.reloadAttempts++;
        if (this.reloadAttempts <= 10) {
          this.loadData();
        } else {
          this.message =
            'Sorry - something went wrong, please contact support.';
        }
      },
    });
  }

  addUser() {
    this.selectedUser = new User();
    this.router.navigate(['admin', 'users'], {
      queryParams: { action: 'add' },
    });
  }

  viewUserDetails(id: number) {
    this.router.navigate(['admin', 'users'], {
      queryParams: { id, action: 'view' },
    });
  }
}
