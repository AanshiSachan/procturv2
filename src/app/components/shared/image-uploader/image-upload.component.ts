import { Component, EventEmitter, Input, Output, ElementRef, Renderer2, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnChanges{

    @ViewChild('uploadImage') el: ElementRef;
    @ViewChild('uploadedImage') el2: ElementRef;

    @Input() removeImg :boolean;

    @Output() getImage = new EventEmitter<boolean>();

    constructor(private renderer: Renderer2) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(this.removeImg);
        if(this.removeImg){
            this.removeImage();
        }
      }

    openUploader() {
        this.el.nativeElement.click();
    }


    uploadHandler(ev) {

        let file = ev.target.files[0];

        let fileData = this.readFile(file);

        this.getImage.emit(true);
    }

    

    removeImage() {
        this.renderer.setAttribute(this.el2.nativeElement, 'src', '');
        localStorage.removeItem('tempImg');
    }



    readFile(file: any): any {
        let reader = new FileReader();
        let preview = this.el2.nativeElement;
        reader.addEventListener("load", function () {
          preview.src = reader.result;
        }, false);
        if (file) {
          reader.readAsDataURL(file);
          reader.onloadend = function () {
            localStorage.setItem('tempImg', reader.result.split(',')[1]);
            return reader.result.split(',')[1];
          }
        }

    }

}