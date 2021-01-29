import { ProductParameterService } from './../produsts/product-parameter.service';
import { CriteriaComponent } from './../shared/criteria/criteria.component';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { IProduct } from './product';
import { ProductService } from './product.service';

@Component({
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, AfterViewInit {
    pageTitle: string = 'Product List';
    //private _listFilter: string;
    listFilter: string;
    private _listFilterNgModel: NgModel;
    private _sub : Subscription;
    //private _showImage: boolean;

    imageWidth: number = 50;
    imageMargin: number = 2;
    errorMessage: string;

    filteredProducts: IProduct[];
    products: IProduct[];

    displayDetailsToChild = true;

    //directly accessing the dom
    @ViewChild('myFilterInputTemplateReferenceVar') filterInputRefVar : ElementRef;
    @ViewChildren('myFilterInputTemplateReferenceVar') childernRef : QueryList<ElementRef>;
    @ViewChildren(NgModel) ngModelsQueryList : QueryList<NgModel>;

    //@ViewChild('allOfChild') allOfMyChild : CriteriaComponent; /on need for temp var
    @ViewChild(CriteriaComponent) allOfMyChild : CriteriaComponent;


    ngAfterViewInit(): void{

        //this.filterInputRefVar.nativeElement.focus();
        //console.log(this.ngModelsQueryList);
        //console.log(this.childernRef);

        //the ngIf work on data not retrieved yet so the element is not found
        // this.ngModelsQueryList.first.valueChanges.subscribe(
        //     () => this.performFilter(this._listFilter)
        // );

        this.performFilter(this.allOfMyChild.listFilter);
    }

    constructor(private productService: ProductService, private productParameterService: ProductParameterService) { }

    // get listFilter() : string{
    //     return this._listFilter;
    // }

    // set listFilter(val : string){
    //     this._listFilter = val;
    //     //this.performFilter(val);
    // }

     get filterInput() : NgModel{
         return this._listFilterNgModel;
     }

     @ViewChild(NgModel)
     set filterInput(val : NgModel){
        console.log(this.filterInput);
        this._listFilterNgModel = val;
        if(this._listFilterNgModel && !this._sub)
        {
            this._sub = this._listFilterNgModel.valueChanges.subscribe(
                () => this.performFilter(this.listFilter)
            );
        }  
     }

     get showImage():boolean{
        //return this._showImage;
        return this.productParameterService.showImage;
     }

     set showImage(val:boolean){
         //this._showImage = val;
         this.productParameterService.showImage = val;
     }


    ngOnInit(): void {
        this.productService.getProducts().subscribe(
            (products: IProduct[]) => {
                this.products = products;
                this.performFilter(this.allOfMyChild.listFilter);
            },
            (error: any) => this.errorMessage = <any>error
        );
    }

    filterValueChanged(e)
    {
        this.performFilter(e);
    }

    toggleImage(): void {
        this.showImage = !this.showImage;
    }

    performFilter(filterBy?: string): void {
        if (filterBy) {
            this.filteredProducts = this.products.filter((product: IProduct) =>
                product.productName.toLocaleLowerCase().indexOf(filterBy.toLocaleLowerCase()) !== -1);
        } else {
            this.filteredProducts = this.products;
        }
    }
}
