import { Component, OnInit, OnChanges, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter, SimpleChanges, HostListener } from '@angular/core';
//import * as Croppie from 'croppie/croppie';
declare var Croppie: any;

@Component({
  selector: 'proctur-image',
  templateUrl: './picture-crop.component.html',
  styleUrls: ['./picture-crop.component.scss']
})

export class PictureCropComponent implements OnInit, OnChanges {

  @ViewChild('imgContainer') imgContainer: ElementRef;
  @ViewChild('uploadImage') uploadImage: ElementRef;
  @ViewChild('uploadedImage') uploadedImage: ElementRef;
  @ViewChild('overlay') overlay: ElementRef;
  @ViewChild('modalButton') modalButton: ElementRef;
  @ViewChild('cropper') cropper: ElementRef;
  @ViewChild('list') list: ElementRef;
  @ViewChild('video') video: ElementRef;
  @ViewChild('snap') snap: ElementRef;
  @ViewChild('cropButton') cropButton: ElementRef;
  @ViewChild('cross') cross: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;

  @Input() removeImg: boolean = false;
  @Input() containerWidth: string = '200px';
  @Input() containerHeight: string = '200px';
  @Input() readonly: boolean = false;
  @Input() serverImg: string;
  @Input() isSidenav: boolean = false;
  @Input() defaultImg: string = 'assets/images/bluecamera.png';

  @Output() getImage = new EventEmitter<boolean>();
  @Output() setImage = new EventEmitter<any>();

  vanilla: any;
  stream: any;
  imgPrefill = 'data:image/png;base64';
  isMenuVisible: boolean = false;
  isCropper: boolean = false;
  isVideo: boolean = false
  isCanvas: boolean = false;
  isSnap: boolean = false;
  isCrop: boolean = false;

  constructor(private renderer: Renderer2, private eRef: ElementRef) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if(this.isSidenav){
      this.imgContainer.nativeElement.classList.add("small")
    }
    this.setContainerSize();
    this.setReadOnly();
    this.setRemoveImg();
    this.setServerImg();
  }

  setContainerSize() {
    this.imgContainer.nativeElement.style.width = this.containerWidth;
    this.imgContainer.nativeElement.style.height = this.containerWidth;
  }

  setReadOnly() {
  }

  setRemoveImg() {
  }

  setServerImg() {
    if (this.serverImg === '' || this.serverImg === null) {
      this.removeImage();
    }
    else {
      const temp: any[] = [];
      temp[0] = this.imgPrefill;
      temp[1] = this.serverImg;
      const imgFile = temp.join(',');
      setTimeout(() => {
        this.uploadedImage.nativeElement.src = imgFile;
      }, 300)

    }
  }

  showMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  camon() {
    this.isMenuVisible = false;
    this.modalButton.nativeElement.click();
    this.isVideo = true;
    this.isSnap = true;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        this.stream = stream;
        this.video.nativeElement.src = window.URL.createObjectURL(stream);
        this.video.nativeElement.play();
      });
    }
  }

  capture() {
    this.isCropper = true;
    this.isVideo = false;
    this.isSnap = false;
    this.isCrop = true;
    const context = this.canvas.nativeElement.getContext('2d');
    context.drawImage(this.video.nativeElement, 0, 0, 640, 480);
    this.cropper.nativeElement.setAttribute('src', this.canvas.nativeElement.toDataURL('image/png'));
    //document.getElementById('my-image').setAttribute('src', this.canvas.nativeElement.toDataURL('image/png'));
    this.getImage.emit(true);
    this.func();
  }

  func() {
    //const uploadImage = document.getElementById('my-image');
    let uploadImage = this.cropper.nativeElement;
    this.vanilla = new Croppie(uploadImage, {
      viewport: { width: 300, height: 300 },
      boundary: { width: 400, height: 400 },
      enforceBoundary: true,
      showZoomer: true,
      enableZoom: true,
      enableOrientation: true
    });
  }

  crop() {
    const preview = this.uploadedImage.nativeElement;
    this.vanilla.result('blob').then((blob) => {
      const url = URL.createObjectURL(blob);
      preview.src = url;

      this.sendReadFile(blob);
    });

  }

  sendReadFile(obj) {
    let reader = new FileReader();
    reader.readAsDataURL(obj);
    reader.onloadend = () => {
      this.setImage.emit(reader.result.split(',')[1]);
      this.cross.nativeElement.click();
    }
  }

  destroy() {
    this.vanilla.destroy();
  }

  openUploader() {
    this.uploadImage.nativeElement.click();
  }

  uploadHandler(ev) {
    const file = ev.target.files[0];
    const fileData = this.readFile(file);
    this.getImage.emit(true);
    this.uploadImage.nativeElement.value = '';
  }

  removeImage() {
    this.isMenuVisible = false;
    this.renderer.setAttribute(
      this.uploadedImage.nativeElement,
      'src',
      this.defaultImg
    );
    this.setImage.emit('');

  }

  readFile(file: any): any {
    //debugger;
    this.isMenuVisible = false;
    const reader = new FileReader();
    const preview = this.cropper.nativeElement;

    reader.addEventListener('load', () => {
      preview.setAttribute('src', reader.result);
      //document.getElementById('my-image').setAttribute('src', reader.result);
      this.func();
      this.isCrop = true;
      this.modalButton.nativeElement.click();
    }, false);

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {

        return reader.result.split(',')[1];
      };
    }
  }

  flushModal() {
    //debugger;
    this.isVideo = false;
    this.isSnap = false;
    this.isCrop = false;
    this.isCropper = false;

    if (this.vanilla) {
      this.vanilla.destroy();
    }
    if (this.stream) {
      const track = this.stream.getTracks()[0];  // if only one media track
      // ...
      track.stop();
    }
  }

  clickDetector($event) {
    $event.preventDefault();
    if ($event.target.id === "myModal") {
      this.flushModal();
    }
  }

  @HostListener("document:click", ['$event'])
  onWindowClick(event) {
    if(this.eRef.nativeElement.contains(event.target)) {
    } else {
      this.isMenuVisible = false;
    }
  }

}
