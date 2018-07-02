import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'searchPipe'
})
export class SearchPipe implements PipeTransform {
    public transform(value, term: string) {
        if (!term) return value;
        if (value.length > 0) {
            let data = value.filter(item =>
                Object.keys(item).some(
                    k => item[k] != null && item[k].toString().toLowerCase().includes(term.toLowerCase()))
            );
            return data;
        }
    }
}