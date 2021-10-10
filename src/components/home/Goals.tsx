import React from "react";
import goalStyles from "../../../styles/components/home/Goal.module.css";
import GoalCard from "./GoalCard";

interface GoalCardDataType {
  goalNumber: number;
  content: string;
}

const goalCardDataArray: GoalCardDataType[] = [
  {
    goalNumber: 1,
    content: "To simplify the process of health checkups.",
  },
  {
    goalNumber: 2,
    content:
      "To provide a centralized platform for anything related to medical field.",
  },
  {
    goalNumber: 3,
    content:
      "To make it easy for doctors to get information about the patient.",
  },
  {
    goalNumber: 4,
    content: "To keep track about each person's health and health expenditure.",
  },
];

const Goals = () => {
  return (
    <div className={goalStyles.goalsContainer}>
      <h2 className={goalStyles.goalTitle}>Our Goals</h2>
      <div className={goalStyles.goals}>
        {goalCardDataArray.map((goalCardData) => (
          <GoalCard
            key={goalCardData.goalNumber}
            goalNumber={goalCardData.goalNumber}
            content={goalCardData.content}
          />
        ))}
      </div>
    </div>
  );
};

export default Goals;
