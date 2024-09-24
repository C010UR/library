export type Scalar = string | number | symbol | bigint | boolean | Date;
export type OneOrMany<Type> = Type | Type[];

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
  contact_information: null | object;
  image: null | string;
  slug: string;
  is_active: boolean;
  login_attempts: number;
  is_disabled: boolean;
  permissions: Permissions;
}
