'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthorsRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.push('/lawfirms/signin');
    }, [router]);

    return null;
}
