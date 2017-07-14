//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
      delta:1,
      msg:'提交成功',
      icon:'weui-icon-success'
  },
  bindGoBack: function() {
      console.log(this.data.delta);
      wx.navigateBack({
          delta: parseInt(this.data.delta)
      })
  },
  onLoad:function (option) {
      console.log(option);
      if(option.hasOwnProperty('delta')) {
          this.setData({
              delta: option.delta
          })
      }

      if(option.hasOwnProperty('msg')) {
          this.setData({
              msg: option.msg
          })
      }

      if(option.hasOwnProperty('icon')) {
          this.setData({
              icon: option.icon
          })
      }
  }
})
