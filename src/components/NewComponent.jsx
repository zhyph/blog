import React, { useEffect, useState } from "react";
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
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "next/link";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  paper: {
    // marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    [theme.breakpoints.down("xs")]: {
      marginLeft: "0",
    },
  },
  submit: {
    margin: theme.spacing(3, 1, 2),
  },
  alertMargin: { marginBottom: theme.spacing(2) },
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
  // teste: {
  //   display: "grid",
  //   placeItems: "center",
  //   [theme.breakpoints.up("md")]: {
  //     width: "30%",
  //   },
  //   [theme.breakpoints.down("md")]: {
  //     width: "60%",
  //   },
  // },
  alertMargin: { marginTop: theme.spacing(2) },
  buttonError: { backgroundColor: "red" },
  profilePicture: {
    borderRadius: "1rem",
    [theme.breakpoints.down("xs")]: {
      marginBottom: "1rem",
    },
  },
  componentMain: {
    display: "grid",
    placeItems: "center",
    maxHeight: "600px",
    height: "100%",
    backgroundColor: "white",
    borderRadius: "1rem",
    marginTop: "10%",
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
  const [controle, tas] = useState();
  const [patchError, setPatchError] = useState();
  const [patchSuccess, setPatchSucces] = useState();
  const [newBool, setNewBool] = useState(true);
  const [edit, setEdit] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
  });
  const [open, setOpen] = useState({ success: false, fail: false });
  const [errorText, setErrorText] = useState();

  useEffect(() => {
    if (finalBase64Src()) {
      const { name, email, cpf } = finalBase64Src();
      setFormData({ name: name, email: email, cpf: cpf });
    } else {
      return;
    }
  }, [controle]);
  console.log(formData ? formData : "");

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

  // const handleChange = (e) => {
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [e.target.name]: e.target.value,
  //   }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("passou");
    const newCpf = formData.cpf.replace(/[^0-9]/g, "");
    fetch(`${server}/api/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // 'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify({
        userId: data.userId,
        name: formData.name,
        email: formData.email,
        cpf: newCpf,
        type: "1",
        active: "1",
      }),
    })
      .then((r) => {
        return r.json();
      })
      .then((data) => {
        if (data && data.error) {
          setPatchError(data.message);
          setOpen({ ...open, fail: true });
        }
        if (data && !data.error && data.message) {
          setPatchSucces(data.message);
          setOpen({ ...open, success: true });
        }
        // if (data && data.token) {
        //   //Set cookie
        //   cookie.set('token', data.token, { expires: 2 });
        //   Router.push('/');
        // }
      });
    setEdit(true);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    // const teste = e.target.name;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleCheck = (e) => {
    const target = e.target.name;
    const value = e.target.value;
    const newCpf = formData.cpf.replace(/[^0-9]/g, "");

    if (target === "cpf") {
      if (formData.cpf.length === 0) {
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

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Container component="main" className={classes.componentMain}>
      <CssBaseline />
      <Box display="flex" justifyContent="center">
        <Typography component="h1" variant="h3">
          SEU PERFIL
        </Typography>
      </Box>
      <div className={classes.paper}>
        <Box
          component="img"
          className={classes.profilePicture}
          src={
            finalBase64Src()?.base64 ? finalBase64Src().base64 : "/default.png"
          }
          width="50%"
        />
        <form onSubmit={handleSubmit} className={classes.form}>
          <Grid container justify="center" spacing={2}>
            <Grid item xs={6}>
              <TextField
                InputLabelProps={{ shrink: true }}
                value={formData.email}
                variant="filled"
                required
                fullWidth
                disabled={edit}
                id="email"
                label="Email"
                name="email"
                type="email"
                onChange={(e) => handleChange(e)}
                // autoComplete="email"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                InputLabelProps={{ shrink: true }}
                value={formData.name}
                disabled={edit}
                variant="filled"
                required
                fullWidth
                onChange={(e) => handleChange(e)}
                name="name"
                label="Nome"
                type="name"
                id="name"
                autoComplete="name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                InputLabelProps={{ shrink: true }}
                disabled={edit}
                variant="filled"
                required
                fullWidth
                name="cpf"
                label="CPF"
                type="cpf"
                id="cpf"
                error={errorText ? true : false}
                helperText={errorText}
                autoComplete="cpf"
                InputProps={{
                  inputComponent: TextMaskCustom,
                  value: formData.cpf,
                  onChange: (e) => handleChange(e),
                  onBlur: (e) => handleCheck(e),
                }}
              />
            </Grid>
            <Button
              // fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => setEdit(!edit)}
            >
              Editar
            </Button>
            {!edit && (
              <Button
                type="submit"
                // fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Atualizar
              </Button>
            )}
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
          severity="success"
        >
          {patchSuccess}
        </Alert>
      </Snackbar>
      <Snackbar open={open.fail} autoHideDuration={4000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          className={classes.alertMargin}
          severity="error"
        >
          {patchError}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default NewComponent;

// <Container className={classes.normalUserLoggedInBox}>
//   <Box className={classes.normalUserBox}>
//     <Box className={classes.newBoxTest} spacing={3}>
//       <Box
//         // item xs={6}
//         className={classes.normalUserElement}
//       >
//         <img
//           width="60%"
//           className={classes.profilePicture}
//           // layout="responsive"
//           src={finalBase64Src() ? finalBase64Src().base64 : "/default.png"}
//         />
//       </Box>
//       <Box
//         // item xs={6}
//         className={classes.normalUserElement}
//       >
//         <form
//           className={classes.root}
//           onSubmit={(e) => handleSubmit(e)}
//           autoComplete="off"
//         >
//           <FormControl
//             component="fieldset"
//             className={classes.inputComponent}
//           >
//             <TextField
//               label="Nome"
//               disabled={newBool}
//               name="name"
//               value={teste?.name}
//               InputLabelProps={{ shrink: true }}
//               required
//               onChange={(e) => handleChange(e)}
//             />
//           </FormControl>
//           <FormControl
//             component="fieldset"
//             className={classes.inputComponent}
//           >
//             <TextField
//               label="Email"
//               disabled={newBool}
//               name="email"
//               type="email"
//               required
//               value={teste?.email}
//               onChange={(e) => handleChange(e)}
//             />
//           </FormControl>
//           <FormControl
//             component="fieldset"
//             className={classes.inputComponent}
//           >
//             <TextField
//               label="CPF"
//               disabled={newBool}
//               name="cpf"
//               InputProps={{
//                 inputComponent: TextMaskCustom,
//                 value: teste?.cpf,
//                 onChange: (e) => handleChange(e),
//                 // value: this.state.textmask,
//                 // onChange: this.handleChange('textmask'),
//                 // onBlur: (e) => errorCheck(e.target.value),
//               }}
//               required
//               // error={errorText.cpf}
//               // helperText={errorText.textCpf}
//               // }
//             />
//           </FormControl>
//           <div className={classes.teste}>
//             <div className={classes.buttonsWrapper}>
//               {/* <Button variant="contained" onClick={(e) => handleCancel(e)}>
//                 Cancelar
//               </Button> */}
//               <Button variant="contained" onClick={(e) => handleBool(e)}>
//                 Editar
//               </Button>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 // disabled={formData.userId ? false : true}
//               >
//                 Enviar
//               </Button>
//             </div>
//           </div>
//         </form>
//         {patchSuccess && (
//           <Alert className={classes.alertMargin} severity="success">
//             {patchSuccess}
//           </Alert>
//         )}
//         {patchError && (
//           <Alert className={classes.alertMargin} severity="error">
//             {patchError}
//           </Alert>
//         )}
//       </Box>
//     </Box>
//   </Box>
// </Container>
