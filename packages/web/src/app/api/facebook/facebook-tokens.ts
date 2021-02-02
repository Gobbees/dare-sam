import axios from 'axios';
import firebase from '../../../lib/firebase';
import 'firebase/auth';

/**
 * Fetches the Facebook Long Lived Token given the short given one
 * @param shortLivedToken the short given token
 */
const getFacebookLongLivedToken = async (shortLivedToken: string) => {
  const response = await axios.get(
    `/api/facebook/long-lived-token?shortLivedToken=${shortLivedToken}`,
  );

  const accessToken: string = response.data.access_token;
  if (!accessToken) {
    return Promise.reject(new Error('Access Token property not defined'));
  }

  return accessToken as string;
};

/**
 * Fetches the Facebook access token for the user.
 * This automatically asks for the following permissions:
 * - pages_show_list: allows your app to access the list of Pages a person manages.
 * - pages_read_engagement: allows your app to read content (posts, photos, videos, events) ...
 * - pages_read_user_content: allows your app to read user generated content on the Page, ...
 * If {@param instagramAccess} is true, it also adds:
 * - instagram_basic: allows your app to read an Instagram account profile's info and media.
 * For further information see https://developers.facebook.com/docs/permissions/reference.
 * @param instagramAccess should the token grant instagram access
 */
const getFacebookAccessToken = async (instagramAccess: boolean) => {
  const facebookProvider = new firebase.auth.FacebookAuthProvider();
  facebookProvider.setCustomParameters({
    display: 'popup',
  });
  firebase.auth().useDeviceLanguage();

  // pages related permissions
  facebookProvider.addScope('pages_show_list');
  facebookProvider.addScope('pages_read_engagement');
  facebookProvider.addScope('pages_read_user_content');
  if (instagramAccess) {
    // https://developers.facebook.com/docs/instagram-api/getting-started
    facebookProvider.addScope('instagram_basic');
  }

  const result = await firebase.auth().signInWithPopup(facebookProvider);
  return (result.credential as firebase.auth.OAuthCredential).accessToken;
};

export { getFacebookAccessToken, getFacebookLongLivedToken };
