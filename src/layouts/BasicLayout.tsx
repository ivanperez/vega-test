import * as React from "react";
import { Layout, Menu, Icon, PageHeader } from "antd";
import { AutoCompleteStations } from "../components";

import "./basicLayout.css";
const { Header, Content, Footer, Sider } = Layout;

export interface IAppProps {}

export default class App extends React.Component<IAppProps, any> {
  state = {
    collapsed: false
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  public render() {
    const { children } = this.props;

    return (
      <Layout>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <Icon type="global" />
              <span>Temperature</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: "#fff", padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
              onClick={this.toggle}
            />
          </Header>

          <PageHeader title="Temperatures in Spain" subTitle="">
            <AutoCompleteStations />
          </PageHeader>

          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280
            }}
          >
            {children}
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Temperature ©2019 Created by Ivan Perez
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
