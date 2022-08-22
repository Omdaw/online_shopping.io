import { Component, OnInit, Inject } from '@angular/core';
import { ProductService } from '../product.service';
import { ProductsMidLayerService } from '../products-mid-layer.service';
import { CommonService } from '../common.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public addonproductsDetailObject   :     any,
    private productService                                      :     ProductService,
    public productMidLayerService                               :     ProductsMidLayerService,
    public commonService                                        :     CommonService,
    public    dialogRef                                         :     MatDialogRef<ViewProductComponent>,
  ) { }

  ngOnInit() {
    this.fetchProduct();
  }

  fetchProduct(){
    let requstObject = {
      PRODUCT_ID :this.addonproductsDetailObject.PRODUCT_ID
    }
    this.productService.fetchProductByProductId(requstObject).subscribe(data => this.handleFetchProduct(data), error => error)
  }

  productObject         : any;
  productsDetailObject  : any;
  selectedImage         = "";
  handleFetchProduct(data){
    if(data.STATUS == "OK"){
      this.productObject          = data.PRODUCT[0];
      data.PRODUCT[0].PRODUCT_DETAIL.forEach(productDetailObject => {
        if(productDetailObject.PRODUCT_DETAIL_ID == this.addonproductsDetailObject.PRODUCT_DETAIL_ID){
          this.productsDetailObject = productDetailObject;
          if(productDetailObject.PRODUCT_IMAGE && productDetailObject.PRODUCT_IMAGE.length > 0 && 
            productDetailObject.PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH != 'null'){
              this.selectedImage = productDetailObject.PRODUCT_IMAGE[0].PRODUCT_IMAGE_FILE_PATH;
              let valid = this.checkURL(this.selectedImage);
              if(!valid) this.selectedImage = "assets/images/noProductImageFound.jpg";
            } else {
              this.selectedImage = "assets/images/noProductImageFound.jpg";
            }
        }
      });
    }
  }

  closeDialogue() : void{
    this.dialogRef.close();
  }

  checkURL(url) {
    // new-checklist-1-soln-4 
    return(url.toLowerCase().match(/\.(jpeg|jpg|gif|png)$/) != null);
  }

}
