import Head from 'next/head';
import AuthForm from '../../components/Auth/AuthForm';

export default function Login() {
    return (
        <>
            <Head>
                <title>Login - Movie Streaming</title>
            </Head>
            <AuthForm />
        </>
    );
}