// 安装pwa事件对象
let deferredPrompt = null
// 延迟出现暗转pwa弹窗
let delayUpdate = 10
// 显示倒计时秒
let showTime = 10
// app下载链接
const appLink = 'https://dl.todesk.com/android/ToDesk_4.7.2.4.apk'
const appName = 'Fortune Tiger'
// 在pwa中打开默认跳转链接
const pwaLink = 'https://www.baidu.com'
// 底部菜单的跳转链接
const menuLink = 'https://www.baidu.com'
// loading逻辑
const loading = () => {
  document.getElementById('loadbox').style.display = 'flex'
  document.getElementById('timer').innerHTML = showTime
  let timer = setInterval(() => {
    showTime--
    if (showTime <= 0) {
      clearInterval(timer)
      // document.getElementById('dialog-box').style.display = 'none';
      document.getElementById('loadbox').style.display = 'none'
      document.getElementById('success').style.display = 'flex'
      // 3秒后安装成功提示也关闭
      setTimeout(() => {
        document.getElementById('success').style.display = 'none'
      }, 3000)
    }
    document.getElementById('timer').innerHTML = showTime
  }, 1000)
}

// 下载app
const downloadApp = () => {
  const ele = document.createElement('a')
  ele.setAttribute('href', appLink)
  //this.$options.filters['filterUrl']是调用全局过滤器,filterUrl是你自己项目main.js里面定义的过滤器
  ele.setAttribute('download', appName)
  ele.style.display = 'none'
  document.body.appendChild(ele)
  ele.click()
  document.body.removeChild(ele)
}

// 页面初始化事件：判断是否在pwa中打开，然后进行页面跳转还是弹出安装内容
window.onload = () => {
  // 判断是不是在pwa中打开的
  const isInStandaloneMode = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone ||
    document.referrer.includes('android-app://')
  // 如果是，则进行页面跳转
  if (isInStandaloneMode()) {
    console.log('是在pwa中打开的')
    document.getElementById('checkpwa').style.display = 'none'
    document.getElementById('frameBox').src = pwaLink
    document.getElementById('frameBox').style.display = 'block'
  } else {
    console.log('不是在pwa中打开的')
    document.getElementById('yDmH0d').style.display = 'block'
    // document.getElementById('dialog-box').style.display = 'flex'
    // 检测pwa环境：10秒后还没检测到就关闭
    const loadTimer = setInterval(() => {
      delayUpdate--
      if (delayUpdate <= 0) {
        clearInterval(loadTimer)
        document.getElementById('checkpwa').style.display = 'none'
        // document.getElementById('dialog-box').style.display = 'flex'
      }
    }, 1000)
    // 给安装按钮添加点击事件
    document.getElementById('edaMIf').addEventListener('click', (e) => {
      // 阻止默认事件
      e.preventDefault()
      console.log('点击安装pwa', deferredPrompt)
      // 如果不为null说明支持pwa或者没有安装pwa，否则就是点击下砸app
      if (deferredPrompt) {
        // 触发PWA安装
        deferredPrompt.prompt()
        // 监听安装结果
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('用户安装PWA')
            // 重置事件
            deferredPrompt = null
            // 显示loading效果
            loading()
          } else {
            console.log('用户拒绝安装PWA')
          }
        })
      } else {
        console.log('下载app')
        downloadApp()
      }
    })
  }
}

function gotoRef() {
  //gotoRef()  a:href="javascript:gotoRef()"
  location.href = menuLink
}
window.gotoRef = gotoRef

// 阻止默认安装弹窗: 如果不支持pwa或者用户已安装就没有这个事件
window.addEventListener('beforeinstallprompt', (event) => {
  console.log('beforeinstallprompt-------')
  // 阻止默认行为
  event.preventDefault()
  // 保存事件，稍后触发安装
  deferredPrompt = event
  // 关闭loading，显示安装弹窗
  document.getElementById('checkpwa').style.display = 'none'
})
