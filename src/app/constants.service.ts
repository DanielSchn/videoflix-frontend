import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor() { }

  API_BASE_URL: string = 'http://127.0.0.1:8000/';
  TOASTR_TIMEOUT: number = 300000;
  TOASTR_POSITION: string = 'toast-bottom-left';
}
