export interface FacebookPage {
  id: string;
  pageAccessToken?: string;
  name: string;
  pictureUrl: string;
}

export interface User {
  name?: string;
  email?: string;
  image?: string;
  facebookAccessToken?: string;
  facebookPages?: FacebookPage[];
}
