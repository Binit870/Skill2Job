import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, DollarSign, Clock } from 'lucide-react';

const FindJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    jobType: '',
    location: '',
    page: 1
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    page: 1
  });

  useEffect(() => {
    fetchJobs();
  }, [filters.page]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: filters.page,
        limit: 10,
        ...(filters.search && { search: filters.search }),
        ...(filters.jobType && { jobType: filters.jobType }),
        ...(filters.location && { location: filters.location })
      });

      const { data } = await axios.get(
        `http://localhost:5000/api/jobs?${params}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );

      setJobs(data.data);
      setPagination({
        total: data.total,
        pages: data.pages,
        page: data.page
      });
    } catch (error) {
      console.error('Fetch jobs error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApply = (jobId) => {
    navigate(`/student/apply/${jobId}`);
  };

  const handleViewDetails = (jobId) => {
    navigate(`/student/job/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search jobs, companies, skills..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filters.jobType}
                onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {jobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <p className="text-gray-500">No jobs found matching your criteria</p>
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          {job.companyLogo && (
                            <img
                              src={`http://localhost:5000${job.companyLogo}`}
                              alt={job.company}
                              className="w-16 h-16 object-contain rounded-lg border p-2"
                            />
                          )}
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                            <p className="text-gray-600">{job.company}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center text-gray-600">
                            <MapPin size={18} className="mr-2" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Briefcase size={18} className="mr-2" />
                            <span>{job.jobType}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <DollarSign size={18} className="mr-2" />
                            <span>
                              {job.salaryMin && job.salaryMax
                                ? `$${job.salaryMin} - $${job.salaryMax}`
                                : 'Salary not specified'}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock size={18} className="mr-2" />
                            <span>{job.experienceMin}+ years exp.</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-gray-700 line-clamp-2">{job.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills.slice(0, 5).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 5 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                              +{job.skills.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                      <button
                        onClick={() => handleViewDetails(job._id)}
                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        View Details
                      </button>
                      {job.hasApplied ? (
                        <button
                          disabled
                          className="px-6 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                        >
                          Already Applied
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApply(job._id)}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                  disabled={filters.page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {filters.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                  disabled={filters.page === pagination.pages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FindJobs;