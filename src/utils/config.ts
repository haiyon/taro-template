import pkg from '../../package.json';

export default {
  version: pkg.version, // 引入 package 信息会导致包大小增加，忽略...
  noConsole: true // 是否输出日志信息
};
