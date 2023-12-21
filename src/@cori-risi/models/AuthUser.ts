export interface AuthUser {
  email?: string;
  username: string;
  userType: string;
  groups: string[];
  signInUserSession: {
    idToken: {
      payload: {
        name: string,
        email: string
      }
    }
  }
}
