export interface ICategories {
    PRODUCT_CATEGORY_ID               : number,
    PRODUCT_CATEGORY_NAME             : string,
    PARENT_PRODUCT_CATEGORY_ID        : number,
    PARENT_PRODUCT_CATEGORY_NAME      : string,
    SUB_CATEGORY                      : ICategories[]
}

