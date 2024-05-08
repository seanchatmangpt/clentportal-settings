interface Config {
  mode: string
  REST_API_URLS: string
  firebase: { [key: string]: any }
  domain?: string
  ASSETS_URL: string
  INTERNAL_URL: string
  certificatesRegistryDomain: string
}
const firebaseStagingConfig = {
  apiKey: 'AIzaSyAbVVAyzRuw0Mx18DYczCehMsjWFCYX1Lo',
  authDomain: 'highlevel-staging.firebaseapp.com',
  databaseURL: 'https://highlevel-staging.firebaseio.com',
  projectId: 'highlevel-staging',
  storageBucket: 'highlevel-staging.appspot.com',
  messagingSenderId: '85350210461',
  appId: '1:85350210461:web:d3728d34bf8bd6b5',
  cdnUrl: 'https://staging.cdn.apisystem.tech',
  assetsUrl: 'https://staging.cdn.apisystem.tech',
}
const firebaseProductionConfig = {
  apiKey: 'AIzaSyB_w3vXmsI7WeQtrIOkjR6xTRVN5uOieiE',
  authDomain: 'highlevel-backend.firebaseapp.com',
  databaseURL: 'https://highlevel-backend.firebaseio.com',
  projectId: 'highlevel-backend',
  storageBucket: 'highlevel-backend.appspot.com',
  messagingSenderId: '439472444885',
  cdnUrl: 'https://cdn.apisystem.tech',
  assetsUrl: 'https://staging.cdn.apisystem.tech',
}

const config: { [key: string]: Config } = {
  development: {
    mode: 'dev',
    REST_API_URLS: 'https://staging.services.leadconnectorhq.com',
    INTERNAL_URL: 'https://staging.services.leadconnectorhq.com/clientclub',
    firebase: firebaseStagingConfig,
    ASSETS_URL: 'https://storage.googleapis.com/revex-client-portal-staging',
    domain: 'communities.staging.clientclub.net',
    certificatesRegistryDomain: 'staging.my-certificates.com',
  },
  staging: {
    mode: 'staging',
    REST_API_URLS: 'https://staging.services.leadconnectorhq.com',
    INTERNAL_URL: 'https://staging.services.leadconnectorhq.com/clientclub',
    firebase: firebaseStagingConfig,
    ASSETS_URL: 'https://storage.googleapis.com/revex-client-portal-staging',
    certificatesRegistryDomain: 'staging.my-certificates.com',
  },
  production: {
    mode: 'production',
    REST_API_URLS: 'https://services.leadconnectorhq.com',
    INTERNAL_URL: 'https://services.leadconnectorhq.com/clientclub',
    firebase: firebaseProductionConfig,
    ASSETS_URL: 'https://storage.googleapis.com/revex-client-portal-staging',
    certificatesRegistryDomain: 'my-certificates.com',
  },
}

const override = false

const overrideConfig = {
  override: true,
}
//@ts-ignore
const envConfig: Config = config[process.env.NODE_ENV]

export default override ? { ...envConfig, ...overrideConfig } : envConfig
