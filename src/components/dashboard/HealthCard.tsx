import React from "react";
import healthCardStyles from "../../../styles/components/dashboard/HealthCard.module.css";

interface HealthCardProps {
  issue: string;
  fees?: number;
  medicines?: number;
  date: string;
}

const HealthCard = ({ issue, fees, medicines, date }: HealthCardProps) => {
  return (
    <div className={healthCardStyles.healthCard}>
      <h4 className={healthCardStyles.issue}>Issue- {issue}</h4>
      {fees ? <h4 className={healthCardStyles.fees}>Fees- ₹{fees}</h4> : <></>}
      {medicines ? (
        <h4 className={healthCardStyles.medicines}>Medicines- ₹{medicines}</h4>
      ) : (
        <></>
      )}
      {fees && medicines ? (
        <h4 className={healthCardStyles.totalCost}>
          Total Cost- ₹{fees + medicines}
        </h4>
      ) : (
        <></>
      )}
      <h4 className={healthCardStyles.date}>On {date}</h4>
    </div>
  );
};

export default HealthCard;
