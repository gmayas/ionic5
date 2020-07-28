import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser$: BehaviorSubject<any> = new BehaviorSubject(null);
  private authState$: BehaviorSubject<any> = new BehaviorSubject(false);
  private signingOut$: BehaviorSubject<any> = new BehaviorSubject(false);
  constructor(private http: HttpClient, private router: Router) {
    this.currentUser$.next(this.getCurrentUser());
    this.authState$.next(this.isLoggedIn());
    this.signingOut$.next(this.isSigningOut());
   }

    // Regresa el estado de si esta loggeado o no, pero como observer
  public isAuthenticated(): any {
    return this.authState$;
  }

  // Regresa cualquier cambio en el objeto de usuario, como observer
  public user(): any {
    return this.currentUser$;
  }

  // Regresa el usuario actual obtenido del local storage
  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    const jwtToken = localStorage.getItem('jwtToken');
    if (!user || !jwtToken) {
      return false;
    }
    return JSON.parse(user);
  }

  // Regresa si esta o no logeado actualmente a modo de estatico
  isLoggedIn() {
    return !!this.getCurrentUser();
  }

  isSigningOut() {
    return this.signingOut$;
  }

  login(emailuser: any, passworduser: any) {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        app: "APP_BCK",
        password: passworduser
     });
         
    return this.http.put(`https://dev.tuten.cl/TutenREST/rest/user/${encodeURIComponent(emailuser)}`,
                         { app: "APP_BCK", email: emailuser, password: passworduser },  { headers } )  
    .pipe(map((user: any) => {
        console.log('user Login: ', user);
        if (!user.active) { this.logout(); return Promise.reject(user); }
        localStorage.setItem('jwtToken', user.sessionTokenBck);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser$.next(user);
        this.authState$.next(user.active);
        this.signingOut$.next(!user.active);
        return user;
      }, (error: any) => {
        this.logout();
        console.log('error profile: ', error)
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    localStorage.removeItem('jwtToken');
    this.currentUser$.next(null);
    this.authState$.next(false);
    this.signingOut$.next(true);
  }
}