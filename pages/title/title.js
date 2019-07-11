// pages/title/title.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    code: '',
    address: '',
    addressee: '',
    mobile: '',
    mail: '',
    bankCode: '',
    bankCard: '',
    companyAddress: '',
    companyTel: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  formSubmit: function(e) {
    console.log(e.detail.value)
    var data = e.detail.value
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.URL + 'index.php?r=jing-ticket/create-title&token=' + token,
      data: {
        title: data.title,
        code: data.code,
        mail: data.mail,
        address: data.address,
        addressee: data.addressee,
        mobile: data.mobile,
        bankCode: data.bankCode,
        bankCard: data.bankCard,
        companyAddress: data.companyAddress,
        companyTel: data.companyTel
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: "POST",
      success: function (res) {
        var r = res.data
        if (r.code == 1) {
          wx.navigateTo({
            url: '../ticket/ticket',
          })
        }
      }
    })
  }
})