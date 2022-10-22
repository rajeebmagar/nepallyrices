import { ContributeComponent } from "app/contribute/contribute.component";
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class CanLeaveContribute implements CanDeactivate<ContributeComponent> {
    canDeactivate(
    component: ContributeComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
      if(component.validForNewSong && !component.addedNewSong){
         var canDeactivate = confirm('Are you sure you want to leave without saving your work?');
         return canDeactivate;
      }
      return true;
  }
}
