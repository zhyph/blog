import React, { useRef, useState } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import FileBase64 from "react-file-base64";
import imageCompression from "browser-image-compression";
import { server } from "../config";
import Nav from "../components/Nav";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
// import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { TextMaskCustom } from "../components/AdminProfile";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Head from "next/head";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
  },
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  alertMargin: { margin: theme.spacing(2) },
}));

function SignUp() {
  const classes = useStyles();
  const Router = useRouter();
  const [dataUri, setDataUri] = useState("");
  // const [files, setFiles] = useState([]);
  const [base, setbase] = useState();
  const [imageStates, setImageStates] = useState({
    maxSizeMB: 1,
    maxWidthOrHeight: 400,
    webWorker: {
      progress: null,
      inputSize: null,
      outputSize: null,
      inputUrl: null,
      outputUrl: null,
    },
    mainThread: {
      progress: null,
      inputSize: null,
      outputSize: null,
      inputUrl: null,
      outputUrl: null,
    },
  });
  const [open, setOpen] = useState({
    success: false,
    fail: false,
    loading: false,
  });
  const [signupError, setSignupError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [name, setName] = useState("");
  const [errorText, setErrorText] = useState();

  console.log(
    "email",
    email,
    "password",
    password,
    "cpf",
    cpf.length,
    "name",
    name
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCpf = cpf.replace(/[^0-9]/g, "");
    console.log(newCpf);
    setOpen({ loading: true });
    fetch(`${server}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        cpf: newCpf,
        password,
        name,
        type: "1",
        active: "1",
        base64: base,
        // profilePictureRef.current.files[0],
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.error) {
          setSignupError(data.message);
          setOpen({ fail: true });
        }
        if (data && data.token) {
          //Set cookie
          cookie.set("token", data.token, { expires: 2 });
          Router.push("/");
        }
      });
  };

 

  const compressImage = async (e, useWebWorker) => {
    const file = e.target.files[0];
    
    const targetName = useWebWorker ? "webWorker" : "mainThread";
    setImageStates((prevState) => ({
      ...prevState,
      [targetName]: {
        ...prevState[targetName],
        inputSize: (file.size / 1024 / 1024).toFixed(2),
        inputUrl: URL.createObjectURL(file),
      },
    }));
    var options = {
      maxSizeMB: imageStates.maxSizeMB,
      maxWidthOrHeight: imageStates.maxWidthOrHeight,
      useWebWorker,
      // onProgress: (p) => onProgress(p, useWebWorker),
    };
    const output = await imageCompression(file, options);
    // console.log("output", output);
    var reader = new FileReader();
    reader.readAsDataURL(output);
    reader.onload = function () {
      // console.log(reader.result);
      setbase(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
    setImageStates((prevState) => ({
      ...prevState,
      [targetName]: {
        ...prevState[targetName],
        outputSize: (output.size / 1024 / 1024).toFixed(2),
        outputUrl: URL.createObjectURL(output),
      },
    }));
    setOpen({ ...open, success: true });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  // const version = imageCompression.version;
  // const { webWorker, mainThread, maxSizeMB, maxWidthOrHeight } = imageStates;

  const handleCheck = (e) => {
    const target = e.target.name;
    const value = e.target.value;
    const newCpf = cpf.replace(/[^0-9]/g, "");

    if (target === "cpf") {
      if (cpf.length === 0) {
        setErrorText();
        return;
      } else if (newCpf.length < 11) {
        setErrorText("CPF Invalido");
      } else if (newCpf.length > 11) {
        setErrorText("CPF Invalido");
      } else {
        setErrorText();
      }
    }
  };

  return (
    <div className={classes.root}>
      <Head>
        <title>SignUp</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Nav loggedIn={false} />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            {imageStates.webWorker.outputUrl ? (
              <Box
                component="img"
                src={imageStates.webWorker.outputUrl}
                width="40px"
              />
            ) : (
              <LockOutlinedIcon />
            )}
          </Avatar>
          <Typography component="h1" variant="h5">
            Cadastro
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container justify="center" spacing={2}>
              <Grid item xs={12}>
                <TextField
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
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="CPF"
                  variant="outlined"
                  autoComplete="cpf"
                  name="cpf"
                  required
                  fullWidth
                  id="cpf"
                  label="CPF"
                  error={errorText ? true : false}
                  helperText={errorText}
                  InputProps={{
                    inputComponent: TextMaskCustom,
                    onChange: (e) => setCpf(e.target.value),
                    onBlur: (e) => handleCheck(e),
                  }}
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  name="name"
                  variant="outlined"
                  required
                  fullWidth
                  id="name"
                  label="Nome Completo"
                />
              </Grid>
              <Grid item xs={4}>
                <Button variant="contained" component="label">
                  Escolha uma foto
                  <input
                    onChange={(e) => compressImage(e, true)}
                    accept="image/*"
                    type="file"
                    hidden
                  />
                </Button>
              </Grid>
             
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Cadastrar
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
              
                <Link href="/login" passHref>
                  <Button component="a" variant="text">
                    Já tem uma conta? Entre por aqui.
                  </Button>
                </Link>
              
              </Grid>
            </Grid>
          </form>
        </div>
        <Snackbar
          open={open.loading}
          autoHideDuration={4000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            className={classes.alertMargin}
            severity="info"
          >
            Loading...
          </Alert>
        </Snackbar>
        <Snackbar
          open={open.success}
          autoHideDuration={4000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            className={classes.alertMargin}
            severity="success"
          >
            Imagem pronta!
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
            {signupError}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
}

export default SignUp;
