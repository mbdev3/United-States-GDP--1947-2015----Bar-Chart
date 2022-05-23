export const Marks = ({
  data,
  yScale,
  xScale,
  xValue,
  yValue,
  innerHeight,
  yearsDate,
  onMouseEnter,
  onMouseOut,
}) => (
  <g className="mark">
    {data.map((d, i) => {
      return (
        <rect
          x={xScale(yearsDate[i])}
          y={yScale(yValue(d))}
          width={
            xScale(yearsDate[i]) &&
            xScale(yearsDate[i]) -
              xScale(yearsDate[i - 1])
          }
          height={innerHeight - yScale(yValue(d))}
          onMouseEnter={(e) => onMouseEnter(e, d)}
          onMouseOut={() => onMouseOut(null)}
          class="bar"
          data-date={xValue(d)}
          data-gdp={yValue(d)}
        ></rect>
      );
    })}
  </g>
);
