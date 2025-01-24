import { CodeResponse, TokenResponse, useGoogleLogin } from '@react-oauth/google';
import { Button } from '@mui/material';
import googleIcon from '../../../assets/images/google-logo.png';
import gitHubIcon from '../../../assets/images/github-icon.png';
import { loginButtonStyleSx } from '../../../models/form-styles/styles';
import './login.scss'
import { useEffect, useState } from 'react';
import { getGoogleAuth, getLoginCredentials } from '../../../services/common/services';
import { GetLoginCredentialsResponse } from '../../../models/services/get-login-credentials-response';
import { AxiosResponse } from 'axios';

const Login: React.FC<{}> = ({}) => {

    const [gitHubCreds, setGitHubCreds] = useState('');
    const [googleCreds, setGoogleCreds] = useState('');
    const redirectUrlLocal = 'http://localhost:3000/sbs-v1/about';

    useEffect(() => {
        getLoginCredentials()
            .then((resp: AxiosResponse<GetLoginCredentialsResponse>) => {
                setGitHubCreds(resp.data.githubClientId);
                setGoogleCreds(resp.data.googleClientId);
            })
            .catch((e: any) => {
                console.log('Unable to retrieve credentials! ', e);
            });
    }, []);

    /* GitHub */ 
    const loginWithGithub = () => {
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${gitHubCreds}&redirect_uri=${redirectUrlLocal}`;
    };

    const gitHubLoginloginComponent = () => {
        return (
            <Button 
                sx={loginButtonStyleSx} 
                onClick={() => loginWithGithub()} 
                startIcon={<img src={gitHubIcon} className='logo-img'></img>}
            >
                Login with GitHub
            </Button>   
        );
    }; 

    /* Google */
    const loginWithGoogle = useGoogleLogin({
        onSuccess: (response: CodeResponse) => {
            console.log(response);
            console.log(response.code);
            getGoogleAuth({ code: response.code })
                .then((resp: AxiosResponse) => {
                    console.log(resp);
                });
        },
        flow: 'auth-code'
    });

    const googleLoginComponent = () => {
        return (
            <Button sx={loginButtonStyleSx} 
                onClick={loginWithGoogle as any} 
                startIcon={<img src={googleIcon} 
                className='logo-img'></img>}
            >
                Login with Google
            </Button>
        );
    };

    return (
        <div className='login-page-container'>
            <div className='login-content-container'>
                <div className='login-content-header'>
                    <div className='header-wrapper'>
                        Login
                    </div>
                </div>
                <div className='login-options'>
                    <div className='login-wrapper'>
                        {googleLoginComponent()}
                    </div>
                    <div className='login-wrapper'>
                        {gitHubLoginloginComponent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;