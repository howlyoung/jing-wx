// pages/access/access.js
var commom = require('../../common.js')
import WxValidate from '../../utils/WxValidate.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [
      {name: '个人', value: 0, key: 0 },
      {name: '公司', value: 1, key: 1 }
    ]
  },
  formSubmit: function(e) {
    var data = e.detail.value
    if(!this.WxValidate.checkForm(data)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'http://local.cp.com/index.php?r=jing-access/create&token='+token,
      data: {
        name: data.name,
        mobile: data.mobile,
        type: data.type,
        desc: data.desc,
        solution: data.solution,
        business: data.business,
        relation: data.relation
      },
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      method: "POST",
      success: function(res) {
        var r = res.data
        if(r.code == 1) {
          wx.setStorage({
            key: 'user_status',
            data: r.data.userStatus,
          })
          wx.showModal({
            title: '',
            content: '提交成功',
            showCancel: false,
            success: function(res) {
              wx.navigateTo({
                url: '../index/index',
              })
            }
          })
        } else {
          commom.login(function() {
            wx.showModal({
              content: 'token已失效，已重新登录!',
              showCancel: false
            })
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    commom.checkLoginStatus(function() {
      var userStatus = wx.getStorageSync('user_status')
      if (userStatus != 0) {
        wx.navigateTo({
          url: '../index/index',
        })
      } else {
        that.initValidate()
      }
    })

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
  initValidate: function() {
    const rules = {
      name: {
        required: true,
        rangelength: [2,4]
      },
      mobile: {
        required: true,
        tel: true
      },
      solution: {
        required: true,
        rangelength: [10, 50]
      },
      business: {
        required: true,
        rangelength: [10, 50]
      },
      relation: {
        required: true,
        rangelength: [10, 50]
      }
    }

    const messages = {
      name: {
        required: '请输入姓名',
        rangelengt: '请输入2-4个汉字'
      },
      mobile: {
        required: '请输入手机号',
        rangelength: '请输入正确手机号'
      },
      solution: {
        required: '请输入解决方案',
        rangelength: '请输入10-50个汉字'
      },
      business: {
        required: '请输入业务内容',
        rangelength: '请输入10-50个汉字'
      },
      relation: {
        required: '请输入供需关系',
        rangelength: '请输入10-50个汉字'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  showModal: function(error) {
    wx.showModal({
      content: error.msg,
      showCancel:false
    })
  }
})