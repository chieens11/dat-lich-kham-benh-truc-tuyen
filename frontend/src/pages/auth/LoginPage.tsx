import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';

const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();
    const [form, setForm] = useState({ TenDangNhap: '', MatKhau: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await authApi.login(form);

            if (res.data.success) {
                const userData = res.data.user;
                setAuth(userData, res.data.token);
                console.log("User Data:", userData);
                // === REDIRECT THEO VAI TRÒ ===
                const vaiTro = userData.VaiTro || userData.vaiTro;
                console.log("VaiTro nhận được:", vaiTro);
                if (vaiTro === 'Admin' || vaiTro === 1) {
                    navigate('/admin');
                }

                else {

                    navigate('/');
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại! Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                {/* Back link */}
                <a href="/" style={styles.backLink}>
                    <span style={styles.backArrow}>←</span> Quay lại Trang chủ
                </a>

                {/* Heading */}
                <h1 style={styles.heading}>Chào mừng quay trở lại</h1>
                <p style={styles.subheading}>
                    Đăng nhập vào tài khoản của bạn!
                </p>

                {/* Error */}
                {error && (
                    <div style={styles.errorBox}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Email / Username */}
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Tên đăng nhập</label>
                        <input
                            type="text"
                            placeholder="Nhập email hoặc tên đăng nhập của bạn"
                            style={styles.input}
                            value={form.TenDangNhap}
                            onChange={(e) => setForm({ ...form, TenDangNhap: e.target.value })}
                            required
                            onFocus={e => (e.target.style.borderColor = '#2563eb')}
                            onBlur={e => (e.target.style.borderColor = '#d1d5db')}
                        />
                    </div>

                    {/* Password */}
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Mật khẩu</label>
                        <div style={styles.passwordWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Nhập mật khẩu của bạn"
                                style={{ ...styles.input, marginBottom: 0, paddingRight: '2.5rem' }}
                                value={form.MatKhau}
                                onChange={(e) => setForm({ ...form, MatKhau: e.target.value })}
                                required
                                onFocus={e => (e.target.style.borderColor = '#2563eb')}
                                onBlur={e => (e.target.style.borderColor = '#d1d5db')}
                            />
                            <button
                                type="button"
                                style={styles.eyeBtn}
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? '🙈' : '👁'}
                            </button>
                        </div>
                    </div>

                    {/* Remember & Forgot */}
                    <div style={styles.rememberRow}>
                        <label style={styles.rememberLabel}>
                            <input type="checkbox" style={{ marginRight: 6 }} />
                            Ghi nhớ tôi
                        </label>
                        <a href="/forgot-password" style={styles.forgotLink}>Quên mật khẩu?</a>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.submitBtn,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                        onMouseEnter={e => {
                            if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1d4ed8';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2563eb';
                        }}
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                {/* Footer links */}
                <p style={styles.footerText}>
                    Mới sử dụng?{' '}
                    <a href="/register" style={styles.footerLink}>Tạo tài khoản</a>
                </p>

                <div style={styles.bottomLinks}>
                    <a href="/privacy" style={styles.bottomLink}>Tiếu chuẩn bảo mật</a>
                    <a href="/terms" style={styles.bottomLink}>Chính sách điều khoản</a>
                    <a href="/faq" style={styles.bottomLink}>Trung tâm trợ giúp</a>
                </div>
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#eff6ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Segoe UI', sans-serif",
        padding: '1rem',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: '2rem 2rem 1.5rem',
        width: '100%',
        maxWidth: '400px',
    },
    backLink: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.8rem',
        color: '#6b7280',
        textDecoration: 'none',
        marginBottom: '1.25rem',
    },
    backArrow: {
        fontSize: '0.9rem',
    },
    heading: {
        fontSize: '1.4rem',
        fontWeight: 700,
        color: '#111827',
        margin: '0 0 0.25rem 0',
    },
    subheading: {
        fontSize: '0.82rem',
        color: '#6b7280',
        margin: '0 0 1.5rem 0',
        lineHeight: 1.5,
    },
    errorBox: {
        backgroundColor: '#fee2e2',
        color: '#b91c1c',
        padding: '0.625rem 0.875rem',
        borderRadius: '8px',
        fontSize: '0.82rem',
        marginBottom: '1rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
    },
    fieldGroup: {
        marginBottom: '1rem',
    },
    label: {
        display: 'block',
        fontSize: '0.82rem',
        fontWeight: 500,
        color: '#374151',
        marginBottom: '0.375rem',
    },
    input: {
        width: '100%',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '0.6rem 0.875rem',
        fontSize: '0.875rem',
        color: '#111827',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.15s',
        marginBottom: 0,
    },
    passwordWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    eyeBtn: {
        position: 'absolute',
        right: '0.75rem',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        padding: 0,
        lineHeight: 1,
        color: '#9ca3af',
    },
    rememberRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.25rem',
        marginTop: '0.25rem',
    },
    rememberLabel: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '0.82rem',
        color: '#374151',
        cursor: 'pointer',
    },
    forgotLink: {
        fontSize: '0.82rem',
        color: '#2563eb',
        textDecoration: 'none',
    },
    submitBtn: {
        width: '100%',
        backgroundColor: '#2563eb',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        padding: '0.7rem',
        fontSize: '0.9rem',
        fontWeight: 600,
        transition: 'background-color 0.15s',
        marginBottom: '1rem',
    },
    footerText: {
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#6b7280',
        margin: '0 0 1rem 0',
    },
    footerLink: {
        color: '#2563eb',
        textDecoration: 'none',
        fontWeight: 500,
    },
    bottomLinks: {
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
        borderTop: '1px solid #f3f4f6',
        paddingTop: '1rem',
    },
    bottomLink: {
        fontSize: '0.75rem',
        color: '#9ca3af',
        textDecoration: 'none',
    },
};

export default LoginPage;