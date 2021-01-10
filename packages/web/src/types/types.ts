interface FacebookPage {
  name: string;
  picture: string;
}

interface User {
  name: string;
  email: string;
  image: string;
  facebookAccessToken: string;
  facebookPages: FacebookPage[];
}

export type { User, FacebookPage };
