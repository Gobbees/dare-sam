import fetch from 'cross-fetch';
import { findGraphError } from './errors';

const facebookGraphAPIVersion = 'v9.0';
const facebookGraphEndpoint = `https://graph.facebook.com/${facebookGraphAPIVersion}/`;

const sendGraphRequest = async (url: string, withGraphEndpoint: boolean) => {
  try {
    const response = await fetch(
      `${withGraphEndpoint ? facebookGraphEndpoint : ''}${url}`,
    );
    // checks for Graph Errors
    const data = await response.json();
    const managedError = await findGraphError(response, data);
    if (managedError) {
      return Promise.reject(managedError);
    }
    return data;
  } catch (error) {
    console.error(`Encountered error: ${error.message} while fetching ${url}`);
    return Promise.reject(error);
  }
};

const sendTokenizedRequest = async (
  url: string,
  doesUrlContainParams: boolean,
  token: string,
) => {
  const data = await sendGraphRequest(
    `${url}${doesUrlContainParams ? '&' : '?'}access_token=${token}`,
    true,
  );
  return data;
};

const sendPagedRequest = async (url: string) => {
  const data = await sendGraphRequest(url, false);
  return data;
};

export {
  sendTokenizedRequest,
  sendPagedRequest,
  facebookGraphEndpoint,
  facebookGraphAPIVersion,
};
