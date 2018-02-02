var commonApi = require("common-api.js")
var restfulApi = require("restful-api.js")

/**
 * 分页、条件查询会议信息
 */
function getSearchMeeting(keyword, pageindex, callbackcount, successCallback, failCallback) {
  var url = commonApi.host + '/meeting/searchMeeting2.action';
  var data = {
    pageIndex: pageindex,
    keyword: keyword,
    pageSize: callbackcount,
    openId: commonApi.getLocalSessionId(),
    createOrJoin: 0, // 0 我创建的  1 我参加的
    _: Date.now()
  }

  restfulApi.GET(url, data, restfulApi.APP_JSON_C, successCallback, failCallback);
}

/**
 * 分页、条件查询会议信息（我创建的）
 */
function getSearchMeetingIed(keyword, pageindex, callbackcount, successCallback, failCallback) {
  var url = commonApi.host + '/meeting/searchMeeting2.action';
  var data = {
    pageIndex: pageindex,
    keyword: keyword,
    pageSize: callbackcount,
    openId: commonApi.getLocalSessionId(),
    createOrJoin: 1, // 0 我创建的  1 我参加的
    _: Date.now()
  }

  restfulApi.GET(url, data, restfulApi.APP_JSON_C, successCallback, failCallback);
}

/**
 * 拍照打卡
 */
function punch(filePath, formData, successCallback, failCallback) {
  formData.openId = commonApi.getLocalSessionId();
  var url = commonApi.host + '/meeting/punch.action';
  var filePath = filePath[0];
  var name = 'file';
  var formData = formData;

  // 上传图片，并打卡
  commonApi.uploadFile(url, filePath, name, formData, successCallback, failCallback);
}

/**
 * 结束会议
 */
function shutdownMeeting(meetingId, successCallback, failCallback) {

  var url = commonApi.host + '/meeting/shutdownMeeting.action';
  var data = {
    meetingId: meetingId,
    openId: commonApi.getLocalSessionId(),
  };

  restfulApi.POST(url, data, restfulApi.FORM_C, successCallback, failCallback);
}

/**
 * 报名会议
 */
function applyMeeting(meetingId, successCallback, failCallback) {
  var url = commonApi.host + '/meeting/applyMeeting.action';
  var data = {
    meetingId: meetingId,
    openId: commonApi.getLocalSessionId(),
  };

  restfulApi.POST(url, data, restfulApi.FORM_C, successCallback, failCallback);
}

/**
 * 创建会议
 */
function createMeeting(meetingObj, successCallback, failCallback) {
  meetingObj.openId = commonApi.getLocalSessionId();
  
  var url = commonApi.host + '/meeting/createMeeting.action';
  restfulApi.POST(url, meetingObj, restfulApi.APP_JSON_C, successCallback, failCallback);
}

/**
 * 获取会议小程序码
 */
function getMeetingCodeImage(meetingInfo, successCallback, failCallback) {
  var url = commonApi.host + '/meeting/getMeetingCodeImage.action';
  var data = {
    meetingId: meetingInfo.meetingId,
    meetingName: "meetingInfo.meetingName"
  };
  
  restfulApi.POST(url, data, restfulApi.FORM_C, successCallback, failCallback);
}

/**
 * 获取会议详情
 */
function getMeetingDetail(meetingId, successCallback, failCallback) {
  var url = commonApi.host + '/meeting/getMeetingDetail.action';
  var data = {
    meetingId: meetingId,
  };

  restfulApi.GET(url, data, restfulApi.FORM_C, successCallback, failCallback);
}

module.exports = {
  getSearchMeeting: getSearchMeeting,
  punch: punch,
  shutdownMeeting: shutdownMeeting,
  applyMeeting: applyMeeting,
  createMeeting: createMeeting,
  getMeetingCodeImage: getMeetingCodeImage,
  getMeetingDetail: getMeetingDetail,
  getSearchMeetingIed: getSearchMeetingIed
}