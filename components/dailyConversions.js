import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryBar,
  VictoryTooltip
} from "victory";
import moment from "moment";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  }
}));

const DailyConversions = ({ conversions }) => {
  const classes = useStyles();

  // Convert value to date so moment can victory the sorting
  conversions.map(c => {
    c.value = moment(c.value).toDate();
    c.label = c.count;
    return c;
  });

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

        <VictoryBar
          style={{
            data: { fill: "#c43a31" }
          }}
          // labelComponent={<VictoryTooltip />}
          data={conversions}
          x="value"
          y="count"
          barWidth={5}
        />
      </VictoryChart>
    </div>
  );
};

export default DailyConversions;
