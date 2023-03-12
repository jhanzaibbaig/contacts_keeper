const mongoose = require("mongoose");
const Joi = require("joi");

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "NAME IS REQUIRED."],
  },
  phone: {
    type: Number,
    required: [true, "PHONE NUMBER IS REQUIRED."],
  },
  file: { type: String, required: [true, "IMAGE IS REQUIRED."] },
  dob: { type: Date, required: [true, "DATE OF BIRTH IS REQUIRED."] },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Contact = new mongoose.model("Contact", ContactSchema);

const validateContact = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(4).max(50).required(),
    phone: Joi.number().min(7).max(10000000000).required(),
    dob: Joi.date().max("now").iso().min("1923-01-01").required(),
  });

  return schema.validate(data);
};

module.exports = {
  validateContact,
  Contact,
};
