const express = require("express");
const router = new express.Router();
const multer = require("multer");
const { Contact } = require("../models/Contact");

const mongoose = require("mongoose");

const auth = require("../middlewares/auth");

// IMAGE STORAGE PATH
const imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}. ${file.originalname}`);
  },
});

const isFile = (req, file, callback) => {
  const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
  if (validImageTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("ONLY IMAGE FILE ARE ALLOWED"));
  }
};

const upload = multer({
  storage: imgconfig,
  fileFilter: isFile,
});

//POST AND CREATE CONTACT
router.post("/contact", auth, upload.single("file"), async (req, res) => {
  const { filename } = req.file;

  const { name, phone, dob } = req.body;

  if (!name || !phone || !filename) {
    res.status(401).json({ status: 401, message: "ALL FIELDS ARE REQUIRED" });
  }

  try {
    const contactData = new Contact({
      name,
      phone,
      file: filename,
      dob,
      postedBy: req.user._id,
    });

    const finalContactData = await contactData.save();

    res.status(201).json({ status: 201, finalContactData });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

// GET ALL CONTACTS
router.get("/mycontacts", auth, async (req, res) => {
  try {
    const myContacts = await Contact.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "-password"
    );

    return res.status(200).json({ contacts: myContacts.reverse() });
  } catch (err) {
    console.log(err);
  }
});

// UPDATE CONTACT
router.put("/contact/:id", auth, upload.single("file"), async (req, res) => {
  const filename = req.file ? req.file.filename : req.body.file;
  const { id } = req.body;

  if (!id)
    return res.status(400).json({ error: "USER IS NOT FOUND OF RELATIVE ID." });
  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "PLEASE ENTER A VALID CONTACT ID" });

  try {
    const contact = await Contact.findOne({ _id: id });

    if (req.user._id.toString() !== contact.postedBy._id.toString())
      return res.status(401).json({ error: "YOU CAN'T EDIT OTHER's CONTACT!" });

    const updatedData = { ...req.body, file: filename, id: undefined };
    const result = await Contact.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    return res.status(200).json({ ...result._doc });
  } catch (err) {
    console.log(err);
  }
});

// DELETE CONTACT
router.delete("/delete/:id", auth, async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "CONTACTS NOT FOUND." });

  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "CONTACTS NOT FOUND." });
  try {
    const contact = await Contact.findOne({ _id: id });
    if (!contact) return res.status(400).json({ error: "CONTACTS NOT FOUND." });

    if (req.user._id.toString() !== contact.postedBy._id.toString())
      return res
        .status(401)
        .json({ error: "YOU CAN'T DELETE OTHER's CONTACT!" });

    const result = await Contact.deleteOne({ _id: id });
    const myContacts = await Contact.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "-password"
    );

    return res
      .status(200)
      .json({ ...contact._doc, myContacts: myContacts.reverse() });
  } catch (err) {
    console.log(err);
  }
});

// GET A SINGLE CONTACT
router.get("/contact/:id", auth, async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "CONTACTS NOT FOUND" });

  if (!mongoose.isValidObjectId(id))
    return res.status(400).json({ error: "CONTACTS NOT FOUND. " });

  try {
    const contact = await Contact.findOne({ _id: id });

    return res.status(200).json({ ...contact._doc });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
