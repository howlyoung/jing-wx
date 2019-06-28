// pages/ticket/ticket.js
var common = require('../../common.js')
import WxValidate from '../../utils/WxValidate.js'

Page({
      // {title: '武当派', code: 'sdfsdfsdffsfd',  expressAddress: '太华山', addressee: '张三丰', mobile: '151651654', mail: 'sdfsd@sdf.com', bankCode: '武林商业银行'},
      // { title: '峨眉派', code: '48464864846', expressAddress: '昆仑山', addressee: '周芷若', mobile: '15164511651', mail: 'cdcdc@sdf.com', bankCode: '武林商业银行'}
  /**
   * 页面的初始数据
   */
  data: {
    ticket: [
    ],
    imageTitleArr: [
      { id: 'serviceBill', title: '税款凭证', src: '' },
      { id: 'amountBill', title: '打款凭证', src: '' }
    ],
    title: '',
    titleFlag: false,
    index: 0,
    code: '',
    expressAddress: '',
    addressee: '',
    mobile: '',
    mail: '',
    bank: '',
    amount: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate()
    var token = wx.getStorageSync('token')
    var that = this
    wx.request({
      url: 'http://local.cp.com/index.php?r=jing-ticket/get-title&token=' + token,
      success: function (res) {
        var r = res.data
         console.log(r)
        if (r.code == 1 && r.data.length != 0) {
          that.setData({
            ticket: r.data,
            code: r.data[0].code,
            expressAddress: r.data[0].expressAddress,
            addressee: r.data[0].addressee,
            mobile: r.data[0].mobile,
            mail: r.data[0].mail,
            bank: r.data[0].bankCode,
            title: r.data[0].title,
            titleFlag: true
          })
        }

        console.log(that.data)
      }
    })
  },
  pickerChange: function(e) {
    var index = e.detail.value
    var data = this.data.ticket[index]
    this.setData({
      code : data.code,
      expressAddress: data.expressAddress,
      addressee: data.addressee,
      mobile: data.mobile,
      mail: data.mail,
      bank: data.bankCode,
      title: data.title,
      titleFlag: true
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
  addTitle: function() {
    wx.navigateTo({
      url: '../title/title',
    })
  },
  chooseImage: function (e) {
    var that = this
    var id = e.currentTarget.id

    wx.chooseImage({
      success: function (res) {
        console.log(id)
        var imageArr = that.data.imageTitleArr
        for (var i in imageArr) {
          if (imageArr[i].id == id) {
            imageArr[i].src = res.tempFilePaths[0]
          }
        }

        // 限制最多只能留下3张照片
        //that.data.images = images.length <= 3 ? images : images.slice(0, 3)
        that.setData({
          imageTitleArr: imageArr
        })
        console.log(that.data)
      },
    })
  },
  upload: function() {
      var that = this
      var data = this.data

    if (!this.WxValidate.checkForm({title:data.title,code:data.code})) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }

    // for(var k in data.imageTitleArr) {
    //   if(data.imageTitleArr[k].src == '') {
    //     this.showModal({msg: '请上传图片'})
    //     return false
    //   }
    // }
      var flag = Math.random().toString(36).substr(2)
      var token = wx.getStorageSync('token')
      var i = 0
      that.uploadFile(that,data,token,i,flag)
        
  },
  uploadFile: function(that,data,token,i,flag) {
    var length = data.imageTitleArr.length

    var image = data.imageTitleArr[i]
    wx.uploadFile({
      url: 'http://local.cp.com/index.php?r=jing-ticket/create&token=' + token,
      filePath: image.src,
      name: 'imageFile',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: {
        flag: flag,
        title: data.title,
        amount: data.amount,
        code: data.code,
        expressAddress: data.expressAddress,
        addressee: data.addressee,
        mobile: data.mobile,
        mail: data.mail,
        bank: data.bankCode,
        imgName: image.id
      },
      success(res) {
        console.log(res)
        if (++i < length) {
          that.uploadFile(that,data,token,i,flag)
        }

      }
    })
  },
  inputContent: function (input) {
    var key = input.currentTarget.id

    this.setData({
      [key]: input.detail.value
    })
    console.log(this.data)
  },
  applyUser: function () {
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
  },
  initValidate: function () {
    const rules = {
      title: {
        required: true,
        rangelength: [5, 20]
      },
      code: {
        required: true,
        rangelength: [10, 20]
      }
    }

    const messages = {
      title: {
        required: '请输入抬头',
        rangelength: ''
      },
      code: {
        required: '请输入识别号',
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
  }
})