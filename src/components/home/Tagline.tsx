import React from "react";
import taglineStyles from "../../../styles/components/home/Tagline.module.css";

const Tagline = () => {
  return (
    <main className={taglineStyles.main}>
      <div className={taglineStyles.layerWaveSeparator} />
      <div className={taglineStyles.tagline}>
        <p className={taglineStyles.taglineText}>
          <span>Indian Unique Medical Card</span>
          <br />
          An initiative to centralize country-wide medical data!
        </p>
      </div>
      <div
        className={`${taglineStyles.layerWaveSeparator} ${taglineStyles.flip}`}
      />
    </main>
  );
};

export default Tagline;
