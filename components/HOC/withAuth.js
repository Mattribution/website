import React, { Component } from "react";
import Router from "next/router";
import { observer, inject } from "mobx-react";
import { CircularProgress } from "@material-ui/core";

const withAuth = WrappedComponent =>
  @inject("authStore")
  @observer
  // @inject("authStore")
  // @observer
  class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: true
      };
    }

    componentDidMount() {
      const { authStore } = this.props;
      const user = authStore.getUser();
      console.log("User: ", user);
      if (user == null) {
        Router.push("/signin");
        return;
      }
      this.setState({ isLoading: false });
    }

    render() {
      const { isLoading } = this.state;
      if (isLoading) {
        return <CircularProgress />;
      }

      return <WrappedComponent {...this.props} />;
    }
  };

export default withAuth;
