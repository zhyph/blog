import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Link from 'next/link';
import cookie from 'js-cookie';
import { NextPage } from 'next';
import { useState } from 'react';
import FileBase64 from 'react-file-base64';
import {
  Box,
  makeStyles,
  Typography,
  Button,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  whiteButton: {
    fontWeight: '500',
    margin: '5px',
    color: 'white',
    padding: '.2rem',
    textDecoration: 'none',
    [theme.breakpoints.down('sm')]: {
      fontSize: '.8rem',
      // backgroundColor: 'purple',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '1.3rem',
      // backgroundColor: 'green',
    },
  },
  button: {
    fontWeight: '500',
    margin: '5px',
    color: 'white',
    '& a': {
      color: 'black',
    },
    padding: '.2rem',
    textDecoration: 'none',
    [theme.breakpoints.down('sm')]: {
      fontSize: '.8rem',
      // backgroundColor: 'purple',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '1.3rem',
      // backgroundColor: 'green',
    },
  },
  buttonMenu: {
    fontWeight: '500',
    margin: '5px',
    color: 'white',
    padding: '.2rem',
    textDecoration: 'none',
    [theme.breakpoints.down('sm')]: {
      fontSize: '.8rem',
      // backgroundColor: 'purple',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '1.3rem',
      // backgroundColor: 'green',
    },
    '&:hover': {
      backgroundColor: grey[900],
      border: '.5px solid white',
    },
  },
  smallText: {
    fontWeight: '500',
    [theme.breakpoints.down('sm')]: {
      fontSize: '.8rem',
      // backgroundColor: 'purple',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '1.3rem',
      // backgroundColor: 'green',
    },
  },
  smallLink: {
    fontWeight: '500',
    color: 'white',
    [theme.breakpoints.down('sm')]: {
      fontSize: '.8rem',
      // backgroundColor: 'purple',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '1.3rem',
      // backgroundColor: 'green',
    },
  },
  pageTitle: {
    marginLeft: '10%',
    fontWeight: '500',
    // variant: 'h2',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
      // backgroundColor: 'purple',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1.3rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '1.7rem',
      // backgroundColor: 'green',
    },
  },
  accountDisplay: {
    marginRight: '10%',
  },
  root: {
    // ...theme.typography.button,
    // display: 'inline-block',
    // backgroundColor: theme.palette.background.paper,
    // padding: theme.spacing(1),
    fontWeight: '500',
    // variant: 'h2',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
      // backgroundColor: 'purple',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1.3rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '1.7rem',
      // backgroundColor: 'green',
    },
  },
}));

export default function Nav({ loggedIn, data, revalidate }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      width="100%"
      // height="30%"
      bgcolor="black"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography color="primary" className={classes.pageTitle}>
        BLOG
      </Typography>
      {!loggedIn && (
        <Box display="flex" flexDirection="row" alignItems="center">
          <Button
            variant="outlined"
            color="primary"
            className={classes.whiteButton}
          >
            <Link href="/login" passHref>
              <a className={classes.whiteButton}>LogIn</a>
            </Link>
          </Button>
          <Typography color="primary" className={classes.root}>
            ou
          </Typography>
          <Button
            color="primary"
            variant="outlined"
            className={classes.whiteButton}
          >
            <Link href="/signup" passHref>
              <a className={classes.whiteButton}>Sign Up</a>
            </Link>
          </Button>
        </Box>
      )}
      {loggedIn && (
        <Box
          //   display="flex"
          //   flexDirection="row"
          //   alignItems="center"
          marginRight="10%"
        >
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            variant="outlined"
            onClick={handleClick}
            className={classes.buttonMenu}
          >
            <Typography color="primary" className={classes.smallText}>
              Welcome {data.email}!
            </Typography>
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Button
                // color="primary"
                variant="outlined"
                className={classes.button}
                display="inline-block"
                fullWidth
              >
                <Link href="/profile" passHref>
                  <a className={classes.button}>Perfil</a>
                </Link>
              </Button>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Button
                fullWidth
                // color="primary"
                variant="outlined"
                className={classes.button}
                onClick={() => {
                  cookie.remove('token');
                  revalidate();
                }}
              >
                <a className={classes.button}>Log Out</a>
              </Button>
            </MenuItem>
          </Menu>
        </Box>
      )}
    </Box>
  );
}
