import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiLocationMarker, HiCurrencyRupee, HiArrowLeft, HiPhone, HiOfficeBuilding, HiHome } from 'react-icons/hi';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready-to-move': return 'bg-green-100 text-green-700';
      case 'under-construction': return 'bg-yellow-100 text-yellow-700';
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
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

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-700 mb-4">Project Not Found</h2>
          <Link to="/projects" className="text-blue-600 hover:underline">← Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link to="/projects" className="inline-flex items-center text-slate-600 hover:text-blue-600 mb-6 transition-colors">
            <HiArrowLeft className="w-5 h-5 mr-2" />
            Back to Projects
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <div className="aspect-[4/3] bg-slate-200 rounded-2xl overflow-hidden mb-4">
                {project.images && project.images.length > 0 ? (
                  <img
                    src={project.images[activeImage]}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                    {project.type === 'residential' ? (
                      <HiHome className="w-24 h-24 text-blue-500" />
                    ) : (
                      <HiOfficeBuilding className="w-24 h-24 text-blue-500" />
                    )}
                  </div>
                )}
              </div>
              {project.images && project.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {project.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* YouTube Video */}
              {project.youtubeUrl && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Project Video</h3>
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <iframe
                      src={project.youtubeUrl.replace('watch?v=', 'embed/')}
                      title="Project Video"
                      className="w-full h-full"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 capitalize">
                    {project.type}
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2">{project.title}</h1>
                <div className="flex items-center gap-1 text-slate-500">
                  <HiLocationMarker className="w-5 h-5" />
                  <span>{project.location}, {project.city}</span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <p className="text-sm text-slate-500 mb-1">Starting From</p>
                <div className="flex items-center text-blue-600 font-extrabold text-2xl">
                  <HiCurrencyRupee className="w-6 h-6" />
                  {project.price}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">About This Project</h3>
                <p className="text-slate-600 leading-relaxed">{project.description}</p>
              </div>

              {/* Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Key Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.highlights.map((h, i) => (
                      <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-100 font-medium">
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {project.amenities && project.amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {project.amenities.map((a, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                        <span className="text-sm text-slate-700">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <a
                  href="tel:+919406650197"
                  className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-xl hover:bg-blue-600 transition-colors font-semibold text-center flex items-center justify-center gap-2"
                >
                  <HiPhone className="w-5 h-5" /> Call Now
                </a>
                <a
                  href="https://wa.me/919406650197"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition-colors font-semibold text-center"
                >
                  WhatsApp
                </a>
                <Link
                  to="/contact"
                  className="flex-1 border-2 border-blue-500 text-blue-600 py-3 px-6 rounded-xl hover:bg-blue-500 hover:text-white transition-colors font-semibold text-center"
                >
                  Inquire
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
