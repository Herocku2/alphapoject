import HCaptcha from '@hcaptcha/react-hcaptcha';

type HCaptchaPros = {
    setToken: (e:string) => void
}

const HCaptCha: React.FC<HCaptchaPros> = ({setToken}) => {


    const onVerifyCaptcha = (token: string) => {
        setToken(token);
    };

    const onError = (err: string) => {
        console.error("Error con hCaptcha", err);
    };
    return (
        <div className='mx-auto'>
            <HCaptcha
                sitekey="e9b2033e-611f-4cfc-bcc1-f7fdf53e5b09"
                onVerify={onVerifyCaptcha}
                onError={onError}
            />
        </div>
    );
}

export default HCaptCha