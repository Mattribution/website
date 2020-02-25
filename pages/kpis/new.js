import {
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@material-ui/core";
import Router from "next/router";
import React, { useState } from "react";
import Layout from "../../components/layoutDrawer";
import { useFetchUser } from "../../lib/user";

function NewKPICard() {
  const [kpi, setKpi] = useState({ column: "event", value: "" });
  const [error, setError] = useState("");

  async function newKpi(kpi) {
    const res = await fetch("/api/kpi/create", {
      method: "POST",
      body: JSON.stringify(kpi),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (res.status != 200) {
      setError(res.statusText);
      return;
    }

    Router.push("/kpis");
  }

  const handleColumnChange = event => {
    setKpi({
      ...kpi,
      column: event.target.value
    });
  };

  const handleValueChange = event => {
    setKpi({
      ...kpi,
      value: event.target.value
    });
  };

  const handleNameChange = event => {
    setKpi({
      ...kpi,
      name: event.target.value
    });
  };

  return (
    <Grid item>
      {error == null ? null : <Typography>{error}</Typography>}
      <form noValidate autoComplete="off">
        <TextField
          id="standard-basic"
          label="Name"
          value={kpi.name}
          onChange={handleNameChange}
        />
        <br />
        Convert when track{" "}
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={kpi.column}
          onChange={handleColumnChange}
        >
          <MenuItem value={"event"}>Event</MenuItem>
          <MenuItem value={"page_path"}>Page Path</MenuItem>
          <MenuItem value={"page_title"}>Page Title</MenuItem>
        </Select>
        is
        <TextField
          id="standard-basic"
          label="Value"
          value={kpi.value}
          onChange={handleValueChange}
        />
        <br />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            newKpi(kpi);
          }}
        >
          Submit
        </Button>
      </form>
    </Grid>
  );
}

function Profile() {
  const { user, loading } = useFetchUser({ required: true });

  return (
    <Layout user={user} currentPage={"kpis"} loading={loading}>
      {loading ? (
        <>Loading...</>
      ) : (
        <Grid container spacing={2}>
          <Typography variant="h5" component="h2">
            New KPI
          </Typography>
          <Grid item xs={12}>
            <NewKPICard />
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export default Profile;
