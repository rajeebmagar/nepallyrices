import { FormControl } from '@angular/forms';
import { InputConfig } from "../input-config";
import { Renderer2 } from "@angular/core";

export abstract class InputBase {

    constructor(protected renderer: Renderer2) { }

    public context: InputConfig;
    public inputElement: HTMLInputElement;
    public isNumeric = false;
    public isRegexTestable = false;
    query = new FormControl();

    public getPlaceholder(): string {
        return this.context.isEmpty ? this.context.empty : this.context.value!;
    }

    public focus(): void {
        setTimeout(() => this.inputElement.focus());
    }
    public focusOut():void{
        setTimeout(() => this.inputElement.focusOut());
    }
    public setContext(_context: InputConfig) {
        this.context = _context;
        this.whenContextIsReady();
    }

    protected whenContextIsReady() { }
}
