interface IRequestCache {
  [url: string]: {
    url: string;
    body: string;
    times: number;
    timestamp: number;
  };
}

interface IRequestObj {
  url: string;
  body: string;
  method: string;
  async: boolean;
}

const monitorRepeatRequest = () => {
  let requestCache: IRequestCache = {};
  let requestInfo: IRequestObj = {} as IRequestObj;

  const onXMLOpen = (params) => {
    requestInfo.method = params[0];
    requestInfo.url = params[1];
    requestInfo.async = params[2];
  };

  const onXMLSend = (params) => {
    requestInfo.body = params[0];
    checkIsRepeat(requestInfo);
  };

  const checkIsRepeat = (requestObj: IRequestObj) => {
    const { url, body } = requestObj;
    const curRequest = requestCache[url];
    let times = 1;
    if (curRequest && Date.now() - curRequest.timestamp < 1000) {
      times = curRequest.times + 1;
      let errMsg = '';
      // 1s内连续发送
      if (JSON.stringify(body) === curRequest.body) {
        // 相同参数
        errMsg = `${url}在1s内连续请求${times}次，且参数相同，请检查`;
        toast(errMsg);
      } else {
        // 不同参数
        errMsg = `${url}在1s内连续请求${times}次，不过请求参数不同，请检查`;
        toast(errMsg);
      }
      console.log('【重复请求】', errMsg);
    }
    requestCache[url] = {
      url,
      timestamp: Date.now(),
      body: JSON.stringify(body),
      times,
    };
  };

  const toast = (msg) => {
    const styles = {
      background: 'rgba(51, 51, 51, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.2)',
      borderRadius: '4px',
      padding: '12px 16px',
      color: 'white',
      fontSize: '16px',
      position: 'fixed',
      top: '10%',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: '9999',
    };
    const tipsDom = document.createElement('div');
    tipsDom.innerText = msg;
    Object.keys(styles).forEach((key) => {
      tipsDom.style[key] = styles[key];
    });
    document.body.appendChild(tipsDom);
    setTimeout(() => {
      document.body.removeChild(tipsDom);
    }, 10000);
  };

  const originSend = XMLHttpRequest.prototype.send;
  const originOpen = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.open = function (...args) {
    // 在这里插入open拦截代码
    onXMLOpen(args);
    return originOpen.apply(this, args);
  };
  XMLHttpRequest.prototype.send = function (...args) {
    // 在这里插入open拦截代码
    onXMLSend(args);
    return originSend.apply(this, args);
  };
};

export default monitorRepeatRequest();
