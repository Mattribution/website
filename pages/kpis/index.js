import { Button, Card, Grid, Typography } from "@material-ui/core";
import { ResponsivePie } from "@nivo/pie";
import Link from "next/link";
import React from "react";
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
      // legends={[
      //   {
      //     anchor: "bottom",
      //     direction: "row",
      //     translateY: 56,
      //     itemWidth: 100,
      //     itemHeight: 18,
      //     itemTextColor: "#999",
      //     symbolSize: 18,
      //     symbolShape: "circle",
      //     effects: [
      //       {
      //         on: "hover",
      //         style: {
      //           itemTextColor: "#000"
      //         }
      //       }
      //     ]
      //   }
      // ]}
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

function KpiCard({ kpi, refresh }) {
  const { id, name, column, value, campaignNameJourneyAggregate } = kpi;
  const firstTouchData = applyFirstTouch(campaignNameJourneyAggregate);
  console.log("FT: ", firstTouchData);

  async function deleteKpi(kpi) {
    await fetch(`/api/kpi/${kpi.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    refresh();
  }

  return (
    // <Grid item>
    <Card variant="outlined">
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" component="h2">
            {name}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <p>
            Conversion when track <b>{column}</b> is <b>{value}</b>
          </p>
        </Grid>

        <Grid item sm={12} md={6} style={{ height: 400 }}>
          <KpiPieChart data={firstTouchData} />
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
    return kpis.map(kpi => <KpiCard refresh={refresh} kpi={kpi} />);
  };

  return (
    <Layout user={user} currentPage={"kpis"} loading={isLoading}>
      {isLoading ? (
        <>Loading...</>
      ) : (
        <Grid container spacing={2}>
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
