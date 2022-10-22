import { FormControl } from '@angular/forms';
import { Component, ViewChild, ElementRef, OnInit, Renderer2 } from "@angular/core";
import { InputBase } from "./input-base";

@Component({
    selector: "inline-editor-text",
    styleUrls: ["./input.component.css"],
    template: `<input #inputRef type="text" [formControl]="query"  class="form-control" [(ngModel)]="context.value" [required]="context.required"
                      [disabled]="context.disabled" [name]="context.name" [placeholder]="context.placeholder" [size]="context.size"/>`,
})
export class InputTextComponent extends InputBase implements OnInit {

    constructor(renderer: Renderer2) {
        super(renderer);
        this.isRegexTestable = true;
    }


    @ViewChild("inputRef", { static: true }) public inputRef: ElementRef;

    ngOnInit() {
        this.inputElement = this.inputRef.nativeElement;
    }
}
