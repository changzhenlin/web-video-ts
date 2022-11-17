
import Icomponent from '../../utils/common';

let styles = require('./popup.css');

interface Ipopup {
  width?: string;
  height?: string;
  title?: string;
  pos?: string;
  mask?: boolean;
  content?: (ele) => void;
}

// 组件的约束，接口，其他所有接口必须实现这个接口
// interface Icomponent {
//   tempContainer: HTMLElement;
//   init : () => void;
//   template : () => void;
//   handle : () => void;
// }

function popup(options: Ipopup) {
  return new Popup( options );
}

class Popup implements Icomponent {
  constructor (private settings: Ipopup) {
    this.settings = Object.assign({
      width: '100%',
      height: '100%',
      title: '',
      pos: 'center',
      mask: true,
      content: () => {}
    }, this.settings);
    this.init();
  }
  mask: HTMLElement;   
  tempContainer: HTMLElement;
  // 初始化
  init() {
    this.template();
    this.settings.mask && this.createMask();
    this.handle();
    this.contentCallback();
  };
  // 创建模板
  template() {
    this.tempContainer = document.createElement('div');
    this.tempContainer.style.width = this.settings.width;
    this.tempContainer.style.height = this.settings.height;
    this.tempContainer.className = styles.default.popup;
    this.tempContainer.innerHTML = `
    <div class="${styles['default']['popup-title']}">
      <h3>${this.settings.title}</h3>
      <i class="iconfont icon-guanbi"></i>
    </div>
    <div class="${styles['default']['popup-content']}"></div>
    `
    document.body.appendChild(this.tempContainer);
    if (this.settings.pos === 'right') {
      this.tempContainer.style.right = '0';
      this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) / 2 + 'px';
    } else {
      this.tempContainer.style.left = (window.innerWidth - this.tempContainer.offsetWidth) / 2 + 'px';
      this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) / 2 + 'px';
    }
  };
  handle() {
    let popupClose = this.tempContainer.querySelector('.' + styles['default']['popup-title'] + ' i');
    popupClose.addEventListener('click', () => {
      document.body.removeChild(this.tempContainer);
      this.settings.mask && document.body.removeChild(this.mask);
    });
  };
  createMask() {
    this.mask = document.createElement('div');
    this.mask.className = styles.default.mask;
    this.mask.style.width = '100%';
    this.mask.style.height = document.body.offsetHeight + 'px';
    document.body.appendChild(this.mask);
    
  };
  contentCallback() {
    let popupContent = this.tempContainer.querySelector('.' + styles['default']['popup-content']);
    this.settings.content(popupContent);
  }
}

export default popup