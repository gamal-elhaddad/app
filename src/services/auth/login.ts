import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions'
import { IUser } from 'src/types/apps/user';

export default (build: EndpointBuilder<any, any, any>) =>
  build.mutation<LoginResponse, LoginBody>({
    query: body => ({
      url: '/v4/pitch-owner-app/auth/signin',
      method: 'POST',
      body,
    }),
  })

export interface LoginBody {
  email: string;
  password: string
}

export interface LoginResponse {
  token: string;
  data: IUser
}

export type LoginFailure = {
  data: {
    code: number
    error: string
  }
}
