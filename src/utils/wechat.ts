/* eslint-disable no-unused-vars */
import Taro from '@tarojs/taro';
import request from '@/utils/request';
import api from '@/utils/api';

/**
 * 将一个回调式异步方法转换成 Promise。
 * @param wxapi 要转换的异步方法名。
 * @returns 返回一个 Promise 包装的异步方法。
 */
export const promisify = <T>(wxapi: (options: any, ...params: any[]) => void) => {
  return (options?: any, ...params: any[]): Promise<T> => {
    return new Promise((resolve, reject) => {
      wxapi(Object.assign({}, options, { success: resolve, fail: reject }), ...params);
    });
  };
};

const sysInfo: any = Taro.getSystemInfo();

/**
 * 获取微信登录凭证
 * @returns 返回一个 Promise 包装的异步函数，该函数将解析为登录凭证（code）。
 */
export const wxLogin = async () => {
  try {
    if (sysInfo.environment === 'wxwork') {
      // @ts-ignore
      const qyLogin = promisify<string>(wx.qy.login);
      return await qyLogin();
    } else {
      const loginRes = await Taro.login();
      return loginRes.code;
    }
  } catch (error) {
    console.log(`获取临时凭据失败：${JSON.stringify(error)}`);
  }
};

/**
 * 检查小程序登录态是否过期
 * @returns 如果登录态没有过期，则返回一个成功的 Promise；否则返回一个拒绝的 Promise。
 */
export const checkSession = async (): Promise<void> => {
  try {
    if (sysInfo.environment === 'wxwork') {
      // @ts-ignore
      const qyCheckSession = promisify<void>(wx.qy.checkSession);
      await qyCheckSession();
    } else {
      await Taro.checkSession();
    }

    if (!Taro.getStorageSync('token')) {
      throw new Error('本地没有缓存 token');
    }
  } catch (error) {
    // if(!loginform && !direct) {
    //   Taro.clearStorageSync()
    //   return Taro.redirectTo({url: '/views/login/index'})
    // }
    await wwAuth();
  }
};

/**
 * 微信企业认证
 * @returns 返回一个 Promise 包装的异步函数，该函数将解析为认证结果。
 */
export const wwAuth = async (): Promise<any> => {
  try {
    const code = await wxLogin();
    return await request({
      url: api.qy_auth,
      method: 'POST',
      data: { code }
    });
  } catch (error) {
    console.log(`认证失败：${JSON.stringify(error)}`);
  }
};

/**
 * 获取企业微信用户信息
 * @returns 返回一个 Promise 包装的异步函数，该函数将解析为用户信息。
 */
const getWUserInfo = async (): Promise<any> => {
  try {
    // @ts-ignore
    let getEnterpriseUserInfo = promisify<any>(wx.qy.getEnterpriseUserInfo);
    return await getEnterpriseUserInfo();
    // if(sysInfo.environment === 'wxwork') {
    //   let getEnterpriseUserInfo = promisify(wx.qy.getEnterpriseUserInfo);
    //   return await getEnterpriseUserInfo();
    // } else {
    //   return Taro.getUserInfo();
    // }
  } catch (error) {
    console.log(`获取用户信息失败：${JSON.stringify(error)}`);
  }
};

/**
 * 用户登录方法
 * @param loginForm 登录表单
 * @returns 返回一个 Promise 包装的异步函数，该函数将解析为登录结果。
 */
export const userLogin = async (loginForm?: any): Promise<any> => {
  loginForm = loginForm || {};
  let checkSessionRes = await checkSession();
  console.log(`// ------- ${JSON.stringify(checkSessionRes)}`);

  if (sysInfo.environment === 'wxwork') {
    loginForm.wx_qy_user = await getWUserInfo();
  }

  const loginRes = await request({
    url: api.login,
    method: 'POST',
    data: Object.assign({}, loginForm)
  });

  if (loginRes.user && loginRes.user.changepwd) {
    Taro.showToast({ title: '请在 PC 端修改初始密码后重试', icon: 'none' });
    return { code: 403 };
  }

  Taro.setStorage({ key: 'token', data: loginRes.token });
  Taro.setStorage({ key: 'user', data: loginRes.user });
  return loginRes;
};

/**
 * 获取登录状态信息
 * @returns 返回一个对象，该对象包含 token 和 user 两个字段。
 */
export const getLogin = (): { token: string; user: any } | undefined => {
  try {
    return {
      token: Taro.getStorageSync('token'),
      user: Taro.getStorageSync('user')
    };
  } catch (error) {
    console.log(`Storage 中获取 Token, User 失败： ${JSON.stringify(error)}`);
  }
};

/**
 * 验证登录状态
 * @returns Promise 对象，根据业务需要进行返回值定义
 */
export async function verifyLogin(): Promise<any> {
  try {
    // TODO: 实现验证登录状态的逻辑
    return true; // 示例返回值
  } catch (e) {
    console.error(e);
  }
}
