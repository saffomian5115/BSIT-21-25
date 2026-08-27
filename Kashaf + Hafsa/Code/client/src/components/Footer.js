import React from 'react';
import { Link } from 'react-router-dom';
import GastroCareLogo from './Logo';

const Footer = () => (
  <footer className="gc-footer py-5">
    <div className="container">
      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <GastroCareLogo size={32}/>
            <span style={{fontFamily:"'Playfair Display',Georgia,serif",fontWeight:700,color:'#fff',fontSize:'1.2rem'}}>GastroCare</span>
          </div>
          <p className="text-white-50 small lh-lg">Your trusted AI-powered health companion specializing in gastroenterology, nutrition, and general wellness. Available 24/7 in English, Urdu & Turkish.</p>
        </div>
        <div className="col-6 col-lg-2">
          <h6 className="gc-footer">Quick Links</h6>
          <ul className="list-unstyled mt-2">
            {[['/', 'Home'],['/about','About'],['/chatbot','AI Chat']].map(([to,label])=>(
              <li key={to} className="mb-1"><Link to={to} className="gc-footer">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="col-6 col-lg-2">
          <h6 className="gc-footer">Support</h6>
          <ul className="list-unstyled mt-2">
            {[['/emergency','Emergency'],['/contact','Contact'],['/profile','Profile']].map(([to,label])=>(
              <li key={to} className="mb-1"><Link to={to} className="gc-footer">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="col-lg-4">
          <h6 className="gc-footer">Connect With Us</h6>
          <div className="d-flex flex-wrap gap-2 mt-2">
            <a href="https://www.instagram.com/ai.gastrocare.official/" target="_blank" rel="noreferrer"
              className="gc-footer d-flex align-items-center gap-1 border border-secondary rounded-pill px-3 py-1" style={{fontSize:'.8rem'}}>
              <i className="bi bi-instagram"/> Instagram
            </a>
            <a href="https://x.com/AiBased37955" target="_blank" rel="noreferrer"
              className="gc-footer d-flex align-items-center gap-1 border border-secondary rounded-pill px-3 py-1" style={{fontSize:'.8rem'}}>
              <i className="bi bi-twitter-x"/> X (Twitter)
            </a>
          </div>
          <p className="text-white-50 small mt-3 mb-0">
            <i className="bi bi-envelope me-1"/>
            <a href="mailto:ai.gastrocare.official@gmail.com" className="gc-footer">ai.gastrocare.official@gmail.com</a>
          </p>
        </div>
      </div>
      <hr style={{borderColor:'rgba(255,255,255,.1)'}}/>
      <div className="d-flex flex-wrap justify-content-between align-items-center">
        <p className="text-white-50 small mb-0">© 2026 GastroCare. All rights reserved.</p>
        <p className="text-white-50 small mb-0">Not a substitute for professional medical advice.</p>
      </div>
    </div>
  </footer>
);
export default Footer;
