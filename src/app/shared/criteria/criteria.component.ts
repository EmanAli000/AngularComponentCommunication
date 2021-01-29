import { ProductParameterService } from './../../produsts/product-parameter.service';
import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pm-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.css']
})
export class CriteriaComponent implements OnInit, OnChanges {

  private _listFilter: string;
  @Input() displayDetailsInput: boolean;
  @Input() filteredCount : number;
  private filteredCountMessage = 'No Matches Found';
  @Output() childEvent : EventEmitter<string> = new EventEmitter<string>();

  constructor(private productParameterService : ProductParameterService) { }

  //this life cycle hook called whenever any input changes
  ngOnChanges(changes:SimpleChanges):void{
    console.log(changes);
    if(this.filteredCount > 0)
      this.filteredCountMessage = 'Count:' + this.filteredCount;
    else
    this.filteredCountMessage = 'No Matches Found';
  }

  ngOnInit() {
  }

  get listFilter():string{
    //return this._listFilter;
    return this.productParameterService.filterBy;
  }

  set listFilter(val:string){
    //this._listFilter = val;
    //this.childEvent.emit(val);
    this.productParameterService.filterBy = val;
    this.childEvent.emit(val);
  }

}
