import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOfficeBuilding, HiHome, HiLocationMarker, HiCurrencyRupee } from 'react-icons/hi';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready-to-move': return 'bg-green-100 text-green-800';
      case 'under-construction': return 'bg-yellow-100 text-yellow-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ready-to-move': return 'Ready to Move';
      case 'under-construction': return 'Under Construction';
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-6">
              Our Projects
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover our premium residential and commercial projects designed to meet your lifestyle needs.
            </p>
          </div>

          {/* Projects Grid */}
          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div key={project._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group flex flex-col cursor-pointer" onClick={() => navigate(`/project/${project._id}`)}>
                  <div className="h-52 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden relative">
                    {project.images && project.images.length > 0 ? (
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      project.type === 'residential' ? (
                        <HiHome className="w-16 h-16 text-blue-600" />
                      ) : (
                        <HiOfficeBuilding className="w-16 h-16 text-blue-600" />
                      )
                    )}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-900/70 text-white backdrop-blur-md capitalize">
                        {project.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                    <div className="flex items-center gap-1 text-slate-600 mb-2">
                      <HiLocationMarker className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{project.location}, {project.city}</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 font-semibold mb-3">
                      <HiCurrencyRupee className="w-5 h-5" />
                      <span>Starting from {project.price}</span>
                    </div>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-1">{project.description}</p>

                    {/* Highlights */}
                    {project.highlights && project.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.highlights.slice(0, 3).map((highlight, index) => (
                          <span key={index} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/project/${project._id}`);
                        }}
                        className="flex-1 bg-blue-500 text-white py-2.5 px-4 rounded-xl hover:bg-blue-600 transition-colors font-semibold text-sm text-center"
                      >
                        View Details
                      </button>
                      <a
                        href="tel:+919406650197"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 border border-blue-500 text-blue-600 py-2.5 px-4 rounded-xl hover:bg-blue-600 hover:text-white transition-colors font-semibold text-sm text-center"
                      >
                        Call Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <HiOfficeBuilding className="w-20 h-20 text-slate-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-700 mb-3">No Projects Available Yet</h3>
              <p className="text-slate-500 max-w-md mx-auto">We&apos;re adding new projects soon. Check back later or contact us for information.</p>
              <Link
                to="/contact"
                className="inline-block mt-6 bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center mt-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-semibold mb-4">Interested in Our Projects?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Get detailed information about our ongoing and upcoming projects. Our team is ready to assist you.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-slate-50 transition-all duration-300 font-semibold shadow-lg"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;