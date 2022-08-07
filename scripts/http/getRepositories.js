const got = require('got');

const { SEARCH_URI, TIMEOUT_MS } = process.env;

const queryParams = (params) => Object.entries(params || {})
    .reduce((acc, [key, val]) => {
      if (!val) { return acc; }
      return [...acc, `${key}=${val}`];
    }, []).join('&');

const pageCount = (count) => {
  if (!count) { return undefined; }
  return { per_page: count };
}

module.exports = ({ date, count }) => {  
  const params = {
    q: `created:>${date}`,
    sort: 'stars',
    order: 'desc',
    ...(pageCount(count)),
    page: 1,
  };

  const uri = `${SEARCH_URI}?${queryParams(params)}`;

  const options = {
    responseType: 'json',
    timeout: { request: TIMEOUT_MS },
  };

  return got.get(uri, options)
    .then((res) => res.body)
    .catch((err) => err?.response?.body || err.message);
};
