import config from '../../MyNovelReader/config';

function buildError(message, response) {
  const error = new Error(message);
  if (response) {
    error.status = response.status;
    error.statusText = response.statusText;
    error.finalUrl = response.finalUrl;
  }
  return error;
}

/**
 * GM_xmlhttpRequest Promise wrapper
 *
 * @export
 * @param {string} url
 * @param {object} [opt={}]
 * @returns {Promise<GM.Response>}
 */

export function GM_request(url, opt = {}) {
  return new Promise((resolve, reject) => {
    const { timeout, ...rest } = opt;
    const requestOptions = {
      method: 'GET',
      url,
      timeout: typeof timeout === 'number' ? timeout : config.xhr_time,
      ...rest,
    };

    let settled = false;
    const settle = fn => response => {
      if (settled) return;
      settled = true;
      fn(response);
    };

    try {
      GM_xmlhttpRequest({
        ...requestOptions,
        onload: settle(response => resolve(response)),
        onerror: settle(response => reject(buildError('GM_request failed', response))),
        ontimeout: settle(response => reject(buildError('GM_request timeout', response))),
      });
    } catch (error) {
      if (!settled) {
        settled = true;
        reject(error);
      }
    }
  });
}
