import { Subscription } from 'rxjs';
import {
    Component, forwardRef, Input, OnInit, Output,
    EventEmitter, ViewChild,
    ComponentRef, ComponentFactoryResolver, ViewContainerRef,
} from "@angular/core";

import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, ReactiveFormsModule } from "@angular/forms";
import { InputConfig, InputType, SelectOptions } from "./input-config";
import { InputNumberComponent } from "./inputs/input-number.component";
import { InputBase } from "./inputs/input-base";
import { InputTextComponent } from "./inputs/input-text.component";
import { InputPasswordComponent } from "./inputs/input-password.component";
import { InputRangeComponent } from "./inputs/input-range.component";
import { InputTextareaComponent } from "./inputs/input-textarea.component";
import { InputSelectComponent } from "./inputs/input-select.component";
import { InputDateComponent } from "./inputs/input-date.component";
import { InputTimeComponent } from "./inputs/input-time.component";
import { InputDateTimeComponent } from "./inputs/input-date-time.component";
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

export const InputComponets = [
    InputTextComponent,
    InputNumberComponent,
    InputPasswordComponent,
    InputRangeComponent,
    InputTextareaComponent,
    InputSelectComponent,
    InputDateComponent,
    InputTimeComponent,
    InputDateTimeComponent,
];

// TO-DO Default's value
const inputConfig: InputConfig = {
    options: {
        data: [],
        text: "text",
        value: "value",
    },
    empty: "empty",
    placeholder: "",
    type: "text",
    disabled: false,
    name: "",
    size: 8,
    min: 1,
    pattern: "",
    max: Infinity,
    fnErrorLength() { alert("Error: Lenght!"); },
    fnErrorPattern() { alert("Error: Pattern!"); },
};

// const NUMERIC_TYPES: InputType[] = ["range", "number"];

@Component({
    selector: "inline-editor",
    templateUrl: "./inline-editor.component.html",
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InlineEditorComponent),
        multi: true,
    }],
    entryComponents: InputComponets,
})
export class InlineEditorComponent implements OnInit, ControlValueAccessor {
    constructor(public componentFactoryResolver: ComponentFactoryResolver) { }

    @Input() public type: InputType;

    @Output() public onSave: EventEmitter<any> = new EventEmitter();
    @Output() public onEdit: EventEmitter<any> = new EventEmitter();
    @Output() public onCancel: EventEmitter<any> = new EventEmitter();


    // input's attribute
    @Input() public empty: string;
    @Input() public disabled: boolean;
    @Input() public required: boolean;
    @Input() public placeholder: string;
    @Input() public name: string;
    @Input() public size: number;
    @Input() public min: number;
    @Input() public max: number;
    @Input() public pattern: string;

    @Input() public showEditButton: boolean;
    @Input() public canEdit: boolean;

    // TO DO: This must be outputs events emitter
    @Input() public fnErrorLength;
    @Input() public fnErrorPattern;

    // textarea's attribute
    @Input() public cols = 50;
    @Input() public rows = 4;
    @Input() public css: string;

    @Input()
    set options(options: SelectOptions) {
        this._options = options instanceof Array ?
            {
                data: options,
                value: "value",
                text: "text",
            } : options;
    }

    get options() { return this._options; }

    // select's attribute

    // @Output() public selected:EventEmitter<any> = new EventEmitter();

    public onChange: Function;
    public onTouched: Function;
    private valueChangeSubscription: Subscription;
    public editing = false;
    public isEmpty = false;
    private _options: SelectOptions;
    private _value = "";
    private preValue = "";
    query = new FormControl();
    public editorHover = false;
    public get value(): any { return this._value; }

    public set value(newValue: any) {
        if (newValue !== this._value) {
            this._value = newValue;
            this.onChange(newValue);
        }
    }


    private componentRef: ComponentRef<{}>;

    @ViewChild("container", { read: ViewContainerRef, static: true })
    private container: ViewContainerRef;
    private inputInstance: InputBase;



    // Inputs implemented
    private components: { [key: string]: any } = {
        text: InputTextComponent,
        number: InputNumberComponent,
        password: InputPasswordComponent,
        range: InputRangeComponent,
        textarea: InputTextareaComponent,
        select: InputSelectComponent,
        date: InputDateComponent,
        time: InputTimeComponent,
        datetime: InputDateTimeComponent,
    };
    private getComponentType(typeName: InputType): any {
        const type = this.components[typeName];

        if (!type) {
            throw new Error("That type does not exist or it is not implemented yet!");
        }

        return type;
    }
    ngOnInit() {
        if (this.type) {
            this.initializeProperties();
            this.generateComponent(this.type);
        }
        this.valueChangeSubscription = 
        this.inputInstance.query.valueChanges
        .pipe( 
            debounceTime(400),
            distinctUntilChanged()
        ).subscribe(result => {
            //prevent first event while loading valueß
            if (this.editing) {
                this.onSave.emit(result);
            }
        });
    }

    private generateComponent(type: InputType) {
        const componentType = this.getComponentType(type);
        this.inputInstance = this.createInputInstance(componentType);
        this.inputInstance.setContext(this);
    }

    private createInputInstance(componentType): InputBase {
        const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
        this.componentRef = this.container.createComponent(factory);

        return <InputBase>this.componentRef.instance;
    }

    public initializeProperties(): void {
        this.initProperty("type");
        this.initProperty("disabled");
        this.initProperty("placeholder");
        this.initProperty("empty");
        this.initProperty("name");
        this.initProperty("size");
        this.initProperty("min");
        this.initProperty("max");
        this.initProperty("pattern");
        this.initProperty("options");
        this.initProperty("fnErrorLength");
        this.initProperty("fnErrorPattern");
    }

    writeValue(value: any) {
        if (value == null) {
            this.isEmpty = true;
        } else {
            this.value = value;
            this.isEmpty = false;
        }
    }

    public registerOnChange(fn: Function): void { this.onChange = fn; }

    public registerOnTouched(fn: Function): void { this.onTouched = fn; }

    // Method to display the inline edit form and hide the <a> element
    edit(value): void {
        if (this.canEdit) {
            this.preValue = value;  // Store original value in case the form is cancelled
            this.editing = true;
            this.inputInstance.focus();
            this.onEdit.emit(this);
        }

    }

    // Method to display the editable value as text and emit save event to host
    onSubmit(value): void {
        if (this.pattern && this.inputInstance.isRegexTestable && !new RegExp(this.pattern).test(value)) {
            return this.fnErrorPattern();
        }

        const length = this.inputInstance.isNumeric ? Number(value) : value.length;

        if (length < this.min || length > this.max) {
            return this.fnErrorLength();
        }
        this.onSave.emit(value);
        this.editing = false;
        this.isEmpty = false;
    }

    // Method to reset the editable value
    cancel(): void {
        this.value = this.preValue;
        this.editing = false;

        this.onCancel.emit(this);
    }

    private initProperty(property: string): void {
        this[property] = typeof this[property] !== "undefined"
            ? this[property]
            : inputConfig[property];
    }

    public showText(): any {
        return this.inputInstance ? this.inputInstance.getPlaceholder() : "Loading...";
    }
    public showEditor(value) {
        this.editorHover = value;
    }
    public focusOut() {
        this.editing = false;
    }
    ngOnDestroy() {
        this.valueChangeSubscription.unsubscribe();
    }
}
