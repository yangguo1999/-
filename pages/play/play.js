// pages/play/play.js
const app = getApp(); 
let bg = wx.getBackgroundAudioManager()
const dayjs = require("../../utils/dayjs.min.js")
const musicTool = require("../../utils/QQMusicPlugin/qqMusicTools.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
     songList:'',
     songName:'',//歌名
     url:'',
     singerName:'',
     seconds:'',
     albumpic_big:'',
     pic:'',
     totalTime: '00:00', //总时长
     max: 0, //滑块最大值
     value: 0, //进度条进程
     currentTime: "00:00", //当前时长
     flag: false //是否在拖动滑块
  },
  play:function(){
    if(app.globalData.isPlaying){
      wx.pauseBackgroundAudio({
        success: (res) => {},
      })
      this.setData({
        pic : "cloud://ygwangyiyun-3gbf1zr26fe0e6df.7967-ygwangyiyun-3gbf1zr26fe0e6df-1304222864/基本图片/播放.png",
      })
      app.globalData.isPlaying = false
      app.globalData.state = -1
    }else{
      var _this = this
      wx.request({
        url: 'http://neteasecloudmusicapi.zhaoboy.com/search?keywords='+_this.data.songName,
        success (resid){
         wx.request({
           url: 'http://neteasecloudmusicapi.zhaoboy.com/song/url?id='+resid.data.result.songs[0].id,
           success (resurl){
             //  console.log(resurl.data.data[0].url)
             //  console.log(app.globaData)
            wx.playBackgroundAudio({
              dataUrl: resurl.data.data[0].url,
              title: _this.data.songName,
              coverImgUrl: ''
            })
          }
        })
       }
     })
      this.setData({
        pic : "cloud://ygwangyiyun-3gbf1zr26fe0e6df.7967-ygwangyiyun-3gbf1zr26fe0e6df-1304222864/基本图片/正在播放.png",
      })

      app.globalData.isPlaying = true
      app.globalData.state = app.globalData.targetSong.cur_count - 1
    }
  },
  changed1(e) { //滑动拖动完成后执行
    console.log('拖动后', e.detail.value)
    let a = e.detail.value
    this.setData({
      flag: false,
    })
    bg.seek(a)
  },
  //拖动滑块中
  changing(e) { 
    console.log('滑块数字', e.detail.value)
    let b = e.detail.value
    let a = dayjs(b * 1000).format("mm:ss")
    // console.log(a)
    this.setData({
      currentTime: a,
      flag: true
    })
  },
  last:function(){
    if(app.globalData.playid == 0){
      console.log("已经是第一首歌了")
    }else{
      app.globalData.playid = app.globalData.playid-1
      // app.globalData.targetSong = this.data.songlist[app.globalData.playid]
      app.globalData.targetSong = this.data.songList[app.globalData.playid]
      app.globalData.songname = this.data.songList[app.globalData.playid].data.songname
      wx.redirectTo({
        url:'../play/play'
      })
    }
  },
  next:function(){
    if(app.globalData.playid == this.data.songList.length-1){
      console.log("已经是最后一首歌了")
    }else{
    app.globalData.playid = app.globalData.playid+1
    // app.globalData.targetSong = this.data.songlist[app.globalData.playid]
    app.globalData.targetSong = this.data.songList[app.globalData.playid]
    app.globalData.songname = this.data.songList[app.globalData.playid].data.songname
    wx.redirectTo({
      url:'../play/play'
    })
  }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

    var _this = this//运用反回的结果来设置data里的数据必须使用this的副本
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
     setInterval(() => {
      //判断滑块是否在推动
        if (this.data.flag === false) {  //滑块没有拖动
          let a = dayjs(bg.duration * 1000).format("mm:ss") //总时长 用dayjs对总时长进行处理
          let b = parseInt(bg.duration) //滑块最大值
          let c = dayjs(bg.currentTime * 1000).format('mm:ss') //当前时长
          let d = parseInt(bg.currentTime) //滑块值
          this.setData({
            totalTime: a, ///总时长 对数据进行处理后
            max: b, //滑块最大数
            currentTime: c,
            value: d,
          })
          console.log('定时器', this.data.currentTime)
        }
      }, 1000)
    if(app.globalData.isPlaying){
      this.setData({
        pic : "../../image/正在播放.png"
      })
      wx.request({
        url: 'http://neteasecloudmusicapi.zhaoboy.com/search?keywords='+app.globalData.songname,
        success (resid){
         wx.request({
           url: 'http://neteasecloudmusicapi.zhaoboy.com/song/url?id='+resid.data.result.songs[0].id,
           success (resurl){
             //  console.log(resurl.data.data[0].url)
             //  console.log(app.globaData)
             bg.src = resurl.data.data[0].url
             bg.title = app.globalData.songname
            wx.playBackgroundAudio({
              dataUrl: resurl.data.data[0].url,
              title: app.globalData.songname,
              coverImgUrl: ''
            })
          }
        })
       }
     })
      this.setData({
        pic : "../../image/正在播放.png",
      })
      app.globalData.isPlaying = true
      app.globalData.state = app.globalData.targetSong.cur_count - 1
    }else{
      this.setData({
        pic : "../../image/播放.png"
      })
    }
     var _this =this
     var targetSong = app.globalData.targetSong
    // console.log(targetSong,999)
    // console.log(targetSong.data.songname,1999)
     var picid = targetSong.data.albumid
     musicTool.getAlbumImage(picid).then(function(res) {
       _this.setData({
         albumpic_big:res
       })
   })
     this.setData({
        songName:app.globalData.songname,
        songmid:targetSong.data.songid,
        singerName:targetSong.data.singer[0].name,
        seconds:''
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

  }
})