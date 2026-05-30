import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineClock, HiOutlineArrowLeft } from 'react-icons/hi';
import { API_URL } from '../apiConfig';

const jobDescriptions = {
  'Content Writer Intern': {
    title: 'Content Writer Intern',
    description: "The rapid digitisation of businesses across India, combined with Noida's emergence as a corporate and start-up hub, has opened a wide range of internship opportunities for students and fresh graduates.",
    responsibilities: [
      'Content Research: Conducting in-depth research on industry topics, market trends, competitor content, and audience preferences before drafting articles.',
      'Blog & Article Writing: Writing well-structured, SEO-friendly blogs, articles, and long-form content on real estate, lifestyle, investments, and market trends.',
      'SEO Optimisation: Implementing on-page SEO best practices including keyword integration, meta titles, meta descriptions, internal linking, and headline optimisation.',
      'Website & Landing Page Content: Drafting compelling copy for property pages, service pages, and campaign landing pages that drive conversions.',
      'Editing & Proofreading: Reviewing content for grammar, clarity, tone, and factual accuracy before publishing.',
      'Collaboration: Working closely with the SEO, design, and marketing teams to align content with brand voice and campaign objectives.',
      'Reporting: Tracking content performance metrics such as traffic, engagement, and rankings to refine future content.',
    ],
    skills: [
      'Excellent written and verbal communication in English',
      'Strong research and analytical abilities',
      'Basic understanding of SEO principles and keyword research',
      'Familiarity with tools like Google Docs, Grammarly, ChatGPT, and Surfer SEO/SEMrush (preferred)',
      'Creativity, originality, and storytelling ability',
      'Attention to detail and strong editing/proofreading skills',
      'Time management and ability to meet deadlines',
      'Willingness to learn and adapt to brand tone and style guides',
    ],
  },
  'Sales Executive': {
    title: 'Sales Executive',
    description: 'Drive business growth through proactive customer engagement and sales strategy execution.',
    responsibilities: [
      'Identify and generate leads from various sources',
      'Build and maintain strong customer relationships',
      'Present property/investment opportunities effectively',
      'Negotiate and close deals',
      'Maintain sales pipeline and CRM data',
      'Meet monthly and quarterly sales targets',
    ],
    skills: [
      'Excellent communication skills',
      'Negotiation and persuasion abilities',
      'Problem-solving mindset',
      'Customer-focused approach',
      'Sales experience (preferred)',
      'CRM proficiency',
    ],
  },
  'Team Leader': {
    title: 'Team Leader',
    description: 'Lead and mentor a high-performing team while driving sales and operational excellence.',
    responsibilities: [
      'Lead and motivate sales team members',
      'Set performance targets and KPIs',
      'Conduct training and skill development sessions',
      'Monitor team productivity and performance',
      'Develop and implement sales strategies',
      'Report to senior management',
    ],
    skills: [
      'Leadership and team management',
      'Sales expertise',
      'Mentoring and coaching abilities',
      'Strategic thinking',
      'Customer relationship management',
      'Decision-making skills',
    ],
  },
  'Graphic Designer Intern (Male)': {
    title: 'Graphic Designer Intern (Male)',
    description: 'Create visually compelling designs for marketing materials and digital platforms.',
    responsibilities: [
      'Design marketing collateral and promotional materials',
      'Create social media graphics and posts',
      'Develop visual concepts for campaigns',
      'Edit and enhance images',
      'Maintain brand consistency',
      'Support the creative team on various projects',
    ],
    skills: [
      'Proficiency in Adobe Creative Suite',
      'Strong visual design fundamentals',
      'Creativity and originality',
      'Attention to detail',
      'Time management',
      'Ability to take feedback',
    ],
  },
  'Video Editor Intern (Male)': {
    title: 'Video Editor Intern (Male)',
    description: 'Edit and produce engaging video content for marketing and social media.',
    responsibilities: [
      'Edit raw footage into polished videos',
      'Add graphics, transitions, and effects',
      'Create promotional and social media videos',
      'Maintain brand consistency in video content',
      'Collaborate with creative and marketing teams',
      'Optimize videos for different platforms',
    ],
    skills: [
      'Proficiency in video editing software (Premiere Pro, After Effects, etc.)',
      'Knowledge of video formats and codecs',
      'Creative storytelling ability',
      'Attention to detail',
      'Time management',
      'Ability to work in a fast-paced environment',
    ],
  },
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid #E0E0E0',
  borderRadius: '8px',
  fontSize: '0.95rem',
  color: 'var(--color-navy)',
  outline: 'none',
  backgroundColor: '#FAFAFA',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: 'var(--color-navy)',
  marginBottom: '6px',
};

const JobDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const position = location.state?.position;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    position: position?.title || '',
    location: position?.location || '',
    experience: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const jobInfo = jobDescriptions[formData.position] || jobDescriptions['Content Writer Intern'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setTimeout(() => navigate('/careers'), 3000);
      } else {
        alert('Error submitting application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F9F9F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '480px', width: '100%', backgroundColor: 'white', borderRadius: '16px', padding: '48px 32px', textAlign: 'center', boxShadow: '0 8px 40px rgba(10,28,58,0.1)' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '2rem', color: '#4CAF50' }}>✓</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '12px' }}>Application Submitted!</h2>
          <p style={{ color: '#666', lineHeight: 1.7, marginBottom: '8px' }}>
            Thank you for applying for <strong>{formData.position}</strong>. We have received your application and will review it shortly.
          </p>
          <p style={{ fontSize: '0.85rem', color: '#999' }}>Redirecting to careers page...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9F9F9' }}>
      {/* Hero */}
      <section style={{ backgroundColor: 'var(--color-navy)', padding: isMobile ? '32px 0 40px' : '40px 0 56px' }}>
        <div className="container" style={{ padding: '0 24px' }}>
          <button
            onClick={() => navigate('/careers')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              marginBottom: '24px',
              padding: 0,
            }}
          >
            <HiOutlineArrowLeft /> Back to Careers
          </button>

          <span style={{ color: 'var(--color-gold)', letterSpacing: '4px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
            Job Application
          </span>
          <h1 style={{ fontSize: isMobile ? '1.75rem' : '2.5rem', fontWeight: 900, color: 'white', marginBottom: '16px', lineHeight: 1.2 }}>
            {jobInfo.title}
          </h1>
          <div style={{ width: '50px', height: '3px', backgroundColor: 'var(--color-gold)', marginBottom: '20px' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HiOutlineLocationMarker style={{ color: 'var(--color-gold)' }} />
              {position?.location || 'Multiple Locations'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HiOutlineBriefcase style={{ color: 'var(--color-gold)' }} />
              {position?.openings || 'N/A'} openings
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HiOutlineClock style={{ color: 'var(--color-gold)' }} />
              {position?.experience === '0' ? 'Fresher welcome' : `${position?.experience || 'Any'} yrs experience`}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: isMobile ? '32px 0 60px' : '48px 0 80px' }}>
        <div className="container" style={{ padding: '0 24px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 380px',
              gap: '32px',
              alignItems: 'start',
            }}
          >
            {/* Job Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {jobInfo.description && (
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: isMobile ? '24px' : '32px', boxShadow: '0 4px 20px rgba(10,28,58,0.06)' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid var(--color-gold)' }}>
                    About This Role
                  </h2>
                  <p style={{ color: '#555', lineHeight: 1.8, margin: 0, fontSize: '0.95rem' }}>{jobInfo.description}</p>
                </div>
              )}

              {jobInfo.responsibilities && (
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: isMobile ? '24px' : '32px', boxShadow: '0 4px 20px rgba(10,28,58,0.06)' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid var(--color-gold)' }}>
                    Key Responsibilities
                  </h2>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {jobInfo.responsibilities.map((item, index) => (
                      <li key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#555', fontSize: '0.95rem', lineHeight: 1.7 }}>
                        <span style={{ color: 'var(--color-gold)', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {jobInfo.skills && (
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: isMobile ? '24px' : '32px', boxShadow: '0 4px 20px rgba(10,28,58,0.06)' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid var(--color-gold)' }}>
                    Required Skills
                  </h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {jobInfo.skills.map((skill, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#F0F4FF',
                          color: 'var(--color-navy)',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          border: '1px solid rgba(10,28,58,0.08)',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Application Form */}
            <div style={{ position: isMobile ? 'static' : 'sticky', top: '100px' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: isMobile ? '24px' : '28px', boxShadow: '0 8px 30px rgba(10,28,58,0.1)', border: '1px solid rgba(198,156,109,0.2)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '6px' }}>Apply Now</h3>
                <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '24px' }}>Fill in your details and our HR team will get back to you.</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={inputStyle} placeholder="Your name" />
                  </div>

                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} placeholder="your@email.com" />
                  </div>

                  <div>
                    <label style={labelStyle}>Mobile Number *</label>
                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required style={inputStyle} placeholder="+91 XXXXXXXXXX" />
                  </div>

                  <div>
                    <label style={labelStyle}>Experience (Years) *</label>
                    <input type="number" name="experience" value={formData.experience} onChange={handleChange} required min="0" style={inputStyle} placeholder="0" />
                  </div>

                  <div>
                    <label style={labelStyle}>Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="3"
                      style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      backgroundColor: loading ? '#ccc' : 'var(--color-gold)',
                      color: 'var(--color-navy)',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '1rem',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      marginTop: '4px',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </button>

                  <p style={{ fontSize: '0.75rem', color: '#aaa', textAlign: 'center', margin: 0 }}>
                    By applying, you agree to our terms and conditions.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobDetail;
