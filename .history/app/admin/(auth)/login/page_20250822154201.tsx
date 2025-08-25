"use client"
import React from "react";
import { NextPage } from 'next';
import  LoginForm  from '@/components/login/login_from';

const LoginPage: NextPage = () => {
    return (
        <div>
            <LoginForm />
        </div>
    );
};

export default LoginPage;