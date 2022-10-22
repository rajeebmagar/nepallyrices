import { Directive, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';

@Directive({
    selector: '[autofocus]'
})
export class Autofocus implements AfterViewInit
{
    constructor(private el: ElementRef, private renderer: Renderer2)
    {        
    }

    ngAfterViewInit()
    {
        this.el.nativeElement.focus();
    }
}