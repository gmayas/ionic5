import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from 'rxjs/operators';
import * as _ from "lodash";
import { ToastService } from './../services/toast.service';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, private router: Router, private auth: AuthService, private toastService: ToastService) {
  }

  getBookings(emailUser) {
    try {
     let headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'token': localStorage.getItem('jwtToken'),
          adminemail: emailUser,
          app: "APP_BCK",
        });
      let params: any = 'current=true';
      //
      return this.http.get(`https://dev.tuten.cl/TutenREST/rest/user/${encodeURIComponent('contacto@tuten.cl')}/bookings?${ params }`, { headers }  )
        .pipe(map((data: any) => {
          console.log('data admin: ', data)
          return data;
        }, error => {
          this.auth.logout();
          this.router.navigate(['home']);
          this.toastService.presentToast('Network Issue.');
          console.log('error getBookings: ', error)
        }));
    } catch (e) {
      console.log('error getBookings: ', e)
    }
  }
   
}
