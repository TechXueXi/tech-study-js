/**
 * @description 获取cookie
 * @param name
 * @returns
 */
function getCookie(name) {
  // 获取当前所有cookie
  const strCookies = document.cookie;
  // 截取变成cookie数组
  const cookieText = strCookies.split(';');
  // 循环每个cookie
  for (const i in cookieText) {
    // 将cookie截取成两部分
    const item = cookieText[i].split('=');
    // 判断cookie的name 是否相等
    if (item[0].trim() === name) {
      return item[1].trim();
    }
  }
  return null;
}
/**
 * @description 防抖
 * @param callback
 * @param delay
 * @returns
 */
function debounce(callback, delay) {
  let timer = -1;
  return function (this: any, ...args) {
    if (timer !== -1) {
      clearTimeout(timer);
    }
    timer = <any>setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}
/**
 * @description 选择器
 * @param selector
 * @returns
 */
function $$<T extends Element = any>(selector: string) {
  return Array.from(document.querySelectorAll<T>(selector));
}
/**
 * @description 关闭子窗口
 */
function closeWin() {
  try {
    window.opener = window;
    const win = window.open('', '_self');
    win?.close();
    top?.close();
  } catch (e) {}
}
/**
 * @description 等待窗口关闭
 * @param newPage
 * @returns
 */
function waitingClose(newPage) {
  return new Promise((resolve) => {
    const doing = setInterval(() => {
      if (newPage.closed) {
        clearInterval(doing); // 停止定时器
        resolve('done');
      }
    }, 1000);
  });
}
/**
 * @description 等待时间
 * @param time
 * @returns
 */
function waitingTime(time) {
  if (!Number.isInteger(time)) {
    time = 1000;
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('done');
    }, time);
  });
}
/**
 * @description 判断是否为移动端
 * @returns
 */
function hasMobile() {
  let isMobile = false;
  if (
    navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    console.log('移动端');
    isMobile = true;
  }
  if (document.body.clientWidth < 800) {
    console.log('小尺寸设备端');
    isMobile = true;
  }
  return isMobile;
}
/**
 * @description 将 GET 请求参数插入 URL
 * @param url
 * @param params
 * @returns
 */
function stringfyParamsURL(url: string, params: object): string {
  // 参数名
  const keys = Object.keys(params);
  // 参数名存在
  if (keys.length) {
    // 完整链接
    const fullURL = `${url}?${keys
      .filter((key) => key.length)
      .map((key) => `${key}=${params[key]}`)
      .join('&')}`;
    return fullURL;
  }
  return url;
}
/**
 * @description 创建元素节点
 * @param eleName
 * @param props
 * @param attrs
 * @param children
 * @returns
 */
function creatElementNode(
  eleName: string,
  props?: { [key: string]: any },
  attrs?: { [key: string]: any },
  children?: Node | Node[]
): HTMLElement {
  // 元素
  let ele;
  // 格式化元素名
  const formatEleName = eleName.toLowerCase();
  // 需要命名空间的svg元素
  const specficSVGElement = [
    'svg',
    'use',
    'circle',
    'rect',
    'line',
    'marker',
    'linearGradient',
    'g',
    'path',
  ];
  // 需要命名空间的html元素
  const specficHTMLElement = 'html';
  if (formatEleName === specficHTMLElement) {
    // html元素命名空间
    const ns = 'http://www.w3.org/1999/xhtml';
    // 创建普通元素
    ele = document.createElementNS(ns, formatEleName);
  } else if (specficSVGElement.includes(formatEleName)) {
    // svg元素命名空间
    const ns = 'http://www.w3.org/2000/svg';
    // 创建普通元素
    ele = document.createElementNS(ns, formatEleName);
  } else {
    // 创建普通元素
    ele = document.createElement(formatEleName);
  }
  // props属性设置
  for (const key in props) {
    if (props[key] instanceof Object) {
      for (const subkey in props[key]) {
        ele[key][subkey] = props[key][subkey];
      }
    } else {
      ele[key] = props[key];
    }
  }
  // attrs属性设置
  for (const key in attrs) {
    // 属性值
    const value = attrs[key];
    // 处理完的key
    const formatKey = key.toLowerCase();
    // xlink命名空间
    if (formatKey.startsWith('xlink:')) {
      // xlink属性命名空间
      const attrNS = 'http://www.w3.org/1999/xlink';
      if (value) {
        ele.setAttributeNS(attrNS, key, value);
      } else {
        ele.removeAttributeNS(attrNS, key);
      }
    } else if (formatKey.startsWith('on')) {
      // 事件监听
      const [, eventType] = key.toLowerCase().split('on');
      // 事件类型
      if (eventType) {
        // 回调函数
        if (value instanceof Function) {
          ele.addEventListener(eventType, value);

          // 回调函数数组
        } else if (value instanceof Array) {
          for (const i in value) {
            // 回调函数
            if (value[i] instanceof Function) {
              ele.addEventListener(eventType, value[i]);
            }
          }
        }
      }
    } else {
      // 特殊属性
      const specificAttrs = ['checked', 'selected', 'disabled', 'enabled'];
      if (specificAttrs.includes(key) && value) {
        ele.setAttribute(key, '');
      } else {
        if (value) {
          ele.setAttribute(key, value);
        } else {
          ele.removeAttribute(key);
        }
      }
    }
  }
  // 子节点
  if (children) {
    if (children instanceof Array) {
      if (children.length === 1) {
        ele.append(children[0]);
      } else {
        // 文档碎片
        const fragment = document.createDocumentFragment();
        for (const i in children) {
          fragment.append(children[i]);
        }
        ele.append(fragment);
      }
    } else {
      ele.append(children);
    }
  }
  return ele;
}
/**
 * @description 创建文字节点
 * @param text
 * @returns
 */
function createTextNode(...text) {
  if (text && text.length === 1) {
    return document.createTextNode(text[0]);
  }
  const fragment = document.createDocumentFragment();
  for (const i in text) {
    const textEle = document.createTextNode(text[i]);
    fragment.append(textEle);
  }
  return fragment;
}
export {
  $$,
  closeWin,
  debounce,
  hasMobile,
  getCookie,
  waitingTime,
  waitingClose,
  creatElementNode,
  createTextNode,
};