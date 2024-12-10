export type Emirates = 'DUBAI' | 'ABU_DHABI' | 'SHARJAH' | 'AJMAN' | 'UMM_AL_QUWAIN' | 'RAS_AL_KHAIMAH' | 'FUJAIRAH';

export type AddressType = 'SHIPPING' | 'BILLING';

export interface Address {
  id: string;
  street: string;
  apartment: string;
  emirate: Emirates;
  country: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserAddress {
  id: string;
  street: string;
  apartment: string;
  emirate: Emirates;
  city?: string;
  pincode?: string;
  country?: string;
  isDefault: boolean;
  type: AddressType;
}
