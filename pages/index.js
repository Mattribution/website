import React from "react";
import Link from "next/link";
import Head from "../components/head";
import Router from "next/router";
import LayoutDrawer from "../components/Layouts/LayoutDrawer";

import withAuth from "../components/HOC/withAuth";

class Home extends React.Component {
  render() {
    return (
      <LayoutDrawer>
        <Head title="Home" />

        <div className="hero">
          <h1 className="title">Welcome to Next!</h1>
          <p className="description">
            To get started, edit <code>pages/index.js</code> and save to reload.
          </p>

          <div className="row"></div>
        </div>
      </LayoutDrawer>
    );
  }
}

export default withAuth(Home);
