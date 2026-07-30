import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetailsHdrsSharedSignalsService {

  HeaderValue = signal<any>(null);
  constructor() { }
  setHeaderValue(item: any) {
    this.HeaderValue.set(item);
    console.log("Signalllll !!!!!!!!!",item)
  }
}
