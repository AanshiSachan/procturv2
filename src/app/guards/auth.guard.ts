import { Injectable } from '@angular/core';
import { Route, Router, CanActivate, CanLoad ,ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { tr } from '../../assets/imported_modules/ngx-bootstrap/bs-moment/i18n/tr';

/* For future purpose when routing will be allowed only if router is activated */

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('clientData')) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url and return false
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    canLoad(route: Route): boolean {
        let url = `/${route.path}`;

        return this.checkLogin(url);
    }


    checkLogin(string): boolean{
        
        if((sessionStorage.getItem('Authorization') != null)&&sessionStorage.getItem('institute_id') != null){

            if(string.indexOf('enquiry') >= 0){
                //alert('enquiry routed');
                return true;
            }
            else if(string.indexOf('student') >= 0){
                //alert('student routed');
                return true;
            }
            else if(string.indexOf('custom') >= 0){
                //alert('custom routed');
                return true;
            }
            else if(string.indexOf('campaign') >= 0){
                //alert('campaign routed');
                return true;
            }
            else if(string.indexOf('course') >= 0){
                //alert('campaign routed');
                return true;
            }
            else if(string.indexOf('reports') >= 0){
                //alert('campaign routed');
                return true;
            }
        }
        else{
            return false;
        }

    }

}
