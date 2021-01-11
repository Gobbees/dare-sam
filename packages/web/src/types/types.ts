interface FacebookPage {
  pid: string;
  pageAccessToken?: string;
  name: string;
  pictureUrl: string;
}

interface User {
  name?: string;
  email?: string;
  image?: string;
  facebookAccessToken?: string;
  facebookPages?: FacebookPage[];
}

export type { User, FacebookPage };
