// pages/create/create.js 
var util = require('../../utils/util.js')
var meetingApi = require('../../utils/meeting-api.js')
var commonApi = require('../../utils/common-api.js')

Page({
  data: {
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    name: '',
    introduction: '',
    address: '',
    openId: 'hanyuking'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    that.initDateTime();
  },

  initDateTime() {
    var that = this;
    var date = new Date();
    var hours = date.getHours();
    var mins = date.getMinutes();

    that.setData({
      startDate: util.formatDate(date),
      endDate: util.formatDate(date),
      startTime: hours + ":" + mins,
      endTime: hours + ":" + mins
    });
  },

  bindStartTimeChange: function(e) {
    var that = this;
    that.setData({
      startTime: e.detail.value
    });
  },

  bindStartDateChange: function (e) {
    var that = this;
    that.setData({
      startDate: e.detail.value
    });
  },

  bindEndTimeChange: function (e) {
    var that = this;
    that.setData({
      endTime: e.detail.value
    });
  },

  bindEndDateChange: function (e) {
    var that = this;
    that.setData({
      endDate: e.detail.value
    });
  },

  bindMeetingNameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  bindMeetingIntroductionInput: function (e) {
    this.setData({
      introduction: e.detail.value
    })
  },

  bindMeetingAddrInput: function(e) {
    this.setData({
      address: e.detail.value
    })
  },

  /**
   * 会议创建操作
   */
  doCreate: function() {
    var that = this;
    var logo = getApp().globalData.userInfo.avatarUrl;
    console.log(logo);
    
    meetingApi.createMeeting(that.data, function(res) {
      if(res.success) {
        var meetingId = 1001;
        var meetingDetailUrl = '/pages/meeting_detail/detail?meetingId=' + meetingId;

        wx.showToast({
          title: '创建成功',
          icon: 'success',
          duration: 900,
          mask: true,
          success: function() {
            util.sleep(500); // 睡一下

            wx.navigateTo({
              url: meetingDetailUrl,
              fail: function() {  // 失败重试一下
                wx.navigateTo({
                  url: meetingDetailUrl,
                })
              }
            })
          },
          fail: function () { // 失败重试一下
            wx.navigateTo({
              url: meetingDetailUrl,
              fail: function () {
                wx.navigateTo({
                  url: meetingDetailUrl,
                })
              }
            })
          }
        })
        
      } else {

      }
    }, function() {
      util.toastNoneIcon("创建会议失败，请售后重试！");
    });
  }
})