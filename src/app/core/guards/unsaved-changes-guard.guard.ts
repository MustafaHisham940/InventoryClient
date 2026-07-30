import { CanDeactivateFn } from '@angular/router';
import { Injectable } from '@angular/core';



export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}
export const unsavedChangesGuardGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  return component.canDeactivate ? component.canDeactivate() : true; 
};
