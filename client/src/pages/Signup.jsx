import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
// import './Signup.css'

const schema = z.object({
  role: z.enum(['USER', 'OWNER']),
  name: z.string().min(20).max(60),
  email: z.string().email(),
  address: z.string().max(400),
  password: z.string().min(8).max(16).regex(/[A-Z]/, 'uppercase required').regex(/[!@#$%^&*(),.?":{}|<>_\-]/, 'special char required')
});

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const nav = useNavigate();

  const onSubmit = async (form) => {
    await api.post('/auth/signup', form);
    nav('/login');
  };

  return (
    <div className="container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="card">
        <select {...register('role')}>
          <option value="USER">User</option>
          <option value="OWNER">Owner</option>
        </select>
        <input placeholder="Full Name (20-60)" {...register('name')} />
        {errors.name && <small>{errors.name.message}</small>}
        <input placeholder="Email" {...register('email')} />
        {errors.email && <small>{errors.email.message}</small>}
        <input placeholder="Address (max 400)" {...register('address')} />
        {errors.address && <small>{errors.address.message}</small>}
        <input placeholder="Password" type="password" {...register('password')} />
        {errors.password && <small>{errors.password.message}</small>}
        <button>Create Account</button>
      </form>
    </div>
  );
}
