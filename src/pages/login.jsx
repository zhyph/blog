import React, { useState } from "react";
import Router from "next/router";
import cookie from "js-cookie";
import { NextPage } from "next";
import { server } from "../config/index";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Nav from "../components/Nav";
import Link from "next/link";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Head from "next/head";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  alertMargin: { marginBottom: theme.spacing(2) },
}));

const Login = () => {
  const classes = useStyles();
  const [loginError, setLoginError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState({ success: false, fail: false });

  console.log("email", email, "password", password);

  function handleSubmit(e) {
    e.preventDefault();
    //call api
    setOpen({ ...open, success: true });
    fetch(`${server}/api/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((r) => {
        return r.json();
      })
      .then((data) => {
        if (data && data.error) {
          setLoginError(data.message);
          setOpen({ ...open, fail: true });
        }
        if (data && data.token) {
          //set cookie
          cookie.set("token", data.token, { expires: 2 });
          Router.push("/");
        }
      });
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Head>
        <title>Login</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Nav loggedIn={false} />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <form onSubmit={handleSubmit} className={classes.form}>
            <TextField
              className={classes.alertMargin}
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              type="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
              // autoComplete="email"
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Entrar
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link href="/signup" passHref>
                  <Button component="a" variant="text">
                    Não tem uma conta? Se cadastre por aqui
                  </Button>
                </Link>
              </Grid>
            </Grid>
          </form>
          
        </div>
        <Snackbar
          open={open.success}
          autoHideDuration={4000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            className={classes.alertMargin}
            severity="info"
          >
            Carregando...
          </Alert>
        </Snackbar>
        <Snackbar
          open={open.fail}
          autoHideDuration={4000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            className={classes.alertMargin}
            severity="error"
          >
            {loginError}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default Login;
