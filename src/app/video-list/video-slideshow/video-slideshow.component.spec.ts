import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoSlideshowComponent } from './video-slideshow.component';

describe('VideoSlideshowComponent', () => {
  let component: VideoSlideshowComponent;
  let fixture: ComponentFixture<VideoSlideshowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoSlideshowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideoSlideshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
