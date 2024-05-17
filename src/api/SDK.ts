import { ApiRoot } from '@commercetools/platform-sdk';
import { projectKey } from './ApiRoot';

export default async function getUser(
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
