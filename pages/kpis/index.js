import { Button, Card, CardContent, Grid, Typography } from "@material-ui/core";
import Link from "next/link";
import React from "react";
import Layout from "../../components/layoutDrawer";
import useApi from "../../lib/use-api";
import { useFetchUser } from "../../lib/user";

function updateKPI(kpi) {
  console.log("Updating kpi: ", kpi);
}

function KpiCard({ kpi }) {
  const { id, name, column, value } = kpi;

  const handleChange = event => {
    updateKPI(event.target.value);
  };

  return (
    <Grid item>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="h2">
            {name}
          </Typography>
          <p>
            Conversion when track <b>{column}</b> is <b>{value}</b>
          </p>
        </CardContent>
      </Card>
    </Grid>
  );
}

function Profile() {
  const { user, _ } = useFetchUser({ required: true });
  const { response, error, isLoading } = useApi("/api/kpi/list");
  const kpis = response;

  if (error) {
    return null;
  }

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
            {kpis.map(kpi => (
              <KpiCard kpi={kpi} />
            ))}
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export default Profile;
