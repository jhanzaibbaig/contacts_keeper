import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateContact = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    dob: "",
  });
  const [file, setFile] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    console.log("file: ", file);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("userDetails: ", userDetails);
    console.log("file: ", file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", userDetails.name);
    formData.append("phone", userDetails.phone);
    formData.append("dob", userDetails.dob);

    console.log("formData: ", formData);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    const res = await axios.post(
      "http://localhost:8000/api/contact",
      formData,
      config
    );

    if (res.data.status === 401 || !res.data) {
      console.log("errror");
    } else {
      navigate("/");
    }
  };

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
      <h2>Create your contact</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nameInput" className="form-label mt-4">
            ENTER CONTACTS NAME
          </label>
          <input
            type="text"
            className="form-control"
            id="nameInput"
            name="name"
            value={userDetails.name}
            onChange={handleInputChange}
            placeholder="ENTER NAME"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneInput" className="form-label mt-4">
            ENTER CONTACTS NUMBER
          </label>
          <input
            type="number"
            className="form-control"
            id="phoneInput"
            name="phone"
            value={userDetails.phone}
            onChange={handleInputChange}
            placeholder="ENTER CONTACT NUMBER"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fileInput" className="form-label mt-4">
            UPLOAD IMAGE OF CONTACT
          </label>
          <input
            type="file"
            className="form-control"
            id="fileInput"
            name="file"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dob" className="form-label mt-4">
            ENTER DOB
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
          value="Add Contact"
          className="btn btn-info my-2"
        />
      </form>
    </>
  );
};

export default CreateContact;
