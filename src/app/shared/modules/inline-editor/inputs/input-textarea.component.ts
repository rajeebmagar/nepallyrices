import { Component, ViewChild, ElementRef, OnInit, Renderer2 } from "@angular/core";
import { InputBase } from "./input-base";

@Component({
    selector: "inline-editor-textarea",
    styleUrls: ["./input.component.css"],
    template: `<textarea #inputRef [formControl]="query" class="form-control" [(ngModel)]="context.value" [required]="context.required"
                      [rows]="context.rows" [cols]="context.cols" [maxlength]="context.max" [disabled]="context.disabled" [name]="context.name"
                      [placeholder]="context.placeholder"></textarea>`,
})
export class InputTextareaComponent extends InputBase implements OnInit {

    constructor(renderer: Renderer2) {
        super(renderer);
        this.isRegexTestable = true;
    }

    @ViewChild("inputRef", { static: true }) public inputRef: ElementRef;


    ngOnInit() {
        this.inputElement = this.inputRef.nativeElement;
    }
}
