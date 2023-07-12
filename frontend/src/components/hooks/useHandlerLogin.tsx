import { useState } from 'react'

const useHandlerLogin = (code: string, btnText: string, authState: boolean) => 
{
    const   client_id_42 = "u-s4t2ud-d47fc78f47a2cc31da6c325194c23e4780ec811e2f6ae9d2e992346ac0ef851c";
    const   url_auth_42 = "https://api.intra.42.fr/oauth/authorize?client_id=" + client_id_42 + "&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code";
    

    if (!authState && btnText === "Log in" && code === "")
    {
        window.location.href =  url_auth_42;
    }
    else if (authState && btnText == "Log out")
    {
        // contact backend to remove user login session
        // setAuthState to false
        // setBtnText to "Log in"
    }

    return { code, btnText, authState };
}
 
export default useHandlerLogin;