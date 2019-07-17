// pages/ticket/ticket.js
var common = require('../../common.js')
import WxValidate from '../../utils/WxValidate.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticket: [
    ],
    imageTitleArr: [
      { id: 'serviceBill', title: '税款凭证', src: '' },
      { id: 'amountBill', title: '公司向个体工商户打款凭证', src: '' },
      { id: 'agreement', title: '公司与个体工商户合作协议', src: '' },
    ],
    personName: '',
    title: '',
    titleFlag: false,
    index: 0,
    code: '',
    expressAddress: '',
    addressee: '',
    mobile: '',
    mail: '',
    amount: '',
    bankCode: '',
    bankCard: '',
    companyAddress: '',
    companyTel: '',
    radioItems: [
      { name: '普票', value: 0, key: 0 },
      { name: '专票', value: 1, key: 1 }
    ],
    ticketType: '',
    buttonSumit: true,
    receiveFlag: -1,
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate()
    var token = wx.getStorageSync('token')
    var that = this
    wx.request({
      url: app.globalData.URL + 'index.php?r=jing-ticket/get-title&token=' + token,
      success: function (res) {
        var r = res.data
        if (r.code == 1 && r.data.length != 0) {
          that.setData({
            ticket: r.data.list,
            code: r.data.list[0].code,
            expressAddress: r.data.list[0].expressAddress,
            addressee: r.data.list[0].addressee,
            mobile: r.data.list[0].mobile,
            mail: r.data.list[0].mail,
            title: r.data.list[0].title,
            titleFlag: true,
            bankCode: r.data.list[0].bankCode,
            bankCard: r.data.list[0].bankCard,
            companyAddress: r.data.list[0].companyAddress,
            companyTel: r.data.list[0].companyTel,
            imageTitleArr: r.data.imageArr,
            personName: r.data.personName
          })
          
          for (let index in r.data.imageArr) {
            if (r.data.imageArr[index].src.length != 0) {
              for(let key in r.data.imageArr[index].src) {
                wx.downloadFile({
                  url: r.data.imageArr[index].src[key],
                  success: function(res) {
                    if(res.statusCode == 200) {
                      r.data.imageArr[index].src[key] = res.tempFilePath
                      that.setData({
                        imageTitleArr: r.data.imageArr
                      })
                      console.log(that.data)
                    }
                  }
                })
              }
            }
          }
        } else if(r.code == -1) {
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
  pickerChange: function(e) {
    var index = e.detail.value
    var data = this.data.ticket[index]
    this.setData({
      index: index,
      title: data.title,
      code : data.code,
      expressAddress: data.expressAddress,
      addressee: data.addressee,
      mobile: data.mobile,
      mail: data.mail,
      bankCode: data.bankCode,
      title: data.title,
      titleFlag: true,
      bankCard: data.bankCard,
      companyAddress: data.companyAddress,
      companyTel: data.companyTel
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
    console.log(e)

    wx.chooseImage({
      success: function (res) {
        console.log(id)
        var imageArr = that.data.imageTitleArr
        for (var i in imageArr) {
          if (imageArr[i].id == id) {
            imageArr[i].src = res.tempFilePaths
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
  upload: function(e) {
      var that = this
      var data = this.data
    var validate = { title: data.title, code: data.code, amount: data.amount, ticketType: data.ticketType, personName: data.personName ,content: data.content}
      if(that.data.receiveFlag == 0) {
        validate['mail'] = that.data.mail
        validate['expressAddress'] = that.data.expressAddress == '' ? '无' : that.data.expressAddress
        validate['addressee'] = that.data.addressee == '' ? '无' : that.data.addressee
        validate['mobile'] = that.data.mobile == '' ? '无' : that.data.mobile
      } else if (that.data.receiveFlag == 1) {
        validate['expressAddress'] = that.data.expressAddress
        validate['addressee'] = that.data.addressee
        validate['mobile'] = that.data.mobile
        validate['mail'] = that.data.mail == '' ? '无' : that.data.mail
      }
console.log(validate)
    if (!this.WxValidate.checkForm(validate)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    if (that.data.buttonSumit) {
      that.setData({
        buttonSumit: false
      })

      var flag = Math.random().toString(36).substr(2)
      var token = wx.getStorageSync('token')
      wx.request({
        url: app.globalData.URL + 'index.php?r=jing-ticket/create&token=' + token,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          flag: flag,
          title: data.title,
          amount: data.amount,
          code: data.code,
          expressAddress: data.expressAddress,
          addressee: data.addressee,
          mobile: data.mobile,
          mail: data.mail,
          bankCode: data.bankCode,
          bankCard: data.bankCard,
          ticketType: data.ticketType,
          companyAddress: data.companyAddress,
          companyTel: data.companyTel,
          personName: data.personName,
          content: data.content
        },
        success: function (res) {
          if (res.data.code == 1) {
            var i = 0
            that.uploadFile(that, data, token, i, flag)
          }
        }
      })
    }
  
  },
  uploadFile: function(that,data,token,i,flag) {
    var length = data.imageTitleArr.length

    var image = data.imageTitleArr[i]
    for (var k = 0; k < image.src.length; k++) {
      console.log(flag)
      wx.uploadFile({
        url: app.globalData.URL + 'index.php?r=jing-ticket/create&token=' + token,
        filePath: image.src[k],
        name: 'imageFile',
        header: {
          'content-type': 'multipart/form-data'
        },
        formData: {
          flag: flag,
          imgName: image.id
        },
        success(res) {
          var r = JSON.parse(res.data)
          if (r.code == -1) {
            common.login(function () {
              wx.showModal({
                content: 'token已失效，已重新登录!',
                showCancel: false
              })
            })
          }
        }
      })
    }

    if (++i < length) {
      that.uploadFile(that, data, token, i, flag)
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

  },
  handleImagePreview: function(e) {
    var urls = []
    var type = e.currentTarget.dataset['type']
    var current = e.currentTarget.dataset['index']
    for (let i in this.data.imageTitleArr) {
      if(type == this.data.imageTitleArr[i].id) {
        urls = this.data.imageTitleArr[i].src
      }
    }
    wx.previewImage({
      urls: urls,
      current: urls[current]
    })
  },
  radioChange: function(res) {
    this.setData({
      ticketType: res.detail.value,
      receiveFlag: res.detail.value
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
        rangelength: [1, 200]
      },
      code: {
        required: true,
        rangelength: [10, 200]
      },
      amount: {
        required: true,
        number: true
      },
      ticketType: {
        required: true
      },
      personName: {
        required: true
      },
      expressAddress: {
        required: true
      },
      mobile: {
        required: true
      },
      addressee: {
        required: true
      },
      mail: {
        required: true
      },
      content: {
        required: true
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
      },
      amount: {
        required: '请输入开票金额',
        rangelength: ''
      },
      ticketType: {
        required: '请选择发票类型'
      },
      personName: {
        required: '请填写个人工商户'
      },
      expressAddress: {
        required: '请填写收件地址'
      },
      mobile: {
        required: '请填写收件人手机'
      },
      addressee: {
        required: '请填写收件人姓名'
      },
      mail: {
        required: '请填写邮箱'
      },
      content: {
        required: '请填写发票内容'
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