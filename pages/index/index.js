//index.js
//获取应用实例
const app = getApp()
var common = require('../../common.js')

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    status: 0,
    navData: [
      {
        name: "申请自创客",  //文本
        current: 1,    //是否是当前页，0不是  1是
        style: 0,     //样式
        ico: '',  //不同图标
        fn: 'applyUser'   //对应处理函数
      }, {
        name: "我要开票",
        current: 0,
        style: 0,
        ico: '',
        fn: 'applyTicket'
      }
      // , {
      //   name: "个人中心",
      //   current: 0,
      //   style: 1,
      //   ico: '',
      //   fn: 'user'
      // }
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindIndexTap: function() {
    var status = wx.getStorageSync('user_status')
    if(status == 0) {
      wx.navigateTo({
        url: '../access/access',
      })
    } else {
      console.log('已经初审')
    }
  }
  ,
  onLoad: function () {
    console.log('dfsdfsdfs')
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    var that = this

    common.checkLoginStatus(function () {
      var status = wx.getStorageSync('user_status')
      that.setData({
        status: status
      })
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  apply: function() {
    wx.navigateTo({
      url: '../apply/apply',
    })
  },
  ticket: function() {
    wx.navigateTo({
      url: '../ticket/ticket',
    })
  },
  title: function() {
    wx.navigateTo({
      url: '../title/title',
    })
  },
  login: function() {
    common.login()
  },
  status: function() {
    common.checkLoginStatus(function() {
      var status = wx.getStorageSync('user_status')
      console.log(status)
      var url = ''
      switch (status) {
        case 0:
          url = '../access/access'
          break
        case 1:
          url = '../index/index'
          break
        case 2:
          url = '../apply/apply'
          break
        case 3:
          url = '../ticket/ticket'
          break
      }
      wx.navigateTo({
        url: url,
      })
    })
  },
  applyUser: function() {
    common.checkLoginStatus(function () {
      var status = wx.getStorageSync('user_status')
      console.log(status)
      var url = ''
      switch (status) {
        case 0:
          url = '../access/access'
          break
        case 1:
          wx.showModal({
            content: '初审中',
            showCancel: false
          })
          break
        case 2:
        case 3:
        default:
          url = '../apply/apply'
          break
      }
      if(url != '') {
        wx.navigateTo({
          url: url,
        })
      }
    })
  },
  applyTicket: function() {
    common.checkLoginStatus(function () {
      var status = wx.getStorageSync('user_status')
      if(status == 3) {
        wx.navigateTo({
          url: '../ticket/ticket',
        })
      } else {
        wx.showModal({
          content: '自创客审核尚未完成',
          showCancel: false
        })
      }
    })
  },
  user: function() {
    wx.navigateTo({
      url: '../index/index',
    })
  }
})
