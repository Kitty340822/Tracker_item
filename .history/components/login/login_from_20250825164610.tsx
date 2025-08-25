'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            // เรียก NextAuth CredentialsProvider
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false, // false เพื่อให้เราเช็คผลก่อน redirect
            });

            console.log('SignIn result:', result);

            if (result?.error) {
                setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
            } else if (result?.ok) {
                // login สำเร็จ → redirect ไปหน้า /admin/claim
                router.push('/admin/claim');
                router.refresh(); // อัปเดต session
            } else {
                setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-blue-500">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    เข้าสู่ระบบ
                </h1>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                        อีเมล:
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="กรอกอีเมลของคุณ"
                        required
                        disabled={loading}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                        รหัสผ่าน:
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="กรอกรหัสผ่านของคุณ"
                        required
                        disabled={loading}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                </div>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            กำลังเข้าสู่ระบบ...
                        </>
                    ) : (
                        'เข้าสู่ระบบ'
                    )}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
