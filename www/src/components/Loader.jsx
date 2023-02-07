import loader from '../assets/loader.png';

const Loader = () => {
  return (
    <div className="loader">
      <img src={loader} alt="Loading"/>
      <p>Loading</p>
    </div>
  );
};
export default Loader;
