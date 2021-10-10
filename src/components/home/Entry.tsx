import {
  CircularProgress,
  IconButton,
  Slide,
  Snackbar,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import { ChevronRightRounded } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { useRouter } from "next/router";
import React, { FormEvent, forwardRef, useState } from "react";
import entryStyles from "../../../styles/components/home/Entry.module.css";
import { sendEmailVerificationLinkForLoggingIn } from "../../services/firebaseUtils";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children?: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Entry = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.length > 4) {
      setLoading(true);
      await sendEmailVerificationLinkForLoggingIn(email);
      setLoading(false);
      setOpenAlert(true);
    }
  };

  return (
    <div className={entryStyles.container}>
      <div className={entryStyles.main}>
        <form onSubmit={login} className={entryStyles.loginInputField}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter e-mail to login"
          />
          {loading ? (
            <CircularProgress
              size={24}
              color="secondary"
              style={{ marginRight: 11 }}
            />
          ) : (
            <IconButton className={entryStyles.loginIcon} type="submit">
              <ChevronRightRounded />
            </IconButton>
          )}
        </form>

        <button
          onClick={() => router.push("/auth/register")}
          className={entryStyles.register}
        >
          Register
        </button>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        key={new Date().getMilliseconds()}
        TransitionComponent={Transition}
        autoHideDuration={4444}
      >
        <Alert
          onClose={() => setOpenAlert(false)}
          severity={"success"}
          style={{ width: "100%" }}
        >
          Verify your email by clicking link sent to you on {email}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Entry;
