import { CodeResponse, TokenResponse, useGoogleLogin } from '@react-oauth/google';
import { Button } from '@mui/material';
import googleIcon from '../../../assets/images/google-logo.png';
import gitHubIcon from '../../../assets/images/github-icon.png';
import { loginButtonStyleSx } from '../../../models/form-styles/styles';
import { useEffect, useState } from 'react';
import { getGitHubAuth, getGoogleAuth, getLoginCredentials } from '../../../services/common/services';
import { GetLoginCredentialsResponse } from '../../../models/services/get-login-credentials-response';
import { AxiosResponse } from 'axios';
import { setUserInfo } from '../../../store/slices/user-info-slice';
import { LoginResult } from '../../../models/services/login-result';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { Routes } from '../../../routes';
import sbs_logo from '../../../assets/sbs-branding/sandbox_v3_1.png';
import AlertMessage from '../../common/alert/alert-message';
import './login.scss';

const Login: React.FC<{}> = ({ }) => {
    /* consts ***********************************************************************/
    const [gitHubCreds, setGitHubCreds] = useState('');
    const [googleCreds, setGoogleCreds] = useState('');
    const githubRedirectUrlLocal = 'http://localhost:3000/sbs-v1/login';
    const scopes = ["user", "user:email"]
    const [alertMessage, setAlertMessage] = useState<React.ReactNode>(null);
    /********************************************************************************/

    /* Store ************************************************************************/
    const dispatch = useDispatch<AppDispatch>();
    /********************************************************************************/

    /* Effects **********************************************************************/
    useEffect(() => {
        getLoginCredentials()
            .then((resp: AxiosResponse<GetLoginCredentialsResponse>) => {
                setGitHubCreds(resp.data.githubClientId);
                setGoogleCreds(resp.data.googleClientId);
            })
            .catch((e: any) => {
                console.log('Unable to retrieve credentials! ', e);
            });

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
            getGitHubAuth({ code: code })
                .then((resp: AxiosResponse<LoginResult>) => {
                    if (!resp.data.isError && resp.data.userInfo) {
                        dispatch(setUserInfo(resp.data.userInfo));
                        setAlertMessage(null);
                        window.location.href = `${Routes.root}${Routes.about}`;
                    } else {
                        setAlertMessage(<AlertMessage message={resp.data.errorMessage || 'Unable to login with GitHub!'} type="error" />);
                    }
                })
                .catch((e: any) => {
                    console.log('Unable to retrieve credentials! ', e);
                });
        }
    }, []);
    /********************************************************************************/

    /* GitHub ***********************************************************************/
    const loginWithGithub = () => {
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${gitHubCreds}&redirect_uri=${githubRedirectUrlLocal}&scope=${scopes.join(',')}`;
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
    /********************************************************************************/

    /* Google ***********************************************************************/
    const loginWithGoogle = useGoogleLogin({
        onSuccess: (response: CodeResponse) => {
            getGoogleAuth({ code: response.code })
                .then((resp: AxiosResponse<LoginResult>) => {
                    if (!resp.data.isError && resp.data.userInfo) {
                        dispatch(setUserInfo(resp.data.userInfo));
                        setAlertMessage(null);
                        window.location.href = `${Routes.root}${Routes.about}`;
                    } else {
                        setAlertMessage(<AlertMessage message={resp.data.errorMessage || 'Unable to login with Google!'} type="error" />);
                    }
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
    /********************************************************************************/

    return (
        <div className='login-page-container'>
            <div className='login-content-container'>
                {alertMessage}
                <div className='login-content-header'>
                    <div className='logo-wrapper'>
                        <img src={sbs_logo} alt="Sports Betting Sandbox" />
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