import React from "react";
import { Card, Button } from "antd";
import { HeatMap, BandChart, LineChart, AreaChart } from "../components";
import BasicLayout from "../layouts/BasicLayout";
import axios from "axios";
import socketIOClient from "socket.io-client";

//import * as vega from "vega";

import "./App.css";

export default class App extends React.Component {
  state = {
    temperature: [],
    loading: true,
    error: false
  };

  public async componentDidMount() {
    const resp = await axios.get("/api/temperature");

    this.setState({
      temperature: this.randomTemperature(resp.data),
      loading: false
    });

    const socket = socketIOClient("ws://localhost:3000/");
    socket.on("UPDATE", this.updateData.bind(this));
  }

  randomTemperature(data: any) {
    const temperature: any = [];

    data.forEach((element: any) => {
      for (let hour = 0; hour <= 24; hour++) {
        const item = {
          date: this.toShortISO(
            new Date(new Date(element.date).setHours(hour))
          ),
          temp: element.temp + Math.floor(Math.random() * Math.abs(hour - 12))
        };
        temperature.push(item);
      }
    });

    return temperature;
  }

  toShortISO(date: Date) {
    return date
      .toISOString()
      .slice(0, 16)
      .replace("T", " ");
  }

  updateData(data: any) {
    if (this.state.temperature.length) {
      const newData: any = this.randomTemperature(data);

      this.setState({
        temperature: newData,
        loading: false
      });
    }
  }

  public render() {
    const data = {
      temperature: this.state.temperature || {}
    };

    return (
      <BasicLayout>
        {this.state.loading ? (
          <Button type="primary" shape="circle" loading />
        ) : (
          <>
            <Card title="Anual temperature">
              <LineChart
                data={data}
                background="white"
                logLevel={0}
                renderer="svg"
              />
            </Card>
            <br />

            <Card title="Anual temperature with zoom">
              <AreaChart
                data={data}
                background="white"
                logLevel={0}
                renderer="svg"
              />
            </Card>
            <br />
            <Card title="Anual temperature by hours">
              <HeatMap
                data={data}
                background="white"
                logLevel={0}
                renderer="canvas"
              />
            </Card>
            <br />
            <Card title="Anual temperature">
              <BandChart
                data={data}
                background="white"
                logLevel={0}
                renderer="canvas"
              />
            </Card>
          </>
        )}
      </BasicLayout>
    );
  }
}
