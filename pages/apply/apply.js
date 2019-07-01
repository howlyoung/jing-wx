// pages/apply/apply.js
import WxValidate from '../../utils/WxValidate.js'
var common = require('../../common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageTitleArr: [
      { id: 'argeement', title: '三方协议', src: ''},
      { id: 'agent', title: '代理证明', src: '' },
      { id: 'id_card_u', title: '身份证正面', src: '' },
      { id: 'id_card_d', title: '身份证反面', src: '' },
      { id: 'current', title: '现场照片', src: '' },
      // { id: 'passport', title: '营业执照', src: '' }
    ],
    passportImage: '',
    radioItems: [
      { name: '专票', value: 0, key: 0 },
      { name: '增票', value: 1, key: 1 }
    ],
    form: {
      bankCode: '',
      bankCard: '',
      creditNo: '',
    },
    editStatus: false,
    status: 4,
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
    ]
  },
  chooseImage: function(e) {
    var that = this
    var id = e.currentTarget.id

    wx.chooseImage({
      success: function(res) {
        var imageArr = that.data.imageTitleArr
        for (var i in imageArr) {
          if (imageArr[i].id == id) {
            imageArr[i].src = res.tempFilePaths[0]
          }
        }
        that.setData({
          imageTitleArr: imageArr
        })
      },
    })
  },
  upload: function() {
      var that = this
      var data = this.data

    if (!this.WxValidate.checkForm(data.form)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }

    for(var k in data.imageTitleArr) {
      if(data.imageTitleArr[k].src == '') {
        this.showModal({msg: '请上传图片'})
        return false
      }
    }
      var token = wx.getStorageSync('token')
      var i = 0
      that.uploadFile(that,data,token,i)
        
  },
  uploadFile: function(that,data,token,i) {
    var length = data.imageTitleArr.length

    var image = data.imageTitleArr[i]
    data.form.imgName = image.id
    wx.uploadFile({
      url: 'http://local.cp.com/index.php?r=jing-apply/create&token=' + token,
      filePath: image.src,
      name: 'imageFile',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: data.form,
      success(res) {
        var r = JSON.parse(res.data)
        
        if(r.code == -1) {
          common.login(function () {
            wx.showModal({
              content: 'token已失效，已重新登录!',
              showCancel: false
            })
          })
        } else {
          if (++i < length) {
            that.uploadFile(that, data, token, i)
          } else {
            wx.showModal({
              content: '申请提交成功',
              showCancel: false,
              success() {
                wx.navigateTo({
                  url: '../index/index',
                })
              }
            })
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate()
    var that = this
    var token = wx.getStorageSync('token')
    var status = wx.getStorageSync('user_status')
    that.setData({
      status: status
    })
    if(status == 4 || status == 3) {
      that.setData({
        editStatus: true
      })
    }

    wx.request({
      url: 'http://local.cp.com/index.php?r=jing-apply/get-apply&token=' + token,
      success: function(res) {
        var r = res.data
        if(r.code == 1) {

          if(r.data != '') {
            var form = {
              personName: '',
              tradeType: '',
              busRange: '',
              bankCard: r.data.bankCard,
            }
            for (var k in that.data.imageTitleArr) {
              var index = that.data.imageTitleArr[k].id
              if (r.data.hasOwnProperty(index)) {       
                that.data.imageTitleArr[k].src = r.data[index]
              }
            }
            that.setData({
              form: form,
              imageTitleArr: that.data.imageTitleArr,
              passportImage: r.data.passport
            })
          }
        }
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
  inputName: function(input) {
    var that = this
    that.setData({
      name: input.detail.value
    })
  },
  inputMobile: function(input) {
    var that = this
    that.setData({
      mobile: input.detail.value
    })
  },
  inputContent: function(input) {
    var key = input.currentTarget.id
    this.data.form[key] = input.detail.value
    const form = this.data.form
    this.setData({
      form: form
    })
  },
  initValidate: function () {
    const rules = {
      bankCard: {
        required: true,
        number: true
      },
      bankCode: {
        required: true,
        rangelength: [4,10]
      }
    }

    const messages = {
      bankCard: {
        required: '请输入银行卡号',
        rangelength: '请输入银行卡号'
      },
      bankCode: {
        required: '请输入开户行',
        rangelength: ''
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  showModal: function (error) {
    wx.showModal({
      content: error.msg,
      showCancel: false
    })
  },
  downloadPassport: function() {
    var that = this
    wx.downloadFile({
      url: that.data.passportImage,
      success (res) {
        console.log(res)
      }
    })
  },
  auth: function() {
    var token = wx.getStorageSync('token')
    var that = this
    wx.request({
      url: 'http://local.cp.com/index.php?r=jing/auth&token=' + token,
      success: function(res) {
        var r = res.data
        if(r.code == 1) {
          wx.setStorageSync('user_status', r.data.userStatus)
          that.setData({
            status: r.data.userStatus
          })
          that.onLoad()
        } else if(r.code ==-1) {
          common.login(function () {
            wx.showModal({
              content: 'token已失效，已重新登录!',
              showCancel: false
            })
          })
        }
      }
    })
  },
  applyUser: function () {
    common.checkLoginStatus(function () {
      var status = wx.getStorageSync('user_status')
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
      if (url != '') {
        wx.navigateTo({
          url: url,
        })
      }
    })
  },
  applyTicket: function () {
    common.checkLoginStatus(function () {
      var status = wx.getStorageSync('user_status')
      if (status == 3) {
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
  user: function () {
    wx.navigateTo({
      url: '../index/index',
    })
  }
})