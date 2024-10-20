'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addCreditPoints } from '@/lib/actions/user.actions';
import { useToast } from '@/components/ui/use-toast';

const ReferralPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const router = useRouter();
    const {toast} = useToast();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleAddReferral = async () => {
        try {
            const res = await addCreditPoints(email);
            toast({
                title: 'Referral Added',
                description: 'Referral has been added successfully',
            });
            router.push('/');
        } catch (error) {
            console.log(error);
            return;
        }
    };

    const handleSkipReferral = () => {
        router.push('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Referral Page</h1>
            <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter referral email"
                className="mb-4 p-2 border border-gray-300 rounded"
            />
            <div className="flex space-x-4">
                <button onClick={handleAddReferral} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Referral</button>
                <button onClick={handleSkipReferral} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Skip Referral</button>
            </div>
        </div>
    );
};

export default ReferralPage;
