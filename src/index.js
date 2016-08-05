/**
 * Creator: yeliex
 * Project: wxs.js
 * Description:
 */
const wx = require('../lib/wechat');
const $ = {
  ajax: require('node.ajax'),
  url: require('node.url')
};
const defaultJSApiList = [
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'onMenuShareQQ',
  'onMenuShareWeibo',
  'onMenuShareQZone',
  'startRecord',
  'stopRecord',
  'onVoiceRecordEnd',
  'playVoice',
  'pauseVoice',
  'stopVoice',
  'onVoicePlayEnd',
  'uploadVoice',
  'downloadVoice',
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'translateVoice',
  'getNetworkType',
  'openLocation',
  'getLocation',
  'hideOptionMenu',
  'showOptionMenu',
  'hideMenuItems',
  'showMenuItems',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'closeWindow',
  'scanQRCode',
  'chooseWXPay',
  'openProductSpecificView',
  'addCard',
  'chooseCard',
  'openCard'
];

const host = 'https://wxs.yeliex.com/api/';

const status = {
  wxs: {},
  openid: null,
  openidProcess: false,
  configured: false,
  config: null
};

const openidCallbackStacks = [];

(() => {
  const init = (callback) => {
    if (!status.configured) {
      wx.config(status.config);
    }

    if (typeof callback === 'function') {
      wx.ready(callback);
      wx.error(callback);
    }
  };

  const closeWindow = () => {
    init(wx.closeWindow);
  };

  const initShare = ({ title, desc, link, imgUrl, target = ['Timeline', 'AppMessage', 'QQ', 'Weibo', 'QZone'], success, cancel }) => {
    initial(()=> {
      const menuList = [];

      // hide menu items
      wx.hideMenuItems({
        menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:QZone', 'menuItem:share:facrbook']
      });

      target.forEach((i) => {
        wx[`onMenuShare${i}`]({
          title,
          desc,
          link,
          imgUrl,
          success: typeof success === 'function' ? success : '',
          cancel: typeof cancel === 'function' ? cancel : ''
        });

        switch (i.toLowerCase()) {
          case 'appmessage': {
            i = 'appMessage';
            break;
          }
          case 'timeline': {
            i = 'timeline';
            break;
          }
          case 'qq': {
            i = 'qq';
            break;
          }
          case 'weibo': {
            i = 'weiboApp';
            break;
          }
          case 'qzone': {
            i = 'QZone';
            break;
          }
        }
        menuList.push(`menuItem:share:${i}`);
      });

      // show share menu item
      wx.showMenuItems({ menuList });
    });
  };

  const openid = ({ force = false, state = 'SUCCESS', fullQuery = false, callback }) => {
    if (status.openidProcess) {
      if (typeof callback === 'function') {
        openidCallbackStacks.push(callback);
      }
      return;
    }

    status.openidProcess = true;

    const doCallback = (openid) => {
      openidCallbackStacks.forEach((func)=> {
        func(openid);
        status.openidProcess = false;
      });
    };

    // 首先获取地址参数
    if (!status.openid) {
      const params = location.href.parseUrl().params || {};
      if (params.openid) {
        status.openid = params.openid;
      } else {
        if (params.code) {
          // 从服务器获取openid
          const request = $.ajax(`${host}api/wxs/openid/57984c2ace75116230dc6464`, 'POST', {
            code: params.code,
            token: status.wxs.token,
            mobile: state.wxs.mobile
          });
          if (!request.status) {
            alert(`获取openid失败: ${request.error}`);
            throw new Error(`Get openid: ${request.error}`);
          } else {
            // 获取成功,避免刷新时code异常需要跳转
            location.replace(location.href.split('&').map((l)=>l.replace(/^code=.{1,}$/, `openid=${request.data}`)).join('&'));
            throw new Error('Need Rewrite');
          }
        } else {
          if (force) {
            // 跳转获取openid
            location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${status.config.appId}&redirect_uri=${encodeURI(fullQuery ? location.href : `${location.protocol}//${location.host}${location.pathname}`)}&response_type=code&scope=snsapi_base&state=${state}#wechat_redirect`);
          }
        }
      }
    }
    if (status.openid) {
      doCallback(status.openid);
      return status.openid;
    }
  };

  const initial = ({ id, mobile, token, jsApiList = defaultJSApiList, debug = process.env.NODE_ENV !== 'production' || false }) => {
    if (!status.config && id) {

      if (!id) {
        throw new Error('wxs appid is required');
      }

      status.wxs = { id, mobile, token };

      // 从服务器获取config
      const request = $.ajax(`${host}wxs/config/${status.wxs.id}`);
      if (!request.status) {
        alert(`微信服务不可用: ${request.error}`);
        throw new Error(`Wechat Config: ${request.error}`);
      }

      status.config = Object.assign({}, request.data, { debug, jsApiList });
    }

    return Object.assign({}, wx, { init, closeWindow, initShare, openid });
  }
})();