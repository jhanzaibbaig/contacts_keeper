import axios from "axios";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import ToastContext from "../context/ToastContext";

const EditContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useContext(ToastContext);

  const [userDetails, setUserDetails] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    dob: "",
  });
  const [file, setFile] = useState("");
  const [isFileUpdate, setIsFileUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setIsFileUpdate(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("file: ", file);
    const formData = new FormData();

    formData.append("id", userDetails.id);
    formData.append("name", userDetails.name);
    formData.append("address", userDetails.address);
    formData.append("email", userDetails.email);
    formData.append("phone", userDetails.phone);
    formData.append("dob", userDetails.dob);
    if (isFileUpdate && file) {
      formData.append("file", file);
    }

    const config = {
      headers: {
        "Content-Type": isFileUpdate
          ? "multipart/form-data"
          : "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const res = await axios.put(
      `http://localhost:8000/api/contact/${id}`,
      isFileUpdate ? formData : { ...userDetails, file },
      config
    );

    const result = await res.data;

    if (!result.error) {
      toast.success(`updated [${userDetails.name}] contact`);

      setUserDetails({ name: "", address: "", email: "", phone: "", dob: "" });
      navigate("/mycontacts");
    } else {
      toast.error(result.error);
    }
  };

  useEffect(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/contact/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await res.data;

      console.log("result: ", result);

      setUserDetails({
        id: result._id,
        name: result.name,
        email: result.email,
        address: result.address,
        phone: result.phone,
        dob: moment(result.dob).format("YYYY-MM-DD"),
      });
      setFile(result.file);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  const currentDate = new Date();
  const minDate = new Date(
    currentDate.getFullYear() - 100,
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const maxDate = new Date();

  const minDateISO = minDate.toISOString().split("T")[0];
  const maxDateISO = maxDate.toISOString().split("T")[0];

  return (
    <>
      {loading ? (
        <Spinner splash="Loading Contact..." />
      ) : (
        <>
          <h2>Edit your contact</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nameInput" className="form-label mt-4">
                UPDATE NAME OF YOUR CONTACT
              </label>
              <input
                type="text"
                className="form-control"
                id="nameInput"
                name="name"
                value={userDetails.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneInput" className="form-label mt-4">
                UPDATE NUMBER OF YOUR CONTACT
              </label>
              <input
                type="number"
                className="form-control"
                id="phoneInput"
                name="phone"
                value={userDetails.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="fileInput" className="form-label mt-4">
                UPDATE IMAGE OF YOUR CONTACT
              </label>
              <input
                type="file"
                className="form-control"
                id="fileInput"
                name="file"
                onChange={handleFileChange}
              />
              <span>
                <img
                  variant="top"
                  style={{
                    width: "100px",
                    textAlign: "center",
                    margin: "auto",
                  }}
                  src={`http://localhost:8000/uploads/${file}`}
                  className="mt-2"
                />
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="dob" className="form-label mt-4">
                UPDATE DOB OF YOUR CONTACT
              </label>
              <input
                type="date"
                id="dobInput"
                name="dob"
                className="form-control"
                value={userDetails.dob}
                min={minDateISO}
                max={maxDateISO}
                onChange={handleInputChange}
              />
            </div>
            <input
              type="submit"
              value="Save Changes"
              className="btn btn-info my-2"
            />
          </form>
        </>
      )}
    </>
  );
};

export default EditContact;
