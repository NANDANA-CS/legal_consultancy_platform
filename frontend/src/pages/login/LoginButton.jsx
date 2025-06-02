// import { useAuth0 } from "@auth0/auth0-react";
// import React, { useEffect } from "react";
// import axios from "axios";
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// const LoginButton = () => {
//   const { loginWithRedirect, user, isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
//   const navigate = useNavigate()
//   return (
//     <button
//       onClick={() =>
//         loginWithRedirect({
//           scope: 'read:current_user openid profile email',
//           audience: "https://dev-dwidrngxdwz2oh0g.us.auth0.com/api/v2/",
//         })
//       }
//       className="flex items-center justify-center gap-2 w-[700px] h-10 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200"
//     >
//       <img
//         src="https://www.svgrepo.com/show/475656/google-color.svg"
//         alt="Google logo"
//         className="w-5 h-5"
//       />
//       <span className="text-sm font-medium">Continue with Google</span>
//     </button>
//   );
// };

// export default LoginButton;