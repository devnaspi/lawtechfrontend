'use client'

import React, { useEffect, useState } from 'react';
import Home from '../page';

const Page = ({ params }) => {
    const slug = params.slug
    useEffect(() => {
        console.log('slug is ', slug)
    })

    if (!slug || slug[0] === 'login') {
        return (
            <Home />
        );
    }
    else if (!slug || slug[0] === 'sign-up') {
        return (
            <Home />
        );
    }

    return (
        <Home />
    );
};

export default Page;
