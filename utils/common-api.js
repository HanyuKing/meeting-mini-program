var util = require("util.js")

var host = "https://www.hanyuking.com";
var imgHost = "https://image.hanyuking.com";

var retryCount = 6; // 重试次数
var retryTimes = [7, 23, 51, 101, 302];  // 重试时间数, 单位ms

/**
 * 获取用户 sessionId（唯一标识）
 */
function getLocalSessionId() {
  var app = getApp();
  var sessionId = null;
  if (app != undefined && (sessionId = app.globalData.sessionId) != null) {
    return sessionId;
  }

  getSessionId(function () { }, function () { });

  return false;
}

function getSessionId(successCallback, errorCallback) {
  
  getSessionIdHasRetry(successCallback, errorCallback, 0);
}

function getSessionIdHasRetry(successCallback, errorCallback, retry) {
  if (retry >= retryCount) {
    errorCallback();
    return false;
  }
  getJsCode(function(jsCode) {
    wx.request({
      url: host + '/meeting/getSessionId.action',
      data: {
        jsCode: jsCode
      },
      method: 'POST',
      header: { 'content-Type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.statusCode == 200 && res.data.success) {
          var app = getApp();
          if(app != undefined) {
            app.globalData.sessionId = res.data.data;
          }
          successCallback(res.data);
          return;
        } else {
          util.sleep(retryTimes[retry]);
          getSessionIdHasRetry(successCallback, errorCallback, retry + 1);
        }
      },
      fail: function (res) {
        util.sleep(retryTimes[retry]);
        getSessionIdHasRetry(successCallback, errorCallback, retry + 1);
      }
    })
  });
}

function getJsCode(callback) {
  wx.login({
    success: function (res) {
      var code = res.code;
      callback(code)
    }
  })
}

/**
 * 图片上传
 */
function uploadFile(url, filePath, name, formData, successCallback, failCallback) {
  util.showLoadingDialog("正在处理...");
  wx.uploadFile({
    url: url,
    filePath: filePath,
    name: name,
    formData: formData,
    success: function(res) {
      successCallback(res.data);
    },
    fail: function(res) {
      console.log(res);
      failCallback(res); 
    },
    complete: function(res) {
      util.hideLoadingDialog();
    }
  })
}

module.exports = {
  getSessionId: getSessionId,
  getJsCode: getJsCode,
  getLocalSessionId: getLocalSessionId,
  host: host,
  imgHost: imgHost,
  uploadFile: uploadFile
}  