import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  message = '';
  name: string;
  password: string;
  subscription : Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
   this.subscription = this.authService.authenticationResultEvent.subscribe((result) => {
      if (result) {
        const url = this.activatedRoute.snapshot.queryParams['requested'];
        this.router.navigateByUrl(url);
      } else {
        this.message = 'Wrong username / password. Please try again.';
      }
    });
    this.authService.checkIfAlreadyAuthenticated();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    this.authService.authenticate(this.name, this.password);
  }
}
