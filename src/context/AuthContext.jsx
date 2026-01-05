/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('bookverse_user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error('Erro ao ler user do localStorage:', error);
            return null;
        }
    });

    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    const login = async (username, password) => {
        try {
            setLoading(true);

            if (username === 'admin' && password === 'admin123') {
                const userData = {
                    username,
                    role: 'admin',
                    token: 'fake-jwt-token'
                };
                setUser(userData);
                localStorage.setItem('bookverse_user', JSON.stringify(userData));
                return { success: true, user: userData };
            }

            return {
                success: false,
                error: 'Credenciais inválidas. Use admin/admin123'
            };
        } catch (error) {
            console.error('Erro no login:', error);
            return {
                success: false,
                error: `Erro na conexão: ${error.message || 'Servidor não disponível'}`
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('bookverse_user');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            loading,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};