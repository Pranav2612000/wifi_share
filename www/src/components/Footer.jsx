import React from "react";
import metadata from "../../package.json";

function Footer() {
  const { version } = metadata;
  return (
    <footer className="text-xs">
      <p>Version {version}</p>
      <p>
        <a
          href="https://pranavjoglekarcodes.web.app"
          target="_blank"
          rel="noreferrer"
        >
          © Pranav Joglekar
        </a>
      </p>
    </footer>
  );
}
export default Footer;
