import Head from "next/head";
import fetch from "isomorphic-unfetch";
import useSWR from "swr";
import Link from "next/link";
import cookie from "js-cookie";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import FileBase64 from "react-file-base64";
import {
  Box,
  makeStyles,
  Typography,
  Button,
  Menu,
  MenuItem,
  Container,
} from "@material-ui/core";
import Nav from "../components/Nav";
import axios from "axios";
import NotLogged from "../components/NotLogged";
import { server } from "../config";

const useStyles = makeStyles((theme) => ({
  body: {
    backgroundColor: "grey",
  },
  notLoggedInContainer: {
    backgroundColor: "white",
    height: "70%",
    width: "70%",
    display: "grid",
    placeItems: "center",
    // paddingTop: '1rem',
    [theme.breakpoints.down("md")]: {
      maxHeight: "660px",
      maxWidth: "960px",
    },
    [theme.breakpoints.down("sm")]: {
      maxHeight: "300px",
      maxWidth: "600px",
    },
  },
  notLoggedInBox: {
    height: "90vh",
    width: "100%",
    display: "grid",
    placeItems: "center",
  },
  notLoggedInText: {
    [theme.breakpoints.down("md")]: {
      fontSize: "1.5rem",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem",
    },
  },
}));

function Home({ dados }) {

  const classes = useStyles();
  const { data, revalidate } = useSWR(
    `${server}/api/me`,
    async function (args) {
      const res = await fetch(args);
      return res.json();
    }
  );
  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;
  if (data.email) {
    loggedIn = true;
  }

  const finalBase64Src = () => {
    const base64Array = dados?.map((item) => {
      if (data.userId === item.userId) {
        return item;
      }
    });
    const finalFilter = base64Array?.filter((e) => {
      return e !== undefined;
    });
    return finalFilter ? finalFilter[0] : "";
  };

  return (
    <Box
      height={!loggedIn ? "100vh" : "100%"}
      width="auto"
      className={classes.body}
    >
      <Head>
        <title>Blog</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Nav
        loggedIn={loggedIn}
        data={data}
        revalidate={revalidate}
        base64Img={dados}
      />
      {finalBase64Src()?.active === "0" && <NotLogged />}
      {!loggedIn && (
        <NotLogged></NotLogged>
      )}
    </Box>
  );
}

export default Home;

export const getServerSideProps = async (ctx) => {
  const res = await fetch(`${server}/api/user`);

  return {
    props: {
      dados: await res.json(),
    },
  };
};
