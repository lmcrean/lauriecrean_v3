"use client"

import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Image from 'react-bootstrap/Image';

// HTML Badge
export const HtmlBadge = () => (
    <Badge pill bg="danger">
        <Image src="/icons_language/html5.svg" width="24" height="24" alt="HTML" className="me-2" /> HTML
    </Badge>
);

// CSS Badge
export const CssBadge = () => (
    <Badge pill bg="primary">
        <Image src="/icons_language/css3.svg" width="24" height="24" alt="CSS" className="me-2" /> CSS
    </Badge>
);

// Cloudinary Badge
export const CloudinaryBadge = () => (
    <Badge pill bg="light">
        <Image src="/icons_language/cloudinary.svg" width="24" height="24" alt="Cloudinary" className="me-2" /> Cloudinary
    </Badge>
);

// Django Badge
export const DjangoBadge = () => (
    <Badge pill bg="dark">
        <Image src="/icons_language/django.svg" width="24" height="24" alt="Django" className="me-2" /> Django
    </Badge>
);

// Framer Motion Badge
export const FramerBadge = () => (
    <Badge pill bg="warning">
        <Image src="/icons_language/framer.svg" width="24" height="24" alt="Framer Motion" className="me-2" /> Framer Motion
    </Badge>
);

// JavaScript Badge
export const JavascriptBadge = () => (
    <Badge pill bg="info">
        <Image src="/icons_language/javascript.svg" width="24" height="24" alt="JavaScript" className="me-2" /> JavaScript
    </Badge>
);

// Next.js Badge
export const NextdotjsBadge = () => (
    <Badge pill bg="black">
        <Image src="/icons_language/nextdotjs.svg" width="24" height="24" alt="Next.js" className="me-2" /> Next.js
    </Badge>
);

// Python Badge
export const PythonBadge = () => (
    <Badge pill bg="success">
        <Image src="/icons_language/python.svg" width="24" height="24" alt="Python" className="me-2" /> Python
    </Badge>
);

// React Badge
export const ReactBadge = () => (
    <Badge pill bg="primary">
        <Image src="/icons_language/react.svg" width="24" height="24" alt="React" className="me-2" /> React
    </Badge>
);

// React Bootstrap Badge
export const ReactBootstrapBadge = () => (
    <Badge pill bg="secondary">
        <Image src="/icons_language/reactbootstrap.svg" width="24" height="24" alt="React Bootstrap" className="me-2" /> React Bootstrap
    </Badge>
);

// Vercel Badge
export const VercelBadge = () => (
    <Badge pill bg="gray">
        <Image src="/icons_language/vercel.svg" width="24" height="24" alt="Vercel" className="me-2" /> Vercel
    </Badge>
);