import React from "react";
import ReactDOM from "react-dom";
import { useData } from "./useData";
import { AxisBottom } from "./axisBottom";
import { AxisLeft } from "./axisLeft";
import { Marks } from "./Marks";
import { scaleLinear, max, min, format, scaleTime, timeFormat } from "d3";

const width = 960;
const height = 540;
const margin = {
  top: 30,
  bottom: 50,
  right: 10,
  left: 100,
};

const App = () => {
  const data = useData();
  if (!data) {
    return <pre>loading..</pre>;
  }

  const xValue = (d) => d[0];
  const xAxisLabel = "Year";

  const yValue = (d) => d[1];

  const yAxisLabel = "GDP";

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.right - margin.left;

  let yearsDate = data.map((d) => new Date(d[0]));

  let xMax = new Date(max(yearsDate));
  xMax.setMonth(xMax.getMonth() + 3);

  const xScale = scaleTime()
    .domain([min(yearsDate), xMax])
    .range([0, innerWidth]);

  const xAxisTickFormat = timeFormat("%Y");

  const gdpFormat = format("s");
  const yScale = scaleLinear()
    .domain([0, max(data, yValue)])
    .range([innerHeight, 0]);

  const monthFormatting = (m) => {
    let regex = "-(.*?)-";
    let match = m.match(regex);
    if (match[1] === "01") {
      return m.substr(0, 4) + " Q1";
    }
    if (match[1] === "04") {
      return m.substr(0, 4) + " Q2";
    }
    if (match[1] === "07") {
      return m.substr(0, 4) + " Q3";
    }
    if (match[1] === "10") {
      return m.substr(0, 4) + " Q4";
    }
  };

  const gdpFormatting = (m) => {
    m = m * 1000000000;
    m = gdpFormat(m);
    if (m.includes("T")) {
      return m.replace("T", " Trillion USD");
    } else if (m.includes("G")) {
      return m.replace("G", " Billion USD");
    }
    return m;
  };
  const onMouseEnter = (e, d) => {
    let x = xScale(xValue(d));
    let y = yScale(yValue(d));

    e.pageX < window.innerWidth / 2 ? (y = y - 25) : y;

    tooldiv
      .style("visibility", "visible")
      .html(() => `${monthFormatting(xValue(d))}</br>${gdpFormatting(yValue(d))}`)
      .style("top", y + "px")
      .style("left", e.pageX - 100 + "px")
      .attr("data-date", yValue(d));
  };
  const onMouseOut = (e) => {
    tooldiv.style("visibility", "hidden");
  };
  return (
    <>
      <div id="title">
        <h1>United States GDP [1947-2015]</h1>
      </div>
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g id="x-axis">
            <AxisBottom innerHeight={innerHeight} xScale={xScale} tickFormat={xAxisTickFormat} />
          </g>
          <g id="y-axis">
            <AxisLeft yScale={yScale} innerWidth={innerWidth} />
          </g>

          <text
            className="label"
            textAnchor="middle"
            transform={`translate(${innerWidth / 2},${innerHeight + margin.bottom}) `}
          >
            {xAxisLabel}
          </text>
          <text
            className="label"
            textAnchor="middle"
            transform={`translate(${-margin.left / 1.5},${innerHeight / 2}) rotate(-90)`}
          >
            {yAxisLabel}
          </text>
          <Marks
            data={data}
            xScale={xScale}
            yScale={yScale}
            xValue={xValue}
            yValue={yValue}
            innerHeight={innerHeight}
            tooltip={(d) => d}
            yearsDate={yearsDate}
            onMouseEnter={(e, d) => onMouseEnter(e, d)}
            onMouseOut={(e) => onMouseOut(e)}
          />
        </g>
        <g className="copyright" transform={`translate(${width - 35},${height - 25}) `}>
          <text textAnchor="middle" dx={-15} dy={18}>
            By
          </text>
          <a xlink:href="https://thembdev.com">
            {" "}
            <image xlink:href="https://mbdev-utils.s3.eu-west-3.amazonaws.com/mbdev_logo_sm.svg" width={25} />
          </a>
        </g>
      </svg>
    </>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
