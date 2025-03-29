import Head from 'next/head';
import AuthForm from '../../components/Auth/AuthForm';

export default function Signup() {
    return (
        <>
            <Head>
                <title>Sign Up - Movie Streaming</title>
            </Head>
            <AuthForm />
        </>
    );
}
