import React from "react";
import footerStyles from "../../../styles/components/home/Footer.module.css";
import {
  CodeRounded,
  Facebook,
  FavoriteRounded,
  GitHub,
  Instagram,
  LinkedIn,
  Twitter,
} from "@material-ui/icons";

const Footer = () => {
  return (
    <footer className={footerStyles.footer}>
      <div className={footerStyles.waves}>
        <div
          className={`${footerStyles.wave} ${footerStyles.wave1}`}
          id="wave1"
        />
        <div
          className={`${footerStyles.wave} ${footerStyles.wave2}`}
          id="wave2"
        />
        <div
          className={`${footerStyles.wave} ${footerStyles.wave3}`}
          id="wave3"
        />
        <div
          className={`${footerStyles.wave} ${footerStyles.wave4}`}
          id="wave4"
        />
      </div>
      <h1 className={footerStyles.socialTitle}>My Socials</h1>
      <ul className={footerStyles.socialIcons}>
        <li>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.facebook.com/om.londhe.332/"
          >
            <Facebook className={footerStyles.logoFacebook} />
          </a>
        </li>
        <li>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.instagram.com/theomlondhe/"
          >
            <Instagram className={footerStyles.logoInstagram} />
          </a>
        </li>
        <li>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://twitter.com/OmLondhe2003"
          >
            <Twitter className={footerStyles.logoTwitter} />
          </a>
        </li>
        <li>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/Om-Londhe"
          >
            <GitHub className={footerStyles.logoGithub} />
          </a>
        </li>
        <li>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.linkedin.com/in/omlondhe/"
          >
            <LinkedIn className={footerStyles.logoLinkedin} />
          </a>
        </li>
      </ul>
      <p className={footerStyles.dev}>
        <CodeRounded /> &nbsp;with&nbsp;
        <FavoriteRounded style={{ color: "#ED4956" }} />
        &nbsp;by Om Londhe using&nbsp;
        <img src="/next.png" alt="" />
      </p>
      <p className={footerStyles.copyright}>
        Copyright &copy; Om Prashant Londhe 2021
      </p>
    </footer>
  );
};

export default Footer;
