import React, { useRef } from "react";
import { useEffect, useState } from "react";
import {
  Box,
  makeStyles,
  Container,
  FormControl,
  TextField,
  Button,
} from "@material-ui/core";
import MaskedInput from "react-text-mask";
import { server } from "../config";
import { Alert } from "@material-ui/lab";

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

function NewComponent({ dados, data, revalidate }) {
  const classes = useStyles();
  const [teste, setTeste] = useState({ name: "", email: "", cpf: "" });
  const [controle, tas] = useState();
  const [patchError, setPatchError] = useState();
  const [patchSuccess, setPatchSucces] = useState();
  const [newBool, setNewBool] = useState(true);

  useEffect(() => {
    if (finalBase64Src()) {
      const { name, email, cpf } = finalBase64Src();
      setTeste({ name: name, email: email, cpf: cpf });
    } else {
      return;
    }
  }, [controle]);
  console.log(teste ? teste : "");

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

  const handleChange = (e) => {
    setTeste((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("passou");
    const newCpf = teste.cpf.replace(/[^0-9]/g, "");
    fetch(`${server}/api/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // 'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify({
        userId: data.userId,
        name: teste.name,
        email: teste.email,
        cpf: newCpf,
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
        // if (data && data.token) {
        //   //Set cookie
        //   cookie.set('token', data.token, { expires: 2 });
        //   Router.push('/');
        // }
      });
  };

  // const handleCancel = (e) => {
  //   e.preventDefault();
  //   console.log("cancelado com succeso");
  //   setErrorText({ ...errorText, userId: false, textUserId: "" });
  //   setTeste({
  //     name: "",
  //     email: "",
  //     cpf: "",
  //   });
  // };

  const handleBool = (e) => {
    e.preventDefault();
    setNewBool(!newBool);
  };

  return (
    <Container className={classes.normalUserLoggedInBox}>
      <Box className={classes.normalUserBox}>
        <Box className={classes.newBoxTest} spacing={3}>
          <Box
            // item xs={6}
            className={classes.normalUserElement}
          >
            <img
              width="60%"
              className={classes.profilePicture}
              // layout="responsive"
              src={finalBase64Src() ? finalBase64Src().base64 : "/default.png"}
            />
          </Box>
          <Box
            // item xs={6}
            className={classes.normalUserElement}
          >
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
                  label="Nome"
                  disabled={newBool}
                  name="name"
                  value={teste?.name}
                  InputLabelProps={{ shrink: true }}
                  required
                  onChange={(e) => handleChange(e)}
                />
              </FormControl>
              <FormControl
                component="fieldset"
                className={classes.inputComponent}
              >
                <TextField
                  label="Email"
                  disabled={newBool}
                  name="email"
                  type="email"
                  required
                  value={teste?.email}
                  onChange={(e) => handleChange(e)}
                />
              </FormControl>
              <FormControl
                component="fieldset"
                className={classes.inputComponent}
              >
                <TextField
                  label="CPF"
                  disabled={newBool}
                  name="cpf"
                  InputProps={{
                    inputComponent: TextMaskCustom,
                    value: teste?.cpf,
                    onChange: (e) => handleChange(e),
                    // value: this.state.textmask,
                    // onChange: this.handleChange('textmask'),
                    // onBlur: (e) => errorCheck(e.target.value),
                  }}
                  required
                  // error={errorText.cpf}
                  // helperText={errorText.textCpf}
                  // }
                />
              </FormControl>
              <div className={classes.teste}>
                <div className={classes.buttonsWrapper}>
                  {/* <Button variant="contained" onClick={(e) => handleCancel(e)}>
                    Cancelar
                  </Button> */}
                  <Button variant="contained" onClick={(e) => handleBool(e)}>
                    Editar
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
        </Box>
      </Box>
    </Container>
  );
}

export default NewComponent;
