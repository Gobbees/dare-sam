import { Response } from 'cross-fetch';
/* eslint-disable no-unused-vars */
enum GraphError {
  AUTH_EXPIRED = 'AUTH_EXPIRED', // Invalid OAuth 2.0 Access Token
  RATE_LIMITED = 'RATE_LIMITED',
}

const findGraphError = async (
  response: Response,
): Promise<GraphError | undefined> => {
  if (response.status >= 200 && response.status < 300) {
    // no error
    return undefined;
  }
  const data = await response.json();
  if (response.status === 400 && data.error.code === 190) {
    return GraphError.AUTH_EXPIRED;
  }
  if (response.status === 403) {
    return GraphError.RATE_LIMITED; // TODO add error code check
  }
  return undefined;
};

/**
 * This function checks if the service should block the requests
 * to the Graph API with the specific acces token.
 * @param func the function to be executed.
 * @returns the input function result if the function returns without errors, otherwise a boolean
 * that states if the service should block all the requests to the GraphAPI with that access token.
 */
const shouldBlockRequests = async (func: () => any) => {
  try {
    const result = await func();
    return result;
  } catch (error) {
    if (
      error === GraphError.AUTH_EXPIRED ||
      error === GraphError.RATE_LIMITED
    ) {
      return true;
    }
    console.error(error.message);
    return false;
  }
};

export { GraphError, findGraphError, shouldBlockRequests };
