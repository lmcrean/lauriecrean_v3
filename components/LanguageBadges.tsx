"use client"

import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Image from 'react-bootstrap/Image';
import '../styles/Colors/Badges.scss'; // Import Badges.scss after globals.scss

// HTML Badge
export const HtmlBadge = () => (
    <Badge pill className='d-flex align-items-center html-badge'>
        <Image src="/icons_language/html5.svg" width="24" height="24" alt="HTML" className="me-2" /> HTML
    </Badge>
);

// CSS Badge
export const CssBadge = () => (
    <Badge pill className='d-flex align-items-center css-badge'>
        <Image src="/icons_language/css3.svg" width="24" height="24" alt="CSS" className="me-2" /> CSS
    </Badge>
);

//Bootstrap Badge
export const BootstrapBadge = () => (
    <Badge pill className='d-flex align-items-center bootstrap-badge'>
        <Image src="/icons_language/bootstrap.svg" width="24" height="24" alt="Bootstrap" className="me-2" /> Bootstrap
    </Badge>
);

// Cloudinary Badge
export const CloudinaryBadge = () => (
    <Badge pill className="d-flex align-items-center cloudinary-badge">
        <Image src="/icons_language/cloudinary.svg" width="24" height="24" alt="Cloudinary" className="me-2" /> Cloudinary
    </Badge>
);

// Django Badge
export const DjangoBadge = () => (
    <Badge pill className="d-flex align-items-center django-badge">
        <Image src="/icons_language/django.svg" width="24" height="24" alt="Django" className="me-2"/>
        <span>Django</span> 
    </Badge>
);

export const DjangoRestBadge = () => (
    <Badge pill className="d-flex align-items-center django-badge">
        <Image src="/icons_language/django.svg" width="24" height="24" alt="Django" className="me-2"/>
        <span>Django Rest Framework</span> 
    </Badge>
);

// Framer Motion Badge
export const FramerBadge = () => (
    <Badge pill className='d-flex align-items-center framer-badge'>
        <Image src="/icons_language/framer.svg" width="24" height="24" alt="Framer Motion" className="me-2" /> Framer Motion
    </Badge>
);

// JavaScript Badge
export const JavascriptBadge = () => (
    <Badge pill className='d-flex align-items-center javascript-badge text-black'>
        <Image src="/icons_language/javascript.svg" width="24" height="24" alt="JavaScript" className="me-2" /> JavaScript
    </Badge>
);

// Github Pages Badge
export const GithubPagesBadge = () => (
    <Badge pill className='d-flex align-items-center github-pages-badge'>
        <Image src="/icons_language/github.svg" width="24" height="24" alt="Github Pages" className="me-2 invert" /> Github Pages
    </Badge>
);


// Heroku Badge
export const HerokuBadge = () => (
    <Badge pill className='d-flex align-items-center heroku-badge'>
        <Image src="/icons_language/heroku.svg" width="24" height="24" alt="Heroku" className="me-2" /> Heroku
    </Badge>
);

// JQuery Badge
export const JQueryBadge = () => (
    <Badge pill className='d-flex align-items-center jquery-badge '>
        <Image src="/icons_language/jquery.svg" width="24" height="24" alt="JQuery" className="me-2" /> JQuery
    </Badge>
);

// Next.js Badge
export const NextdotjsBadge = () => (
    <Badge pill className='d-flex align-items-center nextjs-badge'>
        <Image src="/icons_language/nextdotjs.svg" width="24" height="24" alt="Next.js" className="me-2 invert" /> Next.js
    </Badge>
);

// Node.js Badge
export const NodejsBadge = () => (
    <Badge pill className='d-flex align-items-center nodejs-badge'>
        <Image src="/icons_language/nodejs.svg" width="24" height="24" alt="Node.js" className="me-2" /> Node.js
    </Badge>
);

// PostgreSQL Badge
export const PostgresSQLBadge = () => (
    <Badge pill className='d-flex align-items-center postgresql-badge'>
        <Image src="/icons_language/postgresql.svg" width="24" height="24" alt="PostgreSQL" className="me-2" /> PostgreSQL
    </Badge>
);

// Python Badge
export const PythonBadge = () => (
    <Badge pill className='d-flex align-items-center python-badge'>
        <Image src="/icons_language/python.svg" width="24" height="24" alt="Python" className="me-2" /> Python
    </Badge>
);

// React Badge
export const ReactBadge = () => (
    <Badge pill className='d-flex align-items-center react-badge text-black'>
        <Image src="/icons_language/react.svg" width="24" height="24" alt="React" className="me-2" /> React
    </Badge>
);

// React Bootstrap Badge
export const ReactBootstrapBadge = () => (
    <Badge pill className='d-flex align-items-center reactbootstrap-badge'>
        <Image src="/icons_language/reactbootstrap.svg" width="24" height="24" alt="React Bootstrap" className="me-2" /> React Bootstrap
    </Badge>
);

// Vercel Badge
export const VercelBadge = () => (
    <Badge pill className='d-flex align-items-center vercel-badge'>
        <Image src="/icons_language/vercel.svg" width="24" height="24" alt="Vercel" className="me-2 invert" /> Vercel
    </Badge>
);