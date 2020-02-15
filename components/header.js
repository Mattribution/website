import Link from "next/link";
import { makeStyles } from "@material-ui/styles";

import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  }
}));

function Header({ user, loading, className }) {
  const classes = useStyles();

  const renderAuthButtons = () => {
    if (loading) {
      return;
    }

    if (user) {
      return (
        <>
          <Link href="/profile">
            <Button color="inherit">Profile</Button>
          </Link>

          {/* <Link href="/advanced/ssr-profile">
            <Button color="inherit">Server rendered profile (advanced)</Button>
          </Link> */}

          <Link href="/api/logout">
            <Button color="inherit">Logout</Button>
          </Link>
        </>
      );
    }

    return (
      <>
        <Link href="/api/login">
          <Button color="inherit">Login</Button>
        </Link>
      </>
    );
  };

  return (
    <header>
      <AppBar position="fixed" className={className}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            MAttribution
          </Typography>
          {renderAuthButtons()}
        </Toolbar>
      </AppBar>

      <style jsx>{`
        header {
          padding: 0.2rem;
          color: #fff;
          background-color: #333;
        }
        nav {
          max-width: 42rem;
          margin: 1.5rem auto;
        }
        ul {
          display: flex;
          list-style: none;
          margin-left: 0;
          padding-left: 0;
        }
        li {
          margin-right: 1rem;
        }
        li:nth-child(2) {
          margin-right: auto;
        }
        a {
          color: #fff;
          text-decoration: none;
        }
        button {
          font-size: 1rem;
          color: #fff;
          cursor: pointer;
          border: none;
          background: none;
        }
      `}</style>
    </header>
  );
}

export default Header;
