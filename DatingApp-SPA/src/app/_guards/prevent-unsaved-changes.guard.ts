import { Injectable, Component } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { Observable } from 'rxjs';

@Injectable()
export class PreventUnsavedChanges
  implements CanDeactivate<MemberEditComponent>
{
  canDeactivate(component: MemberEditComponent) {
    if (component.editForm.dirty) {
      return confirm(
        'Are You Sure you want to continue? Any usaved changes will be lost'
      );
    }
    return true;
  }
}
