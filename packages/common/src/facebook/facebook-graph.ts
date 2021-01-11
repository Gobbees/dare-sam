import axios from 'axios';
import GraphError from './errors';

const facebookGraphAPIVersion = 'v9.0';
const facebookGraphEndpoint = `https://graph.facebook.com/${facebookGraphAPIVersion}/`;

const sendGraphRequest = async (url: string, withGraphEndpoint: boolean) => {
  try {
    const response = await axios.get(
      `${withGraphEndpoint ? facebookGraphEndpoint : ''}${url}`,
    );
    return response.data;
  } catch (error) {
    if (
      error.response.status === 400 &&
      error.response.data.error.code === 190
    ) {
      throw new Error(GraphError.AUTH_EXPIRED);
    } else if (error.response.status === 403) {
      throw new Error(GraphError.RATE_LIMITED); // TODO add error code check
    }
    console.error(`Encountered error: ${error.message} while fetching ${url}`);
    return Promise.reject(error);
  }
};

const sendTokenizedRequest = async (
  url: string,
  doesUrlContainParams: boolean,
  token: string,
) => {
  try {
    const data = await sendGraphRequest(
      `${url}${doesUrlContainParams ? '&' : '?'}access_token=${token}`,
      true,
    );
    return data;
  } catch (error) {
    return undefined;
  }
};

const sendPagedRequest = async (url: string) => {
  try {
    const data = await sendGraphRequest(url, false);
    return data;
  } catch (error) {
    return undefined;
  }
};

export {
  sendTokenizedRequest,
  sendPagedRequest,
  facebookGraphEndpoint,
  facebookGraphAPIVersion,
};
