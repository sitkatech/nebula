import { Component, forwardRef, ViewChild, ElementRef,Injector,OnInit,Host,Attribute,Directive,HostBinding,ViewEncapsulation,Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, FormControl, NgModel } from '@angular/forms';

@Component({
  selector: 'ng-select-custom',
  templateUrl: './ng-select-custom.component.html',
  styleUrls: ['./ng-select-custom.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgSelectCustomComponent),
      multi: true
    }
  ],
  encapsulation:ViewEncapsulation.None,
})
export class NgSelectCustomComponent {

  @Input() items: any;
  @Input() bindLabel: string;
  @Input() bindValue: string;
  @Input() placeholder: string;
  @Input() labelForId: string;
  @Input() control: any;
  @Input() multiple: boolean;
  //for now handle these on a case-by-case basis because of reactive forms
  @Output() selectAll = new EventEmitter();
  @Output() deselectAll = new EventEmitter();

}
