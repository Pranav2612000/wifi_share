import metadata from '../../package.json';

const Footer = () => {
  const { version } = metadata;
  return (
    <footer className="text-xs">
      <p>Version {version}</p>
      <p> © Pranav Joglekar </p>
    </footer>
  );
}
export default Footer;
