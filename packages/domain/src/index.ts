export type Brand<T, TBrand extends string> = T & {
  readonly __brand: TBrand;
};

export type TenantId = Brand<string, 'TenantId'>;
export type StorefrontId = Brand<string, 'StorefrontId'>;
export type ProductId = Brand<string, 'ProductId'>;

export const asTenantId = (value: string): TenantId => value as TenantId;
export const asStorefrontId = (value: string): StorefrontId => value as StorefrontId;
export const asProductId = (value: string): ProductId => value as ProductId;
