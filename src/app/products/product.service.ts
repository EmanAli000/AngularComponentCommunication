import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { of } from 'rxjs/observable/of';

import { catchError, tap } from 'rxjs/operators';

import { IProduct } from './product';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ProductService {
    private productsUrl = 'api/products';
    private productList : IProduct[]; //for caching if we don't need to re-retrieve the data from the server, service declaration the the module so it's life time is the whole module
    currentProduct : IProduct | null;
    //private _currentProductObservable = new Subject<IProduct | null>(); //provide the new value after supscribtion
    private _currentProductObservable = new BehaviorSubject<IProduct | null>(null); //provide the last value it has for each new supscribtion
    currentProductObservable$ = this._currentProductObservable.asObservable();

    constructor(private http: HttpClient) { }

    changeCurrentProduct(product:IProduct){
        this._currentProductObservable.next(product);
    }

    getProducts(): Observable<IProduct[]> {

        // if(this.productList)
        // return of(this.productList);

        return this.http.get<IProduct[]>(this.productsUrl)
                        .pipe(
                            tap(data => console.log(JSON.stringify(data))),
                            tap(data => this.productList = data),
                            catchError(this.handleError)
                        );
    }

    getProduct(id: number): Observable<IProduct> {
        if (id === 0) {
            return of(this.initializeProduct());
        }
        const url = `${this.productsUrl}/${id}`;
        return this.http.get<IProduct>(url)
                        .pipe(
                            tap(data => console.log('Data: ' + JSON.stringify(data))),
                            tap(data => this.currentProduct = data),
                            catchError(this.handleError)
                        );
    }

    saveProduct(product: IProduct): Observable<IProduct> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (product.id === 0) {
            //this.currentProduct = product;
            this.changeCurrentProduct(product);
            return this.createProduct(product, headers);
        }
        return this.updateProduct(product, headers);
    }

    deleteProduct(id: number): Observable<IProduct> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        const url = `${this.productsUrl}/${id}`;
        return this.http.delete<IProduct>(url, { headers: headers} )
                        .pipe(
                            tap(data => console.log('deleteProduct: ' + id)),
                             //tap(data => this.currentProduct = null),
                             tap(data => this.changeCurrentProduct(null)),
                            catchError(this.handleError)
                        );
    }

    private createProduct(product: IProduct, headers: HttpHeaders): Observable<IProduct> {
        product.id = null;
        return this.http.post<IProduct>(this.productsUrl, product,  { headers: headers} )
                        .pipe(
                            tap(data => console.log('createProduct: ' + JSON.stringify(data))),
                            tap(data => this.currentProduct = product),
                            catchError(this.handleError)
                        );
    }

    private updateProduct(product: IProduct, headers: HttpHeaders): Observable<IProduct> {
        const url = `${this.productsUrl}/${product.id}`;
        return this.http.put<IProduct>(url, product, { headers: headers} )
                        .pipe(
                            tap(data => console.log('updateProduct: ' + product.id)),
                            catchError(this.handleError)
                        );
    }

    private initializeProduct(): IProduct {
        // Return an initialized object
        return {
            'id': 0,
            productName: '',
            productCode: '',
            category: '',
            tags: [],
            releaseDate: '',
            price: 0,
            description: '',
            starRating: 0,
            imageUrl: ''
        };
    }

    private handleError(err: HttpErrorResponse): ErrorObservable {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        let errorMessage: string;
        if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMessage = `Backend returned code ${err.status}, body was: ${err.error}`;
        }
        console.error(err);
        return new ErrorObservable(errorMessage);
    }

}
