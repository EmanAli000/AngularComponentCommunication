import { IProduct } from './../product';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';


@Component({
    selector: 'pm-product-shell-detail',
    templateUrl: './product-shell-detail.component.html'
})
export class ProductShellDetailComponent implements OnInit {
    pageTitle: string = 'Product Detail';
    product:IProduct;
    
    constructor(private productService: ProductService) { }

    ngOnInit() {
        this.productService.currentProductObservable$.subscribe(
            currentProj => this.product = currentProj
        );
    }

    //will be called every change occurred in the other component but how ?! because of the interpolation
    // get product():IProduct{
    //     return this.productService.currentProduct;
    // }

}
