const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function toastNoneIcon(text) {
  wx.showToast({
    title: text,
    icon: 'none',
    duration: 2000,
    mask: true,
  })
}

function toastSuccessIcon(text) {
  wx.showToast({
    title: text,
    icon: 'success',
    duration: 2000,
    mask: true,
  })
}

function toastLoadingIcon(text) {
  wx.showToast({
    title: text,
    icon: 'loading',
    duration: 2000,
    mask: true,
  })
}

function showLoadingDialog(text) {
  wx.showLoading({
    mask: true,
    title: text,
  })
}

function hideLoadingDialog() {
  wx.hideLoading();
}

// 毫秒
function sleep(duration) {
  var preNowTime = new Date().getTime();

  while(new Date().getTime() - preNowTime < duration) {}
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  toastNoneIcon: toastNoneIcon,
  toastSuccessIcon: toastSuccessIcon,
  toastLoadingIcon: toastLoadingIcon,
  showLoadingDialog: showLoadingDialog,
  hideLoadingDialog: hideLoadingDialog,
  sleep: sleep,
}
