import React, { useRef } from "react";
import Nav from "../components/Nav";
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
  Container,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  withStyles,
  Table,
  InputLabel,
  Input,
  FormControl,
  FormHelperText,
  OutlinedInput,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  Grid,
} from "@material-ui/core";
import axios from "axios";
import NotLogged from "../components/NotLogged";
import Paper from "@material-ui/core/Paper";
import MaskedInput from "react-text-mask";
import { Alert } from "@material-ui/lab";
import Image from "next/image";
import { server } from "../config";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "100vh",
    backgroundColor: "grey",
  },
  newBoxTest: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
  },
  table: {
    minWidth: 650,
  },
  normalUserBox: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(4),
    height: "100%",
    // width: '100%',
  },
  normalUserElement: {
    display: "grid",
    placeItems: "center",
    // marginBottom: theme.spacing(4),
    height: "50%",
    // width: '100%',
  },
  loggedFormBox: {
    display: "grid",
    placeItems: "center",
  },
  loggedInContainer: {
    // display: 'grid',
    // placeItems: 'center',
    // height: '70%',
    // paddingTop: '1rem',
    // marginBottom: theme.spacing(1),
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
  loggedInBox: {
    backgroundColor: "white",
    height: "90%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginTop: theme.spacing(3),
    [theme.breakpoints.down("md")]: {
      height: "100%",
    },
  },
  normalUserLoggedInBox: {
    backgroundColor: "white",
    height: "90%",
    width: "100%",
    display: "flex",
    // alignItems: 'center',
    justifyContent: "center",
    // flexDirection: 'row',
    marginTop: theme.spacing(3),
    [theme.breakpoints.down("md")]: {
      height: "100%",
    },
  },
  inputComponent: {
    marginRight: theme.spacing(1),
    flex: "1 1 100px",
    // marginBottom: theme.spacing(1),
    [theme.breakpoints.up("lg")]: {
      // maxWidth: '960px',
      flex: "1 1 200px",
    },
    [theme.breakpoints.down("md")]: {
      // maxWidth: '960px',
      flex: "1 1 150px",
    },
    [theme.breakpoints.down("sm")]: {
      // maxWidth: '600px',
      flex: "1 1 80px",
      // backgroundColor: 'purple',
    },
    // ' & #grid': {
    //   display: 'grid',
    //   placeItems: 'center',
    // },
  },
  root: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    // display: 'grid',
    // placeItems: 'center',
    // gridTemplateColumns: 'repeat(5, 1fr)',
  },
  textSize: {
    [theme.breakpoints.up("md")]: {
      fontSize: "2rem",
    },
    [theme.breakpoints.down("md")]: {
      fontSize: "1rem",
    },
    // [theme.breakpoints.down('sm')]: {
    //   fontSize: '.25rem',
    //   // backgroundColor: 'purple',
    // },
  },
  buttonsWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    // paddingLeft: theme.spacing(2),
  },
  teste: {
    display: "grid",
    placeItems: "center",
    [theme.breakpoints.up("md")]: {
      width: "30%",
    },
    [theme.breakpoints.down("md")]: {
      width: "60%",
    },
  },
  alertMargin: { marginTop: theme.spacing(2) },
  buttonError: { backgroundColor: "red" },
  profilePicture: {
    borderRadius: "100%",
  },
}));

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[
        /\d/,
        /\d/,
        /\d/,
        ".",
        /\d/,
        /\d/,
        /\d/,
        ".",
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
      ]}
      // placeholderChar={'\u2000'}
      // showMask
    />
  );
}

function AdminProfile({ loggedIn, data, revalidate, dados }) {
  const ref = useRef();
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    cpf: "",
    type: "",
    active: "",
  });
  const [errorText, setErrorText] = useState({
    userId: false,
    cpf: false,
    textUserId: "",
    textCpf: "",
  });
  const [patchError, setPatchError] = useState();
  const [patchSuccess, setPatchSucces] = useState();
  const classes = useStyles();

  return (
    <Container className={classes.loggedInBox}>
      <Box className={classes.loggedFormBox}>
        <Typography variant="h6" className={classes.textSize}>
          Preencha o formulario se você desejar editar ou excluir algum usuario
        </Typography>
        <form
          className={classes.root}
          onSubmit={(e) => handleSubmit(e)}
          autoComplete="off"
        >
          <FormControl component="fieldset" className={classes.inputComponent}>
            <TextField
              label="UserID"
              variant="filled"
              inputRef={ref}
              required
              error={errorText.userId}
              helperText={errorText.textUserId}
              // value={formData.userId}
              // onChange={(e) => setFormData({ userId: e.target.value })}
              onBlur={(e) => userIdCheck(e)}
            />
          </FormControl>
          <FormControl component="fieldset" className={classes.inputComponent}>
            <TextField
              label="Nome"
              variant="filled"
              value={formData.name}
              required
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  name: e.target.value,
                }))
              }
            />
          </FormControl>
          <FormControl component="fieldset" className={classes.inputComponent}>
            <TextField
              label="Email"
              type="email"
              required
              variant="filled"
              value={formData.email}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  email: e.target.value,
                }))
              }
            />
          </FormControl>
          <FormControl component="fieldset" className={classes.inputComponent}>
            <TextField
              label="CPF"
              variant="filled"
              InputProps={{
                inputComponent: TextMaskCustom,
                value: formData.cpf,
                // value: this.state.textmask,
                // onChange: this.handleChange('textmask'),
                onBlur: (e) => errorCheck(e.target.value),
                onChange: (e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    cpf: e.target.value,
                  })),
              }}
              required
              error={errorText.cpf}
              helperText={errorText.textCpf}
              // }
            />
          </FormControl>
          <FormControl component="fieldset" className={classes.inputComponent}>
            <InputLabel id="demo-simple-select-label">Nivel</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={formData.type}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  type: e.target.value,
                }))
              }
            >
              <MenuItem value={"1"}>Usuario Comum</MenuItem>
              <MenuItem value={"999"}>Admin</MenuItem>
            </Select>
          </FormControl>
          <div className={classes.teste}>
            <FormControl
              component="fieldset"
              className={classes.inputComponent}
              // id="grid"
            >
              <RadioGroup
                row
                // className={classes.radioButton}
                aria-label="position"
                name="position"
                value={formData.active}
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    active: e.target.value,
                  }))
                }
              >
                <FormControlLabel
                  value="1"
                  control={<Radio color="primary" />}
                  label="Ativado"
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="0"
                  control={<Radio color="primary" />}
                  label="Desativado"
                  labelPlacement="start"
                />
              </RadioGroup>
            </FormControl>
            <div className={classes.buttonsWrapper}>
              <Button
                type="submit"
                variant="contained"
                className={classes.buttonError}
                onClick={(e) => handleDelete(e)}
              >
                Deletar
              </Button>
              <Button variant="contained" onClick={(e) => handleCancel(e)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                // disabled={formData.userId ? false : true}
              >
                Enviar
              </Button>
            </div>
          </div>
        </form>
        {patchSuccess && (
          <Alert className={classes.alertMargin} severity="success">
            {patchSuccess}
          </Alert>
        )}
        {patchError && (
          <Alert className={classes.alertMargin} severity="error">
            {patchError}
          </Alert>
        )}
      </Box>
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
                <TableCell align="right">Ativo</TableCell>
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
                  <TableCell align="right">
                    {row.active === "1" ? "Ativo" : "Desativado"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

export default AdminProfile;
