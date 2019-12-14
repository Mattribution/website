import React from "react";
import Head from "../../components/head";
import LayoutVanilla from "../../components/Layouts/LayoutDrawer";
import { Typography, Paper, Grid } from "@material-ui/core";

const Campaigns = ({ campaigns }) => {
  return (
    <LayoutVanilla>
      <Head title="Campaigns" />

      <Grid container spacing={2}>
        {campaigns.map(campaign => {
          return (
            <Grid item xs={12}>
              <Paper>
                <Typography variant="h4">{campaign.name}</Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </LayoutVanilla>
  );
};

Campaigns.getInitialProps = async function() {
  // Scan for new campaigns in tracking data
  // TODO: Optimize this, maybe in scheduler
  await fetch("http://localhost:3001/v1/campaigns/scan");
  // Get campaigns after
  const res = await fetch("http://localhost:3001/v1/campaigns");
  const campaigns = await res.json();

  return { campaigns };
};

export default Campaigns;
