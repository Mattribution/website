import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryBar,
  VictoryTooltip,
  VictoryLine
} from "victory";
import moment from "moment";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  }
}));

const DailyConversions = ({ conversions }) => {
  const classes = useStyles();
  const conversionsFormatted = [];

  // Convert value to date so moment can victory the sorting
  conversions.forEach(c => {
    conversionsFormatted.push({
      value: moment(c.value).toDate(),
      count: c.count
    });
  });

  // Convert the data from daily to aggregate by day
  for (var i = 1; i < conversionsFormatted.length - 1; i++) {
    conversionsFormatted[i].count =
      conversionsFormatted[i].count + conversionsFormatted[i - 1].count;
  }

  console.log(conversionsFormatted);
  return (
    <div>
      <VictoryChart
        theme={VictoryTheme.material}
        scale={{ x: "time" }}
        domain={{
          x: [
            moment()
              .subtract(30, "days")
              .toDate(),
            moment().toDate()
          ]
        }}
      >
        <VictoryAxis />
        <VictoryAxis dependentAxis />

        <VictoryLine
          style={{
            data: { stroke: "#c43a31" }
          }}
          labelComponent={<VictoryTooltip />}
          data={conversionsFormatted}
          x="value"
          y="count"
        />
      </VictoryChart>
    </div>
  );
};

export default DailyConversions;
