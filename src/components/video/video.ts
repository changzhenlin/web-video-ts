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

    videoContent.addEventListener('canplay', () => {
    })
    videoContent.addEventListener('play', () => {
      videoPlay.className =  'iconfont icon-zanting';
    })
    videoContent.addEventListener('pause', () => {
      videoPlay.className =  'iconfont icon-bofang';
    })
    videoPlay.addEventListener('click', () => {
      if (videoContent.paused) {
        videoContent.play();
      } else {
        videoContent.pause();
      }
    })
  };
}

export default video; 