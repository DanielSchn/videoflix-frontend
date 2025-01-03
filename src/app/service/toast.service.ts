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


  /**
  * Displays different state notifications with the given message.
  * 
  * This method uses the `Toastr` service to display a success notification with the provided message. 
  * You can also customize the title, position, and timeout duration.
  * 
  * @param message The message to display in the notification.
  * @param title The title of the notification (default is "Success").
  */
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