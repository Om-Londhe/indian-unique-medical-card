import React, { useEffect, useState } from "react";
import citizenMedicalDataCardStyles from "../../../styles/components/gov/CitizenMedicalDataCard.module.css";
import { getUserDataFromID } from "../../services/firebaseUtils";
import Link from "next/link";

interface MedicalDataType {
  id: string;
  on: number;
  fees: number;
  medicines: number;
  issue: string;
  patientID: string;
}

interface CitizenMedicalDataCardProps {
  medicalData: MedicalDataType;
}

const CitizenMedicalDataCard = ({
  medicalData,
}: CitizenMedicalDataCardProps) => {
  const [patientData, setPatientData] = useState<{
    id: string;
    name: any;
    email: any;
    phoneNumber: any;
    address: any;
    userType: any;
    photoURL: any;
  }>();

  useEffect(() => {
    getUserDataFromID(medicalData.patientID).then((data) =>
      setPatientData(data)
    );
  }, []);

  return (
    <Link href={`/patient/${medicalData.patientID}`}>
      <a>
        <div className={citizenMedicalDataCardStyles.card}>
          <h4 className={citizenMedicalDataCardStyles.patientName}>
            Patient- {patientData?.name}
          </h4>
          <h4 className={citizenMedicalDataCardStyles.patientID}>
            Patient ID- {medicalData.patientID}
          </h4>
          <h4 className={citizenMedicalDataCardStyles.issue}>
            Issue- {medicalData?.issue}
          </h4>
          {medicalData?.fees ? (
            <h4 className={citizenMedicalDataCardStyles.fees}>
              Fees- ₹{medicalData?.fees}
            </h4>
          ) : (
            <></>
          )}
          {medicalData?.medicines ? (
            <h4 className={citizenMedicalDataCardStyles.medicines}>
              Medicines- ₹{medicalData?.medicines}
            </h4>
          ) : (
            <></>
          )}
          {medicalData?.fees && medicalData?.medicines ? (
            <h4 className={citizenMedicalDataCardStyles.totalCost}>
              Total Cost- ₹{medicalData?.fees + medicalData?.medicines}
            </h4>
          ) : (
            <></>
          )}
          <h4 className={citizenMedicalDataCardStyles.date}>
            On {new Date(Number(medicalData.on.toString())).toLocaleString()}
          </h4>
        </div>
      </a>
    </Link>
  );
};

export default CitizenMedicalDataCard;
