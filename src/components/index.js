import { createClassFromSpec } from "react-vega";

import HeatMapSpec from "./HeatMap.json";
import BandChartSpec from "./BandChart.json";
import LineChartSpec from "./LineChart.json";
import AreaChartSpec from "./AreaChart.json";

import AutoCompleteStations from "./AutoCompleteStations";

export const HeatMap = createClassFromSpec("HeatMap", HeatMapSpec);
export const BandChart = createClassFromSpec("BandChart", BandChartSpec);
export const LineChart = createClassFromSpec("LineChart", LineChartSpec);
export const AreaChart = createClassFromSpec("AreaChart", AreaChartSpec);

export { AutoCompleteStations };
