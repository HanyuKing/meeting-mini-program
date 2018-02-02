var util = require('util.js')

var CONTENT_APPLICATION_JSON = "application/json"
var CONTENT_FORM = "application/x-www-form-urlencoded"

function POST(url, data, contentType, successCallback, errorCallback) {
  try {
    util.showLoadingDialog("正在处理...");
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: { 'content-Type': contentType },
      success: function (res) {
        util.hideLoadingDialog();

        if (res.statusCode == 200) {
          successCallback(res.data);
        } else {
          console.log(res);
          errorCallback();
        }
      },
      fail: function (res) {
        util.hideLoadingDialog();

        console.log(res);
        errorCallback(res);
      }
    })
  } catch(e) {
    console.log(e);
    util.hideLoadingDialog();
    util.toastNoneIcon("服务繁忙！");
  }
  
}

function GET(url, data, contentType, successCallback, errorCallback) {
  try {
    util.showLoadingDialog("正在处理...");
    wx.request({
      url: url,
      data: data,
      method: 'GET',
      header: { 'content-Type': contentType },
      success: function (res) {
        util.hideLoadingDialog();

        if (res.statusCode == 200) {
          successCallback(res.data);
        } else {
          console.log(res);
          errorCallback();
        }
      },
      fail: function (res) {
        util.hideLoadingDialog();
        
        console.log(res);
        errorCallback(res);
      }
    })
  } catch (e) {
    console.log(e);
    util.hideLoadingDialog();
    util.toastNoneIcon("服务繁忙！");
  }
}

module.exports = {
  POST : POST,
  GET : GET,
  FORM_C : CONTENT_FORM,
  APP_JSON_C : CONTENT_APPLICATION_JSON,

}