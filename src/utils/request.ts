import Taro from '@tarojs/taro';
import cfg from './config';

const customHeader = {};

/**
 * 验证请求结果，正确 (code: 200) 的直接返回结果，错误的则返回 code、msg, 发起请求的地方验证存在 code 和 msg 即认为接口有错误
 * @param { Object } response http response 数据集
 * @param { Object } options Request 参数
 */
const validateResult = async (
  response: Taro.request.SuccessCallbackResult,
  options: Taro.request.Option
): Promise<any> => {
  const { data, statusCode } = response;

  if (statusCode === 200) {
    return data;
  }

  let result = {
    code: data.code,
    msg: data.message
  };

  if (result.code) {
    if (options.url.includes('login')) {
      await Taro.showToast({
        title: `${result.msg}`,
        icon: 'none',
        mask: true
      });
    } else if (result.code === 403) {
      let keepTicket = Taro.getStorageSync('keep_ticket');
      if (!keepTicket) Taro.clearStorageSync();
      await Taro.redirectTo({ url: '/pages/login/index' });
    }
  }

  if (!cfg.noConsole) {
    console.log(`ET: ${new Date().toLocaleString()} U: ${options.url} R: `, result);
  }

  return result;
};

export default async (options: Taro.request.Option): Promise<any> => {
  const token = await Taro.getStorageSync('token');
  options.method = options.method || 'POST';
  options.header = Object.assign(
    customHeader,
    options.header,
    token ? { Authorization: 'Bearer ' + token } : {}
  );

  if (!options.data) {
    options.data = {};
  }

  if (!cfg.noConsole) {
    console.log(
      `ST: ${new Date().toLocaleString()} U: ${options.url} R: ${JSON.stringify(options.data)}`
    );
  }

  try {
    await Taro.showLoading({ title: '加载中...' });
    const response = await Taro.request(options);
    await Taro.hideLoading();
    return await validateResult(response, options);
  } catch (error) {
    return {
      code: 600,
      msg: '网络错误'
    };
  }
};

export const downloadFile = async (url: string) => {
  return await Taro.downloadFile({ url, header: customHeader });
};
