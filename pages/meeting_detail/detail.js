// pages/meeting_detail/detail.js
var meetingApi = require('../../utils/meeting-api.js')
var util = require('../../utils/util.js')
var commonApi = require("../../utils/common-api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowApplys: false, // 是否显示报名列表，默认为 false（隐藏）
    isShowPunchs: false, // 是否显示打卡列表，默认为 false（隐藏）
    isShowDetail: false, // 是否显示会议详情

    applyOrPunchStatus: { // 1 可以报名, 2 可以打卡, 3 已经报名, 4 活动已结束
      status: 2,
      text: "立即报名",
      disabled: false,
      method: "punchMeeting", // applyMeeting  punchMeeting
    },

    // 会议详情
    meetingInfo: {
      meetingId: '',
      admin: '',  // 发起人(创建者)
      startTime: '',  // 会议开始时间
      endTime: '',  // 会议结束时间
      applyDeadline: '',  // 最晚报名时间
      meetingName: '', // 会议名称
      description: '', // 会议介绍
      status: '',
      location: '',
    },

    // 会议报名列表
    meetingApplys: [],

    // 会议打卡记录
    meetingPunchs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this;
    var meetingId = options.meetingId;

    that.getMeetingDetail(meetingId);

    this.setData({
      "meetingInfo.meetingId" : meetingId
    });
  },

  getMeetingDetail: function(meetingId) {
    var that = this;
    meetingApi.getMeetingDetail(meetingId, function(data) {
      console.log(data);
      var meetingDetail = data.meetingDetails == null ? {} : data.meetingDetails;
      var meetingApplys = data.registeredRecords == undefined 
                              || data.registeredRecords == null ? [] : data.registeredRecords;

      var meetingPunchs = data.signedRecords == undefined
        || data.registeredRecords == null ? [] : data.signedRecords;

      that.setData({
        meetingInfo: {
          meetingId: meetingId,
          admin: '',  // 发起人(创建者)
          startTime: '',  // 会议开始时间
          endTime: '',  // 会议结束时间
          applyDeadline: '',  // 最晚报名时间
          meetingName: '', // 会议名称
          description: meetingDetail.description, // 会议介绍
          status: meetingDetail.status,
          introdution: '',
          location: meetingDetail.location,
        },
        meetingApplys: meetingApplys,
        meetingPunchs: meetingPunchs,
      });
    }, function() {

    });
  },

  showDetail: function() {
    var that = this;

    that.setData({
      isShowDetail: !that.data.isShowDetail
    });
  },
  
  showApplys: function() {
    var that = this;

    that.setData({
      isShowApplys: !that.data.isShowApplys
    });
  },

  showPunchs: function() {
    var that = this;
    this.setData({
      isShowPunchs: !that.data.isShowPunchs
    });
  },

  /**
   * 会议报名
   */
  punchMeeting: function() {
    wx.chooseImage({
      count: 1, // 默认9
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        var formData = {
          meetingId: 1,
          openId: "hanyuking"
        };

        meetingApi.punch(tempFilePaths, formData, function(data) {
          console.log(data)
          var result = JSON.parse(data);
          if (result.success) {
            util.toastSuccessIcon("打卡成功");
          } else {
            util.toastNoneIcon("打卡失败");
          }
        }, function() {
          util.toastNoneIcon("打卡失败");
        });
      }
    })
  },

  /**
   * 强制结束会议
   */
  shutdownMeeting: function() {
    wx.showModal({
      title: '结束会议',
      content: '您是否要结束当前会议？',
      success: function (res) {
        if (res.confirm) {
          meetingApi.shutdownMeeting("111", function(data){
            if(data.success) {
              util.toastSuccessIcon("操作成功");
            } else {
              util.toastNoneIcon("操作失败");
            }
          }, function(){
            util.toastNoneIcon("操作失败");
          });
        } else if (res.cancel) {
          // do nothing
        }
      }
    })
  },

  applyMeeting: function() {
    meetingApi.applyMeeting("111", function (data) {
      console.log(data);
      if (data.success) {
        util.toastSuccessIcon("操作成功");
      } else {
        util.toastNoneIcon("操作失败");
      }
    }, function () {
      util.toastNoneIcon("操作失败");
    });
  },

  /**
   * 预览小程序码
   */
  preSPCode: function () {
    var that = this;
    // 请求后台获取小程序码，
    
    /**
     * 1、add name
     * 2、lazy load
     * 3、redis cache (url_key : url_value)
     */
    meetingApi.getMeetingCodeImage(that.data.meetingInfo, function(res){
        if(res.success) {
          wx.previewImage({
            current: commonApi.imgHost + res.data,
            urls: [commonApi.imgHost + res.data]
          })
         } else {
            util.toastNoneIcon("获取小程序码失败！请请稍后重试");   
         }
      }, function() {
        util.toastNoneIcon("获取小程序码失败！请请稍后重试");
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '会议签到系统',
      path: '/pages/meeting_detail/detail?meetingId=onSharAppMessage'
    }
  }
  // end
  })
