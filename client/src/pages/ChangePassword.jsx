import { useForm } from 'react-hook-form';
import { api } from '../api';

export default function ChangePassword() {
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = async (form) => {
    await api.put('/auth/password', form);
    alert('Password updated');
    reset();
  };
  return (
    <div className="container">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="card">
        <input placeholder="Old Password" type="password" {...register('oldPassword')} />
        <input placeholder="New Password" type="password" {...register('password')} />
        <button>Update</button>
      </form>
    </div>
  );
}
