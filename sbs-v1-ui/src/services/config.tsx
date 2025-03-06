export const PYTHON_SERVER = 'http://127.0.0.1:8000'; // deprecated
export const RUST_SERVER = process.env.ENV !== 'prod' ? 
    'http://localhost:8000' : process.env.REACT_APP_PROD_PROXY_ADDRESS;