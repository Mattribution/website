import React from "react";
import Link from "next/link";
import Head from "../components/head";
import LayoutVanilla from "../components/Layouts/LayoutVanilla";

const Home = () => {
  return (
    <LayoutVanilla>
      <Head title="Home" />
      Signup
    </LayoutVanilla>
  );
};

export default Home;
