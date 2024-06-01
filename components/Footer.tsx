import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-light py-3 text-center text-center text-white mx-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <span className="copyright-text">Copyright &copy; 2024 Laurie Crean</span>
          </div>
          <div className="col-md-4">
            <ul className="list-inline social-buttons">
              <li className="list-inline-item">
                <a href="#!" target="_blank"><i className="fab fa-twitter"></i></a>
              </li>
              <li className="list-inline-item">
                <a href="#!" target="_blank"><i className="fab fa-facebook-f"></i></a>
              </li>
              <li className="list-inline-item">
                <a href="#!" target="_blank"><i className="fab fa-instagram"></i></a>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <ul className="list-inline quick-links">
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
