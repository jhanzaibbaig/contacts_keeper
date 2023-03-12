import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="container mt-3">{children}</div>
    </>
  );
};

export default Layout;
