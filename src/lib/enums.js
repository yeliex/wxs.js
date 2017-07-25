exports.JSApiList = [
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

exports.BetaJSApiList = [
  'openWXDeviceLib',
  'closeWXDeviceLib',
  'getWXDeviceInfos',
  'sendDataToWXDevice',
  'startScanWXDevice',
  'stopScanWXDevice',
  'connectWXDevice',
  'disconnectWXDevice',
  'getWXDeviceTicket',
  'configWXDeviceWiFi',
  'onWXDeviceBindStateChange',
  'onWXDeviceStateChange',
  'onReceiveDataFromWXDevice',
  'onScanWXDeviceResult',
  'onWXDeviceBluetoothStateChange',
  'onWXDeviceLanStateChange'
];

exports.host = 'https://wxs.yeliex.com/api/';

exports.shareTargets = {
  Timeline: 'menuItem:share:timeline',
  AppMessage: 'menuItem:share:appMessage',
  QQ: 'menuItem:share:qq',
  Weibo: 'menuItem:share:weiboApp',
  QZone: 'menuItem:share:QZone'
};

exports.ScopeEnums = {
  base: 'snsapi_base',
  info: 'snsapi_userinfo'
};
