import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'link-to-analysis',
  templateUrl: './link-to-analysis.component.html',
  styleUrls: ['./link-to-analysis.component.scss']
})
export class LinkToAnalysisComponent implements OnInit {

  @ViewChild('p') public popover: NgbPopover;
  
  constructor(private elem: ElementRef) { }

  ngOnInit(): void {
  }

  openPopoverAndSelectText() {
    if (this.popover.isOpen()) {
      this.popover.close();
      return;
    }
    
    this.popover.open();
    this.selectPopoverText();
  }

  selectPopoverText() {
    if (!this.popover.isOpen()) {
      return;
    }

    this.elem.nativeElement.closest('body')
                            .querySelector("#linkText")
                            .select();
  }

}
