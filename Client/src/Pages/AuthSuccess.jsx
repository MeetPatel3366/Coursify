import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../Redux/Slices/AuthSlice";
import { useDispatch } from "react-redux";

const AuthSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // In cookie-based flow, there is no `token` in query params
        // The backend has already set the secure HTTP-only cookie

        // Fetch the user data (this will include the cookie automatically)
        dispatch(getUserData()).then((res) => {
            if (res.payload?.success) {
                navigate("/"); // redirect to home
            } else {
                navigate("/login");
            }
        });
    }, [navigate, dispatch]);

    return <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-semibold text-gray-700">
            Signing you in...
        </p>
    </div>

};

export default AuthSuccess;
