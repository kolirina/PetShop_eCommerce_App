type Category = {
  id: string;
  version?: number;
  versionModifiedAt?: string;
  lastMessageSequenceNumber?: number;
  createdAt?: string;
  lastModifiedAt?: string;
  key?: string;
  name?: {
    [key: string]: string;
  };
  slug?: {
    [key: string]: string;
  };
  description?: {
    [key: string]: string;
  };
  ancestors?: CategoryType[];
  parent?: CategoryType;
  orderHint?: string;
  assets?: Asset[];
};

type CategoryType = {
  typeId: string;
  id: string;
};

type Asset = {
  name: LocalizedString;
};

type LocalizedString =
  | {
      [key: string]: string;
    }
  | undefined;

export default Category;
