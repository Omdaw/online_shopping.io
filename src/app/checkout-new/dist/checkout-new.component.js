"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Deliverypincode = exports.UnavailableProductsDialog = exports.CheckoutNewComponent = void 0;
var core_1 = require("@angular/core");
var ApplicationConstants_1 = require("src/ApplicationConstants");
var dialog_1 = require("@angular/material/dialog");
var CheckoutNewComponent = /** @class */ (function () {
    function CheckoutNewComponent(configService, transactionService, mapsService, _router, loginservice, userProfileService, flashMessagesService, commonService, socialSignupService, flagsService, signupService, emailandphonenumberverifiationService, referenceMethodsService, walletMethodsService, deliveryAddressService, paymentService, transactionsService, subscriberService, flashMessageService, dialog, pincodeMethodsService, datePipe) {
        this.configService = configService;
        this.transactionService = transactionService;
        this.mapsService = mapsService;
        this._router = _router;
        this.loginservice = loginservice;
        this.userProfileService = userProfileService;
        this.flashMessagesService = flashMessagesService;
        this.commonService = commonService;
        this.socialSignupService = socialSignupService;
        this.flagsService = flagsService;
        this.signupService = signupService;
        this.emailandphonenumberverifiationService = emailandphonenumberverifiationService;
        this.referenceMethodsService = referenceMethodsService;
        this.walletMethodsService = walletMethodsService;
        this.deliveryAddressService = deliveryAddressService;
        this.paymentService = paymentService;
        this.transactionsService = transactionsService;
        this.subscriberService = subscriberService;
        this.flashMessageService = flashMessageService;
        this.dialog = dialog;
        this.pincodeMethodsService = pincodeMethodsService;
        this.datePipe = datePipe;
        // 2nd Dialog ends
        this.foods = [
            { value: 'steak-0', viewValue: 'Steak' },
            { value: 'pizza-1', viewValue: 'Pizza' },
            { value: 'tacos-2', viewValue: 'Tacos' }
        ];
        this.displayLoginFlag = true;
        this.displayAddressFlag = true;
        this.processBar = false;
        this.displayLoginOrSignUpDiv = false;
        this.displayDeliveryAddressDiv = false;
        // displayDeliveryTimingSlotsDiv = false;
        this.displayPaymentsDiv = false;
        this.showProducts = "";
        this.displayInMobile = false;
        this.currentDate = "";
        this.datesArray = [];
        this.daysArray = [];
        this.promocodeDetailsSampleObject = {
            TRANSACTION_DETAIL_ID: 0,
            TRANSACTION_ID: 0,
            STORE_ID: 0,
            VENDOR_ID: 0,
            PRODUCT_ID: "",
            PRODUCT_DETAIL_ID: "",
            PRODUCT_NAME: "",
            PRODUCT_PRICE: 0,
            PRODUCT_DISCOUNT_ID: "",
            PRODUCT_DISCOUNT_AMOUNT: 0,
            PRODUCT_FINAL_PRICE: 0,
            PRODUCT_GST_ID: "",
            PRODUCT_GST_PERCENTAGE: 0,
            PRODUCT_GST_AMOUNT: 0,
            PRODUCT_GST_STATUS: "",
            PRODUCT_QUANTITY: "",
            PRODUCT_MULTI_FLAG: "",
            PRODUCT_IMAGE_FILE: "",
            PRODUCT_IMAGE_PATH: "",
            PRODUCT_IMAGE_FILE_PATH: "",
            PRODUCT_UNIT_TYPE_CODE: "",
            PRODUCT_UNIT: "",
            PRODUCT_UNIT_TYPE_NAME: "",
            PRODUCT_BRAND_ID: "",
            PRODUCT_BRAND_NAME: "",
            MAX_PURCHASE_QUANTITY: "",
            TRANSACTION_DETAIL_TYPE_CODE: 0,
            PROMO_CODE: "",
            PROMO_CODE_DISCOUNT_AMOUNT: 0
        };
        // Login login 
        this.loginEmail = "";
        this.loginPassword = "";
        this.signupEmail = "";
        this.signupPassword = "";
        this.loginRequestObject = {};
        // -----------------------
        this.collapseIcon1 = "down";
        this.collapseIcon = "down";
        this.selectedIndex = 0;
        this.searchedProductsArray = [];
        this.deleteCartRequestObject = {};
        this.invoiceTotal = 0;
        this.invoiceAmount = 0;
        this.invoiceDiscountAmount = 0;
        //Update Cart
        this.updateCartRequestObject = {};
        this.formDisable = true;
        this.isLoginFormValid = false;
        this.isSignUpFormValid = false;
        // Login login ends 
        // delivery address 
        this.fetchDeliveryAddressRequestObject = {};
        this.deliveryAddressesArray = [];
        this.numberOfRows = [];
        // delivery address ends 
        this.addressLabelCode = 1;
        this.addressLabel = "";
        this.customLabel = "";
        // Create Delivery Address 
        this.addressLine1 = "";
        this.addressLine2 = "";
        this.addressPin = null;
        this.lattitude = 12;
        this.longitude = 12;
        this.contactName = "";
        this.mobileNumber = "";
        this.addressStatus = 1;
        this.createDeliveryAddressRequestObject = {};
        // Create Delivery Address ends 
        // Update Delviery Address
        this.updateDeliveryAddressRequestObject = {};
        this.subscriberAddressId = 0;
        this.addressId = 0;
        this.selctedDeliveryAddressId = 0;
        // Update Delivery Address in Transaction 
        this.transactionObject = {};
        this.transactionId = this.commonService.lsTransactionId();
        // Update Delivery Address in Transaction ends
        // Fetching Payment Gateways Starts here
        this.paymentGatewaysArray = [];
        // Fetching Payment Gateways Ends here
        this.selectedPaymentsId = 0;
        this.paymentRequestObject = {};
        this.displayLoggedInDetails = false;
        this.gst = 0;
        this.deliveryCharge = 0;
        this.convenienceFee = 0;
        this.selectedDeliveryAddressObject = {};
        // Sign Up 
        this.signupRequestObject = {};
        this.fName = "";
        this.lName = "";
        this.subscriberMobileNo = "";
        this.paymentGatementCode = 0;
        this.razorpayPaymentLogId = 0;
        //Create Payment Gateway History Starts here 
        //Create Payment API Log Starts here 
        this.paypalResponseObject = { id: "" };
        this.paymentApiLogId = 0;
        //Update Payment API Log Ends here 
        // Apply Promocode Starts here
        this.applyPromocodeRequestObject = {};
        this.promocode = "";
        this.disablePromocodeInputAndApplyButton = false;
        this.invalidPromocodeNotification = "";
        // Apply Promocode Ends here
        // cancel Promocode Starts here
        this.cancelPromocodeRequestObject = {};
        // cancel Promocode Ends here
        //Applied Promocode Displaying Logic
        this.promocodeDetailsObject = this.promocodeDetailsSampleObject;
        this.displayAppyWalletButton = true;
        this.referralCode = "";
        /** Guest CheckIn */
        this.displayGuestCheckIn = false;
        this.guestCheckInFormInValid = true;
        this.guestName = "";
        this.guestEmail = "";
        this.guestCheckInRequestObject = {};
        /** Guest CheckIn ends */
        this.dayIndex = 0;
        this.timeIndex = null;
        // Delivery Time Slots 
        this.displayDeliveryTimingSlotsDiv = false;
        this.noOfDaysToBeShown = 0;
        this.daysOfTheWeek = [];
        this.tempTimeOfTheDay = [];
        this.deliveryOptionCode = 0;
        // the following 2 things are only if normal or express delivery along with timing slots is selected from backend 
        this.deliveryTimingSlots = [];
        this.timingSlotId = 0;
        this.timeOfTheDay = [];
        this.deliveryTimingSlotId = 0;
        this.selectedDeliveryOption = "";
        this.selectedDeliverySlotDay = "";
        this.selectedDeliverySlotTime = "";
        // OTP CheckIn Logic Starts 
        this.isOtpFormValid = false;
    }
    CheckoutNewComponent.prototype.openDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(UnavailableProductsDialog, {
            width: '1200px'
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.transactionsService.checkCartItems();
        });
    };
    // Dialog ends
    // 2nd Dialog
    CheckoutNewComponent.prototype.openPincodeDialog = function () {
        var dialogRef = this.dialog.open(Deliverypincode, {
            width: '1200px'
        });
        dialogRef.afterClosed().subscribe(function (result) {
            //after dialogue closes
        });
    };
    CheckoutNewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.commonService.sendMessage("hideFM");
        if (window.innerWidth < 600)
            this.displayInMobile = true;
        window.scroll(0, 0);
        this.flagsService.hideSearch();
        this.userProfileService.loginCallFromCheckoutPage = 1;
        this.showLoginOrSignUp();
        if (this.userProfileService.loggedIn)
            this.showDeliveryAddress();
        this.fetchPaymentGatewayByStoreIdAPI();
        // this.flagsService.hideHeaderFooter();
        this.flagsService.showSearch();
        this.flagsService.showHeaderFooter();
        this.fetchDeliveryAddress();
        this.makeTransactionArray();
        this.transactionsService.checkoutApi();
        if (window.innerWidth < 600) {
            this.flagsService.hideFooter();
        }
        (function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.commonService.delay(ApplicationConstants_1.ApplicationConstants.wait_time)];
                    case 1:
                        _a.sent();
                        if (this.transactionsService.unavailableProductsArray.length > 0) {
                            this.openDialog();
                        }
                        return [2 /*return*/];
                }
            });
        }); })();
    };
    CheckoutNewComponent.prototype.ngOnDestroy = function () {
        this.commonService.sendMessage("showFM");
    };
    CheckoutNewComponent.prototype.updateSelectedDeliveryOption = function () {
        if (this.deliveryOptionCode == 1)
            this.selectedDeliveryOption = "Normal Delivery";
        else if (this.deliveryOptionCode == 2)
            this.selectedDeliveryOption = "Express Delivery";
        else if (this.deliveryOptionCode == 3)
            this.selectedDeliveryOption = "Delivery Slot";
    };
    CheckoutNewComponent.prototype.updateSelectedDeliverySlotDay = function (pValue) {
        this.selectedDeliverySlotDay = pValue;
    };
    CheckoutNewComponent.prototype.updateSelectedDeliverySlotTime = function (pValue) {
        this.selectedDeliverySlotTime = pValue;
    };
    CheckoutNewComponent.prototype.showSignup = function () {
        this.displayLoginFlag = false;
    };
    CheckoutNewComponent.prototype.showLogin = function () {
        this.displayLoginFlag = true;
    };
    CheckoutNewComponent.prototype.showAddaddress = function () {
        this.displayAddressFlag = false;
    };
    CheckoutNewComponent.prototype.hideAddress = function () {
        this.displayAddressFlag = true;
    };
    CheckoutNewComponent.prototype.showLoginOrSignUp = function () {
        this.displayLoginOrSignUpDiv = true;
        this.displayDeliveryAddressDiv = false;
        this.displayPaymentsDiv = false;
        this.displayDeliveryTimingSlotsDiv = false;
    };
    CheckoutNewComponent.prototype.showDeliveryAddress = function () {
        this.displayAddressFlag = true;
        this.displayLoginOrSignUpDiv = false;
        this.displayDeliveryAddressDiv = true;
        this.displayPaymentsDiv = false;
        this.displayDeliveryTimingSlotsDiv = false;
    };
    CheckoutNewComponent.prototype.showDeliveryTimingSlots = function () {
        this.displayLoginOrSignUpDiv = false;
        this.displayDeliveryAddressDiv = false;
        this.displayPaymentsDiv = false;
        this.displayDeliveryTimingSlotsDiv = true;
    };
    CheckoutNewComponent.prototype.showPayments = function () {
        this.displayLoginOrSignUpDiv = false;
        this.displayDeliveryAddressDiv = false;
        this.displayPaymentsDiv = true;
        this.displayDeliveryTimingSlotsDiv = false;
    };
    CheckoutNewComponent.prototype.makeLoginRequestObject = function () {
        this.loginRequestObject = {
            APPLICATION_ID: this.commonService.applicationId,
            SUBSCRIBER_EMAIL_ID: this.loginEmail,
            SUBSCRIBER_PASSWORD: this.loginPassword
        };
    };
    CheckoutNewComponent.prototype.makeDeleteTempSubscriberRequestObject = function () {
        this.loginRequestObject = {
            APPLICATION_ID: this.commonService.applicationId,
            TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            SUBSCRIBER_EMAIL_ID: this.loginEmail,
            SUBSCRIBER_PASSWORD: this.loginPassword,
            STORE_ID: this.configService.getStoreID(),
            REFERRAL_FLAG: this.referenceMethodsService.referralFlag,
            REFERRAL_URL: this.referenceMethodsService.referralUrl
        };
    };
    CheckoutNewComponent.prototype.collapseOrderDetails = function () {
        if (this.collapseIcon1 == "down") {
            this.collapseIcon1 = "up";
        }
        else {
            this.collapseIcon1 = "down";
        }
    };
    CheckoutNewComponent.prototype.collapse = function () {
        if (this.collapseIcon == "down") {
            this.collapseIcon = "up";
        }
        else {
            this.collapseIcon = "down";
        }
    };
    CheckoutNewComponent.prototype.reduceQuantity = function (index) {
        this.showProducts = "show";
        this.selectedIndex = index;
        this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY = this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY - 1;
        if (this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY == 0) {
            this.deleteCart();
        }
        this.updateCart();
    };
    CheckoutNewComponent.prototype.increaseQuantity = function (index) {
        this.showProducts = "show";
        this.selectedIndex = index;
        this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY = this.transactionService.transactionDetailsArray[index].PRODUCT_QUANTITY + 1;
        this.updateCart();
    };
    CheckoutNewComponent.prototype.handleFetchSearchResponse = function (pData) {
        this.searchedProductsArray = [];
        if (pData.STATUS == "OK") {
            this.searchedProductsArray = pData.PRODUCT;
            for (var i = 0; i < this.searchedProductsArray.length; i++) {
                this.searchedProductsArray[i].showAddToCart = 1;
                this.searchedProductsArray[i].selectedQuantity = 1;
                this.checkProductExistsInTransaction(i);
            }
        }
        this.processBar = false;
    };
    CheckoutNewComponent.prototype.checkProductExistsInTransaction = function (index) {
        var _this = this;
        this.transactionService.transactionDetailsArray.forEach(function (element) {
            if (_this.searchedProductsArray[index].PRODUCT_DETAIL[0].PRODUCT_DETAIL_ID == element.PRODUCT_DETAIL_ID) {
                _this.searchedProductsArray[index].showAddToCart = 0;
                _this.searchedProductsArray[index].selectedQuantity = element.PRODUCT_QUANTITY;
                _this.searchedProductsArray[index].PRODUCT_DETAIL[0].transactionDetailsId = element.TRANSACTION_DETAIL_ID;
            }
        });
    };
    CheckoutNewComponent.prototype.removeFromCart = function (index) {
        this.showProducts = "show";
        this.processBar = true;
        this.selectedIndex = index;
        this.deleteCart();
    };
    CheckoutNewComponent.prototype.deleteCart = function () {
        var _this = this;
        this.makeDeleteCartRequestObject();
        this.subscriberService.removeFromCart(this.deleteCartRequestObject).subscribe(function (data) { return _this.handleDeleteCartResponse(data); }, function (error) { return _this.handleError(error); });
    };
    CheckoutNewComponent.prototype.makeDeleteCartRequestObject = function () {
        var transactionDetails = {
            TRANSACTION_DETAIL_ID: this.transactionService.transactionDetailsArray[this.selectedIndex].TRANSACTION_DETAIL_ID
        };
        var tempObj = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_ID: this.transactionService.transactionDetailsArray[this.selectedIndex].TRANSACTION_ID,
            TRANSACTION_DETAIL: transactionDetails
        };
        this.deleteCartRequestObject = tempObj;
    };
    CheckoutNewComponent.prototype.handleDeleteCartResponse = function (data) {
        if (data.STATUS == "OK") {
            this.transactionService.transactionDetailsArray.splice(this.selectedIndex, 1);
            this.calculateInvoiceDetail(data.TRANSACTION[0]);
            this.maketransactionArray(data);
            this.processBar = false;
            this.transactionService.transactionArray = data.TRANSACTION;
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
        }
    };
    //Delete Cart Ends
    CheckoutNewComponent.prototype.calculateInvoiceDetail = function (data) {
        this.invoiceAmount = data.INVOICE_AMOUNT;
        this.invoiceDiscountAmount = data.INVOICE_DISCOUNT_AMOUNT;
        this.invoiceTotal = data.INVOICE_FINAL_AMOUNT;
        this.userProfileService.invoiceAmount = this.invoiceAmount;
        this.userProfileService.invoiceDiscount = this.invoiceDiscountAmount;
        this.userProfileService.invoiceTotal = this.invoiceTotal;
    };
    CheckoutNewComponent.prototype.maketransactionArray = function (data) {
        var _this = this;
        this.gst = 0;
        this.deliveryCharge = 0;
        this.convenienceFee = 0; //Initialise
        this.transactionService.transactionDetailsArray = [];
        data.TRANSACTION[0].TRANSACTION_DETAIL.forEach(function (element) {
            if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PRODUCT) {
                _this.transactionService.transactionDetailsArray.push(element);
                _this.transactionService.transactionDetailsArray = _this.transactionService.transactionDetailsArray;
                _this.gst += element.PRODUCT_GST_AMOUNT * element.PRODUCT_QUANTITY;
            }
            if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_DELIVERY_CHAGE) {
                _this.deliveryCharge += element.PRODUCT_FINAL_PRICE;
            }
            if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_CONVENIENCE_FEE) {
                _this.convenienceFee += element.PRODUCT_FINAL_PRICE;
            }
        });
        this.userProfileService.numberOfProductsInCart = this.transactionService.transactionDetailsArray.length;
    };
    CheckoutNewComponent.prototype.updateCart = function () {
        var _this = this;
        this.processBar = true;
        this.makeUpdateCartRequestObject();
        this.subscriberService.updateCart(this.updateCartRequestObject).subscribe(function (data) { return _this.handleUpdateCartResponse(data); }, function (error) { return _this.handleError(error); });
    };
    CheckoutNewComponent.prototype.makeUpdateCartRequestObject = function () {
        var transactionDetails = {
            TRANSACTION_DETAIL_ID: this.transactionService.transactionDetailsArray[this.selectedIndex].TRANSACTION_DETAIL_ID,
            PRODUCT_QUANTITY: this.transactionService.transactionDetailsArray[this.selectedIndex].PRODUCT_QUANTITY
        };
        var addToCartObject = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            STORE_ID: this.configService.getStoreID(),
            TRANSACTION_ID: this.transactionService.transactionDetailsArray[this.selectedIndex].TRANSACTION_ID,
            TRANSACTION_DETAIL: transactionDetails
        };
        this.updateCartRequestObject = addToCartObject;
    };
    CheckoutNewComponent.prototype.handleUpdateCartResponse = function (data) {
        this.processBar = false;
        if (data.STATUS == "OK") {
            this.calculateInvoiceDetail(data.TRANSACTION[0]);
            this.maketransactionArray(data);
            this.transactionService.transactionArray = data.TRANSACTION;
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
        }
    };
    //Update Cart Ends
    // ---------------------------------
    CheckoutNewComponent.prototype.login = function () {
        var _this = this;
        if (this.isLoginFormValid) {
            var tempSubscriberFlag = 0;
            tempSubscriberFlag = +this.commonService.lsTempSubscriberFlag();
            if (tempSubscriberFlag > 0) {
                this.makeDeleteTempSubscriberRequestObject();
                this.loginservice.deleteTemporarySubscriberAndLogInAPI(this.loginRequestObject).subscribe(function (data) { return _this.handleTempSubscriberLoginSuccess(data); }, function (error) { return _this.handleError(error); });
            }
            else {
                this.makeLoginRequestObject();
                this.loginservice.subscriberLoginAPI(this.loginRequestObject).subscribe(function (data) { return _this.handleLoginSuccess(data); }, function (error) { return _this.handleError(error); });
            }
        }
    };
    CheckoutNewComponent.prototype.handleLoginSuccess = function (data) {
        if (data.STATUS == "OK") {
            this.commonService.notifyMessage(this.flashMessagesService, "User Login Success.");
            this.commonService.addSubscriberIdTols(data.SUBSCRIBER.SUBSCRIBER_ID);
            this.commonService.addLoggedInUsernameTols(data.SUBSCRIBER.SUBSCRIBER_FIRST_NAME + data.SUBSCRIBER.SUBSCRIBER_LAST_NAME);
            this.commonService.addTempSubscriberFlagTols(0);
            this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
            this.commonService.isUserLoggedIn();
            this.afterSuccessfullLogin();
        }
        else {
            this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
        }
    };
    CheckoutNewComponent.prototype.handleTempSubscriberLoginSuccess = function (data) {
        if (data.STATUS == "OK") {
            if (data.SUBSCRIBER.SUBSCRIBER_EMAIL_OTP_STATUS == 1) { // this means otp is verified
                var authToken = data.SUBSCRIBER.AUTHENTICATION_TOKEN;
                var subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
                var tempSubscriberFlag = 0;
                var transactionId = 0;
                this.commonService.addStoreData(authToken, subscriberId, tempSubscriberFlag, transactionId);
                var subscriberObject = {
                    name: data.SUBSCRIBER.SUBSCRIBER_FIRST_NAME + " " + this.commonService.checkIfNull(data.SUBSCRIBER.SUBSCRIBER_LAST_NAME),
                    email: data.SUBSCRIBER.SUBSCRIBER_EMAIL_ID,
                    mobile: data.SUBSCRIBER.SUBSCRIBER_MOBILE_NR
                };
                this.commonService.addSubscriberObjectTols(subscriberObject);
                this.loginservice.checkTransactionArrayAndUpdate(data);
                this.afterSuccessfullLogin();
                this.commonService.isUserLoggedIn();
            }
            else {
                this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
                this.emailandphonenumberverifiationService.deleteTempSubsReqObject = {
                    APPLICATION_ID: this.commonService.applicationId,
                    TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
                    SUBSCRIBER_EMAIL_ID: this.loginEmail,
                    SUBSCRIBER_PASSWORD: this.loginPassword,
                    STORE_ID: this.configService.getStoreID()
                };
                this._router.navigate(['/collections/otp']);
            }
            this.walletMethodsService.fetchWalletMoneyBySubscriberIdAPI();
            this.referenceMethodsService.referralFlag = false;
        }
        else {
            this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
        }
    };
    CheckoutNewComponent.prototype.afterSuccessfullLogin = function () {
        var _this = this;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.transactionsService.checkoutApi();
                        this.commonService.notifySuccessMessage(this.flashMessagesService, "User Login Success.");
                        return [4 /*yield*/, this.delay(ApplicationConstants_1.ApplicationConstants.notification_display_time)];
                    case 1:
                        _a.sent();
                        this.fetchDeliveryAddress();
                        this.showDeliveryAddress();
                        (function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.commonService.delay(ApplicationConstants_1.ApplicationConstants.wait_time)];
                                    case 1:
                                        _a.sent();
                                        if (this.transactionsService.unavailableProductsArray.length > 0) {
                                            this.openDialog();
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); })();
                        return [2 /*return*/];
                }
            });
        }); })();
    };
    CheckoutNewComponent.prototype.handleError = function (error) {
    };
    CheckoutNewComponent.prototype.clearSignupForm = function () {
        this.loginEmail = "";
        this.loginPassword = "";
    };
    CheckoutNewComponent.prototype.validateForm = function (ngObject) {
        this.formDisable = true;
        if (ngObject._parent.form.status == "VALID") {
            this.formDisable = false;
        }
    };
    CheckoutNewComponent.prototype.loginFormValidation = function (ngObject) {
        this.isLoginFormValid = false;
        if (ngObject._parent.form.status == "VALID")
            this.isLoginFormValid = true;
    };
    CheckoutNewComponent.prototype.signupFormValidation = function (ngObject) {
        this.isSignUpFormValid = false;
        if (ngObject._parent.form.status == "VALID")
            this.isSignUpFormValid = true;
    };
    CheckoutNewComponent.prototype.makeFetchDeliveryAddressRequestObject = function () {
        this.fetchDeliveryAddressRequestObject = {
            SUBSCRIBER_ID: this.commonService.lsSubscriberId()
        };
    };
    CheckoutNewComponent.prototype.fetchDeliveryAddress = function () {
        var _this = this;
        this.makeFetchDeliveryAddressRequestObject();
        this.deliveryAddressService.fetchSubscriberAddress(this.fetchDeliveryAddressRequestObject)
            .subscribe(function (data) { return _this.handleFetchDeliveryAddressSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    CheckoutNewComponent.prototype.handleFetchDeliveryAddressSuccess = function (data) {
        if (data.STATUS == "OK") {
            this.deliveryAddressesArray = [];
            var delArray = data.SUBSCRIBER_ADDRESS;
            var arrayLength = Math.ceil(delArray.length / 3);
            var index = 0;
            for (var row = 0; row < arrayLength; row++) {
                var tempArray = [];
                if (index < delArray.length) {
                    for (var col = 0; col < 3; col++) {
                        if (delArray[index])
                            tempArray.push(delArray[index]);
                        index++;
                    }
                    this.deliveryAddressesArray.push(tempArray);
                }
            }
            if (this.deliveryAddressesArray.length > 0 && this.deliveryAddressesArray[0].length == 1) {
                this.updateSelectedDeliveryAddressId(this.deliveryAddressesArray[0][0]);
                this.updateSelectedDeliveryAddressObject(this.deliveryAddressesArray[0][0]);
            }
        }
    };
    CheckoutNewComponent.prototype.updateAddressLabel = function (addressLabel) {
        this.addressLabelCode = addressLabel;
        if (addressLabel == 1)
            this.addressLabel = "Home";
        if (addressLabel == 2)
            this.addressLabel = "Office";
        if (addressLabel == 3)
            this.addressLabel = this.customLabel;
    };
    CheckoutNewComponent.prototype.getDeliveryAddressClass = function (deliveryAddressLabelCode) {
        var cls = "";
        if (deliveryAddressLabelCode == this.addressLabelCode)
            cls = "highlightDeliveryAddressLabel";
        return cls;
    };
    CheckoutNewComponent.prototype.highlightDeliveryAddressLabelByLabelName = function (addressLabelName) {
        if (this.addressLabel == "Home")
            this.addressLabelCode = 1;
        else if (this.addressLabel == "Office")
            this.addressLabelCode = 2;
        else
            this.addressLabelCode = 3;
    };
    CheckoutNewComponent.prototype.makeCreateDeliveryAddressRequestObject = function () {
        this.createDeliveryAddressRequestObject = {
            SUBSCRIBER_ID: +this.commonService.lsSubscriberId(),
            ADDRESS_LINE1: this.addressLine1,
            ADDRESS_LINE2: this.mapsService.googleAddress,
            ADDRESS_PINCODE: this.addressPin,
            ADDRESS_LATITUDE: this.lattitude,
            ADDRESS_LONGITUDE: this.longitude,
            ADDRESS_LABEL: this.addressLabel,
            CONTACT_NAME: this.contactName,
            CONTACT_MOBILE_NR: this.mobileNumber,
            ADDRESS_STATUS: this.addressStatus
        };
    };
    CheckoutNewComponent.prototype.createDeliveryAddress = function () {
        var _this = this;
        if (this.subscriberAddressId > 0) {
            this.updateDeliveryAddress();
        }
        else {
            this.makeCreateDeliveryAddressRequestObject();
            this.deliveryAddressService.createSubscriberAddress(this.createDeliveryAddressRequestObject)
                .subscribe(function (data) { return _this.handleCreateDeliveryAddressSuccess(data); }, function (error) { return _this.handleError(error); });
        }
    };
    CheckoutNewComponent.prototype.handleCreateDeliveryAddressSuccess = function (data) {
        var _this = this;
        if (data.STATUS == "OK") {
            (function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.flashMessageService.show("Delivery address Saved Successfully.", { cssClass: 'alert-success', timeout: ApplicationConstants_1.ApplicationConstants.notification_display_time });
                            return [4 /*yield*/, this.commonService.delay(ApplicationConstants_1.ApplicationConstants.notification_display_time)];
                        case 1:
                            _a.sent();
                            this.refreshForm();
                            this.fetchDeliveryAddress();
                            this.hideAddress();
                            return [2 /*return*/];
                    }
                });
            }); })();
        }
    };
    CheckoutNewComponent.prototype.makeUpdateDeliveryAddressRequestObject = function () {
        this.updateDeliveryAddressRequestObject = {
            SUBSCRIBER_ADDRESS_ID: this.subscriberAddressId,
            ADDRESS_ID: this.addressId,
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            ADDRESS_LINE1: this.addressLine1,
            ADDRESS_LINE2: this.mapsService.googleAddress,
            ADDRESS_PINCODE: this.addressPin,
            ADDRESS_LATITUDE: this.lattitude,
            ADDRESS_LONGITUDE: this.longitude,
            ADDRESS_LABEL: this.addressLabel,
            CONTACT_NAME: this.contactName,
            CONTACT_MOBILE_NR: this.mobileNumber,
            ADDRESS_STATUS: this.addressStatus
        };
    };
    CheckoutNewComponent.prototype.updateDeliveryAddress = function () {
        var _this = this;
        this.makeUpdateDeliveryAddressRequestObject();
        this.deliveryAddressService.updateSubscriberAddress(this.updateDeliveryAddressRequestObject)
            .subscribe(function (data) { return _this.handleUpdateDeliveryAddressSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    CheckoutNewComponent.prototype.handleUpdateDeliveryAddressSuccess = function (data) {
        if (data.STATUS == "OK") {
            this.refreshForm();
            this.fetchDeliveryAddress();
            this.hideAddress();
        }
    };
    // Update Delviery Address ends 
    CheckoutNewComponent.prototype.refreshForm = function () {
        this.addressLine1 = "";
        this.addressLine2 = "";
        this.addressPin = 0;
        this.lattitude = 12;
        this.longitude = 12;
        this.addressLabel = "";
        this.contactName = "";
        this.mobileNumber = "";
    };
    CheckoutNewComponent.prototype.getSelectedDeliveryAddress = function (deliveryAddressObject) {
        var classname = "";
        if (this.selctedDeliveryAddressId == deliveryAddressObject.SUBSCRIBER_ADDRESS_ID)
            classname = "selectedDiv";
        return classname;
    };
    CheckoutNewComponent.prototype.checkDeliveryAddress = function (deliveryAddressObject) {
        var flag = false;
        if (this.selctedDeliveryAddressId == deliveryAddressObject.SUBSCRIBER_ADDRESS_ID)
            flag = true;
        return flag;
    };
    CheckoutNewComponent.prototype.updateSelectedDeliveryAddressId = function (addressObject) {
        var _this = this;
        if (this.commonService.STORE_CHECK_PINCODE_AT_CHECKOUT_FLAG) {
            this.pincodeMethodsService.checkDeliveryLocationPincodeAPIRequestObject.PINCODE = addressObject.ADDRESS_PINCODE;
            this.pincodeMethodsService.checkDeliveryLocationPincodeAPI();
            (function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.commonService.delay(ApplicationConstants_1.ApplicationConstants.wait_time)];
                        case 1:
                            _a.sent();
                            this.openPincodeDialog();
                            if (this.pincodeMethodsService.pincodeAvailablity == ApplicationConstants_1.ApplicationConstants.PINCODE_AVAILABLITY_AVAILABLE)
                                this.selctedDeliveryAddressId = addressObject.SUBSCRIBER_ADDRESS_ID;
                            return [2 /*return*/];
                    }
                });
            }); })();
        }
        else {
            this.selctedDeliveryAddressId = addressObject.SUBSCRIBER_ADDRESS_ID;
        }
    };
    CheckoutNewComponent.prototype.updateDeliveryAddressInTransaction = function () {
        var _this = this;
        this.transactionObject = {
            DELIVERY_ADDRESS_ID: this.selctedDeliveryAddressId,
            STORE_ID: this.configService.getStoreID(),
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            TRANSACTION_ID: this.commonService.lsTransactionId()
        };
        this.deliveryAddressService.updateDeliveryAddressInTransaction(this.transactionObject).subscribe(function (data) { return _this.handleUpdateDeliveryAddressInTransactionSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    CheckoutNewComponent.prototype.handleUpdateDeliveryAddressInTransactionSuccess = function (data) {
        if (data.STATUS == "OK") {
            if (this.commonService.deliverySlotFlag) {
                this.fetchDeliverySlotApi();
            }
            else {
                this.showPayments();
            }
        }
    };
    CheckoutNewComponent.prototype.fetchPaymentGatewayByStoreIdAPI = function () {
        var _this = this;
        this.processBar = true;
        var tempObj = {
            STORE_ID: this.configService.getStoreID()
        };
        this.deliveryAddressService.fetchPaymentGatewayByStoreIdAPI(tempObj)
            .subscribe(function (data) { return _this.handleFetchPaymentGatewayByStoreIdAPISuccess(data); }, function (error) { return _this.handleError(error); });
    };
    CheckoutNewComponent.prototype.handleFetchPaymentGatewayByStoreIdAPISuccess = function (data) {
        if (data.STATUS == "OK") {
            this.paymentGatewaysArray = data.STORE_PAYMENT_GATEWAY_MAP;
            if (this.paymentGatewaysArray.length > 0)
                this.selectedPaymentsId = this.paymentGatewaysArray[0].PAYMENT_GATEWAY_TYPE_CODE;
        }
        this.processBar = false;
    };
    CheckoutNewComponent.prototype.getPaymentsClass = function (paymentsId) {
        var classname = "";
        if (paymentsId == this.selectedPaymentsId)
            classname = "active";
        return classname;
    };
    CheckoutNewComponent.prototype.updatePaymentsId = function (paymentsId) {
        this.selectedPaymentsId = paymentsId;
    };
    CheckoutNewComponent.prototype.makeUpdatePaymentRequestObject = function () {
        var paymentTypeId = 0;
        if (this.selectedPaymentsId == ApplicationConstants_1.ApplicationConstants.CASH_0N_DELIVERY_PAYMENT_GATEWAY_TYPE_CODE)
            paymentTypeId = 2; //This means COD
        else if (this.selectedPaymentsId == ApplicationConstants_1.ApplicationConstants.WALLET_PAYMENT_GATEWAY_TYPE_ID)
            paymentTypeId = 3; //This means wallet money
        else
            paymentTypeId = 1; // This means online 
        this.paymentRequestObject = {
            STORE_ID: this.configService.getStoreID(),
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            TRANSACTION_ID: this.commonService.lsTransactionId(),
            PAYMENT_TYPE_ID: ApplicationConstants_1.ApplicationConstants.CASH_0N_DELIVERY_PAYMENT_GATEWAY_TYPE_CODE,
            DELIVERY_STATUS_ID: ApplicationConstants_1.ApplicationConstants.PENDING_DELIVERY_STATUS_TYPE_ID
        };
    };
    CheckoutNewComponent.prototype.updatePayment = function () {
        var _this = this;
        this.makeUpdatePaymentRequestObject();
        this.paymentService.updatePaymentTypeAPI(this.paymentRequestObject).subscribe(function (data) { return _this.handleUpdatePayment(data); }, function (error) { return error; });
    };
    CheckoutNewComponent.prototype.handleUpdatePayment = function (data) {
        if (data.STATUS == "OK") {
            // this._router.navigate(['invoice']);
            this._router.navigate(['/collections/customer-invoice', this.commonService.lsTransactionId()]);
        }
    };
    CheckoutNewComponent.prototype.showLoggedInDetails = function () {
        this.showLoginOrSignUp();
        this.displayLoggedInDetails = true;
        this.displayLoginOrSignUpDiv = false;
    };
    CheckoutNewComponent.prototype.hideLoggedInDetails = function () {
        this.displayLoggedInDetails = false;
    };
    CheckoutNewComponent.prototype.makeTransactionArray = function () {
        var _this = this;
        this.gst = 0;
        this.deliveryCharge = 0;
        this.convenienceFee = 0; //Initialise
        // this.invoiceDetails = [];
        if (this.transactionsService.transactionArray && this.transactionsService.transactionArray.length > 0) {
            this.transactionsService.transactionArray[0].TRANSACTION_DETAIL.forEach(function (element) {
                if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PRODUCT) {
                    // this.invoiceDetails.push(element);
                    _this.gst += element.PRODUCT_GST_AMOUNT * element.PRODUCT_QUANTITY;
                }
                if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_DELIVERY_CHAGE) {
                    _this.deliveryCharge += element.PRODUCT_FINAL_PRICE;
                }
                if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_CONVENIENCE_FEE) {
                    _this.convenienceFee += element.PRODUCT_FINAL_PRICE;
                }
            });
        }
    };
    CheckoutNewComponent.prototype.displayChangeDeliveryAddress = function () {
        var value = false;
        if (this.displayDeliveryAddressDiv == false && this.selctedDeliveryAddressId > 0)
            value = true;
        return value;
    };
    CheckoutNewComponent.prototype.updateSelectedDeliveryAddressObject = function (address) {
        this.selectedDeliveryAddressObject = address;
    };
    CheckoutNewComponent.prototype.addDeliveryAddressValidation = function () {
        var disabledValue = true;
        if (this.addressLine1 != "" && this.mapsService.googleAddress != "" && this.contactName != "" && this.mobileNumber != "" && this.addressPin > 0 && this.addressLabelCode > 0)
            disabledValue = false;
        return disabledValue;
    };
    CheckoutNewComponent.prototype.makeSignupRequestObject = function () {
        var tempSubscriberId = 0;
        tempSubscriberId = +this.commonService.lsSubscriberId();
        this.signupRequestObject = {
            APPLICATION_ID: this.commonService.applicationId,
            STORE_ID: this.configService.getStoreID(),
            SUBSCRIBER_FIRST_NAME: this.fName,
            SUBSCRIBER_LAST_NAME: this.lName,
            SUBSCRIBER_EMAIL_ID: this.signupEmail,
            SUBSCRIBER_PASSWORD: this.signupPassword,
            SUBSCRIBER_TOKEN: "",
            SUBSCRIBER_MOBILE_NR: this.subscriberMobileNo,
            SUBSCRIBER_STATUS_CODE: ApplicationConstants_1.ApplicationConstants.SUBSCRIBER_STATUS_CODE_PENDING,
            PROVIDER_CODE: ApplicationConstants_1.ApplicationConstants.PROVIDER_CODE_PERSONAL,
            TEMP_SUBSCRIBER_ID: tempSubscriberId,
            TEMP_SUBSCRIBER_FLAG: this.commonService.lsTempSubscriberFlag(),
            PROFILE_ID: ApplicationConstants_1.ApplicationConstants.DEFAULT_SUBSCRIBER_PROFILE_ID,
            REFERRAL_FLAG: this.userProfileService.referralFlag(),
            REFERRAL_CODE: this.userProfileService.referralCode
        };
    };
    CheckoutNewComponent.prototype.signup = function () {
        var _this = this;
        if (this.isSignUpFormValid) {
            this.makeSignupRequestObject();
            this.signupService.subscriberRegistrationAPI(this.signupRequestObject).subscribe(function (data) { return _this.handleSignupSuccess(data); }, function (error) { return _this.handleError(error); });
        }
    };
    CheckoutNewComponent.prototype.handleSignupSuccess = function (data) {
        if (data.STATUS == "OK") {
            this.emailandphonenumberverifiationService.deleteTempSubsReqObject = {
                APPLICATION_ID: this.commonService.applicationId,
                TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
                SUBSCRIBER_EMAIL_ID: this.signupEmail,
                SUBSCRIBER_PASSWORD: this.signupPassword,
                STORE_ID: this.configService.getStoreID()
            };
            this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
            this.emailandphonenumberverifiationService.subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
            this.referenceMethodsService.referralFlag = false;
            this.afterSuccessfulSignUp();
        }
        else {
            this.commonService.notifyMessage(this.flashMessagesService, data.ERROR_MSG);
        }
    };
    // Sign Up ends
    CheckoutNewComponent.prototype.afterSuccessfulSignUp = function () {
        var _this = this;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.commonService.notifySuccessMessage(this.flashMessagesService, "User Registered Successfully.");
                        return [4 /*yield*/, this.commonService.delay(2000)];
                    case 1:
                        _a.sent();
                        this._router.navigate(['/collections/otp']);
                        return [2 /*return*/];
                }
            });
        }); })();
    };
    CheckoutNewComponent.prototype.validateSignUp = function () {
        var disabledValue = true;
        if (this.fName != "" && this.subscriberMobileNo != "" && this.loginEmail != "" && this.loginPassword != "")
            disabledValue = false;
        return disabledValue;
    };
    CheckoutNewComponent.prototype.onPaymentSubmit = function () {
        if (this.commonService.deliverySlotFlag) {
            this.updateDeliverySlot();
        }
        else {
            this.paymentUpdateToTransaction();
        }
    };
    CheckoutNewComponent.prototype.paymentUpdateToTransaction = function () {
        switch (this.selectedPaymentsId) {
            case ApplicationConstants_1.ApplicationConstants.INSTAMOJO_PAYMENT_GATEWAY_TYPE_CODE:
                this.triggerInstamojoPaymentGateway();
                break;
            case ApplicationConstants_1.ApplicationConstants.CASH_0N_DELIVERY_PAYMENT_GATEWAY_TYPE_CODE:
                this.updatePayment();
                break;
            case ApplicationConstants_1.ApplicationConstants.PAYPAL_PAYMENT_GATEWAY_TYPE_CODE:
                this.fetchPaymentGatewayCredentialsByStoreId();
                this.createTransactionPaymentGatewayHistory();
                this.createPaymentGatewayApiLog();
                // this.updatePaymentGatewayApiLog();
                break;
            case ApplicationConstants_1.ApplicationConstants.AUTHORIZE_NET_PAYMENT_GATEWAY_TYPE_CODE:
                this.fetchPaymentGatewayCredentialsByStoreId();
                this.createTransactionPaymentGatewayHistory();
                this.createPaymentGatewayApiLog();
                // this.updatePaymentGatewayApiLog();
                break;
            case ApplicationConstants_1.ApplicationConstants.RAZORPAY_PAYMENT_GATEWAY_TYPE_CODE: //RazorpayPayment
                this.paymentGatementCode = ApplicationConstants_1.ApplicationConstants.RAZORPAY_PAYMENT_GATEWAY_TYPE_CODE;
                this.updatePaymentMethodInTransaction();
                this.razorpayOrderRequestAPI();
                break;
            case ApplicationConstants_1.ApplicationConstants.WALLET_PAYMENT_GATEWAY_TYPE_CODE:
                this.updatePayment();
                break;
        }
    };
    CheckoutNewComponent.prototype.updatePaymentMethodInTransaction = function () {
        var _this = this;
        this.transactionObject = {
            PAYMENT_GATEWAY_CODE: this.paymentGatementCode,
            STORE_ID: this.configService.getStoreID(),
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            TRANSACTION_ID: this.commonService.lsTransactionId()
        };
        this.deliveryAddressService.updateTransaction(this.transactionObject)
            .subscribe(function (data) { return _this.handleUpdatePaymentMethodInTransactionSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    CheckoutNewComponent.prototype.handleUpdatePaymentMethodInTransactionSuccess = function (data) {
        if (data.STATUS == "OK") {
        }
    };
    // RazorpayPayment
    CheckoutNewComponent.prototype.razorpayOrderRequestAPI = function () {
        var _this = this;
        var reqObj = {
            ORDER_AMOUNT: this.transactionsService.transactionArray[0].INVOICE_FINAL_AMOUNT * 100,
            CURRENCY: "INR",
            TRANSACTION_ID: this.commonService.lsTransactionId(),
            STORE_ID: this.commonService.storeObject.STORE_ID
        };
        // currency from store if stored 
        if (this.commonService.storeObject.STORE_CURRENCY_NAME && this.commonService.storeObject.STORE_CURRENCY_NAME != 'null') {
            reqObj.CURRENCY = this.commonService.storeObject.STORE_CURRENCY_NAME;
        }
        this.paymentService.razorpayOrderRequestAPI(reqObj).subscribe(function (data) { return _this.handleRazorpayOrderRequestApi(data); }, function (error) { return error; });
    };
    CheckoutNewComponent.prototype.handleRazorpayOrderRequestApi = function (data) {
        var _this = this;
        if (data.STATUS == "OK") {
            this.razorpayPaymentLogId = data.RAZOPAY_PAYMENT_LOG_ID;
            var razorpayKey = "rzp_test_eBJrVRaCugEdpI";
            if (data.RAZOPAY_KEY && data.RAZOPAY_KEY != 'null')
                razorpayKey = data.RAZOPAY_KEY;
            var orderObject = JSON.parse(data.ORDER);
            var RazorpayOptions = {
                "key": razorpayKey,
                "amount": this.transactionsService.transactionArray[0].INVOICE_FINAL_AMOUNT * 100,
                "currency": "INR",
                "name": this.commonService.storeObject.STORE_NAME,
                "description": "Test Transaction",
                "image": this.commonService.storeObject.STORE_LOGO_URL,
                "order_id": orderObject.id,
                "handler": function (response) {
                    _this.handleRazorpayPayment(response);
                },
                "prefill": {
                    "name": "",
                    "email": "",
                    "contact": ""
                },
                "notes": {
                    "address": ""
                },
                "theme": {
                    "color": "#3399cc"
                }
            };
            // this is the detail pre populated in the payment popup
            var subscriberObject = this.commonService.lsSubscriberObject();
            if (subscriberObject != undefined) {
                RazorpayOptions.prefill.name = subscriberObject.name;
                RazorpayOptions.prefill.email = subscriberObject.email;
                RazorpayOptions.prefill.contact = subscriberObject.mobile;
            }
            // payment pop up color (store color) 
            if (this.commonService.storeObject.STORE_THEME_HEX_COLOR_CODE && this.commonService.storeObject.STORE_THEME_HEX_COLOR_CODE != 'null') {
                RazorpayOptions.theme.color = this.commonService.storeObject.STORE_THEME_HEX_COLOR_CODE;
            }
            // currency from store if stored 
            if (this.commonService.storeObject.STORE_CURRENCY_NAME && this.commonService.storeObject.STORE_CURRENCY_NAME != 'null') {
                RazorpayOptions.currency = this.commonService.storeObject.STORE_CURRENCY_NAME;
            }
            //@ts-ignore
            var rzp1 = new Razorpay(RazorpayOptions);
            rzp1.open();
            rzp1.on('payment.failed', function (response) {
                // alert(response.error.code);
                // alert(response.error.description);
                // alert(response.error.source);
                // alert(response.error.step);
                // alert(response.error.reason);
                // alert(response.error.metadata.order_id);
                // alert(response.error.metadata.payment_id);
                _this.handleRazorpayFailureResponse(response);
            });
        }
    };
    CheckoutNewComponent.prototype.handleRazorpayPayment = function (pRazorpayObject) {
        var _this = this;
        console.log("pRazorpayObject", pRazorpayObject);
        var responseObject = {
            RAZORPAY_PAYMENT_ID: pRazorpayObject.razorpay_payment_id,
            RAZORPAY_ORDER_ID: pRazorpayObject.razorpay_order_id,
            RAZORPAY_SIGNATURE: pRazorpayObject.razorpay_signature,
            TRANSACTION_ID: this.commonService.lsTransactionId(),
            RAZOPAY_PAYMENT_LOG_ID: this.razorpayPaymentLogId
        };
        this.paymentService.updateRazorPayResposeAPI(responseObject)
            .subscribe(function (data) { return _this.handleUpdateRazorpayResponseAPI(data); }, function (error) { return error; });
    };
    CheckoutNewComponent.prototype.handleRazorpayFailureResponse = function (pResponseObject) {
        console.log("failureResponseObject", pResponseObject);
    };
    CheckoutNewComponent.prototype.handleUpdateRazorpayResponseAPI = function (data) {
        if (data.STATUS == "OK") {
            // this.commonService.openAlertBar("Payment Succussful");
            this._router.navigate(['/collections/customer-invoice', this.commonService.lsTransactionId()]);
        }
        else if (data.STATUS == "FAIL") {
            this.commonService.openAlertBar(data.ERROR_MSG);
        }
    };
    CheckoutNewComponent.prototype.triggerInstamojoPaymentGateway = function () {
        var _this = this;
        this.processBar = true;
        this.paymentService.createAPaymentRequestAPI(this.configService.getStoreID(), this.commonService.lsSubscriberId(), this.transactionId).subscribe(function (data) { return _this.handleCreatePaymentRequestAPIResponse(data); }, function (error) { return _this.handleError(error); });
        ;
    };
    CheckoutNewComponent.prototype.handleCreatePaymentRequestAPIResponse = function (data) {
        if (data.STATUS == "OK") {
            var paymentURL = data.PAYMENT_REQUESTED_LONGURL;
            window.open(paymentURL, "_self");
        }
        this.processBar = false;
    };
    CheckoutNewComponent.prototype.fetchPaymentGatewayCredentialsByStoreId = function () {
        var _this = this;
        this.processBar = true;
        var tempObj = {
            STORE_ID: this.configService.getStoreID()
        };
        this.deliveryAddressService.fetchPaymentGatewayCredentialsByStoreId(tempObj).subscribe(function (data) { return _this.handleFetchPaymentGatewayCredentialsByStoreIdSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    CheckoutNewComponent.prototype.handleFetchPaymentGatewayCredentialsByStoreIdSuccess = function (data) {
        if (data.STATUS == "OK") {
            this.paymentGatewayCredentialsArray = data.PAYMENT_GATEWAY_CREDENTIALS;
        }
        this.processBar = false;
    };
    //Fetch Payment Gateway Credentials Ends here     
    //Create Payment Gateway History Starts here 
    CheckoutNewComponent.prototype.createTransactionPaymentGatewayHistory = function () {
        var _this = this;
        var tempObj = {
            TRANSACTION_ID: this.commonService.lsTransactionId(),
            PAYMENT_GATEWAY_TYPE_CODE: this.selectedPaymentsId,
            PAYMENT_REQUEST_ID: this.paypalResponseObject.id //This will be implement once everything is done
        };
        this.deliveryAddressService.createPaymentGatewayHistoryAPI(tempObj).subscribe(function (data) { return _this.handleCreateTransactionPaymentGatewayHistorySuccess(data); }, function (error) { return _this.handleError(error); });
    };
    CheckoutNewComponent.prototype.handleCreateTransactionPaymentGatewayHistorySuccess = function (data) {
        if (data.STATUS == "OK") {
            console.log("createTransactionPaymentGatewayHistory");
            console.log(data);
        }
        this.processBar = false;
    };
    CheckoutNewComponent.prototype.createPaymentGatewayApiLog = function () {
        var _this = this;
        var tempObj = {
            PAYMENT_GATEWAY_TYPE_CODE: this.selectedPaymentsId,
            API_TYPE_CODE: 1,
            PAYMENT_REQUEST_ID: this.paypalResponseObject.id,
            REQUEST_CONTENT: "",
            RESPONSE_CONTENT: ""
        };
        this.deliveryAddressService.createPaymentAPILogAPI(tempObj).subscribe(function (data) { return _this.handleCreatePaymentGatewayApiLogSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    CheckoutNewComponent.prototype.handleCreatePaymentGatewayApiLogSuccess = function (data) {
        if (data.STATUS == "OK") {
            console.log("createPaymentAPILogAPI");
            console.log(data);
            this.paymentApiLogId = data.AUTHORIZENET_PAYMENT_API_LOG_ID;
            this.updatePaymentGatewayApiLog();
        }
        this.processBar = false;
    };
    //Create Payment API Log Ends here 
    //Update Payment API Log Starts here 
    CheckoutNewComponent.prototype.updatePaymentGatewayApiLog = function () {
        var _this = this;
        var tempObj = {
            PAYMENT_API_LOG_ID: this.paymentApiLogId,
            PAYMENT_GATEWAY_TYPE_CODE: this.selectedPaymentsId,
            API_TYPE_CODE: 1,
            PAYMENT_REQUEST_ID: this.paypalResponseObject.id,
            REQUEST_CONTENT: "",
            RESPONSE_CONTENT: ""
        };
        this.deliveryAddressService.updatePaymentAPILogAPI(tempObj).subscribe(function (data) { return _this.handleUpdatePaymentGatewayApiLogSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    CheckoutNewComponent.prototype.handleUpdatePaymentGatewayApiLogSuccess = function (data) {
        if (data.STATUS == "OK") {
            // this._router.navigate(['invoice']);
            this._router.navigate(['/collections/customer-invoice', this.commonService.lsTransactionId()]);
        }
        this.processBar = false;
    };
    CheckoutNewComponent.prototype.makeApplyPromocodeRequestObject = function () {
        this.applyPromocodeRequestObject = {
            STORE_ID: this.configService.getStoreID(),
            PROMO_CODE: this.promocode,
            SUBSCRIBER_ID: +this.commonService.lsSubscriberId(),
            TRANSACTION_ID: +this.commonService.lsTransactionId()
        };
    };
    CheckoutNewComponent.prototype.applyPromocode = function () {
        var _this = this;
        this.makeApplyPromocodeRequestObject();
        this.subscriberService.applyPromoCodeAPI(this.applyPromocodeRequestObject)
            .subscribe(function (data) { return _this.handleApplyPromocodeSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    CheckoutNewComponent.prototype.handleApplyPromocodeSuccess = function (data) {
        var _this = this;
        if (data.STATUS == "OK") {
            this.transactionsService.transactionArray = data.TRANSACTION;
            this.transactionsService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            data.TRANSACTION.forEach(function (element) {
                element.TRANSACTION_DETAIL.forEach(function (element) {
                    if (element.TRANSACTION_DETAIL_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.TRANSACTION_DETAIL_TYPE_CODE_PROMO_CODE) {
                        _this.promocodeDetailsObject = element;
                    }
                });
            });
            //disable promocode input box and apply button
            this.disablePromocodeInputAndApplyButton = true;
            //empty the promocode input 
            this.promocode = "";
        }
        if (data.STATUS == "FAIL") {
            (function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.invalidPromocodeNotification = data.ERROR_MSG;
                            return [4 /*yield*/, this.commonService.delay(2000)];
                        case 1:
                            _a.sent();
                            this.invalidPromocodeNotification = "";
                            return [2 /*return*/];
                    }
                });
            }); })();
            console.log(this.invalidPromocodeNotification);
        }
    };
    CheckoutNewComponent.prototype.makeCancelPromocodeRequestObject = function () {
        this.cancelPromocodeRequestObject = {
            STORE_ID: this.configService.getStoreID(),
            PROMO_CODE: this.promocodeDetailsObject.PROMO_CODE,
            SUBSCRIBER_ID: +this.commonService.lsSubscriberId(),
            TRANSACTION_ID: +this.commonService.lsTransactionId()
        };
    };
    CheckoutNewComponent.prototype.cancelPromocode = function () {
        var _this = this;
        this.makeCancelPromocodeRequestObject();
        this.subscriberService.cancelPromoCodeAPI(this.applyPromocodeRequestObject)
            .subscribe(function (data) { return _this.handleCancelPromocodeSuccess(data); }, function (error) { return _this.handleError(error); });
    };
    CheckoutNewComponent.prototype.handleCancelPromocodeSuccess = function (data) {
        if (data.STATUS == "OK") {
            this.transactionsService.transactionArray = data.TRANSACTION;
            this.transactionsService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.promocodeDetailsObject = this.promocodeDetailsSampleObject;
            this.disablePromocodeInputAndApplyButton = false;
        }
    };
    CheckoutNewComponent.prototype.applyWalletMoney = function () {
        var _this = this;
        this.walletMethodsService.applyWalletMoneyAPI();
        this.displayAppyWalletButton = false;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.delay(500)];
                    case 1:
                        _a.sent();
                        if (this.walletMethodsService.walletPaymentGatewayType == ApplicationConstants_1.ApplicationConstants.WALLET_PAYMENT_GATEWAY_TYPE_ID) {
                            this.flagsService.completelyWalletPaymentFlag = true; // This means completely wallet payments is done 
                            this.selectedPaymentsId = ApplicationConstants_1.ApplicationConstants.WALLET_PAYMENT_GATEWAY_TYPE_CODE;
                            // this.transactionsService.refreshWalletMoney();
                        }
                        return [2 /*return*/];
                }
            });
        }); })();
    };
    CheckoutNewComponent.prototype.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    CheckoutNewComponent.prototype.cancelWalletMoney = function () {
        this.walletMethodsService.cancelWalletMoneyAPI();
        this.displayAppyWalletButton = true;
        this.selectedPaymentsId = 1;
        this.flagsService.completelyWalletPaymentFlag = false;
        // this.transactionsService.refreshWalletMoney();
    };
    CheckoutNewComponent.prototype.mandatoryFieldsValidation = function () {
        var disable = true;
        if (this.loginEmail != "" && this.loginPassword != "")
            disable = false;
        return disable;
    };
    CheckoutNewComponent.prototype.gotoResetPassword = function () {
        this._router.navigate(['/reset-password']);
    };
    CheckoutNewComponent.prototype.onValueIn = function () {
        this.userProfileService.referralCode = this.referralCode;
    };
    CheckoutNewComponent.prototype.hideGuestCheckIn = function () {
        this.displayGuestCheckIn = false;
    };
    CheckoutNewComponent.prototype.showGuestCheckIn = function () {
        this.displayGuestCheckIn = true;
    };
    CheckoutNewComponent.prototype.validateGuestCheckInForm = function (ngObject) {
        this.guestCheckInFormInValid = true;
        if (ngObject._parent.form.status == "VALID") {
            this.guestCheckInFormInValid = false;
        }
    };
    CheckoutNewComponent.prototype.guestCheckIn = function () {
        var _this = this;
        if (this.guestCheckInFormInValid == false) {
            this.makeGuestCheckInRequestObjectObject();
            this.signupService.subscriberRegistrationAPI(this.guestCheckInRequestObject).
                subscribe(function (data) { return _this.socialSignupService.handleGuestCheckInSuccess(data); }, function (error) { return error; });
        }
    };
    CheckoutNewComponent.prototype.makeGuestCheckInRequestObjectObject = function () {
        this.guestCheckInRequestObject = {
            APPLICATION_ID: this.commonService.applicationId,
            SUBSCRIBER_FIRST_NAME: this.guestName,
            SUBSCRIBER_EMAIL_ID: this.guestEmail,
            SUBSCRIBER_TOKEN: "",
            SUBSCRIBER_STATUS_CODE: ApplicationConstants_1.ApplicationConstants.SUBSCRIBER_STATUS_CODE_ACTIVATED,
            PROVIDER_CODE: ApplicationConstants_1.ApplicationConstants.PROVIDER_CODE_GUEST_CHECK_IN,
            TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            TEMP_SUBSCRIBER_FLAG: 1,
            PROFILE_ID: ApplicationConstants_1.ApplicationConstants.DEFAULT_SUBSCRIBER_PROFILE_ID,
            STORE_ID: this.configService.getStoreID(),
            SUBSCRIBER_MOBILE_NR: this.guestMobileNumber,
            REFERRAL_FLAG: this.referenceMethodsService.referralFlag
        };
    };
    CheckoutNewComponent.prototype.handleGuestCheckInSuccess = function (data) {
    };
    CheckoutNewComponent.prototype.updateDayIndex = function (dayIndex) {
        this.dayIndex = dayIndex;
        this.timeIndex = 0;
        this.updateDeliveryTimingSlotId();
    };
    CheckoutNewComponent.prototype.updateTimeIndex = function (code) {
        this.timeIndex = code;
        this.updateDeliveryTimingSlotId();
    };
    CheckoutNewComponent.prototype.validateDeliveryOptions = function () {
        var disableButton = true;
        // Delivery Option shoule be selected 
        if (this.deliveryOptionCode > 0) {
            disableButton = false;
            // if Delivery Option is (1 or 2) and 3 also there and also timing slots are available then user needs to select delivery slot id 
            if ((this.deliveryOptionCode == 1 || this.deliveryOptionCode == 2) && this.deliveryTimingSlots.length > 0) {
                disableButton = true;
                if (this.timingSlotId > 0)
                    disableButton = false;
            }
            // if Only option 3 is availabe then delivery timing slot id > 0  
            if (this.deliveryOptionCode == 3) {
                disableButton = true;
                if (this.deliveryTimingSlotId > 0)
                    disableButton = false;
            }
        }
        return disableButton;
    };
    CheckoutNewComponent.prototype.formatTime = function (pTime) {
        var postFix = "AM";
        var timeObject = pTime.split(":");
        if (timeObject[0] > 12) {
            postFix = "PM";
            timeObject[0] = timeObject[0] - 12;
        }
        return timeObject[0] + ":" + timeObject[1] + " " + postFix;
    };
    CheckoutNewComponent.prototype.fetchDeliverySlotApi = function () {
        var _this = this;
        var tempObj = {
            APPLICATION_ID: this.commonService.applicationId,
            STATUS_CODE: ApplicationConstants_1.ApplicationConstants.STATUS_CODE_ENABLE,
            STORE_ID: this.configService.getStoreID(),
            PINCODE: this.selectedDeliveryAddressObject.ADDRESS_PINCODE,
            LATITUDE: this.selectedDeliveryAddressObject.ADDRESS_LATITUDE,
            LONGITUDE: this.selectedDeliveryAddressObject.ADDRESS_LONGITUDE
        };
        this.transactionsService.fetchDeliverySlotApi(tempObj).subscribe(function (data) { return _this.handleFetchDeliverySlotsApi(data); }, function (error) { return error; });
    };
    CheckoutNewComponent.prototype.handleFetchDeliverySlotsApi = function (data) {
        var _this = this;
        if (data.STATUS == "OK") {
            if (data.DELIVERY_OPTION && data.DELIVERY_OPTION.length > 0)
                this.deliveryOptions = data.DELIVERY_OPTION[0];
            if (this.deliveryOptions != undefined) {
                this.showDeliveryTimingSlots();
                if ((this.deliveryOptions.NORMAL_DELIVERY == 'true' || this.deliveryOptions.EXPRESS_DELIVERY == 'true') && this.deliveryOptions.DELIVERY_SLOT == 'true') { // 1 is Normal Delivery 
                    if (this.deliveryOptions.DELIVERY_SLOT_ARRAY && this.deliveryOptions.DELIVERY_SLOT_ARRAY.length > 0) {
                        this.deliveryOptions.DELIVERY_SLOT_ARRAY.forEach(function (timingSlot) {
                            var tempObj = {
                                DELIVERY_SLOT_ID: timingSlot.DELIVERY_SLOT_ID,
                                FROM: timingSlot.START_TIME,
                                TO: timingSlot.END_TIME
                            };
                            _this.deliveryTimingSlots.push(tempObj);
                        });
                    }
                }
                if (this.deliveryOptions.DELIVERY_SLOT == 'true') {
                    this.noOfDaysToBeShown = this.deliveryOptions.DELIVERY_SLOT_ARRAY[0].NO_OF_DAYS_VISIBLE;
                    this.makeDaysOfTheWeek(this.deliveryOptions.DELIVERY_SLOT_ARRAY);
                }
                this.selectFirstDeliveryOptionByDefault();
            }
            else {
                this.showPayments();
            }
        }
    };
    CheckoutNewComponent.prototype.selectFirstDeliveryOptionByDefault = function () {
        // if(this.deliveryOptions.NORMAL_DELIVERY == 'true'){
        //   this.deliveryOptionCode = 1;
        // } else if(this.deliveryOptions.EXPRESS_DELIVERY == 'true'){
        //   this.deliveryOptionCode = 2;
        // } else {
        //   this.deliveryOptionCode = 3;
        // }
    };
    CheckoutNewComponent.prototype.makeDaysOfTheWeek = function (deliverySlotsArray) {
        var _this = this;
        var currentDay = true;
        deliverySlotsArray.forEach(function (element) {
            var index = _this.daysOfTheWeek.indexOf(element.DAY_OF_WEEK);
            if (index == -1) { // this is for removing duplicates
                _this.daysOfTheWeek.push(element.DAY_OF_WEEK);
                var tempArray = [];
                tempArray.push(element);
                _this.tempTimeOfTheDay.push(tempArray);
            }
            else {
                _this.tempTimeOfTheDay[index].push(element);
            }
        });
        this.formatData();
    };
    CheckoutNewComponent.prototype.isTimeValid = function (data) {
        var valid = true;
        var timeObject = data.START_TIME.split(":");
        var hour = timeObject[0];
        var minute = timeObject[1];
        var second = timeObject[2];
        var currentHour = 0;
        var currentMin = 0;
        var currentSecond = 0;
        this.myDate = new Date();
        var date = this.myDate.setDate(this.myDate.getDate());
        var currentTime = this.datePipe.transform(date, 'HH-mm');
        var currentTimeObject = currentTime.split("-");
        currentHour = Number(currentTimeObject[0]);
        currentMin = Number(currentTimeObject[1]);
        var bufferTimeHour = 0;
        var bufferTimeMin = 0;
        var bufferTimeSec = 0;
        if (data.BUFFER_TIME_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.BUFFER_TIME_TYPE_CODE_HOUR)
            bufferTimeHour = data.BUFFER_TIME;
        if (data.BUFFER_TIME_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.BUFFER_TIME_TYPE_CODE_MIN)
            bufferTimeMin = data.BUFFER_TIME;
        if (data.BUFFER_TIME_TYPE_CODE == ApplicationConstants_1.ApplicationConstants.BUFFER_TIME_TYPE_CODE_SECOND)
            bufferTimeSec = data.BUFFER_TIME;
        currentSecond += bufferTimeSec;
        currentSecond += bufferTimeSec;
        if (currentSecond > 60) {
            currentMin += Math.floor(currentSecond / 60);
        }
        currentMin += bufferTimeMin;
        if (currentMin > 60) {
            currentHour += Math.floor(currentMin / 60);
            currentMin = currentMin % 60;
        }
        currentHour += bufferTimeHour;
        if (currentHour > hour || (currentHour == hour && currentMin > minute))
            valid = false;
        return valid;
    };
    CheckoutNewComponent.prototype.formatData = function () {
        var _this = this;
        var _loop_1 = function (i) {
            this_1.myDate = new Date();
            var date = this_1.myDate.setDate(this_1.myDate.getDate() + i);
            var formatedDate = this_1.datePipe.transform(date, 'dd-MM-yyyy');
            this_1.datesArray.push(formatedDate);
            var day = this_1.getDayNameByIndex(this_1.myDate.getDay());
            this_1.daysArray.push(day);
            // by using day get the index and put that in the first index
            var index = this_1.daysOfTheWeek.indexOf(day);
            var timesArray = this_1.tempTimeOfTheDay[index];
            // if(i==0) means current day 
            if (i == 0) {
                var tempTimesArray_1 = [];
                timesArray.forEach(function (element) {
                    if (_this.isTimeValid(element))
                        tempTimesArray_1.push(element);
                });
                timesArray = tempTimesArray_1;
            }
            this_1.timeOfTheDay.push(timesArray);
        };
        var this_1 = this;
        for (var i = 0; i < this.noOfDaysToBeShown; i++) {
            _loop_1(i);
        }
        this.updateDeliveryTimingSlotId();
    };
    CheckoutNewComponent.prototype.getDayNameByIndex = function (index) {
        var day = "";
        if (index == 0)
            day = "Sunday";
        if (index == 1)
            day = "Monday";
        if (index == 2)
            day = "Tuesday";
        if (index == 3)
            day = "Wednesday";
        if (index == 4)
            day = "Thursday";
        if (index == 5)
            day = "Friday";
        if (index == 6)
            day = "Saturday";
        return day;
    };
    CheckoutNewComponent.prototype.updateDeliveryTimingSlotId = function () {
        if (this.timeOfTheDay[this.dayIndex] != undefined && this.timeOfTheDay[this.dayIndex][this.timeIndex] != undefined)
            this.deliveryTimingSlotId = this.timeOfTheDay[this.dayIndex][this.timeIndex].DELIVERY_SLOT_ID;
    };
    CheckoutNewComponent.prototype.chekValidTime = function (pDate, pStartTime) {
        var invalidFlag = false;
        this.myDate = new Date();
        var date = this.myDate.setDate(this.myDate.getDate());
        var formatedCurrentDate = this.datePipe.transform(date, 'dd-MM-yyyy');
        if (pDate == formatedCurrentDate) {
            this.myDate = new Date();
            var date_1 = this.myDate.setDate(this.myDate.getDate());
            var currentTime = this.datePipe.transform(date_1, 'HH-mm');
            var currentTimeObject = currentTime.split("-");
            var currentHour = currentTimeObject[0];
            var currentMin = currentTimeObject[1];
            var selectedTimeObject = pStartTime.split(':');
            var selectedHour = selectedTimeObject[0];
            var selectedMin = selectedTimeObject[1];
            if (selectedHour > currentHour || (selectedHour == currentHour && selectedMin > currentMin))
                invalidFlag = true;
        }
        return invalidFlag;
    };
    CheckoutNewComponent.prototype.getDeliveryCharge = function () {
        var deliveryCharge = 0;
        if (this.deliveryOptionCode == 1) {
            deliveryCharge = this.deliveryOptions.NORMAL_DELIVERY_COST;
        }
        else if (this.deliveryOptionCode == 2) {
            deliveryCharge = this.deliveryOptions.EXPRESS_DELIVERY_COST;
        }
        else {
            this.getDeliverySlotCharges();
        }
        return deliveryCharge;
    };
    CheckoutNewComponent.prototype.updateDeliverySlot = function () {
        var _this = this;
        var requestObject = {
            STORE_ID: this.configService.getStoreID(),
            SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            TRANSACTION_ID: this.commonService.lsTransactionId(),
            DELIVERY_SLOT_ID: this.deliveryTimingSlotId,
            DELIVERY_OPTION_ID: this.deliveryOptions.DELIVERY_OPTION_ID,
            DELIVERY_CHARGES: this.getDeliveryCharge(),
            PRODUCT_GST_PERCENTAGE: this.transactionService.getMaxGSTPercentageInTheProductsInCart(),
            PRODUCT_GST_AMOUNT: this.transactionService.getGSTAmountOfDeliverySlotCharges(this.getDeliveryCharge()),
            DELIVERY_OPTION: this.selectedDeliveryOption,
            DELIVERY_SLOT_DAY: this.selectedDeliverySlotDay,
            DELIVERY_SLOT_TIME: this.selectedDeliverySlotTime
        };
        this.transactionService.applyDeliverySlotAPI(requestObject).subscribe(function (data) { return _this.handleUpdateDeliverySlot(data); }, function (error) { return error; });
    };
    CheckoutNewComponent.prototype.handleUpdateDeliverySlot = function (data) {
        if (data.STATUS == "OK") {
            this.transactionService.transactionArray = data.TRANSACTION;
            this.transactionService.transactionDetailsArray = data.TRANSACTION[0].TRANSACTION_DETAIL;
            this.paymentUpdateToTransaction();
        }
    };
    CheckoutNewComponent.prototype.getDeliverySlotCharges = function () {
        var deliverySlotCharge = 0;
        if (this.timeOfTheDay[this.dayIndex] != undefined
            && this.timeOfTheDay[this.dayIndex][this.timeIndex] != undefined
            && this.timeOfTheDay[this.dayIndex][this.timeIndex].DELIVERY_CHARGES != undefined)
            deliverySlotCharge = this.timeOfTheDay[this.dayIndex][this.timeIndex].DELIVERY_CHARGES;
        return deliverySlotCharge;
    };
    CheckoutNewComponent.prototype.otpLoginFormValidation = function (ngObject) {
        this.isOtpFormValid = false;
        if (ngObject._parent.form.status == "VALID")
            this.isOtpFormValid = true;
    };
    CheckoutNewComponent.prototype.makeOtpCheckInRequestObjectObject = function () {
        this.otpCheckInRequestObject = {
            APPLICATION_ID: this.commonService.applicationId,
            SUBSCRIBER_FIRST_NAME: this.otpFirstname,
            SUBSCRIBER_STATUS_CODE: ApplicationConstants_1.ApplicationConstants.SUBSCRIBER_STATUS_CODE_ACTIVATED,
            PROVIDER_CODE: ApplicationConstants_1.ApplicationConstants.PROVIDER_CODE_OTP_CHECK_IN,
            TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
            TEMP_SUBSCRIBER_FLAG: 1,
            PROFILE_ID: ApplicationConstants_1.ApplicationConstants.DEFAULT_SUBSCRIBER_PROFILE_ID,
            STORE_ID: this.configService.getStoreID(),
            SUBSCRIBER_MOBILE_NR: this.otpMobileNumber
        };
        console.log("make ends");
    };
    CheckoutNewComponent.prototype.otpCheckIn = function () {
        var _this = this;
        if (this.isOtpFormValid) {
            this.makeOtpCheckInRequestObjectObject();
            this.signupService.subscriberRegistrationAPI(this.otpCheckInRequestObject)
                .subscribe(function (data) { return _this.handleOtpCheckInSuccess(data); }, function (error) { return error; });
        }
    };
    CheckoutNewComponent.prototype.handleOtpCheckInSuccess = function (data) {
        if (data.STATUS == "OK") {
            this.emailandphonenumberverifiationService.deleteTempSubsReqObjectThroughOtp = {
                TEMP_SUBSCRIBER_ID: this.commonService.lsSubscriberId(),
                SUBSCRIBER_MOBILE_NR: this.otpMobileNumber,
                STORE_ID: this.configService.getStoreID()
            };
            this.commonService.addAuthTokenTols(data.SUBSCRIBER.AUTHENTICATION_TOKEN);
            this.emailandphonenumberverifiationService.subscriberId = data.SUBSCRIBER.SUBSCRIBER_ID;
            this._router.navigate(['mobile-otp']);
            this.referenceMethodsService.referralFlag = false;
        }
    };
    CheckoutNewComponent = __decorate([
        core_1.Component({
            selector: 'app-checkout-new',
            templateUrl: './checkout-new.component.html',
            styleUrls: ['./checkout-new.component.css']
        })
    ], CheckoutNewComponent);
    return CheckoutNewComponent;
}());
exports.CheckoutNewComponent = CheckoutNewComponent;
var UnavailableProductsDialog = /** @class */ (function () {
    function UnavailableProductsDialog(configService, unavailableProdDialog, data, transactionsService) {
        this.configService = configService;
        this.unavailableProdDialog = unavailableProdDialog;
        this.data = data;
        this.transactionsService = transactionsService;
    }
    /* To copy Text from Textbox */
    UnavailableProductsDialog.prototype.copyInputMessage = function (inputElement) {
        console.log("Hello");
        console.log(inputElement);
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
    };
    UnavailableProductsDialog.prototype.onNoClick = function () {
        this.unavailableProdDialog.close();
    };
    UnavailableProductsDialog.prototype.closeDialogue = function () {
        this.unavailableProdDialog.close();
    };
    UnavailableProductsDialog = __decorate([
        core_1.Component({
            selector: 'unavailable-products-dialog',
            templateUrl: './unavailable_products.html'
        }),
        __param(2, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], UnavailableProductsDialog);
    return UnavailableProductsDialog;
}());
exports.UnavailableProductsDialog = UnavailableProductsDialog;
// Dialog Code ends
// 2nd Dialog  (for showing delivery pincode status)
var Deliverypincode = /** @class */ (function () {
    function Deliverypincode(configService, deliverypincode, data, pincodeMethodsService) {
        this.configService = configService;
        this.deliverypincode = deliverypincode;
        this.data = data;
        this.pincodeMethodsService = pincodeMethodsService;
    }
    Deliverypincode.prototype.closeDialogue = function () {
        this.deliverypincode.close();
    };
    Deliverypincode = __decorate([
        core_1.Component({
            selector: 'delivery-pincode-staus-dialog',
            templateUrl: './delivery-pincode.html'
        }),
        __param(2, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], Deliverypincode);
    return Deliverypincode;
}());
exports.Deliverypincode = Deliverypincode;
