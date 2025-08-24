import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (form) => {
    await login(form.email, form.password);
    nav('/');
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="card">
        <input placeholder="Email" {...register('email')} />
        <input placeholder="Password" type="password" {...register('password')} />
        <button>Login</button>
      </form>
    </div>
  );
}
