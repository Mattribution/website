import React, { useState } from "react";
import fetch from "isomorphic-unfetch";

import Head from "../components/head";
import { makeStyles } from "@material-ui/styles";
import {
  Table,
  Paper,
  Container,
  Grid,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  CircularProgress
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  }
}));

const KPIs = ({ kpis }) => {
  const [_, setRefreshValue] = useState(0);
  const refresh = () => setRefreshValue(0);
  const classes = useStyles();

  if (!kpis) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Column Name</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {kpis.map(kpi => (
            <TableRow key={kpi.id}>
              <TableCell component="th" scope="row">
                {kpi.name}
              </TableCell>
              <TableCell>{kpi.column}</TableCell>
              <TableCell>{kpi.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default KPIs;
