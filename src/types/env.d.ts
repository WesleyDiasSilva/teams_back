declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: '5000';
    OUTLOOK_USERNAME: string;
    OUTLOOK_PASSWORD: string;
    JWT_SECRET: string;
    URL_FRONT: string;
    PROJECT_ID_FIREBASE: string;
    PRIVATE_KEY_FIREBASE: string;
    CLIENT_EMAIL_FIREBASE: string;
  }
}
