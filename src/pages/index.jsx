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
      // backgroundColor: 'purple',
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
  // console.log(dados);
  // const [files, setFiles] = useState([]);
  // const [base64Img, setBase64Img] = useState();
  // const [newData, setNewData] = useState();
  // const [res, setRes] = useState();

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
      // console.log(e);
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

      {/* <FileBase64 multiple={false} onDone={(e) => getFiles(e)} /> */}

      <Nav
        loggedIn={loggedIn}
        data={data}
        revalidate={revalidate}
        base64Img={dados}
      />
      {finalBase64Src()?.active === "0" && <NotLogged />}
      {!loggedIn && (
        <NotLogged></NotLogged>
        // <Box className={classes.notLoggedInBox}>
        //   <Container maxWidth="md" className={classes.notLoggedInContainer}>
        //     <Typography
        //       variant="h3"
        //       color="textPrimary"
        //       align="center"
        //       className={classes.notLoggedInText}
        //     >
        //       Você precisa fazer Log In ou Sign Up para ver o conteudo
        //     </Typography>
        //   </Container>
        // </Box>
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

{
  /* <Box
        width="100%"
        // height="30%"
        bgcolor="black"
        display="flex"
        justifyContent="space-around"
        alignItems="center"
      >
        <Typography color="primary" className={classes.root}>
          BLOG
        </Typography>
        {!loggedIn && (
          <Box display="flex" flexDirection="row" alignItems="center">
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
            >
              <Link href="/login" passHref>
                <a className={classes.button}>LogIn</a>
              </Link>
            </Button>
            <Typography color="primary" className={classes.root}>
              ou
            </Typography>
            <Button
              color="primary"
              variant="outlined"
              className={classes.button}
            >
              <Link href="/signup" passHref>
                <a className={classes.button}>Sign Up</a>
              </Link>
            </Button>
          </Box>
        )} */
}

{
  /* </Box> */
}

{
  /* {loggedIn && (
        <>
          <p>Welcome {data.email}!</p>
          <button
            onClick={() => {
              cookie.remove('token');
              revalidate();
            }}
          >
            Logout
          </button>
        </>
      )} */
}
{
  /* {!loggedIn && (
        <>
          <Link href="/login">Login</Link>
          <p>or</p>
          <Link href="/signup">Sign Up</Link>
        </>
      )} */
}
