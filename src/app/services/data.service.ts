import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  showMessage(message: string): void {
    alert(message);
  }
}
