import mongoose from "mongoose";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import asyncHandler from "../utils/asyncHandler.js";

// GET /api/recruiter/analytics/overview
export const getOverview = asyncHandler(async (req, res) => {
  const recruiterId = req.user._id;

  const [
    jobCounts,
    statusFunnel,
    hiredApps,
    topJobs,
    trend,
  ] = await Promise.all([
    // Active vs closed job counts
    Job.aggregate([
      { $match: { recruiter: recruiterId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    // Applications by status (the "funnel")
    Application.aggregate([
      { $match: { recruiter: recruiterId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    // Hired applications with timestamps, to compute average time-to-hire
    Application.find({ recruiter: recruiterId, status: "Hired", hiredAt: { $ne: null } })
      .select("createdAt hiredAt")
      .lean(),

    // Top 5 jobs by application count
    Job.find({ recruiter: recruiterId })
      .select("title applications views status createdAt")
      .sort({ applications: -1 })
      .limit(5)
      .lean(),

    // Applications received per day, last 30 days
    Application.aggregate([
      {
        $match: {
          recruiter: recruiterId,
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const jobStatusMap = { Active: 0, Closed: 0 };
  jobCounts.forEach((j) => { jobStatusMap[j._id] = j.count; });

  const funnel = { Pending: 0, Reviewed: 0, Shortlisted: 0, Rejected: 0, Hired: 0 };
  statusFunnel.forEach((s) => { funnel[s._id] = s.count; });
  const totalApplications = Object.values(funnel).reduce((a, b) => a + b, 0);

  const avgTimeToHireDays = hiredApps.length
    ? Math.round(
        hiredApps.reduce((sum, a) => sum + (new Date(a.hiredAt) - new Date(a.createdAt)), 0) /
          hiredApps.length /
          (1000 * 60 * 60 * 24) * 10
      ) / 10
    : null;

  const hireRate = totalApplications
    ? Math.round((funnel.Hired / totalApplications) * 1000) / 10
    : 0;

  res.status(200).json({
    success: true,
    data: {
      jobs: {
        active: jobStatusMap.Active || 0,
        closed: jobStatusMap.Closed || 0,
        total: (jobStatusMap.Active || 0) + (jobStatusMap.Closed || 0),
      },
      funnel,
      totalApplications,
      hireRate,
      avgTimeToHireDays,
      topJobs,
      trend, // [{ _id: "2026-08-15", count: 4 }, ...]
    },
  });
});
