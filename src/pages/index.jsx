import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Link from 'next/link';
import cookie from 'js-cookie';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import FileBase64 from 'react-file-base64';
import {
  Box,
  makeStyles,
  Typography,
  Button,
  Menu,
  MenuItem,
} from '@material-ui/core';
import Nav from '../components/Nav';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  body: {
    backgroundColor: 'grey',
  },
}));

function Home({ dados }) {
  console.log(dados);
  // const [files, setFiles] = useState([]);
  // const [base64Img, setBase64Img] = useState();

  const classes = useStyles();

  const { data, revalidate } = useSWR('/api/me', async function (args) {
    const res = await fetch(args);
    return res.json();
  });
  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;
  if (data.email) {
    loggedIn = true;
    // const imgB = imgFinder;
    // setBase64Img(imgB);
  }

  // console.log(files);

  // const getBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //     reader.readAsDataURL(file);
  //   });
  // };

  // const imageUpload = (e) => {
  //   const file = e.target.files[0];
  //   getBase64(file).then((base64) => {
  //     // localStorage['fileBase64'] = base64;
  //     setDataUri(base64);
  //     console.debug('file stored', base64);
  //   });
  // };

  return (
    <Box height="100vh" width="auto" className={classes.body}>
      <Head>
        <title>Blog</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      {/* <input
        type="file"
        id="imageFile"
        name="imageFile"
        onChange={imageUpload}
      />
    <img src={dataUri} width="200" height="200" alt="image" /> */}

      {/* <FileBase64 multiple={false} onDone={(e) => getFiles(e)} /> */}

      <Nav
        loggedIn={loggedIn}
        data={data}
        revalidate={revalidate}
        base64Img={dados.map((item) => {
          if (item.email === data.email) {
            // console.log(item.base64);
            return item.base64;
          }
        })}
      />
      {/* <Box
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
        )} */}

      {/* </Box> */}

      {/* {loggedIn && (
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
      )} */}
      {/* {!loggedIn && (
        <>
          <Link href="/login">Login</Link>
          <p>or</p>
          <Link href="/signup">Sign Up</Link>
        </>
      )} */}
    </Box>
  );
}

export default Home;

export const getServerSideProps = async (ctx) => {
  const res = await fetch('http://localhost:3000/api/user');

  return {
    props: {
      dados: await res.json(),
    },
  };
};
