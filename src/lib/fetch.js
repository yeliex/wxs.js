const { host } = require('./enums');
const { format, parse } = require('./url');

module.exports = (url, options = {}) => {
  url = url.replace(/^\/\//, host);

  const parsedUrl = parse(url);

  options.method = options.method ? options.method.toUpperCase() : 'GET';

  return new Promise((rec, rej) => {
    const request = new XMLHttpRequest();

    //request.withCredentials = true;

    const callback = (err, res) => {
      if (err) {
        rej(err);
        return;
      }
      rec(res);
    };

    request.onload = function(response) {
      const data = response.currentTarget.responseText;
      try {
        const json = JSON.parse(data);
        if (Number(json.status) === 200) {
          callback(null, json.data);
        } else {
          callback(json, null);
        }
      } catch (e) {
        callback('请求错误', null);
      }
    };

    request.onerror = function() {
      callback('请求错误', null);
    };

    request.open(options.method, format({
      protocol: parsedUrl.protocol,
      host: parsedUrl.host,
      pathname: parsedUrl.pathname,
      query: options.query
    }), true);

    if (['GET', 'HEAD'].includes(options.method)) {
      request.send();
      return;
    }
    request.setRequestHeader('content-type', 'application/json');
    request.send(JSON.stringify(options.body));
  });
};
