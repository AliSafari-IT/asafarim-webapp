import React, { useState } from 'react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Contact Us</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
        <section>
          <h2>Get in Touch</h2>
          <p style={{ lineHeight: '1.8', marginBottom: '2rem' }}>
            We'd love to hear from you! Whether you have questions about our components, 
            need help with implementation, or want to discuss a project, don't hesitate to reach out.
          </p>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3>Contact Information</h3>
            <div style={{ lineHeight: '2', marginTop: '1rem' }}>
              <p><strong>📧 Email:</strong> contact@asafarim.com</p>
              <p><strong>🌐 Website:</strong> <a href="https://www.asafarim.com" target="_blank">www.asafarim.com</a></p>
              <p><strong>💼 LinkedIn:</strong> <a href="https://linkedin.com/in/ali-safari-m" target="_blank">LinkedIn</a></p>
              <p><strong>🐙 GitHub:</strong> <a href="https://github.com/AliSafari-IT" target="_blank">GitHub</a></p>
            </div>
          </div>

          <div>
            <h3>Office Hours</h3>
            <div style={{ lineHeight: '2', marginTop: '1rem' }}>
              <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
              <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
              <p><strong>Sunday:</strong> Closed</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                *All times are in Central European Time (CET)
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>Send us a Message</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  background: 'var(--surface)'
                }}
              />
            </div>

            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  background: 'var(--surface)'
                }}
              />
            </div>

            <div>
              <label htmlFor="subject" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  background: 'var(--surface)'
                }}
              />
            </div>

            <div>
              <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  background: 'var(--surface)',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '0.75rem 2rem',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              Send Message
            </button>
          </form>
        </section>
      </div>

      <section style={{ padding: '2rem', background: 'var(--surface)', borderRadius: '8px', marginTop: '3rem' }}>
        <h2>Frequently Asked Questions</h2>
        <div style={{ marginTop: '1.5rem' }}>
          <details style={{ marginBottom: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: '500', padding: '0.5rem 0' }}>
              How can I integrate these components into my project?
            </summary>
            <p style={{ padding: '0.5rem 0', lineHeight: '1.6' }}>
              Our components are designed to be easily integrated into any React project. 
              Simply install the packages via npm or pnpm and import them into your components.
            </p>
          </details>
          
          <details style={{ marginBottom: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: '500', padding: '0.5rem 0' }}>
              Do you provide custom development services?
            </summary>
            <p style={{ padding: '0.5rem 0', lineHeight: '1.6' }}>
              Yes! We offer custom development services for React applications, component libraries, 
              and design systems. Contact us to discuss your specific requirements.
            </p>
          </details>
          
          <details style={{ marginBottom: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: '500', padding: '0.5rem 0' }}>
              Is there documentation available for the components?
            </summary>
            <p style={{ padding: '0.5rem 0', lineHeight: '1.6' }}>
              Yes, comprehensive documentation is available for all components, including 
              API references, examples, and best practices for implementation.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
