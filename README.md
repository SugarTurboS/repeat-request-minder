<h1 align="center">Welcome to repeat-request-minder 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>
</p>

> A tool that can help you check whether there are duplicate requests in your project. After use, the request will be automatically monitored. When it is found that the same request has been sent multiple times within 1 second, it will prompt toast and print the request information on the console.

## Usage

```js
import repeatRequestMinder from 'repeat-request-minder';
repeatRequestMinder();
```

You can also configure whether toast is displayed and the duration of toast display (default display toast, duration is 3 seconds)

```js
repeatRequestMinder({
  isShowToast: true,
  toastTime: 10000
});
```

As well, if you don't want to use it by call the function yourself, you can use the webpack plugin to help you.

Here is the plugin [
repeat-request-minder-webpack-plugin](https://github.com/SugarTurboS/repeat-request-minder-webpack-plugin)

## Author

👤 **Brady**

* Github: [@Brady](https://github.com/WadeZhu)

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_