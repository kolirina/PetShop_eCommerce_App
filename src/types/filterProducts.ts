export type FilteredProduct = {
  categories: Reference[];
  categoryOrderHints?: Record<string, unknown>;
  createdAt: string;
  description?: LocalizedString;
  hasStagedChanges?: boolean;
  id: string;
  key?: string;
  lastModifiedAt: string;
  masterVariant: Variant;

  metaDescription?: LocalizedString;
  metaTitle?: LocalizedString;
  name: LocalizedString;
  priceMode?: string;
  productType: Reference;
  published?: boolean;
  searchKeywords?: Record<string, unknown>;
  slug: LocalizedString;
  taxCategory?: Reference;
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
  key?: string;
  prices?: Price[];
  images?: Image[];
  attributes?: Attribute[];
  assets?: Asset[];
  availability?: Availability;
};

type Price = {
  id: string;
  value: PriceValue;
  key?: string;
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
  label?: string;
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
  channels?: ChannelAvailability;
};

type ChannelAvailability = {
  isOnStock?: boolean;
  restockableInDays?: number;
  availableQuantity?: number;
  version?: number;
  id?: string;
};

export type FilteredProducts = FilteredProduct[];
