import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { ToastService } from './../services/toast.service';
import { first } from 'rxjs/operators';
import * as _ from "lodash";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  postData = {
    username: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit() { }

  validateInputs() {
    let username = this.postData.username.trim();
    let password = this.postData.password.trim();
    return (
      this.postData.username &&
      this.postData.password &&
      username.length > 0 &&
      password.length > 0
    );
  }

  loginAction() {
    if (this.validateInputs()) {
     
      this.authService.login(this.postData.username.trim(), this.postData.password.trim())
      .pipe(first())
      .subscribe(
        data => {
            console.log('data: ', data);
            this.router.navigate(['admin']);
        },
        error => {
          this.toastService.presentToast('Network Issue.');
          console.log('Network Issue.');
        }
      );
    } else {
      this.toastService.presentToast('Please enter username or password.');
      console.log('Please enter email/username or password.');
    }
  }
}
