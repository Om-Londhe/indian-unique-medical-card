import React from "react";
import goalCardStyles from "../../../styles/components/home/GoalCard.module.css";

interface GoalCardProps {
  goalNumber: number;
  content: string;
}

const GoalCard = ({ goalNumber, content }: GoalCardProps) => {
  return (
    <div className={goalCardStyles.goalCard}>
      <h2 className={goalCardStyles.number}>0{goalNumber}</h2>
      <h3 className={goalCardStyles.title}>Goal {goalNumber}</h3>
      <p className={goalCardStyles.content}>{content}</p>
    </div>
  );
};

export default GoalCard;
