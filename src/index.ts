const LRUCache = function (capacity) {
  this.map = {};
  this.size = 0;
  this.maxSize = capacity;

  // 链表初始化，初始化只有一个头和尾
  this.head = {
    prev: null,
    next: null,
  };
  this.tail = {
    prev: this.head,
    next: null,
  };

  this.head.next = this.tail;
};

LRUCache.prototype.get = function (key) {
  if (this.map[key]) {
    const node = this.extractNode(this.map[key]);

    // 最新访问，将该节点放到链表的头部
    this.insertNodeToHead(node);

    return this.map[key].val;
  } else {
    return -1;
  }
};

LRUCache.prototype.put = function (key, value) {
  let node;

  if (this.map[key]) {
    // 该项已经存在，更新值
    node = this.extractNode(this.map[key]);
    node.val = value;
  } else {
    // 如该项不存在，新创造节点
    node = {
      prev: null,
      next: null,
      val: value,
      key,
    };

    this.map[key] = node;
    this.size++;
  }

  // 最新写入，将该节点放到链表的头部
  this.insertNodeToHead(node);

  // 判断长度是否已经到达上限
  if (this.size > this.maxSize) {
    const nodeToDelete = this.tail.prev;
    const keyToDelete = nodeToDelete.key;
    this.extractNode(nodeToDelete);
    this.size--;
    delete this.map[keyToDelete];
  }
};

// 插入节点到链表首项
LRUCache.prototype.insertNodeToHead = function (node) {
  const head = this.head;
  const lastFirstNode = this.head.next;

  node.prev = head;
  head.next = node;
  node.next = lastFirstNode;
  lastFirstNode.prev = node;

  return node;
};

// 从链表中抽取节点
LRUCache.prototype.extractNode = function (node) {
  const beforeNode = node.prev;
  const afterNode = node.next;

  beforeNode.next = afterNode;
  afterNode.prev = beforeNode;

  node.prev = null;
  node.next = null;

  return node;
};

interface IRequestCache {
  url: string;
  body: string;
  times: number;
  timestamp: number;
}

interface IRequestObj {
  url: string;
  body: string;
  method: string;
  async: boolean;
}

const monitorRepeatRequest = () => {
  let requestCache = new LRUCache(30);
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
    const curRequest = requestCache.get(url);
    let times = 1;
    if (curRequest && Date.now() - curRequest.timestamp < 1000) {
      times = curRequest.times + 1;
      let errMsg = "";
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
      console.log("【重复请求】", errMsg);
    }
    const cacheValue: IRequestCache = {
      url,
      timestamp: Date.now(),
      body: JSON.stringify(body),
      times,
    };
    requestCache.put(url, cacheValue);
  };

  const toast = (msg) => {
    const styles = {
      background: "rgba(51, 51, 51, 0.8)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.2)",
      borderRadius: "4px",
      padding: "12px 16px",
      color: "white",
      fontSize: "16px",
      position: "fixed",
      top: "10%",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: "9999",
    };
    const tipsDom = document.createElement("div");
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

export default monitorRepeatRequest;
