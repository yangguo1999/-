// pages/demo4/demo4.js
const app=getApp();
Page({
  //页面的初始数据
  data: {
    songList:'', //歌曲列表
    pic:'',
    time: new Date().toLocaleDateString(),
    state1:app.globalData.state
  },
  
  //播放背景音乐
  selfPlay:function(e){
   app.globalData.songname = e.currentTarget.dataset.songname;
   if(app.globalData.isPlaying && app.globalData.state == e.currentTarget.dataset.playid){
    wx.pauseBackgroundAudio({
      success: (res) => {},
    })
    app.globalData.state = -1
    app.globalData.isPlaying = false
    this.setData({
      pic : "cloud://ygwangyiyun-3gbf1zr26fe0e6df.7967-ygwangyiyun-3gbf1zr26fe0e6df-1304222864/基本图片/播放.png",
      state1 : app.globalData.state
    })
   }else{
    wx.request({
      url: 'http://neteasecloudmusicapi.zhaoboy.com/search?keywords='+app.globalData.songname,
      success (resid){
       wx.request({
         url: 'http://neteasecloudmusicapi.zhaoboy.com/song/url?id='+resid.data.result.songs[0].id,
         success (resurl){
           //  console.log(resurl.data.data[0].url)
           //  console.log(app.globaData)
          wx.playBackgroundAudio({
            dataUrl: resurl.data.data[0].url,
            title: app.globalData.songname,
            coverImgUrl: ''
          })
        }
      })
     }
   })
    app.globalData.isPlaying = true
    app.globalData.state = e.currentTarget.dataset.playid
    this.setData({
      pic : "cloud://ygwangyiyun-3gbf1zr26fe0e6df.7967-ygwangyiyun-3gbf1zr26fe0e6df-1304222864/基本图片/正在播放.png",
      state1 : app.globalData.state
    })
    

   }
  },
  
  //跳转到播放页面
  toPlayPage:function(e){
    this.selfPlay(e);
    //console.log(this.data.songList[e.currentTarget.dataset.playid])
    app.globalData.playid = e.currentTarget.dataset.playid
    app.globalData.targetSong = this.data.songList[e.currentTarget.dataset.playid]
    wx.navigateTo({
      url:'../play/play'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this//运用反悔的结果来设置data里的数据必须使用this的副本
    wx.request({
      url:'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8%C2%ACice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid=27&_=1519963122923',
      data: {
        x: '',
        y: '' 
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res){
        _this.setData({
          songList:res.data.songlist
        }) 
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
    this.setData({
      state1 : app.globalData.state
    })
    if(app.globalData.isPlaying){
      this.setData({
        pic : "cloud://ygwangyiyun-3gbf1zr26fe0e6df.7967-ygwangyiyun-3gbf1zr26fe0e6df-1304222864/基本图片/正在播放.png"
      })
    }else{
      this.setData({
        pic : "cloud://ygwangyiyun-3gbf1zr26fe0e6df.7967-ygwangyiyun-3gbf1zr26fe0e6df-1304222864/基本图片/播放.png"
      })
    }
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

  }
})