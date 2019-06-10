import * as React from "react";

import { Select } from "antd";

const { Option } = Select;

function onChange(value: any) {
  console.log(`selected ${value}`);
}

function onBlur() {
  console.log("blur");
}

function onFocus() {
  console.log("focus");
}

function onSearch(val: any) {
  console.log("search:", val);
}

export default class AutoCompleteStations extends React.Component {
  render() {
    return (
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select AEMET Station"
        value="malaga"
        optionFilterProp="children"
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onSearch={onSearch}
        filterOption={(input, option: any) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value="malaga">Málaga</Option>
        <Option value="sevilla">Sevillla</Option>
        <Option value="cadiz">Cadiz</Option>
      </Select>
    );
  }
}
