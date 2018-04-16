import {Pipe, PipeTransform} from '@angular/core'

@Pipe({name:'filter'})
 
export class FilterPipe implements PipeTransform{
    transform(value:any ,args:any):any{

        if(!value)return null
        if(!args)return value;

        args=args.toLowerCase();

        return value.filter((item)=>{return JSON.stringify(item).toLowerCase().includes(args);
        });
    }
}
<<<<<<< HEAD





=======
>>>>>>> b791418c1931a2e12e1796bddef966b006f03f7f

