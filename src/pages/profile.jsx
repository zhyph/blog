import React from 'react';
import Nav from '../components/Nav';
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
  Container,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  withStyles,
  Table,
} from '@material-ui/core';
import axios from 'axios';
import NotLogged from '../components/NotLogged';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  body: {
    backgroundColor: 'grey',
  },
  table: {
    minWidth: 650,
  },
  loggedInContainer: {
    // display: 'grid',
    // placeItems: 'center',
    // height: '70%',
    // paddingTop: '1rem',
    [theme.breakpoints.down('md')]: {
      maxHeight: '660px',
      maxWidth: '960px',
    },
    [theme.breakpoints.down('sm')]: {
      maxHeight: '300px',
      maxWidth: '600px',
      // backgroundColor: 'purple',
    },
  },
  loggedInBox: {
    height: '90%',
    width: '100%',
    display: 'grid',
    placeItems: 'center',
  },
}));

const profile = ({ dados }) => {
  const classes = useStyles();

  //   const [newTest, setNewTest] = useState();
  //   console.log(dados[0].type);
  const { data, revalidate } = useSWR('/api/me', async function (args) {
    const res = await fetch(args);
    return res.json();
  });
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
    return finalFilter ? finalFilter[0] : '';
  };

  return (
    <Box height={'100vh'} width="auto" className={classes.body}>
      <Head>
        <title>Perfil</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Nav
        loggedIn={loggedIn}
        data={data}
        revalidate={revalidate}
        base64Img={dados}
      >
        Perfil
      </Nav>
      {!loggedIn && <NotLogged />}
      {loggedIn && finalBase64Src().type === '999' ? (
        <Container className={classes.loggedInBox}>
          <Box className={classes.loggedInContainer}>
            <TableContainer component={Paper}>
              <Table
                className={classes.table}
                size="small"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>UserID</TableCell>
                    <TableCell align="right">Nome</TableCell>
                    <TableCell align="right">Email</TableCell>
                    <TableCell align="right">CPF</TableCell>
                    <TableCell align="right">Nivel de Acesso</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dados?.map((row) => (
                    <TableRow key={row.userId}>
                      <TableCell component="th" scope="row">
                        {row.userId}
                      </TableCell>
                      <TableCell align="right">{row.name}</TableCell>
                      <TableCell align="right">{row.email}</TableCell>
                      <TableCell align="right">{row.cpf}</TableCell>
                      <TableCell align="right">{row.type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      ) : (
        ''
      )}
    </Box>
  );
};

export default profile;

export const getServerSideProps = async (ctx) => {
  const res = await fetch('http://localhost:3000/api/user');

  return {
    props: {
      dados: await res.json(),
    },
  };
};
