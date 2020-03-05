import {
  Button,
  Card,
  Grid,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import Link from 'next/link';
import React, { useState } from 'react';

import { useFetchUser } from '../../lib/user';
import KpiPieChart from '../../components/kpiPieChart';
import KpiTimeDataLine from '../../components/kpiTimeDataLine';
import Layout from '../../components/layoutDrawer';
import useApi from '../../lib/use-api';

// firsTouch takes in a single aggregate entry and returns a score for it
function firstTouch({
  position, value, count, day,
}) {
  if (position === 1) {
    return count;
  }
  return 0;
}

// applyScoreFunctionToAggregateData takes in a scoring function and some aggreate data and adds a 'score' attribute to each
// aggreagte entry using the function
function applyScoreFunctionToAggregateData(scoreFunc, data) {
  return data.map((aggr) => ({
    ...aggr,
    score: scoreFunc(aggr),
  }));
}

// formatScoredAggregateDataForNivo takes in pre-scored aggregate data array and formats it for Nivo pie chart and line charts
function formatScoredAggregateDataForNivo(data) {
  const pieData = {};
  const timeData = {};
  // Value: the value of the column, most often campaign_name
  // Position: the journey position
  // Count: how many happened in this period
  // Day: what day this entry is accounting for
  data.forEach((aggregate) => {
    const { value, day } = aggregate;
    const score = aggregate.score || 0;
    const dayStr = new Date(day).toISOString().split('T')[0];
    // Pie chart
    if (!pieData[value]) {
      pieData[value] = 0;
    }
    pieData[value] += score;

    // Time series
    if (!timeData[value]) {
      timeData[value] = {};
    }
    if (!timeData[value][dayStr]) {
      timeData[value][dayStr] = 0;
    }
    timeData[value][dayStr] += score;
  });

  // Convert pie data object to array of objects that nivo can ingest
  const nivoPieData = [];
  for (const key of Object.keys(pieData)) {
    const score = pieData[key];
    nivoPieData.push({
      id: key,
      value: score,
    });
  }

  // ---------------------------
  // --- Handle time series data
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
    const currentDate = new Date(days[0]);
    let lastScore = 0;
    while (currentDate <= new Date(days[days.length - 1])) {
      const currentDateStr = currentDate.toISOString().split('T')[0];
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
      data: [],
    };
    const daysData = timeData[value];
    const days = Object.keys(daysData);
    days.sort();
    for (var day of days) {
      const dayString = new Date(day).toISOString().split('T')[0];
      const totalScore = daysData[day];
      lineData.data.push({
        x: dayString,
        y: totalScore,
      });
    }
    nivoTimeData.push(lineData);
  }
  return { nivoPieData, nivoTimeData };
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
    campaignNameJourneyAggregate,
  } = kpi;

  let scoredData;
  if (modelId === 'first-touch') {
    scoredData = applyScoreFunctionToAggregateData(firstTouch, campaignNameJourneyAggregate);
  } else {
    scoredData = applyScoreFunctionToAggregateData(firstTouch, campaignNameJourneyAggregate);
  }
  const { nivoPieData, nivoTimeData } = formatScoredAggregateDataForNivo(
    scoredData,
  );

  async function deleteKpi(kpi) {
    // TODO: Error handling
    await fetch(`/api/kpi/${kpi.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    refresh();
  }

  async function updateKpi(kpi) {
    // TODO: Error handling
    const resp = await fetch(`/api/kpi/${kpi.id}`, {
      method: 'PUT',
      body: JSON.stringify(kpi),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (resp.status === 200) {
      setKpi({
        ...kpi,
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
            Conversion when track
            {' '}
            <b>{column}</b>
            {' '}
            is
            {' '}
            <b>{value}</b>
          </p>
          Model:
          {' '}
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={modelId}
            onChange={handleModelIdChange}
          >
            <MenuItem value="first-touch">First Touch</MenuItem>
            <MenuItem value="last-touch">Last Touch</MenuItem>
            <MenuItem value="linear">Linear</MenuItem>
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
  const {
    response, error, isLoading, refresh,
  } = useApi('/api/kpi/list');
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
        {kpis.map((kpi) => (
          <Grid item xs={12}>
            <KpiCard refresh={refresh} kpi={kpi} />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Layout user={user} currentPage="kpis" loading={isLoading}>
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
