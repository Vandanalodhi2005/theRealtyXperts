import { useEffect, useState } from 'react';
import emailjs from 'emailjs-com';

function Contact() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Combine first and last name for EmailJS template if needed
        const templateParams = {
            from_name: `${formData.first_name} ${formData.last_name}`,
            from_email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
            to_name: 'The Realty Xperts Team'
        };

        emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            templateParams,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
            alert("Thank you for reaching out! Your inquiry has been sent to our experts via EmailJS.");
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        }, (err) => {
            console.error('FAILED...', err);
            alert("Failed to send message. Please try again later or contact us directly.");
        });
    };

    return (
        <main style={{ paddingTop: '80px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <section className="contact section-padding" id="contact-page">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="subtitle">Get In Touch</span>
                        <h2>Contact The Realty Xperts</h2>
                        <div className="divider mx-auto"></div>
                        <p className="section-desc">We are always ready to help you find your dream address or answer any questions.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', marginTop: '40px' }}>
                        
                        {/* Contact Information Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ backgroundColor: 'var(--color-white)', padding: '30px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(0,128,128,0.1)', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                    <i className="fas fa-phone-alt"></i>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Call Us Directly</h3>
                                    <a href="tel:9264175587" style={{ color: 'var(--color-dark-gray)', textDecoration: 'none', fontSize: '1.1rem' }}>926-417-5587</a>
                                    <p style={{ color: 'var(--color-gold)', fontSize: '0.9rem', marginTop: '5px' }}>Sameer Tiwari</p>
                                </div>
                            </div>

                            <div style={{ backgroundColor: 'var(--color-white)', padding: '30px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(0,128,128,0.1)', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Email Us</h3>
                                    <a href="mailto:Emailtotrx@gmail.com" style={{ color: 'var(--color-dark-gray)', textDecoration: 'none', fontSize: '1.1rem' }}>Emailtotrx@gmail.com</a>
                                </div>
                            </div>

                            <div style={{ backgroundColor: 'var(--color-white)', padding: '30px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(0,128,128,0.1)', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                    <i className="fas fa-clock"></i>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Business Legacy</h3>
                                    <p style={{ color: 'var(--color-dark-gray)' }}>Delivering excellence since <strong>2016</strong>.</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div style={{ backgroundColor: 'var(--color-white)', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
                            <h3 style={{ marginBottom: '25px', fontSize: '1.5rem' }}>Send Us A Message</h3>
                            
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <input 
                                        type="text" 
                                        name="first_name"
                                        placeholder="First Name" 
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required 
                                        style={{ padding: '15px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-gray)', fontFamily: 'inherit', fontSize: '1rem' }} 
                                    />
                                    <input 
                                        type="text" 
                                        name="last_name"
                                        placeholder="Last Name" 
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required 
                                        style={{ padding: '15px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-gray)', fontFamily: 'inherit', fontSize: '1rem' }} 
                                    />
                                </div>
                                <input 
                                    type="email" 
                                    name="email"
                                    placeholder="Your Email Address" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    required 
                                    style={{ padding: '15px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-gray)', fontFamily: 'inherit', fontSize: '1rem' }} 
                                />
                                <input 
                                    type="tel" 
                                    name="phone"
                                    placeholder="Your Phone Number" 
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required 
                                    style={{ padding: '15px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-gray)', fontFamily: 'inherit', fontSize: '1rem' }} 
                                />
                                <input 
                                    type="text" 
                                    name="subject"
                                    placeholder="Subject (e.g., Interested in Buying, Selling...)" 
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required 
                                    style={{ padding: '15px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-gray)', fontFamily: 'inherit', fontSize: '1rem' }} 
                                />
                                <textarea 
                                    name="message"
                                    placeholder="How can we help you today?" 
                                    value={formData.message}
                                    onChange={handleChange}
                                    required 
                                    rows="6" 
                                    style={{ padding: '15px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-gray)', fontFamily: 'inherit', fontSize: '1rem', resize: 'vertical' }}
                                ></textarea>
                                <button type="submit" className="btn btn-primary" style={{ padding: '16px', fontSize: '1.1rem' }}>Submit Message</button>
                            </form>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}

export default Contact;

