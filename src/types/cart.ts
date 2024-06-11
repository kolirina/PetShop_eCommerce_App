export type ByProjectKeyMeCartsPost = {
  currency: string;
  customerId?: string;
};

export type CartInfo = {
  id: string;
  version: number;
};

type Price = {
  id: string;
  value: {
    type: string;
    currencyCode: string;
    centAmount: number;
    fractionDigits: number;
  };
  key?: string;
};

type Image = {
  url: string;
  label?: string;
  dimensions: {
    w: number;
    h: number;
  };
};

type Attribute = {
  name: string;
  value: string;
};

type Asset = unknown;

type DiscountedPricePerQuantity = unknown;

type MethodTaxRate = unknown;

export type LineItem = {
  id: string;
  productId: string;
  productKey?: string;
  name: {
    [language: string]: string;
  };
  productType: {
    typeId: string;
    id: string;
  };
  productSlug?: {
    [language: string]: string;
  };
  variant: {
    id: number;
    sku?: string;
    key?: string | undefined;
    prices?: Price[];
    images?: Image[];
    attributes?: Attribute[];
    assets?: Asset[];
  };
  price: Price;

  quantity: number;
  discountedPricePerQuantity: DiscountedPricePerQuantity[];
  perMethodTaxRate: MethodTaxRate[];
  lastModifiedAt?: string;
  state: {
    quantity: number;
    state: {
      typeId: string;
      id: string;
    };
  }[];
  priceMode: string;
  lineItemMode: string;
  totalPrice: {
    type: string;
    currencyCode: string;
    centAmount: number;
    fractionDigits: number;
  };
  taxedPricePortions: MethodTaxRate[]; // Мы не знаем структуру этих данных
};
