// controllers/jobController.js
import Job from '../models/Job.js';
import Profile from '../models/Profile.js';

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private
export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      companyWebsite,
      companyDescription,
      location,
      jobType,
      experienceMin,
      experienceMax,
      salaryMin,
      salaryMax,
      vacancies,
      skills,
      description,
      deadline,
      contact,
      companyLogo
    } = req.body;

    // Get user profile to verify role and get additional info
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }

    // Check if user is a recruiter
    if (profile.role !== 'recruiter') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only recruiters can post jobs' 
      });
    }

    // Validate required fields
    if (!title || !company || !location || !skills || !description || !contact?.email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Validate experience range
    if (experienceMax && experienceMin > experienceMax) {
      return res.status(400).json({ 
        success: false, 
        message: 'Minimum experience cannot be greater than maximum experience' 
      });
    }

    // Validate salary range
    if (salaryMax && salaryMin > salaryMax) {
      return res.status(400).json({ 
        success: false, 
        message: 'Minimum salary cannot be greater than maximum salary' 
      });
    }

    // Create job object
    const jobData = {
      title,
      company,
      companyWebsite,
      companyDescription,
      location,
      jobType,
      experienceMin: experienceMin || 0,
      experienceMax,
      salaryMin,
      salaryMax,
      vacancies: vacancies || 1,
      skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
      description,
      deadline,
      contact: {
        email: contact.email,
        phone: contact.phone || profile.phone || ''
      },
      companyLogo,
      postedBy: req.user.id,
      status: 'active'
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      data: job,
      message: 'Job posted successfully'
    });

  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating job' 
    });
  }
};

// @desc    Get all jobs (with filters)
// @route   GET /api/jobs
// @access  Public/Private
export const getJobs = async (req, res) => {
  try {
    const {
      search,
      jobType,
      location,
      minSalary,
      maxSalary,
      minExperience,
      maxExperience,
      skills,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };

    // Search in title, company, description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Job type filter
    if (jobType) {
      filter.jobType = jobType;
    }

    // Location filter
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Salary range filter
    if (minSalary || maxSalary) {
      filter.salaryMin = {};
      if (minSalary) filter.salaryMin.$gte = Number(minSalary);
      if (maxSalary) filter.salaryMin.$lte = Number(maxSalary);
    }

    // Experience filter
    if (minExperience || maxExperience) {
      filter.experienceMin = {};
      if (minExperience) filter.experienceMin.$gte = Number(minExperience);
      if (maxExperience) filter.experienceMin.$lte = Number(maxExperience);
    }

    // Skills filter
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      filter.skills = { $in: skillsArray };
    }

    // Pagination
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const jobs = await Job.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .populate('postedBy', 'name email');

    // Get total count for pagination
    const total = await Job.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      data: jobs
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching jobs' 
    });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    // Increment view count
    job.views += 1;
    await job.save();

    res.status(200).json({
      success: true,
      data: job
    });

  } catch (error) {
    console.error('Get job by ID error:', error);
    
    // Check if error is due to invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching job' 
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter only)
export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    // Check if user is the one who posted the job
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this job' 
      });
    }

    // Process skills if they come as string
    if (req.body.skills && typeof req.body.skills === 'string') {
      req.body.skills = req.body.skills.split(',').map(s => s.trim());
    }

    // Update job
    job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: job,
      message: 'Job updated successfully'
    });

  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating job' 
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter only)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    // Check if user is the one who posted the job
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this job' 
      });
    }

    // Soft delete by changing status
    job.status = 'closed';
    await job.save();

    // Alternative: Hard delete
    // await job.remove();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });

  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting job' 
    });
  }
};

// @desc    Get jobs posted by a specific recruiter
// @route   GET /api/jobs/recruiter/:recruiterId
// @access  Private
export const getRecruiterJobs = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { postedBy: req.params.recruiterId };

    // Filter by status if provided
    if (status) {
      filter.status = status;
    }

    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });

  } catch (error) {
    console.error('Get recruiter jobs error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching recruiter jobs' 
    });
  }
};

// @desc    Get job statistics
// @route   GET /api/jobs/stats
// @access  Private (Admin/Recruiter)
export const getJobStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgSalary: { $avg: '$salaryMin' },
          totalViews: { $sum: '$views' },
          totalApplications: { $sum: '$applications' }
        }
      }
    ]);

    const jobTypeStats = await Job.aggregate([
      {
        $group: {
          _id: '$jobType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        byStatus: stats,
        byJobType: jobTypeStats
      }
    });

  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching job statistics' 
    });
  }
};