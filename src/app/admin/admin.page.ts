import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from "lodash";
import { UsersService } from 'src/app/services/users.service';
import { ToastService } from './../services/toast.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  public isAuth: boolean = false;
  public alive: boolean = true;
  public user: any;
  public Bookings: any
  constructor(public auth: AuthService, public userServ: UsersService, private route: ActivatedRoute,
    private router: Router,  private toastService: ToastService) {
    this.user = this.auth.user();
    this.getBookings(_.get(this.user.value, 'email')); 
  }

  ngOnInit() {
    
  }
  
  getBookings(emailUser) {
    this.userServ.getBookings(emailUser)
       .subscribe((data: any) => {
        this.Bookings = data;
        console.log('this.Bookings: ', this.Bookings);
      });
  }
}
