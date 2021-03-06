import React, { useRef, useState } from "react";
import fetch from "isomorphic-unfetch";
import {
  Box,
  makeStyles,
  Container,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Table,
  InputLabel,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import MaskedInput from "react-text-mask";
import { Alert } from "@material-ui/lab";
import { server } from "../config";
import Nav from "./Nav";

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
  },
  normalUserElement: {
    display: "grid",
    placeItems: "center",

    height: "50%",
  },
  loggedFormBox: {
    display: "grid",
    placeItems: "center",
  },
  loggedInContainer: {
    [theme.breakpoints.down("md")]: {
      maxHeight: "660px",
      maxWidth: "960px",
    },
    [theme.breakpoints.down("sm")]: {
      maxHeight: "300px",
      maxWidth: "600px",
    },
  },
  loggedInBox: {
    backgroundColor: "white",
    height: "100%",
    width: "100%",
    display: "grid",
    // alignItems: "center",
    // justifyContent: "center",
    // flexDirection: "column",
    placeItems: "center",
    // marginTop: theme.spacing(3),
    gridTemplateRows: "auto 1fr",
    // [theme.breakpoints.down("md")]: {
    //   height: "100%",
    // },
  },
  normalUserLoggedInBox: {
    backgroundColor: "white",
    height: "90%",
    width: "100%",
    display: "flex",

    justifyContent: "center",

    marginTop: theme.spacing(3),
    [theme.breakpoints.down("md")]: {
      height: "100%",
    },
  },
  inputComponent: {
    marginRight: theme.spacing(1),
    flex: "1 1 100px",

    [theme.breakpoints.up("lg")]: {
      flex: "1 1 200px",
    },
    [theme.breakpoints.down("md")]: {
      flex: "1 1 150px",
    },
    [theme.breakpoints.down("sm")]: {
      flex: "1 1 80px",
    },
  },
  root: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: theme.spacing(1),
  },
  textSize: {
    [theme.breakpoints.up("md")]: {
      fontSize: "2rem",
    },
    [theme.breakpoints.down("md")]: {
      fontSize: "1rem",
    },
  },
  buttonsWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
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
  alertMargin: { margin: theme.spacing(2) },
  buttonError: { backgroundColor: "red" },
  profilePicture: {
    borderRadius: "100%",
  },
  newBox: {
    display: "grid",
    placeItems: "center",
  },
}));

export function TextMaskCustom(props) {
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

  const fetchUserData = (value) => {
    const userIdCheck = dados?.map((item) => {
      if (value === item.userId) {
        return item;
      }
    });
    const newFinalFilter = userIdCheck?.filter((e) => {
      return e !== undefined;
    });
    setFormData((prevState) => ({
      ...prevState,
      name: newFinalFilter[0].name,
      email: newFinalFilter[0].email,
      cpf: newFinalFilter[0].cpf,
      type: newFinalFilter[0].type,
      active: newFinalFilter[0].active,
    }));
  };

  const userIdCheck = (e) => {
    const value = e.target.value;
    setErrorText((prevState) => ({
      ...prevState,
      userId: false,
      textUserId: "",
    }));
    if (value.length === 36) {
      setFormData((prevState) => ({
        ...prevState,
        userId: value,
      }));
      fetchUserData(value);
    } else if (value.length >= 1) {
      setErrorText((prevState) => ({
        ...prevState,
        textUserId: "UserID incorreto",
        userId: true,
      }));
      return;
    }
  };

  const errorCheck = (value) => {
    const newCpf = formData.cpf.replace(/[^0-9]/g, "");
    if (value.length === 0) {
      setErrorText((prevState) => ({
        ...prevState,
        textCpf: "",
        cpf: false,
      }));
    } else if (newCpf.length < 11) {
      setErrorText((prevState) => ({
        ...prevState,
        textCpf: "CPF Invalido",
        cpf: true,
      }));
    } else {
      setErrorText((prevState) => ({
        ...prevState,
        textCpf: "",
        cpf: false,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCpf = formData.cpf.replace(/[^0-9]/g, "");
    fetch(`${server}/api/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: formData.userId,
        email: formData.email,
        cpf: newCpf,
        name: formData.name,
        type: formData.type,
        active: formData.active,
      }),
    })
      .then((r) => {
        return r.json();
      })
      .then((data) => {
        if (data && data.error) {
          setPatchError(data.message);
        }
        if (data && !data.error && data.message) {
          setPatchSucces(data.message);
        }
      });
    ref.current.value = "";
    setFormData({
      userId: "",
      name: "",
      email: "",
      cpf: "",
      type: "",
      active: "",
    });
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    fetch(`${server}/api/user`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: formData.userId,
      }),
    })
      .then((r) => {
        return r.json();
      })
      .then((data) => {
        if (data && data.error) {
          setPatchError(data.message);
        }
        if (data && !data.error && data.message) {
          setPatchSucces(data.message);
        }
      });
    ref.current.value = "";
    setFormData({
      userId: "",
      name: "",
      email: "",
      cpf: "",
      type: "",
      active: "",
    });
  };

  const handleCancel = (e) => {
    e.preventDefault();

    ref.current.value = "";
    setErrorText({ ...errorText, userId: false, textUserId: "" });
    setFormData({
      userId: "",
      name: "",
      email: "",
      cpf: "",
      type: "",
      active: "",
    });
  };

  return (
    <Box className={classes.loggedInBox}>
      <Nav
        loggedIn={loggedIn}
        data={data}
        revalidate={revalidate}
        dados={dados}
      />
      <Box className={classes.newBox}>
        <Box className={classes.loggedFormBox}>
          <Typography variant="h6" className={classes.textSize}>
            Copie e cole o userId para editar/excluir um usuario
          </Typography>
          <form
            className={classes.root}
            onSubmit={(e) => handleSubmit(e)}
            autoComplete="off"
          >
            <FormControl
              component="fieldset"
              className={classes.inputComponent}
            >
              <TextField
                label="UserID"
                variant="filled"
                inputRef={ref}
                required
                error={errorText.userId}
                helperText={errorText.textUserId}
                onBlur={(e) => userIdCheck(e)}
              />
            </FormControl>
            <FormControl
              component="fieldset"
              className={classes.inputComponent}
            >
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
            <FormControl
              component="fieldset"
              className={classes.inputComponent}
            >
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
            <FormControl
              component="fieldset"
              className={classes.inputComponent}
            >
              <TextField
                label="CPF"
                variant="filled"
                InputProps={{
                  inputComponent: TextMaskCustom,
                  value: formData.cpf,

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
              />
            </FormControl>
            <FormControl
              component="fieldset"
              className={classes.inputComponent}
            >
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
              >
                <RadioGroup
                  row
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
                <Button type="submit" variant="contained" color="primary">
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
      </Box>
    </Box>
  );
}

export default AdminProfile;
