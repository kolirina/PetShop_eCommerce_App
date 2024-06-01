export type Product = {
  id: string;
  version: number;
  versionModifiedAt?: string;
  lastMessageSequenceNumber?: number;
  createdAt: string;
  lastModifiedAt: string;
  productType: Reference;
  masterData: MasterData;
  key?: string | undefined;
  taxCategory?: Reference | undefined;
  priceMode?: string | undefined;
  lastVariantId?: number;
};

type Reference = {
  typeId: string;
  id: string;
};

type MasterData = {
  current: ProductData;
  staged: ProductData;
  published: boolean;
  hasStagedChanges: boolean;
};

type ProductData = {
  name: LocalizedString;
  description?: LocalizedString | undefined;
  categories: Reference[];
  categoryOrderHints?: Record<string, unknown> | undefined;
  slug: LocalizedString;
  metaTitle?: LocalizedString;
  metaDescription?: LocalizedString;
  masterVariant: Variant;
  variants: Variant[];
  searchKeywords: Record<string, unknown>;
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

type Availability = {
  channels?: ChannelAvailability | undefined;
};

type ChannelAvailability = {
  isOnStock?: boolean;
  restockableInDays?: number;
  availableQuantity?: number;
  version?: number;
  id?: string;
};

type Asset = {
  name: LocalizedString;
};

export type Products = Product[];
