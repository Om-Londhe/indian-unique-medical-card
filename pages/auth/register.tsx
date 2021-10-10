import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Slide,
  Snackbar,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import {
  AddLocationOutlined,
  AddPhotoAlternateOutlined,
  AssignmentIndRounded,
  EmailOutlined,
  PersonOutlineRounded,
  PhoneOutlined,
  RemoveOutlined,
} from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import React, { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import InputField from "../../src/components/auth/InputField";
import { pageAnimationVariants } from "../../src/services/animationUtils";
import {
  sendEmailVerificationLink,
  uploadImage,
} from "../../src/services/firebaseUtils";
import registerStyles from "../../styles/pages/auth/Register.module.css";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children?: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export type Color = "success" | "info" | "warning" | "error";

const Register = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [userType, setUserType] = useState("normal");
  const [photo, setPhoto] = useState<File | null>(null);
  const [openProfileOptions, setOpenProfileOptions] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState<Color>("error");
  const [loading, setLoading] = useState(false);

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name.length < 4) {
      setAlertMessage("Name must be at least 4 letters long");
      setSeverity("error");
    } else if (phoneNumber.length < 10) {
      setAlertMessage("Enter your 10-digit long Phone Number");
      setSeverity("error");
    } else if (email.length < 4) {
      setAlertMessage("Enter a valid email");
      setSeverity("error");
    } else if (address.length < 5) {
      setAlertMessage("Enter your full address.");
      setSeverity("error");
    } else if (!photo) {
      setAlertMessage("Photo is necessary to identify you at hospital");
      setSeverity("error");
    } else {
      setLoading(true);
      const photoURL = await uploadImage(photo);
      await sendEmailVerificationLink(
        name,
        email,
        phoneNumber,
        address,
        photoURL,
        userType
      );
      setLoading(false);
      setAlertMessage(
        `Verify your email by clicking link sent to you on ${email}`
      );
      setSeverity("success");
    }
    setOpenAlert(true);
  };

  return (
    <motion.div
      className={registerStyles.main}
      variants={pageAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <form className={registerStyles.form} onSubmit={register}>
        <h2 className={registerStyles.title}>Register</h2>
        <Dialog
          open={openProfileOptions}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setOpenProfileOptions(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Photo identity"}</DialogTitle>
          <List style={{ width: 270 }}>
            <ListItem
              button
              onClick={() => {
                document.getElementById("photo")?.click();
                setOpenProfileOptions(false);
              }}
              key={"Add photo"}
            >
              <ListItemAvatar>
                <Avatar>
                  <AddPhotoAlternateOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={"Add photo"} />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                setPhoto(null);
                setOpenProfileOptions(false);
              }}
              key={"Remove photo"}
            >
              <ListItemAvatar>
                <Avatar>
                  <RemoveOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={"Remove photo"} />
            </ListItem>
          </List>
          <DialogActions>
            <Button onClick={() => setOpenProfileOptions(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
        <Avatar
          onClick={() => setOpenProfileOptions(true)}
          className={registerStyles.avatar}
          alt={
            name.split(" ").length >= 2
              ? `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`
                ? name.split(" ").length === 1
                  ? name.split(" ")[0][0]
                  : ""
                : ""
              : ""
          }
          src={photo ? URL.createObjectURL(photo) : undefined}
        />
        <input
          type="file"
          id="photo"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => e.target.files && setPhoto(e.target.files[0])}
        />
        <InputField
          required
          type="text"
          placeholder="Name"
          value={name}
          setValue={setName}
          maxLength={25}
          icon={<PersonOutlineRounded style={{ color: "#444" }} />}
        />
        <InputField
          required
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          setValue={setPhoneNumber}
          maxLength={10}
          icon={<PhoneOutlined style={{ color: "#444" }} />}
        />
        <InputField
          required
          type="email"
          placeholder="Email"
          value={email}
          setValue={setEmail}
          maxLength={50}
          icon={<EmailOutlined style={{ color: "#444" }} />}
        />
        <InputField
          required
          type="text"
          placeholder="Address"
          value={address}
          setValue={setAddress}
          maxLength={75}
          icon={<AddLocationOutlined style={{ color: "#444" }} />}
        />
        <div className={registerStyles.typeSelector}>
          <AssignmentIndRounded style={{ color: "#444" }} />
          <select
            className={registerStyles.select}
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>
        {userType === "doctor" ? (
          <p className={registerStyles.helperText}>
            You said that you are doctor, but still you won't be able to update
            patient data until you are verified by administrators.
          </p>
        ) : (
          <></>
        )}
        {loading ? (
          <CircularProgress
            size={21}
            color="secondary"
            style={{ alignSelf: "center" }}
          />
        ) : (
          <button type="submit" className={registerStyles.submit}>
            Submit
          </button>
        )}
      </form>
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
          severity={severity}
          style={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default Register;
