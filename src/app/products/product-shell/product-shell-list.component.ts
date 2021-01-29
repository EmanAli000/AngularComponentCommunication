import { IProduct } from './../product';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'pm-product-shell-list',
  templateUrl: './product-shell-list.component.html'
})
export class ProductShellListComponent implements OnInit, OnDestroy {
  pageTitle: string = 'Products';
  errorMessage: string;
  products: IProduct[];
  selectedProduct:IProduct;
  sub: Subscription;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
     this.productService.getProducts().subscribe(
      (products: IProduct[]) => {
        this.products = products;
      },
      (error: any) => this.errorMessage = <any>error
    );

    this.sub = this.productService.currentProductObservable$.subscribe(
      currProd => this.selectedProduct = currProd
    );
  }

  productSelected(product){
    //this.productService.currentProduct = product;
    this.productService.changeCurrentProduct(product);
    this.selectedProduct = product;
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

}
