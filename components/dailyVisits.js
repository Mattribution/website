import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryBar,
  VictoryArea,
  VictoryTooltip
} from "victory";
import moment from "moment";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  }
}));

const DailyVisits = ({ tracks }) => {
  const classes = useStyles();

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

        <VictoryArea
          style={{
            data: { fill: "#c43a31" }
          }}
          labelComponent={<VictoryTooltip />}
          data={tracks}
          x="value"
          y="count"
          // barWidth={5}
        />
      </VictoryChart>
    </div>
  );
};

export default DailyVisits;
