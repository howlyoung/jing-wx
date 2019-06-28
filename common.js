function login(e) {
  wx.login({
    success(res) {
      if (res.code) {
        wx.request({
          url: 'http://local.cp.com/index.php?r=jing/login',
          data: {
            code: res.code
          },
          success: function (res) {
            console.log(res.data)
            var r = res.data
            if (r.code == 1) {
              wx.setStorageSync('token', r.data.token)
              wx.setStorageSync('user_status', r.data.userStatus)

              if (typeof e == 'function') {
                e()
              }
            }
          }
        })
      } else {
        console.log('fail')
      }
    }
  })
}

function checkLoginStatus(e='') {
  var token = wx.getStorageSync('token')
  wx.request({
    url: 'http://local.cp.com/index.php?r=jing/check-status',
    data: {
      token: token
    },
    method: 'GET',
    success: function (res) {
      var r = res.data

      if (r.code == -1) {
        //重新登录
        login(e)
      } else {
        wx.setStorageSync('user_status', r.data.userStatus)
        if (typeof e == 'function') {
          e()
        }
      }

    }
  })
}

module.exports = {
  login: login,
  checkLoginStatus: checkLoginStatus
}