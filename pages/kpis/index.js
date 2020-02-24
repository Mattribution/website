import { Button, Card, CardContent, Grid, Typography } from "@material-ui/core";
import Link from "next/link";
import React from "react";
import Layout from "../../components/layoutDrawer";
import useApi from "../../lib/use-api";
import { useFetchUser } from "../../lib/user";

function KpiCard({ kpi, refresh }) {
  const { id, name, column, value } = kpi;

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
    <Grid item>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="h2">
            {name}
          </Typography>
          <p>
            Conversion when track <b>{column}</b> is <b>{value}</b>
          </p>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => deleteKpi(kpi)}
          >
            Delete
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
}

function Profile() {
  const { user, _ } = useFetchUser({ required: true });
  let { response, error, isLoading, refresh } = useApi("/api/kpi/list");
  const kpis = response;

  console.log(response, error);

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
