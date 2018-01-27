import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/Router'

@Component({
    selector: 'loaders-css',
    templateUrl: './app-loader.html',
    styleUrls: ['./app-loader.scss'],
})
export class AppLoaderComponent{
    @Input() loader: string;
    @Input() loaderClass: string;
    
    nodes: number[] = [];

    private _loaders: {[name: string]: number} = {
        "ball-scale-ripple-multiple"  : 5,        
    };
    
    ngOnInit() {
        for (let i = 0; i < this._loaders[this.loader]; i++) {
            this.nodes.push(i);
        }
    }

 }