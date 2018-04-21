import {Pipe, PipeTransform} from '@angular/core';


@Pipe({
    name : 'sortPipe'
})
export class arraySortPipe{
    transform(arr:Array<any>, args:string): Array<any>{
        arr.sort((a:any, b:any)=>{
            if(a[args] < b[args]){
                return -1;
            }
            else if(a[args] > b[args]){
                return 1;
            }
            else{
                return 0;
            }
        });
        return arr;
        
    }
    
}
