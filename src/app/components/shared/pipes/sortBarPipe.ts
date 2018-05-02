import {Pipe, PipeTransform} from '@angular/core';


@Pipe({
    name : 'sortPipe'
})
export class arraySortPipe{
    transform(arr:any[], args:string){
        console.log(args);
        
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
