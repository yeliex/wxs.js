import wx from '../lib/wechat';
import enums from '../lib/enums';
import fetch from '../lib/fetch';
import utils from '../lib/utils';
import { auth } from '../lib/auth';

const flags = {
  configured: false,
  inited: false,
  openidProcess: false
};

const storage = {
  openid: ''
};

const configs = {
  wxs: {},
  sdk: {},
  wxconfig: {}
};

export const init = () => {
  if (!flags.configured) {
    throw new Error('Must call `config` before init sdk');
  }
  if (!flags.inited) {
    wx.config(configs.wxconfig);
  }
  return new Promise((rec, rej) => {
    wx.ready(() => {
      flags.inited = true;
      rec();
    });
    wx.error((e) => {
      rej(e.errMsg || e);
    });
  });
};

export const config = (options) => {
  if (!flags.configured) {
    const { id, mobile, token, beta, debug } = options;
    let { jsApiList } = options;
    jsApiList = jsApiList || [].concat(enums.JSApiList, beta ? enums.BetaJSApiList : []);

    if (!id || !token) {
      throw new Error('wxs appid and token is required');
    }

    configs.wxs = {
      id,
      mobile,
      token
    };

    return fetch(`https://wxs.yeliex.com/api/wxs/config/${configs.wxs.id}`).then((data) => {
      configs.wxconfig = Object.assign({}, data, { debug, beta, jsApiList });
      flags.configured = true;
      flags.inited = false;
      return configs.wxconfig;
    }).catch((e) => {
      console.error(e);
      utils.alert(`微信服务不可用: ${e.error || e.message || e}`);
      throw new Error(`Wechat config error: ${e}`);
    });
  }
  if (options && Object.keys(options).length > 0) {
    console.warn(`[WXS SDK]: SDK would only configured once`);
  }
  return Promise.resolve();
};

export const closeWindow = () => {
  return init().then(() => {
    wx.closeWindow();
  });
};

export const initShare = ({ title, desc, link, imgUrl, success, error, target = Object.keys(enums.shareTargets) }) => {
  return init().then(() => {
    wx.hideMenuItems(en);

    target.forEach((key) => {
      wx[`onMenuShare${key}`]({
        title,
        desc,
        link,
        imgUrl,
        success: typeof success === 'function' ? success : null,
        error: typeof error === 'function' ? error : null
      });
    });
  });
};

const callbackStack = [];

const handleCallback = (error, data) => {
  callbackStack.forEach((item, index) => {
    if (error && typeof item.rej === 'function') {
      item.rej(error);
    } else if (typeof item.rec === 'function') {
      item.rec(data);
    }
    delete callbackStack[index];
  });
};

export const openid = ({ info = false, state } = {}) => {
  return new Promise((rec, rej) => {
    if (storage.openid && !flags.openidProcess) {
      rec(storage.openid);
      return;
    }
    if (flags.openidProcess) {
      callbackStack.push({ rec, rej });
      return;
    }
    flags.openidProcess = true;

    rej('start auth process');
  }).catch(() => {
    return auth({
      wxsId: configs.wxs.id,
      appId: configs.wxconfig.appId,
      token: configs.wxs.token,
      state,
      info
    });
  }).then((data) => {
    handleCallback(null, data);
    flags.openidProcess = false;
    return data;
  }).catch((e) => {
    handleCallback(e, null);
    flags.openidProcess = false;
    return Promise.resolve(e);
  });
};

export const Wechat = wx;

export const JSApiList = enums.JSApiList;

export const BetaJSApiList = enums.BetaJSApiList;
