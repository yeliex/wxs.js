import { parse, format } from 'url';
import fetch from './fetch';
import { ScopeEnums, host } from './enums';

// 从token中获取用户信息对应的code
export const getUserInfo = ({ code, wxsId, token }) => {
  return fetch(`//wxs/oauth/info/${code}`, {
    method: 'GET',
    query: {
      id: wxsId,
      token
    }
  });
};

export const redirect = ({ wxsId, appId, scope = 'base', state }) => {
  const url = parse(location.href, true);
  delete url.query.code;
  delete url.query.openid;
  delete url.query.code;

  const apiHost = parse(host);

  window.location.replace(format({
    protocol: 'https:',
    host: 'open.weixin.qq.com',
    pathname: '/connect/oauth2/authorize',
    query: {
      appid: appId,
      redirect_uri: format({
        protocol: apiHost.protocol,
        host: apiHost.host,
        pathname: '/api/r/authorize',
        query: {
          id: wxsId,
          redirect: format({
            protocol: url.protocol,
            host: url.host,
            pathname: url.pathname,
            query: url.query
          })
        },
        hash: url.hash
      }),
      response_type: 'code',
      scope: ScopeEnums[scope] || ScopeEnums['code'],
      state
    },
    hash: '#wechat_redirect'
  }));
};

export const auth = ({ wxsId, appId, state, info, token }) => {
  const url = parse(location.href, true);

  state = state || url.query.state || 'success';

  if (info && url.query.code) {
    return getUserInfo({
      code: url.query.code,
      appId,
      wxsId,
      token
    });
  } else if (!info && url.query.openid) {
    return Promise.resolve(url.query.openid);
  } else {
    return Promise.resolve(redirect({
      wxsId,
      appId,
      state,
      scope: info ? 'info' : 'base'
    }));
  }
};
