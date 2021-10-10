import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Slide,
  Snackbar,
  TextField,
} from "@material-ui/core";
import {
  ChevronLeftRounded,
  EmailRounded,
  LocationCity,
  PhoneOutlined,
} from "@material-ui/icons";
import { useRouter } from "next/router";
import React, { forwardRef, useEffect, useState } from "react";
import { Bar, Doughnut, Line, PolarArea } from "react-chartjs-2";
import { doc, onSnapshot } from "@firebase/firestore";
import HealthCard from "../../src/components/dashboard/HealthCard";
import { useStateValue } from "../../src/context/StateProvider";
import { db } from "../../src/services/firebase";
import dashboardStyles from "../../styles/pages/dashboard/Dashboard.module.css";
import { updateMedicalData } from "../../src/services/firebaseUtils";
import { Alert } from "@material-ui/lab";
import { TransitionProps } from "@material-ui/core/transitions";
import { motion } from "framer-motion";
import { pageAnimationVariants } from "../../src/services/animationUtils";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children?: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const getChartData = (
  userMedicalData: {
    issue: string;
    fees: number;
    medicines: number;
    on: any;
  }[]
) => {
  const labels: string[] = [];
  const costData: number[] = [];
  const backgroundColor: string[] = [];
  userMedicalData
    .sort((a, b) => Date.parse(a?.on) - Date.parse(b?.on))
    .forEach((medicalData) => {
      labels.push(medicalData.issue);
      costData.push(medicalData.fees + medicalData.medicines);
      backgroundColor.push(
        `rgb(${Math.floor(Math.random() * 244)}, ${Math.floor(
          Math.random() * 244
        )}, ${Math.floor(Math.random() * 244)})`
      );
    });

  return {
    labels,
    datasets: [
      {
        label: "Diseases and expenditure on them in rupees",
        borderColor: "#212121",
        data: costData,
        backgroundColor,
      },
    ],
  };
};

export type Color = "success" | "info" | "warning" | "error";

const Patient = () => {
  const router = useRouter();
  const [{ user }, dispatch] = useStateValue();
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState<Color>("error");
  const [showAlertMessage, setShowAlertMessage] = useState(false);
  const [patient, setPatient] = useState<{
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    photoURL: string;
    address: string;
    userType: string;
    medicalData: {
      issue: string;
      fees: number;
      medicines: number;
      on: any;
    }[];
  }>();
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { data: number[] }[];
  }>({ labels: [], datasets: [{ data: [] }] });
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [issue, setIssue] = useState("");
  const [fees, setFees] = useState("");
  const [medicines, setMedicines] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    var unSubscribe = () => {};
    if (user) {
      if (user?.userType !== "doctor") {
        router.push("/dashboard");
      } else {
        unSubscribe = onSnapshot(
          doc(db, "Users", router.query.id!.toString()),
          (doc) => {
            setPatient({
              id: doc.id,
              name: doc.data()?.name,
              email: doc.data()?.email,
              phoneNumber: doc.data()?.phoneNumber,
              address: doc.data()?.address,
              userType: doc.data()?.userType,
              medicalData: doc.data()?.medicalData,
              photoURL: doc.data()?.photoURL,
            });
            const chartData = getChartData(doc.data()?.medicalData);
            setChartData(chartData);
          }
        );
      }
    }

    return () => unSubscribe();
  }, [user]);

  console.log(patient);

  const update = async () => {
    if (issue.length < 2) {
      setAlertMessage(
        "Health issue must be valid and more than 2 letters long."
      );
      setSeverity("error");
    } else if (fees.length < 1) {
      setAlertMessage(
        "Enter the fees that you actually charged to this patient."
      );
      setSeverity("error");
    } else if (medicines.length < 1) {
      setAlertMessage(
        "Enter the fees that this patient spent on medicines suggested by you."
      );
      setSeverity("error");
    } else {
      setLoading(true);
      await updateMedicalData(
        router.query.id?.toString()!,
        issue,
        Number(fees),
        Number(medicines)
      );
      setLoading(false);
      setAlertMessage("Health data updated successfully!");
      setSeverity("success");
      setOpenUpdateForm(false);
      setIssue("");
      setFees("");
      setMedicines("");
    }
    setShowAlertMessage(true);
  };

  const copyID = () => {
    navigator.clipboard.writeText(user?.id);
  };

  return patient?.id && !loading ? (
    <motion.div
      className={dashboardStyles.dashboard}
      variants={pageAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Dialog
        TransitionComponent={Transition}
        open={openUpdateForm}
        onClose={() => setOpenUpdateForm(false)}
      >
        <DialogTitle>Update health data</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remember that all the changes are immutable so be sure about your
            data entries.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Health issue"
            type="text"
            fullWidth
            variant="standard"
            color="secondary"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Doctor fees"
            type="text"
            fullWidth
            variant="standard"
            color="secondary"
            value={fees}
            onChange={(e) =>
              setFees(
                e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1")
                  .replace(".", "")
              )
            }
          />
          <TextField
            margin="dense"
            label="Medicines cost"
            type="text"
            fullWidth
            variant="standard"
            color="secondary"
            value={medicines}
            onChange={(e) =>
              setMedicines(
                e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1")
                  .replace(".", "")
              )
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateForm(false)}>Cancel</Button>
          <Button onClick={update}>Update</Button>
        </DialogActions>
      </Dialog>
      <div className={dashboardStyles.profileTextAndHealthDataContainer}>
        <div className={dashboardStyles.backButton}>
          <IconButton onClick={() => router.push("/doctor")}>
            <ChevronLeftRounded />
            &nbsp;<span>Go back</span>
          </IconButton>
        </div>
        <div className={dashboardStyles.profileTextDataContainer}>
          <div className={dashboardStyles.photo}>
            <Avatar
              className={dashboardStyles.avatar}
              alt={
                patient?.name.split(" ").length >= 2
                  ? `${patient?.name.split(" ")[0][0]}${
                      patient?.name.split(" ")[1][0]
                    }`
                    ? patient?.name.split(" ").length === 1
                      ? patient?.name.split(" ")[0][0]
                      : ""
                    : ""
                  : ""
              }
              src={patient?.photoURL || undefined}
            />
          </div>
          <h3 className={dashboardStyles.id} onClick={copyID}>
            IUMC ID- {user?.id}
          </h3>
          <h1 className={dashboardStyles.name}>{patient?.name}</h1>
          <h3 className={dashboardStyles.phoneNumber}>
            <PhoneOutlined />
            &nbsp;&nbsp;
            <span>{patient?.phoneNumber}</span>
          </h3>
          <h3 className={dashboardStyles.email}>
            <EmailRounded />
            &nbsp;&nbsp;
            <span>{patient?.email}</span>
          </h3>
          <h3 className={dashboardStyles.address}>
            <LocationCity />
            &nbsp;&nbsp;
            <span>{patient?.address}</span>
          </h3>
          {patient?.userType === "doctor" ? (
            <button
              className={dashboardStyles.doctorButton}
              onClick={() => setOpenUpdateForm(true)}
            >
              Update health data
            </button>
          ) : (
            <></>
          )}
        </div>
        <div className={dashboardStyles.healthDataContainer}>
          <h2 className={dashboardStyles.title}>Health data</h2>
          {patient?.medicalData
            .sort(
              (
                a: {
                  issue: string;
                  fees: number;
                  medicines: number;
                  on: any;
                },
                b: {
                  issue: string;
                  fees: number;
                  medicines: number;
                  on: any;
                }
              ) => Date.parse(b?.on) - Date.parse(a?.on)
            )
            .map(
              (data: {
                on: string;
                fees: number;
                medicines: number;
                issue: string;
              }) => (
                <HealthCard
                  key={data?.on.toString()}
                  date={data?.on.toString()}
                  issue={data?.issue}
                />
              )
            )}
        </div>
      </div>
      <div className={dashboardStyles.graphContainer}>
        <div className={dashboardStyles.chart}>
          <Doughnut data={chartData} />
        </div>
        <div className={dashboardStyles.chart}>
          <Line data={chartData} />
        </div>
        <div className={dashboardStyles.chart}>
          <Bar data={chartData} />
        </div>
        <div className={dashboardStyles.chart}>
          <PolarArea data={chartData} />
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={showAlertMessage}
        onClose={() => setShowAlertMessage(false)}
        key={new Date().getMilliseconds()}
        TransitionComponent={Transition}
        autoHideDuration={4444}
      >
        <Alert
          onClose={() => setShowAlertMessage(false)}
          severity={severity}
          style={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </motion.div>
  ) : (
    <div
      style={{
        height: "100vh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <CircularProgress color="secondary" size={24} />
    </div>
  );
};

export default Patient;
