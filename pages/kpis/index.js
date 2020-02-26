import {
  Button,
  Card,
  Grid,
  MenuItem,
  Select,
  Typography
} from "@material-ui/core";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import Link from "next/link";
import React, { useState } from "react";
import Layout from "../../components/layoutDrawer";
import useApi from "../../lib/use-api";
import { useFetchUser } from "../../lib/user";

function KpiTimeDataLine({ data }) {
  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point", stacked: false }}
      yScale={{
        type: "linear",
        stacked: false
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "day",
        legendOffset: 36,
        legendPosition: "middle"
      }}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "count",
        legendOffset: -40,
        legendPosition: "middle"
      }}
      colors={{ scheme: "nivo" }}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabel="y"
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
    />
  );
}
function KpiPieChart({ data }) {
  return (
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      colors={{ scheme: "nivo" }}
      borderWidth={1}
      borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
      radialLabelsSkipAngle={10}
      radialLabelsTextXOffset={6}
      radialLabelsTextColor="#333333"
      radialLabelsLinkOffset={0}
      radialLabelsLinkDiagonalLength={16}
      radialLabelsLinkHorizontalLength={24}
      radialLabelsLinkStrokeWidth={1}
      radialLabelsLinkColor={{ from: "color" }}
      slicesLabelsSkipAngle={10}
      slicesLabelsTextColor="#333333"
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10
        }
      ]}
    />
  );
}

function applyFirstTouch(aggregateData) {
  const pieData = {};
  const timeData = {};
  // Value: the value of the column, most often campaign_name
  // Position: the journey position
  // Count: how many happened in this period
  // Day: what day this entry is accounting for
  aggregateData.forEach(({ position, value, count, day }) => {
    const dayStr = new Date(day).toISOString().split("T")[0];
    if (position == 1) {
      // Pie chart
      if (!pieData[value]) {
        pieData[value] = 0;
      }
      pieData[value] += count;

      // Time series
      if (!timeData[value]) {
        timeData[value] = {};
      }
      if (!timeData[value][dayStr]) {
        timeData[value][dayStr] = 0;
      }
      timeData[value][dayStr] += count;
    }
  });

  // Convert pie data object to array of objects that nivo can ingest
  const nivoPieData = [];
  for (var key of Object.keys(pieData)) {
    const score = pieData[key];
    nivoPieData.push({
      id: key,
      value: score
    });
  }

  // ---------------------------
  // --- Hanlde time series data
  // ---------------------------
  // Convert counts to totals
  for (var value of Object.keys(timeData)) {
    const daysData = timeData[value];
    const days = Object.keys(daysData);
    let totalScore = 0;
    for (var day of days) {
      totalScore += daysData[day];
      timeData[value][day] = totalScore;
    }
  }

  // Fill in empty days
  for (var value of Object.keys(timeData)) {
    const daysData = timeData[value];
    const days = Object.keys(daysData);
    days.sort();
    let currentDate = new Date(days[0]);
    let lastScore = 0;
    console.log(days);
    while (currentDate <= new Date(days[days.length - 1])) {
      const currentDateStr = currentDate.toISOString().split("T")[0];
      console.log(currentDateStr, lastScore);
      if (!daysData[currentDateStr]) {
        timeData[value][currentDateStr] = lastScore;
      } else {
        lastScore = daysData[currentDateStr];
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  // Convert time series data object to array of objects that nivo can ingest
  const nivoTimeData = [];
  // Note: value = columnValue of the selected column
  for (var value of Object.keys(timeData)) {
    // Data for a single line (contains x y coordinates)
    const lineData = {
      id: value,
      data: []
    };
    const daysData = timeData[value];
    const days = Object.keys(daysData);
    days.sort();
    for (var day of days) {
      const dayString = new Date(day).toISOString().split("T")[0];
      const totalScore = daysData[day];
      lineData.data.push({
        x: dayString,
        y: totalScore
      });
    }
    nivoTimeData.push(lineData);
  }
  return { nivoPieData, nivoTimeData };
}

// function applyLinear(aggregateData) {
//   console.log(aggregateData);
//   const data = [];
//   const keyScoreMap = {};
//   aggregateData.forEach(({ position, value, count, day }) => {
//     keyScoreMap[value] = (keyScoreMap[value] || 0) + count;
//   });
//   for (var key of Object.keys(keyScoreMap)) {
//     const score = keyScoreMap[key];
//     data.push({
//       id: key,
//       label: key,
//       value: score
//     });
//   }
//   return data;
// }

function getDataFromAggregate(modelId, aggregate) {
  if (modelId == "first-touch") {
    return applyFirstTouch(aggregate);
  }
  // if (modelId == "linear") {
  //   return applyLinear(aggregate);
  // }
  return applyFirstTouch(aggregate);
}

function KpiCard(props) {
  const { refresh } = props;
  const [kpi, setKpi] = useState(props.kpi);

  const {
    id,
    modelId,
    name,
    column,
    value,
    campaignNameJourneyAggregate
  } = kpi;

  let { nivoPieData, nivoTimeData } = getDataFromAggregate(
    modelId,
    campaignNameJourneyAggregate
  );

  console.log("TIme Data: ", nivoTimeData);

  async function deleteKpi(kpi) {
    // TODO: Error handling
    await fetch(`/api/kpi/${kpi.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    refresh();
  }

  async function updateKpi(kpi) {
    // TODO: Error handling
    const resp = await fetch(`/api/kpi/${kpi.id}`, {
      method: "PUT",
      body: JSON.stringify(kpi),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (resp.status == 200) {
      setKpi({
        ...kpi
      });
    }
  }

  function handleModelIdChange(event) {
    // TODO: update client kpi state without another fetch
    kpi.modelId = event.target.value;
    updateKpi(kpi);
  }

  return (
    // <Grid item>
    <Card variant="outlined">
      <Grid container style={{ padding: 20 }}>
        <Grid item xs={12}>
          <Typography variant="h5" component="h2">
            {name}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <p>
            Conversion when track <b>{column}</b> is <b>{value}</b>
          </p>
          Model:{" "}
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={modelId}
            onChange={handleModelIdChange}
          >
            <MenuItem value={"first-touch"}>First Touch</MenuItem>
            <MenuItem value={"last-touch"}>Last Touch</MenuItem>
            <MenuItem value={"linear"}>Linear</MenuItem>
          </Select>
        </Grid>

        <Grid item sm={12} md={6} style={{ height: 400 }}>
          <KpiTimeDataLine data={nivoTimeData} />
        </Grid>

        <Grid item sm={12} md={6} style={{ height: 400 }}>
          <KpiPieChart data={nivoPieData} />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => deleteKpi(kpi)}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
    </Card>
    // </Grid>
  );
}

function Profile() {
  const { user, _ } = useFetchUser({ required: true });
  let { response, error, isLoading, refresh } = useApi("/api/kpi/list");
  const kpis = response;

  const renderKpis = () => {
    if (error) {
      return (
        <Typography color="error">
          There was an error fetching your KPIs
        </Typography>
      );
    }
    return (
      <Grid container spacing={4}>
        {kpis.map(kpi => (
          <Grid item xs={12}>
            <KpiCard refresh={refresh} kpi={kpi} />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Layout user={user} currentPage={"kpis"} loading={isLoading}>
      {isLoading ? (
        <>Loading...</>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Link href="/kpis/new">
              <Button variant="contained" color="primary">
                Create
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12}>
            {renderKpis()}
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export default Profile;
