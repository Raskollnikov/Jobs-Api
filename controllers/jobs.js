import jobModel from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

const getAllJobs = async (req, res) => {
  const { userId } = req.user;
  const allJobs = await jobModel.find({ createdBy: userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ allJobs, count: allJobs.length });
};

const getJob = async (req, res) => {
  res.send("get job");
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await jobModel.create(req.body);
  const jobs = await jobModel.find().populate("createdBy", "name email");
  console.log(jobs);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  res.send("update job");
};

const deleteJob = async (req, res) => {
  res.send("delete jobs");
};
export { getAllJobs, getJob, createJob, updateJob, deleteJob };
