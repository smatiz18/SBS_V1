import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@mui/material';
import googleIcon from '../../../assets/images/google-logo.png';
import gitHubIcon from '../../../assets/images/github-icon.png';
import { loginButtonStyleSx } from '../../../models/form-styles/styles';
import './login.scss'
import { useEffect } from 'react';
import { getLoginCredentials } from '../../../services/common/services';

const Login: React.FC<{}> = ({}) => {

    useEffect(() => {
        getLoginCredentials()
            .then((resp: any) => {
                console.log(resp.data);
            });
    }, []);
    
    const gitHubLoginloginComponent = () => {
        return (
            <Button 
                sx={loginButtonStyleSx} 
                onClick={() => {}} 
                startIcon={<img src={gitHubIcon} className='logo-img'></img>}
            >
                Login with GitHub
            </Button>   
        );
    }; 

    const loginWithGoogle = useGoogleLogin({
        onSuccess: tokenResponse => console.log(tokenResponse),
    });

    const googleLoginComponent = () => {
        return (
            <Button sx={loginButtonStyleSx} 
                onClick={() => loginWithGoogle()} 
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