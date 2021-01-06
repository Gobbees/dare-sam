import fetch from 'node-fetch';
import GraphError from './errors';

const graphAPIVersion = 'v9.0';
const graphEndpoint = `https://graph.facebook.com/${graphAPIVersion}/`;

const sendGraphRequest = async (url: string, withGraphEndpoint: boolean) => {
  try {
    const response = await fetch(
      `${withGraphEndpoint ? graphEndpoint : ''}${url}`,
    );
    const body = await response.json();
    console.log(response.status);
    if (response.status === 400 && body.error.code === 190) {
      throw GraphError.AUTH_EXPIRED;
    } else if (response.status === 403) {
      throw GraphError.RATE_LIMITED; // TODO add error code check
    }
    return body;
  } catch (error) {
    console.error(`Encountered error: ${error} while fetching ${url}`);
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

export { sendTokenizedRequest, sendPagedRequest };
