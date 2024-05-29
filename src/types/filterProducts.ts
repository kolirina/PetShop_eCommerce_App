export type FilteredProduct = {
  categories: Reference[];
  categoryOrderHints?: Record<string, unknown> | undefined;
  createdAt: string;
  description?: LocalizedString | undefined;
  hasStagedChanges?: boolean | undefined;
  id: string;
  key?: string | undefined;
  lastModifiedAt: string;
  masterVariant: Variant;

  metaDescription?: LocalizedString;
  metaTitle?: LocalizedString;
  name: LocalizedString;
  priceMode?: string | undefined;
  productType: Reference;
  published?: boolean | undefined;
  searchKeywords?: Record<string, unknown> | undefined;
  slug: LocalizedString;
  taxCategory?: Reference | undefined;
  variants: Variant[];
  version: number;
};

type Reference = {
  typeId: string;
  id: string;
};

type LocalizedString =
  | {
      [key: string]: string;
    }
  | undefined;

type Variant = {
  id: number;
  sku?: string;
  key?: string | undefined;
  prices?: Price[] | undefined;
  images?: Image[] | undefined;
  attributes?: Attribute[] | undefined;
  assets?: Asset[] | undefined;
  availability?: Availability | undefined;
};

type Price = {
  id: string;
  value: PriceValue;
  key?: string | undefined;
  discounted?: DiscountedPrice;
};

type PriceValue = {
  type: string;
  currencyCode: string;
  centAmount: number;
  fractionDigits: number;
};

type DiscountedPrice = {
  value: PriceValue;
  discount: Reference;
};

type Image = {
  url: string;
  label?: string | undefined;
  dimensions: Dimensions;
};

type Dimensions = {
  w: number;
  h: number;
};

type Attribute = {
  name: string;
  value: LocalizedString;
};

type Asset = {
  name: LocalizedString;
};

type Availability = {
  channels?: ChannelAvailability | undefined;
};

type ChannelAvailability = {
  // isOnStock: boolean;
  // restockableInDays: number;
  // availableQuantity: number;
  // version: number;
  // id: string;
};

export type FilteredProducts = FilteredProduct[];
