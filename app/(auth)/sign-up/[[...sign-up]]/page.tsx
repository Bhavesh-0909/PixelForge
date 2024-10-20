import { SignUp } from '@clerk/nextjs'
import React from 'react'

const SignUpPage = () => {
  return <SignUp 
    fallbackRedirectUrl="/referral"
    signInFallbackRedirectUrl="/sign-in"
  />;
};

export default SignUpPage