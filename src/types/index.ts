export type Product = {
  _id?: string;
  productName: string;
  productPrice: string | number;
  productSizes: string;
  productQuantity: string;
  productImage: string[];
  productDescription: string;
  productSpecification: string;
  productCategory: string;
  accountId: string;
  path: string;
};

export type ForProductGrid = {
  products: Product[];
};

export type ForProductInfo = {
  product: Product[];
};

export type ForProductGridMap = Product & {};

// type ProductPrice = Exclude<Product, 'productSizes'>['productPrice']
type ProductPrice = Exclude<Product, null>["productPrice"];
