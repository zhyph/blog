import Head from "next/head";
import fetch from "isomorphic-unfetch";
import useSWR from "swr";
import Link from "next/link";
import cookie from "js-cookie";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import FileBase64 from "react-file-base64";
import Image from "next/image";
import ArrowDropDownCircleRoundedIcon from "@material-ui/icons/ArrowDropDownCircleRounded";
import {
  Box,
  makeStyles,
  Typography,
  Button,
  Menu,
  MenuItem,
  Avatar,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
// import { useRouter } from "next/router";
import Router from "next/router";

const useStyles = makeStyles((theme) => ({
  boxMenu: {
    marginBottom: "2px",
  },
  avatar: {
    // marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  whiteButton: {
    fontWeight: "500",
    margin: "10px",
    color: "white",
    padding: ".5rem",
    textDecoration: "none",
    [theme.breakpoints.down("sm")]: {
      fontSize: ".8rem",
      // backgroundColor: 'purple',
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1rem",
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: "1.3rem",
      // backgroundColor: 'green',
    },
  },
  button: {
    fontWeight: "500",
    margin: "5px",
    color: "white",
    "& a": {
      color: "black",
    },
    padding: ".2rem",
    textDecoration: "none",
    [theme.breakpoints.down("sm")]: {
      fontSize: ".8rem",
      // backgroundColor: 'purple',
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1rem",
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: "1.3rem",
      // backgroundColor: 'green',
    },
  },
  buttonMenu: {
    fontWeight: "500",
    margin: "5px",
    color: "white",
    padding: ".2rem",
    textDecoration: "none",
    [theme.breakpoints.down("sm")]: {
      fontSize: ".8rem",
      // backgroundColor: 'purple',
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1rem",
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: "1.3rem",
      // backgroundColor: 'green',
    },
  },
  smallText: {
    marginLeft: theme.spacing(1),
    fontWeight: "500",
    [theme.breakpoints.down("sm")]: {
      fontSize: ".8rem",
      // backgroundColor: 'purple',
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1rem",
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: "1.3rem",
      // backgroundColor: 'green',
    },
  },
  smallLink: {
    fontWeight: "500",
    color: "white",
    [theme.breakpoints.down("sm")]: {
      fontSize: ".8rem",
      // backgroundColor: 'purple',
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1rem",
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: "1.3rem",
      // backgroundColor: 'green',
    },
  },
  pageTitle: {
    marginLeft: "10%",
    fontWeight: "500",
    textDecoration: "none",
    // variant: 'h2',
    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem",
      // backgroundColor: 'purple',
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1.3rem",
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: "1.7rem",
      // backgroundColor: 'green',
    },
  },
  accountDisplay: {
    marginRight: "10%",
  },
  root: {
    // ...theme.typography.button,
    // display: 'inline-block',
    // backgroundColor: theme.palette.background.paper,
    // padding: theme.spacing(1),
    fontWeight: "500",
    // variant: 'h2',
    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem",
      // backgroundColor: 'purple',
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1.3rem",
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: "1.7rem",
      // backgroundColor: 'green',
    },
  },
}));

export default function Nav({ base64Img, loggedIn, data, revalidate }) {
  // const router = useRouter();
  // { loggedIn, data, revalidate, base64Img }
  const [anchorEl, setAnchorEl] = useState(null);
  const [newData, setNewData] = useState();
  const classes = useStyles();
  const [controle, setControle] = useState();

  // const { data, revalidate } = useSWR('/api/me', async function (args) {
  //   const res = await fetch(args);
  //   return res.json();
  // });
  // if (!data) return <h1>Loading...</h1>;
  // let loggedIn = false;
  // if (data.email) {
  //   loggedIn = true;
  //   // const imgB = imgFinder;
  //   // setBase64Img(imgB);
  // }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const useFilter = () => {
    const base64Array = base64Img?.map((item) => {
      if (data.userId === item.userId) {
        return item;
      }
    });
    // base64Img?.map((item) => {
    //   if (item.email === data.email) {
    //     // console.log(item.base64);
    //     return item.base64;
    //   }
    // });
    const finalFilter = base64Array?.filter((e) => {
      // console.log(e);
      return e !== undefined;
    });
    return finalFilter ? finalFilter[0] : "";
  };

  useEffect(() => {
    setNewData(useFilter());
  }, [loggedIn]);

  // console.log(newData);

  return (
    <Box
      width="100%"
      // height="30%"
      bgcolor="black"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Button color="primary" className={classes.pageTitle}>
        <Link href="/" passHref>
          <a className={classes.pageTitle}>
            <Typography className={classes.pageTitle} color="primary">
              BLOG
            </Typography>
          </a>
        </Link>
      </Button>

      {!loggedIn && (
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          className={classes.accountDisplay}
        >
          {/* <Button
            variant="outlined"
            color="primary"
            className={classes.whiteButton}
          >
            <Link href="/login" passHref>
              <a className={classes.whiteButton}>LogIn</a>
            </Link>
          </Button> */}
          <Link href="/login" passHref>
            <Button
              className={classes.whiteButton}
              component="a"
              variant="outlined"
              color="primary"
            >
              Login
            </Button>
          </Link>
          <Typography color="primary" className={classes.root}>
            ou
          </Typography>
          <Link href="/signup" passHref>
            <Button
              className={classes.whiteButton}
              component="a"
              variant="outlined"
              color="primary"
            >
              Sign Up
            </Button>
          </Link>
          {/* <Button
            color="primary"
            variant="outlined"
            className={classes.whiteButton}
          >
            <Link href="/signup" passHref>
              <a className={classes.whiteButton}>Sign Up</a>
            </Link>
          </Button> */}
        </Box>
      )}
      {loggedIn && (
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          marginRight="10%"
        >
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
                // onClick={logOut()}
                onClick={() => {
                  cookie.remove("token");
                  revalidate();
                  Router.push("/");
                }}
              >
                <a className={classes.button}>Log Out</a>
              </Button>
            </MenuItem>
          </Menu>
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            color="primary"
            variant="outlined"
            onClick={handleClick}
            className={classes.buttonMenu}
          >
            <ArrowDropDownCircleRoundedIcon color="primary" />
            <Typography color="primary" className={classes.smallText}>
              Welcome {newData?.name}!
            </Typography>
            <Avatar
              // src={base64Img.filter((e) => {
              //   return e !== undefined;
              // })}
              src={newData?.base64}
              className={classes.avatar}
            />
          </Button>
        </Box>
      )}
    </Box>
  );
}
