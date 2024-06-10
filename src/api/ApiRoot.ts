import {
  ClientBuilder,
  createAuthForClientCredentialsFlow,
  createHttpClient,
} from '@commercetools/sdk-client-v2';
import {
  createApiBuilderFromCtpClient,
  ApiRoot,
} from '@commercetools/platform-sdk';

const CTP_API_URL = import.meta.env.VITE_CTP_API_URL;
const CTP_AUTH_URL = import.meta.env.VITE_CTP_AUTH_URL;
const CTP_CLIENT_ID = import.meta.env.VITE_CTP_CLIENT_ID;
const CTP_CLIENT_SECRET = import.meta.env.VITE_CTP_CLIENT_SECRET;
const CTP_PROJECT_KEY = import.meta.env.VITE_CTP_PROJECT_KEY;
const CTP_SCOPES = import.meta.env.VITE_CTP_SCOPES;

if (
  !CTP_API_URL ||
  !CTP_AUTH_URL ||
  !CTP_CLIENT_ID ||
  !CTP_CLIENT_SECRET ||
  !CTP_PROJECT_KEY ||
  !CTP_SCOPES
) {
  throw new Error('Some or all environment variables are not defined.');
}

export const projectKey = CTP_PROJECT_KEY;
export const authMiddlewareOptions = {
  host: CTP_AUTH_URL,
  projectKey: CTP_PROJECT_KEY,
  credentials: {
    clientId: CTP_CLIENT_ID,
    clientSecret: CTP_CLIENT_SECRET,
  },
  scopes: [`manage_project:${CTP_PROJECT_KEY}`],
  fetch,
};

export const httpMiddlewareOptions = {
  host: CTP_API_URL,
  fetch,
};

let client;

if (localStorage.getItem('anonymous_token')) {
  client = new ClientBuilder()
    .withProjectKey(CTP_PROJECT_KEY)
    .withMiddleware(createAuthForClientCredentialsFlow(authMiddlewareOptions))
    .withMiddleware(createHttpClient(httpMiddlewareOptions))
    .withUserAgentMiddleware()
    .withExistingTokenFlow(localStorage.getItem('anonymous_token') ?? '', {
      force: true,
    })
    .build();
  localStorage.removeItem('anonymous_token');
} else {
  client = new ClientBuilder()
    .withProjectKey(CTP_PROJECT_KEY)
    .withMiddleware(createAuthForClientCredentialsFlow(authMiddlewareOptions))
    .withMiddleware(createHttpClient(httpMiddlewareOptions))
    .withUserAgentMiddleware()
    .build();
}

export const apiRoot: ApiRoot = createApiBuilderFromCtpClient(client);
