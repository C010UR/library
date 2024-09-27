import * as React from 'react';

export type Scalar = string | number | symbol | bigint | boolean | Date | undefined;
export type OneOrMany<Type> = Type | Type[];

export type UserPermission =
  | 'SHOW_USERS'
  | 'UPDATE_USERS'
  | 'SHOW_PERMISSIONS'
  | 'UPDATE_PERMISSIONS'
  | 'MANAGE_PERMISSIONS';

export type Order = 'ASC' | 'DESC';

interface NavbarLink {
  name: string;
  link: string;
  icon?: React.ReactNode | React.JSX.Element;
}

export interface Permission<Users = User<undefined>[]> {
  id: number;
  name: string;
  description: string;
  users: Users;
}

export interface User<Permissions = Permission<undefined>[]> {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  middlename: null | string;
  full_name: string;
  contact_information: null | {key: string|undefined, value: string|undefined}[];
  image: null | string;
  slug: string;
  is_active: boolean;
  login_attempts: number;
  is_disabled: boolean;
  permissions: Permissions;
}

export interface PaginatedResult<Type> {
  meta: {
    paginated: boolean,
    page_size: number,
    page: number,
    count: number,
    orders: {[key: string]: Order},
    filters: {[key: string]: string|string[]},
  }
  result: Type[]
}
