import { ApiRoot } from '@commercetools/platform-sdk';
import { apiRoot, projectKey } from './ApiRoot';
import { UserInfo } from '../types';

async function getUser(
  email: string,
  password: string,
  passwordApiRoot: ApiRoot
) {
  const resp = await passwordApiRoot
    .withProjectKey({ projectKey })
    .me()
    .login()
    .post({
      body: {
        email,
        password,
        updateProductData: true,
      },
    })
    .execute();
  return resp;
}

async function registerUser(userInfo: UserInfo) {
  const resp = await apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .post({
      body: {
        email: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        password: userInfo.password,
      },
    })
    .execute();
  return resp;
}

export { getUser, registerUser };
