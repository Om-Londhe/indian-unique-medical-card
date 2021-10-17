import React, { Dispatch, SetStateAction } from "react";
import verifierStyles from "../../../styles/components/gov/Verifier.module.css";

interface VerifierProps {
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
}

const Verifier = ({ password, setPassword }: VerifierProps) => {
  return (
    <div className={verifierStyles.verifier}>
      <div className={verifierStyles.form}>
        <p className={verifierStyles.title}>Government Administrator Login</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={verifierStyles.input}
          placeholder="Password"
        />
      </div>
    </div>
  );
};

export default Verifier;
