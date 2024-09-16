import express from "express";
const jobsRouter = express.Router();

import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/jobs.js";

jobsRouter.route("/").get(getAllJobs).post(createJob);
jobsRouter.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);

export default jobsRouter;
