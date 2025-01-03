import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { IndividualConfig } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastr = inject(ToastrService);
  private readonly toastPosition = environment.TOASTR_POSITION;
  private readonly toastTimeout = environment.TOASTR_TIMEOUT;


  constructor() { }


  success(message: string, title: string = 'Success') {
    this.toastr.success(message, title, {
      positionClass: this.toastPosition,
      timeOut: this.toastTimeout
    });
  }

  error(message: string, title: string = 'Error') {
    this.toastr.error(message, title, {
      positionClass: this.toastPosition,
      timeOut: this.toastTimeout
    });
  }

  info(message: string, title: string = 'Info') {
    this.toastr.info(message, title, {
      positionClass: this.toastPosition,
      timeOut: this.toastTimeout
    });
  }

  warning(message: string, title: string = 'Warning') {
    this.toastr.warning(message, title, {
      positionClass: this.toastPosition,
      timeOut: this.toastTimeout
    });
  }


}
