import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { verifyEmail } from '../Redux/Slices/AuthSlice';

const EmailVerify = () => {

  const { token } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const verificationEmail = async () => {
    const response = await dispatch(verifyEmail({ token }))
    console.log('response ', response);

    if (response?.payload?.success) {
      navigate('/login');
    }
    else {
      navigate('/signup')
    }
  }

  useEffect(() => {
    verificationEmail();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <p className="text-lg font-semibold text-gray-700">
        Verifying your email...
      </p>
    </div>
  )
}

export default EmailVerify
