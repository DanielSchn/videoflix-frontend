import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor() { }

  API_BASE_URL = 'http://127.0.0.1:8000/';
}
