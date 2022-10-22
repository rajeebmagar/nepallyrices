import { Component, AfterViewInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectionStrategy, Renderer2 } from '@angular/core';

import {ShareButton, ShareArgs} from "../../helpers/share-buttons.class";
import {ShareButtonsService} from "../../service/share-buttons.service";
import {WindowService} from "../../service/window.service";
import {ShareProvider} from "../../helpers/share-provider.enum";
declare var global: any
@Component({
     moduleId: module.id,
    selector: 'share-button',
    template: '<button  #btn (click)="share()"></button>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareButtonComponent implements AfterViewInit {

    /** Share Args */
    @Input() url: string;
    @Input() title: string;
    @Input() description: string;
    @Input() image: string;
    @Input() tags: string;

    /** Button type e.g. fb, twitter, reddit...etc */
    @Input() button: ShareButton;
    /** Show count, disabled by default */
    @Input() count: boolean = false;
    /** Output button count to calculate total share counts */
    @Output() countOuter = new EventEmitter<number>();

    /** Output pop up closed*/
    @Output() popUpClosed = new EventEmitter<ShareProvider>();

    @ViewChild('btn', { static: true }) btn: ElementRef;

    private window: Window;

    constructor(private sbService: ShareButtonsService,
                private renderer: Renderer2,
                private elementRef: ElementRef,
                window: WindowService
                ) {
        this.window = window.nativeWindow;
    }

    ngAfterViewInit() {
        /** If URL is not presented then set the current URL    */
        if (this.url) {
            /** If URL is presented check if it is a valid URL */
            let r = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            if (!r.test(this.url)) {
                console.warn('ShareButtons: Invalid URL, switching to window.location.href');
                this.url = this.window ? this.window.location.href : typeof global != 'undefined' ? (<any>global).url : '';
            }
        }
        else {
            /** This supposed to fix window when undefined on Universal */
            this.url = decodeURI(this.window ? this.window.location.href : typeof global != 'undefined' ? (<any>global).url : '');
        }

        /** Set button template */
        /** Set button template */
this.renderer.setProperty(this.btn.nativeElement, 'innerHTML', this.button.template);

        /** Set buttons classes */
        let classes = this.button.classes.match(/\S+/g) || [];
        classes.map((btnClass) => this.renderer.addClass(this.btn.nativeElement, btnClass));

        /** Add share count if enabled */
        if (this.count) {
            this.sbService.count(this.button.provider, this.url)
                .subscribe(shareCount => {
                    if (shareCount) {
                        let counter = __ngRendererCreateElementHelper(this.renderer, this.elementRef.nativeElement, 'span');
                        this.renderer.addClass(counter, 'sb-button-count');
                        this.renderer.setProperty(counter, 'textContent', this.nFormatter(Number(shareCount), 1));
                        this.countOuter.emit(shareCount);
                    }
                });
        }
    }


    /** Open share window */
    share() {
        let shareArgs = new ShareArgs(this.url, this.title, this.description, this.image, this.tags);

        let popUp = this.window.open(this.sbService.share(this.button.provider, shareArgs), 'newwindow', this.sbService.windowAttr());

        let pollTimer = this.window.setInterval(() => {
            if (popUp.closed !== false) { // !== is required for compatibility with Opera
                this.window.clearInterval(pollTimer);
                this.popUpClosed.emit(this.button.provider);
            }
        }, 200);
    }


    nFormatter(num:number, digits) {
        var si = [
            {value: 1E18, symbol: "E"},
            {value: 1E15, symbol: "P"},
            {value: 1E12, symbol: "T"},
            {value: 1E9, symbol: "G"},
            {value: 1E6, symbol: "M"},
            {value: 1E3, symbol: "K"}
        ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;
        for (i = 0; i < si.length; i++) {
            if (num >= si[i].value) {
                return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
            }
        }
        return num.toFixed(digits).replace(rx, "$1");
    }
}


type AnyDuringRendererMigration = any;

function __ngRendererSplitNamespaceHelper(name: AnyDuringRendererMigration) {
    if (name[0] === ":") {
        const match = name.match(/^:([^:]+):(.+)$/);
        return [match[1], match[2]];
    }
    return ["", name];
}

function __ngRendererCreateElementHelper(renderer: AnyDuringRendererMigration, parent: AnyDuringRendererMigration, namespaceAndName: AnyDuringRendererMigration) {
    const [namespace, name] = __ngRendererSplitNamespaceHelper(namespaceAndName);
    const node = renderer.createElement(name, namespace);
    if (parent) {
        renderer.appendChild(parent, node);
    }
    return node;
}
