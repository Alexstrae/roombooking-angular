import { EventEmitter, Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated = false;
  authenticationResultEvent = new EventEmitter<boolean>();
  role: string;

  constructor(private dataService: DataService) {}

  authenticate(name: string, password: string) {
    this.dataService.validateUser(name, password).subscribe(
      (next) => {
        this.setUpRole();
        this.isAuthenticated = true;
        this.authenticationResultEvent.emit(true);
      },
      (error) => {
        this.isAuthenticated = false;
        this.authenticationResultEvent.emit(false);
      }
    );
    return this.isAuthenticated;
  }

  setUpRole() {
    this.dataService.getRole().subscribe((next) => {
      console.log(next.role);
      this.role = next.role;
    });
  }

  checkIfAlreadyAuthenticated() {
    this.dataService.getRole().subscribe(next => {
      if(next.role !== '') {
        this.isAuthenticated = true;
        this.authenticationResultEvent.emit(true);
      }
    })
  }
}
