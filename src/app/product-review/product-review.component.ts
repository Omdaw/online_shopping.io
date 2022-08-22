import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';
import { ApplicationConstants } from 'src/ApplicationConstants';
import { ReviewService } from '../review.service';
import { CommonService } from '../common.service';
import { UserProfileService } from '../user-profile.service';
import { FileUploadService } from '../file-upload.service';

interface ReviewImageTable {
  apiMode             : number,
  reviewFileId        : number,
  reviewId            : number,
  reviewFile          : string,
  reviewFileTypeCode  : number,
  displaySeqNr        : number,
  statusCode          : number,
  reviewImagePath     : string,
  reviewImageFilePath : string,
  showDeleteButton    : boolean,
  file                : File
}

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.css']
})

export class ProductReviewComponent implements OnInit {

  productStoreId      : number;

  reviewId            : number;
  productDetailId     : number;
  productName         : string;
  productImage        : string;
  userRatings         : number;
  comments            : string;

  ratingArr            = [];
  imgURL               = [];

  imageIsDeleted               : boolean;
  selectedFile                 : File = null;
  imageUploadFileName          : string;
  imagePath                    : any;
  insertedImage                : boolean;
  maximumImageSelection        : number;
  reviewImageCount             : number;

  reviewImageNames           = [];
  reviewImageArrayObj        : ReviewImageTable[] = []; 
	deletedReviewImageArrayObj : ReviewImageTable[] = []; 

  @Input('rating')    public  rating: number;
  @Input('starCount') public  starCount = 5;
  @Input('color')     public  color     = "blue"; 
  // @Output() private ratingUpdated = new EventEmitter();

  processBar           : boolean;

  errorMessage         : string;
  disableSaveButton    : boolean;

  reviewFile           : any;

  constructor(private route             : ActivatedRoute,
              private productService    : ProductService,
              private reviewService     : ReviewService,
              private commonMethods     : CommonService,
              private userProfile       : UserProfileService,
              private fileUploadService : FileUploadService,
              public commonService         : CommonService) { }

  ngOnInit() {

    this.userProfile.imageFileUploadType = "FUT_REVIEW_IMG";
    this.maximumImageSelection = 3;
    this.insertedImage         = false;
    this.reviewImageCount      = 0;
    
    this.processBar        = false;
    this.disableSaveButton = false;
    
    this.getProductDetailIdByParams();
    this.fetchProductDetailByProductDetailIdAPI(this.productDetailId);

    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }

    this.loadData();
  }

  getProductDetailIdByParams() {

    this.route.params.subscribe(params => {
      if(params['id'] != undefined){
        this.productDetailId = +params['id'];
      }
    });
  }

  fetchProductDetailByProductDetailIdAPI(pProductDetailId) {

    this.processBar = true;

    if(pProductDetailId != undefined || pProductDetailId != 0) {
      this.productService.fetchProductDetailByProductDetailIdAPI(pProductDetailId)
                         .subscribe(data  => this.handleFetchProductDetailData(data),
                                    error => this.handleError(error))
    }
  }

  handleFetchProductDetailData(pData) {

    if(pData.STATUS == "OK") {

      let productDetailObj = pData.PRODUCT_DETAIL[0];

      this.productName    = productDetailObj.PRODUCT_NAME;
      this.productImage   = productDetailObj.PRODUCT_IMAGE_FILE_PATH;
      this.productStoreId = productDetailObj.STORE_ID;
    }
  }

  loadData() {

    this.processBar = true;

    let requestParams = {
      PRODUCT_DETAIL_ID : this.productDetailId,
      SUBSCRIBER_ID     : this.commonService.lsSubscriberId()
    }

    this.reviewService.fetchReviewAPI(requestParams)
                      .subscribe(data  => this.handleFetchReviewData(data),
                                 error => this.handleError(error))
  }

  handleFetchReviewData(pData) {

    if(pData.STATUS == "OK") {

      this.handleFetchReviewSuccessData(pData);
    }

    this.processBar = false;
  }

  handleFetchReviewSuccessData(pData) {

    if(pData.REVIEW.length > 0) {

      let reviewObj = pData.REVIEW[0];

      this.reviewId     = reviewObj.REVIEW_ID;
      this.userRatings  = reviewObj.RATINGS;
      this.comments     = reviewObj.COMMENT;

      let reviewFileArray = reviewObj.REVIEW_FILE;

      for(let index = 0; index < reviewFileArray.length; index ++) {

        let reviewFileObj = reviewFileArray[index];

        let fileObj : ReviewImageTable = {
          apiMode             : ApplicationConstants.API_MODE_UPDATE,
          reviewFileId        : reviewFileObj.REVIEW_FILE_ID,
          reviewId            : reviewFileObj.REVIEW_ID,
          reviewFile          : reviewFileObj.REVIEW_FILE,
          reviewFileTypeCode  : ApplicationConstants.PRODUCT_REVIEW_TYPE_CODE,
          displaySeqNr        : reviewFileObj.DISPLAY_SEQ_NR,
          statusCode          : reviewFileObj.STATUS_CODE,
          reviewImagePath     : reviewFileObj.REVIEW_IMAGE_PATH,
          reviewImageFilePath : reviewFileObj.REVIEW_IMAGE_FILE_PATH,
          showDeleteButton    : false,
          file                : reviewFileObj.REVIEW_IMAGE_FILE_PATH,
        }
        this.reviewImageNames.push(reviewFileObj.REVIEW_FILE);
        this.reviewImageArrayObj.push(fileObj);
      }
    }
  }

  validateformFields() {

    if(this.userRatings == undefined || this.userRatings == 0) {
      
      this.commonMethods.openAlertBar("Please select the Ratings");
      return false;
    }

    return true;
  }

  saveData() {
    
    if(this.validateformFields()) {

      this.processBar = true;

      let requestData = this.convertFormDataToWebData();
      
      if(this.reviewId > 0) {
  
        this.reviewService.updateReviewAPI(requestData)
                          .subscribe(data  => this.handleUpdateData(data),
                                    error => this.handleError(error))
  
      } else {
  
        this.reviewService.createReviewAPI(requestData)
                          .subscribe(data  => this.handleCreateData(data),
                                    error => this.handleError(error))
  
      }
    }
  }

  convertFormDataToWebData() {

    let obj = {

      REVIEW_ID         : this.reviewId,
      REVIEW_TYPE_CODE  : ApplicationConstants.PRODUCT_REVIEW_TYPE_CODE,
      PRODUCT_DETAIL_ID : this.productDetailId,
      SUBSCRIBER_ID     : this.commonService.lsSubscriberId(),
      RATINGS           : this.userRatings,
      COMMENT           : this.comments,
      STATUS_CODE       : ApplicationConstants.STATUS_CODE_ENABLE,
      REVIEW_FILE       : [],
      DELETE_REVIEW_FILE: []
    }

    let seqNumber = 0;

    for(let index = 0; index < this.reviewImageArrayObj.length; index ++) {

      let reviewImageObj = this.reviewImageArrayObj[index];
      seqNumber += 1;
      
      let reviewFileObj = {
        REVIEW_FILE_ID        : reviewImageObj.reviewFileId,
        REVIEW_ID             : reviewImageObj.reviewId,
        REVIEW_FILE_TYPE_CODE : ApplicationConstants.PRODUCT_REVIEW_TYPE_CODE,
        REVIEW_FILE           : reviewImageObj.reviewFile,
        DISPLAY_SEQ_NR        : seqNumber,
        STATUS_CODE           : reviewImageObj.statusCode,
      }
      obj.REVIEW_FILE.push(reviewFileObj);
    }

    for(let deleteIndex = 0; deleteIndex < this.deletedReviewImageArrayObj.length; deleteIndex ++) {

      let deleteReviewImageObj = this.deletedReviewImageArrayObj[deleteIndex];
      
      if(deleteReviewImageObj.reviewFileId > 0) {

        let reviewFileObj = {
          REVIEW_FILE_ID        : deleteReviewImageObj.reviewFileId,
          REVIEW_ID             : deleteReviewImageObj.reviewId,
        }
        obj.DELETE_REVIEW_FILE.push(reviewFileObj);
      }
    }
    
    return obj;
  }

  handleCreateData(pData) {

    if(pData.STATUS == "OK") {
      
      this.disableSaveButton = true;

      this.uploadReviewImageFileData(pData.REVIEW_ID);

      this.commonMethods.openAlertBar("Review Created Successfully.");
    }
    this.processBar = false;
  }

  handleUpdateData(pData) {

    if(pData.STATUS == "OK") {
      
      this.disableSaveButton = true;

      this.uploadReviewImageFileData(this.reviewId);

      this.commonMethods.openAlertBar("Review Updated Successfully.");
    }
    this.processBar = false;
  }

  uploadReviewImageFileData(pReviewId) {

    this.userProfile.imageUploadReviewId = pReviewId;
    this.userProfile.imageUploadStoreId  = "" + this.productStoreId;

    for(let index = 0; index < this.reviewImageArrayObj.length; index ++) {

      let reviewImgObj = this.reviewImageArrayObj[index];

      // this.reviewImageArrayObj[index].reviewId = pReviewId;

      this.userProfile.imageUploadFileName = reviewImgObj.reviewFile;

      this.fileUploadService.uploadFile(reviewImgObj.file)
                            .subscribe(fileUploadResponse => this.handleFileUploadResponse(fileUploadResponse))
    }
  }

  handleFileUploadResponse(pFileUploadResponse) {

    console.log("pFileUploadResponse");
    console.log(pFileUploadResponse);
  }

  handleError(error){

  }

  loadSelectedFile(event){

		if(event.target.files.length > this.maximumImageSelection) {

			this.commonMethods.openAlertBar("Maximum Image selection is " + this.maximumImageSelection + ". Please remove some image and try again.");
		} else {

      let list = event.target.files;

      let currentReviewImageArrayLength = this.reviewImageArrayObj.length;

      let nameAlreadyExists : boolean = true;

      if(list) {

        for (let file of list) {
          
          // for(let index = 0; index < this.reviewImageArrayObj.length; index ++) {

          //   if(file.name == this.reviewImageArrayObj[index].reviewFile) {
          //     this.commonMethods.openAlertBar("File already exists.");
          //     nameAlreadyExists = false;
          //   }
          // }

          if(this.reviewImageNames.includes(file.name)) {
            this.commonMethods.openAlertBar("'" + file.name + "' Image already Exists.");
            continue;
          }

          if(currentReviewImageArrayLength < this.maximumImageSelection) {

            ++currentReviewImageArrayLength;

            ++this.reviewImageCount;
            
            let data : ReviewImageTable = {

              apiMode              : ApplicationConstants.API_MODE_INSERT,
              reviewFileId         : 0,
              reviewId             : 0,
              reviewFileTypeCode   : ApplicationConstants.PRODUCT_REVIEW_TYPE_CODE,
              displaySeqNr         : this.reviewImageCount,
              reviewFile           : file.name,
              reviewImagePath      : '',
              reviewImageFilePath  : '',
              statusCode           : ApplicationConstants.STATUS_CODE_ENABLE,
              showDeleteButton     : false,
              file                 : file
            }
    
            let reader = new FileReader();
            
            reader.onload = (e: any) => {
              data.reviewImageFilePath = e.target.result;
              this.reviewImageNames.push(file.name);
              this.reviewImageArrayObj.push(data);
            }
            
            reader.readAsDataURL(file);
          } else {
            this.commonMethods.openAlertBar("Maximum Image selection is restricted to " + this.maximumImageSelection);
            return;
          }
        }
      }
    }
  }

	showDeleteButton(pArrayIndex: number) {
		this.reviewImageArrayObj[pArrayIndex].showDeleteButton = true;
	}

	hideDeleteButton(pArrayIndex: number) {
		this.reviewImageArrayObj[pArrayIndex].showDeleteButton = false;
	}

  deleteImage(pArrayIndex: number) {

    this.deletedReviewImageArrayObj.push(this.reviewImageArrayObj[pArrayIndex]);

    let imageName = this.reviewImageArrayObj[pArrayIndex].reviewFile;

    let indexOfImage = this.reviewImageNames.indexOf(imageName);

    this.reviewImageNames.splice(indexOfImage, 1);

    this.reviewImageArrayObj.splice(pArrayIndex, 1);
  }


  onClick(pRating:number) {

    this.userRatings = pRating;
  }

  showIcon(index:number) {
    if (this.userRatings >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  getColor(index:number){

    if (this.userRatings >= index + 1) {
      return 'blue';
    } else {
      return '#FFCC36';
    }
  }
}
