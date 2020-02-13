import React, { Component } from "react";
import Router from "next/router";
import { inject } from "mobx-react";
import { CircularProgress } from "@material-ui/core";

const withAuth = WrappedComponent =>
  @inject(props => ({
    p: props
  }))
  class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: true
      };
    }

    componentDidMount() {
      const { user } = this.props;
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
