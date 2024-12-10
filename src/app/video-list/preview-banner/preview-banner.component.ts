import { Component, Input } from '@angular/core';
import { VideoService } from '../../video.service';
import { ConstantsService } from '../../constants.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preview-banner',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './preview-banner.component.html',
  styleUrl: './preview-banner.component.scss'
})
export class PreviewBannerComponent {

  list: any[] = [];
  apiBaseUrl: string = '';

  constructor(
    private VideoService: VideoService,
    private constants: ConstantsService
  ) {
    this.loadData();
    this.apiBaseUrl = this.constants.API_BASE_URL;
    setTimeout(() => {
      console.log(this.list);
      
    }, 1000);
  }

  loadData() {
    this.VideoService.fetchList().subscribe((data) => {
      this.list = data;
    });
  }
}
