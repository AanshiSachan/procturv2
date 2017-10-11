import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
 
/* For future purpose when routing will be allowed only if router is activated */

@Injectable()
export class AuthGuard implements CanActivate {
 
    constructor(private router: Router) { }
 
    canActivate() {
        if (localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }
 
        // not logged in so redirect to login page
        this.router.navigate(['/login']);
        return false;
    }
}