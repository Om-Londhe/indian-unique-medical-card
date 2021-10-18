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
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import {
  ChevronLeftRounded,
  EmailRounded,
  LocationCity,
  PhoneOutlined,
} from "@material-ui/icons";
import { useRouter } from "next/router";
import React, { forwardRef, Ref, useEffect, useState } from "react";
import { Bar, Doughnut, Line, PolarArea } from "react-chartjs-2";
import HealthCard from "../../src/components/dashboard/HealthCard";
import { useStateValue } from "../../src/context/StateProvider";
import dashboardStyles from "../../styles/pages/dashboard/Dashboard.module.css";
import {
  getMedicalDataOfUserID,
  getUserDataFromID,
  updateMedicalData,
} from "../../src/services/firebaseUtils";
import { Alert, Autocomplete } from "@material-ui/lab";
import { TransitionProps } from "@material-ui/core/transitions";
import { motion } from "framer-motion";
import { pageAnimationVariants } from "../../src/services/animationUtils";
import { State, City } from "country-state-city";
import { ICity, IState } from "country-state-city/dist/lib/interface";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: Ref<unknown>
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
  userMedicalData.forEach((medicalData) => {
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
  const [{ user, verified }, dispatch] = useStateValue();
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
  }>();
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { data: number[] }[];
  }>({ labels: [], datasets: [{ data: [] }] });
  const [frequencyFilter, setFrequencyFilter] = useState("monthly");
  const [stateFilter, setStateFilter] = useState<IState | null>(null);
  const [cityFilter, setCityFilter] = useState<ICity | null>(null);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [issue, setIssue] = useState("");
  const [fees, setFees] = useState("");
  const [medicines, setMedicines] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHealthData, setLoadingHealthData] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [medicalData, setMedicalData] = useState<
    {
      id: string;
      issue: any;
      fees: any;
      medicines: any;
      on: any;
      patientID: any;
      state: any;
      city: any;
    }[]
  >();

  const loadLatestMedicalData = () => {
    setLoadingHealthData(true);
    getMedicalDataOfUserID(router.query.id!.toString(), frequencyFilter).then(
      (data) => {
        setMedicalData(data);
        const response = getChartData(data);
        setChartData(response);
        setLoadingHealthData(false);
      }
    );
  };

  useEffect(() => {
    if (user) {
      if (user?.userType !== "doctor") {
        router.push("/dashboard");
      } else {
        getUserDataFromID(router.query!.id?.toString()!).then((data) => {
          setLoading(false);
          setPatient({
            id: data.id,
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber,
            address: data.address,
            userType: data.userType,
            photoURL: data.photoURL,
          });
        });
      }
    } else {
      getUserDataFromID(router.query!.id?.toString()!).then((data) => {
        setLoading(false);
        setPatient({
          id: data.id,
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address,
          userType: data.userType,
          photoURL: data.photoURL,
        });
      });
    }
  }, [user, verified]);

  useEffect(() => {
    if (user || verified) {
      loadLatestMedicalData();
    }
  }, [user, verified, frequencyFilter]);

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
    } else if (!stateFilter) {
      setAlertMessage(
        "Please select the state in which you are checking the patient up."
      );
      setSeverity("error");
    } else if (!cityFilter) {
      setAlertMessage(
        `Please select the city of ${stateFilter.name} in which you are checking the patient up.`
      );
      setSeverity("error");
    } else {
      setLoading(true);
      await updateMedicalData(
        issue,
        Number(fees),
        Number(medicines),
        router.query.id?.toString()!,
        stateFilter.name,
        cityFilter.name
      );
      setLoading(false);
      setAlertMessage("Health data updated successfully!");
      setSeverity("success");
      setOpenUpdateForm(false);
      setIssue("");
      setFees("");
      setMedicines("");
      loadLatestMedicalData();
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
        fullScreen={fullScreen}
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
          <Autocomplete
            options={State.getStatesOfCountry("IN")}
            getOptionLabel={(option: IState) => option.name}
            value={stateFilter}
            onChange={(event: any, newValue: IState | null) => {
              setStateFilter(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="dense"
                label="State"
                type="text"
                fullWidth
                variant="standard"
                color="secondary"
              />
            )}
          />
          {stateFilter ? (
            <Autocomplete
              options={City.getCitiesOfState("IN", stateFilter?.isoCode)}
              getOptionLabel={(option: ICity) => option.name}
              value={cityFilter}
              onChange={(event: any, newValue: ICity | null) => {
                setCityFilter(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="dense"
                  label="City"
                  type="text"
                  fullWidth
                  variant="standard"
                  color="secondary"
                />
              )}
            />
          ) : (
            <></>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateForm(false)}>Cancel</Button>
          <Button onClick={update}>Update</Button>
        </DialogActions>
      </Dialog>
      <div className={dashboardStyles.profileTextAndHealthDataContainer}>
        <div className={dashboardStyles.backButton}>
          <IconButton onClick={router.back} style={{ borderRadius: 7 }}>
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
            IUMC ID- {patient?.id}
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
          {patient?.userType === "doctor" && !verified ? (
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
          <select
            value={frequencyFilter}
            onChange={(e) => setFrequencyFilter(e.target.value)}
            className={dashboardStyles.filter}
          >
            <option value="monthly">Monthly</option>
            <option value="3months">3 Months</option>
            <option value="6month">6 Months</option>
            <option value="yearly">Yearly</option>
            <option value="lifetime">Lifetime</option>
          </select>
          <h2 className={dashboardStyles.title}>Health data</h2>
          {loadingHealthData ? (
            <CircularProgress color="secondary" size={24} />
          ) : medicalData?.length ? (
            medicalData.map(
              (data: {
                id: string;
                on: number;
                fees: number;
                medicines: number;
                issue: string;
                state: string;
                city: string;
              }) => (
                <HealthCard
                  key={data?.id}
                  id={data?.id}
                  date={data?.on}
                  issue={data?.issue}
                  state={data?.state}
                  city={data?.city}
                />
              )
            )
          ) : (
            <p style={{ color: "white" }}>No previous records</p>
          )}
        </div>
      </div>
      <div className={dashboardStyles.graphContainer}>
        {loadingHealthData ? (
          <CircularProgress color="secondary" size={24} />
        ) : medicalData?.length ? (
          <>
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
          </>
        ) : (
          <p style={{ color: "white" }}>No previous records</p>
        )}
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
