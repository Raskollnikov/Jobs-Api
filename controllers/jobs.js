import jobModel from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

const getAllJobs = async (req, res) => {
  const { userId } = req.user;
  const allJobs = await jobModel.find({ createdBy: userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ allJobs, count: allJobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const singleJob = await jobModel.findOne({
    _id: jobId,
    createdBy: userId,
  });
  if (!singleJob) {
    throw new NotFoundError(`No job with ID:${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job: singleJob });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await jobModel.create(req.body);
  const jobs = await jobModel.find().populate("createdBy", "name email");
  console.log(jobs);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position },
  } = req;

  if (company == "" || position == "") {
    throw new BadRequestError("company and position fields cannot be empty");
  }
  const updatedJob = await jobModel.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    { company, position },
    { new: true, runValidators: true }
  );
  if (!updatedJob) {
    throw new NotFoundError(`No job with id ${jobId} found`);
  }

  res.status(StatusCodes.OK).json({ job: updatedJob });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const deleteJob = await jobModel.findByIdAndRemove({
    _id: jobId,
    createdBy: userId,
  });
  if (!deleteJob) {
    throw new NotFoundError(`No job found with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ msg: "Job deleted successfully" });
};
export { getAllJobs, getJob, createJob, updateJob, deleteJob };
