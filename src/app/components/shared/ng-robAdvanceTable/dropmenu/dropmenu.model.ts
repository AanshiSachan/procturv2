export class DropData {
    key: string;
    header?: string;
}

export class DropMapData {
    key: string;
    private _value: string;
constructor ( settings ) {
        this.key = settings.primaryKey;
        this.header = settings.header;
    }
    set header(setting: string) {
        this._value = setting ? 
            setting :
            this.key.slice(0, 1).toUpperCase() + 
                this.key.replace(/_/g, ' ' ).slice(1)
    }
    get header() {
        return this._value;
    }

access = function ( object: any ) {
        if (object[this.key]) {
            return this.key;
        }
        return this.key;
    }
}