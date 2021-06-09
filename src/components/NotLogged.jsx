import { Box, Container, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import Nav from "./Nav";

const useStyles = makeStyles((theme) => ({
  body: {
    backgroundColor: "grey",
  },
  notLoggedInContainer: {
    backgroundColor: "white",
    height: "70%",
    width: "70%",
    display: "grid",
    placeItems: "center",

    [theme.breakpoints.down("md")]: {
      maxHeight: "660px",
      maxWidth: "960px",
    },
    [theme.breakpoints.down("sm")]: {
      maxHeight: "300px",
      maxWidth: "600px",
    },
  },
  notLoggedInBox: {
    height: "100%",
    width: "100%",
    display: "grid",
    placeItems: "center",
    gridTemplateRows: "auto 1fr",
  },
  notLoggedInText: {
    [theme.breakpoints.down("md")]: {
      fontSize: "1.5rem",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "1rem",
    },
  },
}));

function NotLogged({ loggedIn, data, revalidate, dados }) {
  const classes = useStyles();

  return (
    <Box className={classes.notLoggedInBox}>
      <Nav
        loggedIn={loggedIn}
        data={data}
        revalidate={revalidate}
        base64Img={dados}
      />
      <Container maxWidth="md" className={classes.notLoggedInContainer}>
        <Typography
          variant="h3"
          color="textPrimary"
          align="center"
          className={classes.notLoggedInText}
        >
          É necessário estar conectado a uma conta para visualizar o conteúdo
          dessa página
        </Typography>
        {/* <Typography
          variant="h3"
          color="textPrimary"
          align="center"
          className={classes.notLoggedInText}
        >
          Faça o 
        </Typography> */}
      </Container>
    </Box>
  );
}

export default NotLogged;
