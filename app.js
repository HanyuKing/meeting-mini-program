//app.js
var commonApi = require("utils/common-api.js")
var util = require("utils/util.js")
App({
  onLaunch: function () {
    var that = this;
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 调用登录接口获取 sessionId（唯一标识）
    that.getAndSetSessionId();

    // 获取用户信息
    that.getUserInfo(function(){}, function() {
      wx.showModal({
        title: '警告',
        confirmText: "继续授权",
        cancelText: '取消',
        content: '您点击了拒绝授权，将无法正常使用会议签到的功能体验。请10分钟后再次点击授权，或者将微信退出后台，重新进入小程序。',
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
              success: (res) => {
                var isOpenUserInfoAuth = res.authSetting["scope.userInfo"];
                if(isOpenUserInfoAuth) {
                  that.getUserInfo(function(){
                    util.toastNoneIcon("授权成功");
                  }, function() {});
                } else {
                  util.toastNoneIcon("授权失败，您无法正常使用此系统！");
                }
              }
            }) 
          }
        }
      })
    })
  },

  getUserInfo: function(successCallback, failCallback) {
    var that = this;
    // 获取用户信息
    wx.authorize({
      scope: 'scope.userInfo',
      success() {
        wx.getSetting({
          success: res => {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                that.globalData.userInfo = res.userInfo
                if (that.globalData.userInfo != undefined && that.globalData.userInfo != null) {
                  successCallback();
                } else {
                  failCallback();
                }

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (that.userInfoReadyCallback) {
                  that.userInfoReadyCallback(res)
                }
              }
            })
          }
        })
      },
      fail: function(res) {
        console.log(res)
        failCallback();
      }
    });
  },

  getAndSetSessionId: function() {
    // 登录（主要获取sessionId，并存储在本地）
    var that = this;

    commonApi.getSessionId(function (res) {
      if (res.success) {
        that.globalData.sessionId = res.data;
      } else {
        util.toastNoneIcon("网络有些问题！请检查网络，重新进入");
      }
    }, function () {
      util.toastNoneIcon("网络有些问题！请检查网络，重新进入");
    });

  },
  globalData: {
    userInfo: null,
    sessionId: null,
  }
})