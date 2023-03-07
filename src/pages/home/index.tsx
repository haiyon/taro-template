import { Component } from 'preact';
import { Avatar, Button, Cell, CellGroup, Row } from '@nutui/nutui-react-taro';
import { View } from '@tarojs/components';

interface UserInfo {
  [key: string]: any;
}

interface HomeState {
  userInfo: UserInfo | null;
}

class Home extends Component<{}, HomeState> {
  state: HomeState = {
    userInfo: null
  };

  private async setUserInfo(obj: { userInfo: UserInfo }): Promise<void> {
    const { userInfo } = obj;
    console.log(userInfo);
    this.setState({ userInfo });
  }

  private async getUserInfo(e: any): Promise<void> {
    const errMsg = e.detail.errMsg;
    const err = errMsg.lastIndexOf('ok') === -1;
    await this.setUserInfo(err ? { userInfo: null } : { userInfo: e.detail.userInfo });
  }

  public render(): JSX.Element {
    const { userInfo } = this.state;
    return (
      <View className="page">
        {!userInfo && (
          <Row type="flex" align="center" justify="center">
            <Button type="info" openType="getUserInfo" onGetUserInfo={this.getUserInfo.bind(this)}>
              用户信息
            </Button>
          </Row>
        )}
        {userInfo && (
          <CellGroup title="用户信息">
            <Cell title="头像" linkSlot={<Avatar url={userInfo.avatarUrl} />} />
            <Cell title="姓名" desc={userInfo.nickName} />
          </CellGroup>
        )}
      </View>
    );
  }
}

export default Home;
