import React, { useEffect, useState } from "react";
import Verifier from "../../src/components/gov/Verifier";
import { actionTypes } from "../../src/context/reducer";
import { useStateValue } from "../../src/context/StateProvider";
import govStyles from "../../styles/pages/gov/Gov.module.css";
import _ from "lodash";
import Link from "next/link";
import Charts from "../../src/components/gov/Charts";
import CitizenMedicalDataCard from "../../src/components/gov/CitizenMedicalDataCard";
import { FilterListRounded, SearchRounded } from "@material-ui/icons";
import { getMedicalDataOfAllCitizens } from "../../src/services/firebaseUtils";
import { CircularProgress, Fab } from "@material-ui/core";
import Filter from "../../src/components/gov/Filter";

interface MedicalDataType {
  id: string;
  on: number;
  fees: number;
  medicines: number;
  issue: string;
  patientID: string;
}

const getChartData = (
  userMedicalData: {
    id: string;
    issue: string;
    fees: number;
    medicines: number;
    on: any;
    patientID: string;
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

const Gov = () => {
  const [{ verified }, dispatch] = useStateValue();
  const [password, setPassword] = useState("");
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { data: number[] }[];
  }>({ labels: [], datasets: [{ data: [] }] });
  const [citizensMedicalData, setCitizensMedicalData] =
    useState<MedicalDataType[]>();
  const [frequencyFilter, setFrequencyFilter] = useState("monthly");
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  useEffect(() => {
    if (password === "Government") {
      dispatch({
        type: actionTypes.SET_VERIFIED,
        verified: true,
      });
    }
  }, [password]);

  useEffect(() => {
    if (verified) {
      setLoading(true);
      getMedicalDataOfAllCitizens(frequencyFilter).then((snapshot) => {
        setCitizensMedicalData(
          snapshot.map<MedicalDataType>(
            (doc): MedicalDataType => ({
              id: doc.id,
              on: doc?.on.toString(),
              fees: Number(doc?.fees.toString()),
              medicines: Number(doc?.medicines.toString()),
              issue: doc?.issue.toString(),
              patientID: doc?.patientID.toString(),
            })
          )
        );
        setLoading(false);
      });
    }
  }, [verified, frequencyFilter]);

  useEffect(() => {
    citizensMedicalData && setChartData(getChartData(citizensMedicalData!));
  }, [citizensMedicalData]);

  return (
    <div className={govStyles.main}>
      {verified ? (
        <div className={govStyles.govHomeData}>
          <div className={govStyles.charts}>
            <p className={govStyles.title}>Charts showing medical data</p>
            {loading ? (
              <CircularProgress color="secondary" size={24} />
            ) : (
              <Charts
                citizensMedicalData={citizensMedicalData!}
                chartData={chartData}
              />
            )}
          </div>
          <div className={govStyles.citizenMedicalData}>
            <div className={govStyles.dataHeader}>
              <p className={govStyles.dataHeaderTitle}>Health data</p>
              <Link href="/gov/search">
                <a className={govStyles.searchButton}>
                  Search citizens&nbsp;
                  <SearchRounded />
                </a>
              </Link>
            </div>
            {loading ? (
              <CircularProgress color="secondary" size={24} />
            ) : (
              citizensMedicalData?.map((data) => (
                <CitizenMedicalDataCard key={data.id} medicalData={data} />
              ))
            )}
          </div>
          <Filter
            open={openFilter}
            setOpen={setOpenFilter}
            frequencyFilter={frequencyFilter}
            setFrequencyFilter={setFrequencyFilter}
            cityFilter={cityFilter}
            setCityFilter={setCityFilter}
            stateFilter={stateFilter}
            setStateFilter={setStateFilter}
          />
          <Fab
            variant="extended"
            size="medium"
            color="secondary"
            style={{ position: "fixed", bottom: 11, right: 7 }}
            onClick={() => setOpenFilter(true)}
          >
            <FilterListRounded /> &nbsp; Filter citizens
          </Fab>
        </div>
      ) : (
        <Verifier password={password} setPassword={setPassword} />
      )}
    </div>
  );
};

export default Gov;
