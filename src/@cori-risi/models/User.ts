import { AuthUser, GetCurrentUserOutput } from "@aws-amplify/auth/cognito";
// import { CognitoAuthSignInDetails } from "@aws-amplify/auth/src/providers/cognito/types/models";

export default interface User extends AuthUser, GetCurrentUserOutput {
  userId: string;
  username: string;
  userType?: string;
  email?: string;
  groups?: string[];
  //signInDetails?: CognitoAuthSignInDetails, // <= This exists on AuthUser, but
                                              // the CognitoAuthSignInDetails type
                                              // cannot be imported outside of the
                                              // @aws-amplify/auth package :(
  signInUserSession?: {
    idToken: {
      payload: {
        name: string,
        email: string
      }
    }
  }
}
