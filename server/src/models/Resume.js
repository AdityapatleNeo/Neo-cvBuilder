const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ResumeSchema = new Schema({
  personal: {
    image: String,
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    introduction: String,
  },
  education: [
    {
      degree: String,
      institution: String,
      percentage: String,
    },
  ],
  experience: [
    {
      organization: String,
      location: String,
      position: String,
      ctc: String,
      joiningDate: String,
      leavingDate: String,
      technologies: String,
    },
  ],
  projects: [
    {
      title: String,
      teamSize: String,
      duration: String,
      technologies: String,
      description: String,
    },
  ],
  skills: [
    {
      name: String,
      level: String,
    },
  ],
  socials: [
    {
      platform: String,
      link: String,
    },
  ],
  layoutOptions: {
    color: String,
    font: String,
    fontSize: Number,
  },
  layoutChoice: String,
});


const Resume =  mongoose.model("Resume", ResumeSchema);
module.exports = Resume