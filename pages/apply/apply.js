// pages/apply/apply.js
import WxValidate from '../../utils/WxValidate.js'
var common = require('../../common.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageTitleArr: [
      { id: 'agreement', title: '与自创客协议', src: ''},
      { id: 'agent', title: '委托证明', src: '' },
      { id: 'id_card_u', title: '身份证正面', src: '' },
      { id: 'id_card_d', title: '身份证反面', src: '' },
      { id: 'current', title: '承诺书', src: '' },
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
    ],
    personName: '',
    busRange: '',
    busType: '',
    ticketContent: '',
    ticketType: '',
    host: ''
  },
  chooseImage: function(e) {
    var that = this
    var id = e.currentTarget.id

    wx.chooseImage({
      success: function(res) {
        var imageArr = that.data.imageTitleArr
  
        for (var i in imageArr) {
          if (imageArr[i].id == id) {
            imageArr[i].src = res.tempFilePaths
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

    wx.request({
      url: app.globalData.URL + 'index.php?r=jing-apply/create&token=' + token,
      data: data.form,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success:function() {
        console.log('success')
      }
    })

    that.uploadFile(that,data,token,i)
        
  },
  uploadFile: function(that,data,token,i) {
    var length = data.imageTitleArr.length

    var image = data.imageTitleArr[i]

    data.form.imgName = image.id
    for (var k=0;k<image.src.length;k++) {
      wx.uploadFile({
        url: app.globalData.URL + 'index.php?r=jing-apply/create&token=' + token,
        filePath: image.src[k],
        name: 'imageFile',
        header: {
          'content-type': 'multipart/form-data'
        },
        formData: data.form,
        success(res) {
          var r = JSON.parse(res.data)
          console.log(k)
          if (r.code == -1) {
            common.login(function () {
              wx.showModal({
                content: 'token已失效，已重新登录!',
                showCancel: false
              })
            })
          } else {
            console.log('success upload')
          }
        }
      })
    }

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

    // wx.uploadFile({
    //   url: app.globalData.URL + 'index.php?r=jing-apply/create&token=' + token,
    //   filePath: image.src,
    //   name: 'imageFile',
    //   header: {
    //     'content-type': 'multipart/form-data'
    //   },
    //   formData: data.form,
    //   success(res) {
    //     var r = JSON.parse(res.data)
        
    //     if(r.code == -1) {
    //       common.login(function () {
    //         wx.showModal({
    //           content: 'token已失效，已重新登录!',
    //           showCancel: false
    //         })
    //       })
    //     } else {
    //       if (++i < length) {
    //         that.uploadFile(that, data, token, i)
    //       } else {
    //         wx.showModal({
    //           content: '申请提交成功',
    //           showCancel: false,
    //           success() {
    //             wx.navigateTo({
    //               url: '../index/index',
    //             })
    //           }
    //         })
    //       }
    //     }
    //   }
    // })
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
    if(status == 4 || status == 3 || status == 5) {
      that.setData({
        editStatus: true
      })
    }

    wx.request({
      url: app.globalData.URL + 'index.php?r=jing-apply/get-apply&token=' + token,
      success: function(res) {
        var r = res.data
        if(r.code == 1) {

          if(r.data != '') {
            var form = {
              personName: '',
              tradeType: '',
              busRange: '',
              bankCard: r.data.bankCard,
              bankCode: r.data.bankCode
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
              passportImage: r.data.passport,
              ticketContent: r.data.ticketContent,
              ticketType: r.data.ticketType,
              busRange: r.data.busRange,
              busType: r.data.busType,
              personName: r.data.personName,
              host: r.data.hostInfo
            })
          }
        }
      }
    })
  },
  handleImagePreview: function (e) {
    if (this.endTime - this.startTime < 350) {
      var urls = []
      var type = e.currentTarget.dataset['type']
      var current = e.currentTarget.dataset['index']
      for (let i in this.data.imageTitleArr) {
        if (type == this.data.imageTitleArr[i].id) {
          urls = this.data.imageTitleArr[i].src
        }
      }
      wx.previewImage({
        urls: urls,
        current: urls[current]
      })
    }

  },
  bindtouchstart: function(e) {
    this.startTime = e.timeStamp
  },
  bindtouchend: function(e) {
    this.endTime = e.timeStamp
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
        if(res.statusCode ==  200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function(result) {
              console.log(result)
            }
          })
        }
      }
    })
  },
  delImage: function(e) {
    if (this.data.editStatus) {
      return false
    }
    var that = this
    var imgId = e.currentTarget.dataset.id
    var token = wx.getStorageSync('token')
    wx.showModal({
      title: '删除图片',
      content: '是否删除图片',
      success: function(res) {
        if(res.confirm) {
          wx.request({
            url: app.globalData.URL + 'index.php?r=jing-apply/del-image&token=' + token,
            data: {id: imgId},
            success:function(res) {
              if(res.data.code == 1) {
                wx.showModal({
                  title: '成功',
                  content: '操作成功',
                  showCancel:false,
                  success: function(r) {
                    if(r.confirm) {
                      that.onLoad()
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  auth: function() {
    var token = wx.getStorageSync('token')
    var that = this
    wx.request({
      url: app.globalData.URL + 'index.php?r=jing/auth&token=' + token,
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