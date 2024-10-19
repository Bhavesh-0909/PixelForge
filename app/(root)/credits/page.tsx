'use client';

import Header from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { updateCredits } from "@/lib/actions/user.actions";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Credits = () => {
  const { user } = useUser();
  console.log(user);
  
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
        handler: async (response) => {
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
    <>
      <Header
        title="Buy Credits"
        subtitle="Choose a credit package that suits your needs!"
      />

      <Button onClick={() => handlePayment(200, "bhavesh")}>Pay</Button>
    </>
  );
};

export default Credits;
