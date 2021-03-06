import {
  Button,
  Card,
  Grid,
  MenuItem,
  Select,
  Typography
} from "@material-ui/core";
import { ResponsivePie } from "@nivo/pie";
import Link from "next/link";
import React, { useState } from "react";
import Layout from "../../components/layoutDrawer";
import useApi from "../../lib/use-api";
import { useFetchUser } from "../../lib/user";

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
  const data = [];
  aggregateData.forEach(positionData => {
    if (positionData.position == 1) {
      data.push({
        id: positionData.value,
        label: positionData.value,
        value: positionData.count
      });
    }
  });
  return data;
}

function applyLinear(aggregateData) {
  console.log(aggregateData);
  const data = [];
  const keyScoreMap = {};
  aggregateData.forEach(positionData => {
    keyScoreMap[positionData.value] =
      (keyScoreMap[positionData.value] || 0) + positionData.count;
  });
  for (var key of Object.keys(keyScoreMap)) {
    const score = keyScoreMap[key];
    data.push({
      id: key,
      label: key,
      value: score
    });
  }
  return data;
}

function getPieChartDataFromAggregate(modelId, aggregate) {
  if (modelId == "first-touch") {
    return applyFirstTouch(aggregate);
  }
  if (modelId == "linear") {
    return applyLinear(aggregate);
  }

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

  const pieChartData = getPieChartDataFromAggregate(
    modelId,
    campaignNameJourneyAggregate
  );

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
          <KpiPieChart data={pieChartData} />
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
