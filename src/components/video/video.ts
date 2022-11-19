import Icomponent from "../../utils/common";

let styles = require('./video.css');

interface Ivideo {
  url: string;
  elem: string | HTMLElement;
  width?: string;
  height?: string;
  autoplay?: boolean;
}

function video(options: Ivideo) {
  return new Video( options );
}

class Video implements Icomponent {
  constructor (private settings: Ivideo) {
    this.settings = Object.assign({
      width: '100%',
      height: '100%',
      autoplay: false
    }, this.settings);
    this.init();
  }
  tempContainer: HTMLElement;
  // 初始化
  init() {
    this.template();
    this.handle();
  };
  // 创建模板
  template() {
    this.tempContainer = document.createElement('div');
    this.tempContainer.style.width = this.settings.width;
    this.tempContainer.style.height = this.settings.height;
    this.tempContainer.className = styles.default.video;
    this.tempContainer.innerHTML = `
    <video class="${styles['default']['video-content']}" src="${this.settings.url}"></video>
    <div class="${styles['default']['video-controls']}">
      <div class="${styles['default']['video-progress']}">
          <div class="${styles['default']['video-progress-now']}"></div>
          <div class="${styles['default']['video-progress-suc']}"></div>
          <div class="${styles['default']['video-progress-bar']}"></div>
      </div>
      <div class="${styles['default']['video-play']}">
          <i class="iconfont icon-bofang"></i>
      </div>
      <div class="${styles['default']['video-time']}">
          <span>00:00</span> / <span>00:00</span>
      </div>
      <div class="${styles['default']['video-full']}">
          <i class="iconfont icon-quanping_o"></i>
      </div>
      <div class="${styles['default']['video-volume']}">
          <i class="iconfont icon-shengyin_shiti"></i>
          <div class="${styles['default']['video-volprogress']}">
              <div class="${styles['default']['video-volprogress-now']}"></div>
              <div class="${styles['default']['video-volprogress-bar']}"></div>
      </div>
    </div>
    `
    if (typeof this.settings.elem === 'object') {
      this.settings.elem.appendChild(this.tempContainer);
    } else {
      document.querySelector(`${this.settings.elem}`).appendChild(this.tempContainer);
    }
  };
  // 事件处理
  handle() {
    let videoContent = this.tempContainer.querySelector(`.${styles['default']['video-content']}`) as HTMLVideoElement;
    let videoControls = this.tempContainer.querySelector(`.${styles['default']['video-controls']}`) as HTMLElement;
    let videoPlay = this.tempContainer.querySelector(`.${styles['default']['video-controls']} i`) as HTMLElement;
    let videoTime = this.tempContainer.querySelectorAll(`.${styles['default']['video-time']} span`) as NodeListOf<HTMLElement>;
    let videoFull = this.tempContainer.querySelector(`.${styles['default']['video-full']} i`) as HTMLElement;
    let videoProgress = this.tempContainer.querySelectorAll(`.${styles['default']['video-progress']} div`) as NodeListOf<HTMLElement>;
    let videoVolprogress = this.tempContainer.querySelectorAll(`.${styles['default']['video-volprogress']} div`) as NodeListOf<HTMLElement>;
    let timer;
    
    videoContent.volume = 0.5;
    if (this.settings.autoplay) {
      timer = setInterval(palying, 1000);
      videoContent.play();
    }
    function palying() { 
      videoTime[0].innerHTML = this.formatTime(videoContent.currentTime);
      let scale = videoContent.currentTime / videoContent.duration;
      let scaleSuc = videoContent.buffered.end(0) / videoContent.duration;
      videoProgress[0].style.width = scale * 100 + '%';
      videoProgress[1].style.width = scaleSuc * 100 + '%';
      videoProgress[2].style.left = scale * 100 + '%';
    }
    videoContent.addEventListener('canplay', () => {
      videoTime[1].innerHTML = this.formatTime(videoContent.duration);
    })
    videoContent.addEventListener('play', () => {
      videoPlay.className =  'iconfont icon-zanting';
      timer = setInterval(palying.bind(this), 1000);
    })
    videoContent.addEventListener('pause', () => {
      videoPlay.className =  'iconfont icon-bofang';
      clearInterval(timer);
    })
    videoFull.addEventListener('click', () => {
      videoContent.requestFullscreen();
    })
    videoProgress[2].addEventListener('mousedown', function (e:MouseEvent){
      let downX = e.pageX;
      let downL = this.offsetLeft;
      document.onmousemove = (e:MouseEvent) => {
        let scale = (downL + (e.pageX - downX) + 8) / videoProgress[0].offsetWidth;
        if (scale < 0) {
          scale = 0;
        } else if (scale > 1) {
          scale = 1;
        }
        videoProgress[0].style.width = scale * 100 + '%';
        videoProgress[2].style.left = scale * 100 + '%';
        this.style.left = scale * 100 + '%';
        videoContent.currentTime = scale * videoContent.duration;

        document.onmouseup = () => {
          document.onmouseup = document.onmousemove = null;
        }
        e.preventDefault();
      }
      
    })
    videoVolprogress[1].addEventListener('mousedown', function (e:MouseEvent){
      let downX = e.pageX;
      let downL = this.offsetLeft;
      document.onmousemove = (e:MouseEvent) => {
        let scale = (downL + (e.pageX - downX) + 8) / videoVolprogress[0].offsetWidth;
        if (scale < 0) {
          scale = 0;
        } else if (scale > 1) {
          scale = 1;
        }
        videoVolprogress[0].style.width = scale * 100 + '%';
        this.style.left = scale * 100 + '%';
        videoContent.volume = scale;

        document.onmouseup = () => {
          document.onmouseup = document.onmousemove = null;
        }
        e.preventDefault();
      }
    })
    this.tempContainer.addEventListener('mouseenter', () => {
      videoControls.style.bottom = '0';
      })
    this.tempContainer.addEventListener('mouseleave', () => {
      videoControls.style.bottom = '-50px';
    })
    videoPlay.addEventListener('click', () => {
      if (videoContent.paused) {
        videoContent.play();
      } else {
        videoContent.pause();
      }
    })
    
  };
  
  formatTime(time: number) {
    let minute = Math.floor(time / 60);
    let second = Math.floor(time % 60);
    return `${this.setZero(minute)}:${this.setZero(second)}`;
  }
  setZero(n: number) {
    return n < 10 ? '0' + n : '' + n;
  }
}

export default video; 