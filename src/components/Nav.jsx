import Link from "next/link";
import cookie from "js-cookie";
import { useEffect, useState } from "react";
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
import Router from "next/router";

const useStyles = makeStyles((theme) => ({
  boxMenu: {
    marginBottom: "2px",
  },
  avatar: {
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
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1rem",
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: "1.3rem",
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
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1rem",
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: "1.3rem",
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
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1rem",
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: "1.3rem",
    },
  },
  smallText: {
    marginLeft: theme.spacing(1),
    fontWeight: "500",
    [theme.breakpoints.down("sm")]: {
      fontSize: ".8rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1rem",
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: "1.3rem",
    },
  },
  smallLink: {
    fontWeight: "500",
    color: "white",
    [theme.breakpoints.down("sm")]: {
      fontSize: ".8rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1rem",
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: "1.3rem",
    },
  },
  pageTitle: {
    marginLeft: "10%",
    fontWeight: "500",
    textDecoration: "none",

    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1.3rem",
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: "1.7rem",
    },
  },
  accountDisplay: {
    marginRight: "10%",
  },
  root: {
    fontWeight: "500",

    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1.3rem",
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: "1.7rem",
    },
  },
}));

export default function Nav({ dados, loggedIn, data, revalidate }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [newData, setNewData] = useState();
  const classes = useStyles();
  const [controle, setControle] = useState();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const useFilter = () => {
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

  useEffect(() => {
    setNewData(useFilter());
  }, [loggedIn]);

  // console.log(newData?.base64);

  return (
    <Box
      width="100%"
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
                variant="outlined"
                className={classes.button}
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
            <Avatar src={newData?.base64} className={classes.avatar} />
          </Button>
        </Box>
      )}
    </Box>
  );
}
