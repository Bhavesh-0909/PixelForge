'use client';

import React from 'react';
import { useUser } from "@clerk/nextjs";
import { updateCredits } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Credits: React.FC = () => {
  const { user } = useUser();

  // Load the Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (amount: number, receipt: string) => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert('Failed to load payment gateway. Please try again.');
      return;
    }

    try {
      const orderResponse = await fetch('http://localhost:8000/api/v1/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount, // Amount in INR
          currency: 'INR',
          email: receipt,
        }),
      });

      const order = await orderResponse.json();
      if (!order || !order.id) {
        alert('Failed to create order. Please try again.');
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Public Key from Razorpay Dashboard
        amount: order.amount,
        currency: order.currency,
        name: 'Pixel Forge',
        description: 'Test Transaction',
        image: '/logo.jpg', // Replace with your logo if available
        order_id: order.id,
        handler: async (response: { razorpay_payment_id: any; }) => {
          // Handle payment success
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
          
          // Update user credits
          await updateCredits(user?.id as string, amount)
          .then((updatedUser) => {
            console.log('User credits updated successfully!', updatedUser);
          }).catch((error) => {
            console.error('Failed to update user credits!', error);
          });
          
        },
        prefill: {
          name: user?.fullName, // Replace with the customer's name
          email: user?.primaryEmailAddress?.emailAddress, // Replace with the customer's email
          contact: '9999999999',
        },
        theme: {
          color: '#F37254', // Customize the checkout window theme color
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open(); // Open the Razorpay checkout window

    } catch (error) {
      alert('Error in payment: ' + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Select Your Plan</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* Free Plan Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 transition transform hover:scale-105">
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-700">Free Plan</h2>
            <h3 className="text-3xl font-semibold text-gray-800">₹0</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-gray-600">20 free credits</li>
              <li className="text-gray-600">Unlimited text to image conversion</li>
            </ul>
            <Button className="mt-6 w-full bg-blue-600 text-white hover:bg-blue-700 transition duration-200">
              Get Free Plan
            </Button>
          </div>
        </div>

        {/* Paid Plan Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 transition transform hover:scale-105">
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-700">Pro Plan</h2>
            <h3 className="text-3xl font-semibold text-gray-800">₹200 for 20 credits</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-gray-600">Everything in Free Plan</li>
              <li className="text-gray-600">Image recolor</li>
              <li className="text-gray-600">Object remove</li>
              <li className="text-gray-600">Image enhancer</li>
              <li className="text-gray-600">Object resize</li>
            </ul>
            <Button
              className="mt-6 w-full bg-green-600 text-white hover:bg-green-700 transition duration-200"
              onClick={() => handlePayment(20000, user?.primaryEmailAddress?.emailAddress || '')}
            >
              Get Pro Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credits;