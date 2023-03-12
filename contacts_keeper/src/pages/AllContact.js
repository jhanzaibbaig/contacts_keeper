import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import ToastContext from "../context/ToastContext";
import moment from "moment";

const AllContact = () => {
  const { toast } = useContext(ToastContext);

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [contacts, setContacts] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/mycontacts`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await res.data;
      if (!result.error) {
        setContacts(result.contacts);
      } else {
        console.log(result);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);
  const deleteContact = async (id) => {
    if (window.confirm("are you sure you want to delete this contact ?")) {
      try {
        const res = await axios.delete(
          `http://localhost:8000/api/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = await res.data;
        if (!result.error) {
          setContacts(result.myContacts);
          toast.success("Deleted contact");
          setShowModal(false);
        } else {
          toast.error(result.error);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const newSearchUser = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    console.log(newSearchUser);
    setContacts(newSearchUser);
  };

  return (
    <>
      <div>
        <h1>Your Contacts</h1>
        <a href="/mycontacts" className="btn btn-danger my-2">
          Reload Contact
        </a>
        <hr className="my-4" />

        <>
          {contacts.length === 0 ? (
            <h3>No contacts created yet</h3>
          ) : (
            <>
              <form className="d-flex" onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  name="searchInput"
                  id="searchInput"
                  className="form-control my-2"
                  placeholder="Search Contact"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button type="submit" className="btn btn-info mx-2">
                  Search
                </button>
              </form>

              <p>
                Your Total Contacts: <strong>{contacts.length}</strong>
              </p>
              <table className="table table-hover">
                <thead>
                  <tr className="table-dark">
                    <th scope="col">IMAGE</th>
                    <th scope="col">NAME</th>
                    <th scope="col">PHONE</th>
                    <th scope="col">DOB</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr
                      key={contact._id}
                      onClick={() => {
                        setModalData({});
                        setModalData(contact);
                        setShowModal(true);
                      }}
                    >
                      <td>
                        <img
                          variant="top"
                          style={{
                            width: "100px",
                            textAlign: "center",
                            margin: "auto",
                          }}
                          src={`http://localhost:8000/uploads/${contact.file}`}
                          className="mt-2"
                        />
                      </td>
                      <th scope="row">{contact.name}</th>
                      <td>{contact.phone}</td>
                      <td>{moment(contact.dob).format("L")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalData.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <img
            variant="top"
            style={{
              width: "100px",
              textAlign: "center",
              margin: "auto",
            }}
            src={`http://localhost:8000/uploads/${modalData.file}`}
            className="mt-2"
          />
          <p>
            <strong>PHONE #: </strong> {modalData.phone}
          </p>
          <p>
            <strong>DATE OF BIRTH : </strong>:{" "}
            {moment(modalData.dob).format("L")}
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Link className="btn btn-info" to={`/edit/${modalData._id}`}>
            Edit
          </Link>
          <button
            className="btn btn-danger"
            onClick={() => deleteContact(modalData._id)}
          >
            Delete
          </button>
          <button
            className="btn btn-warning"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AllContact;
