// definisi tipe props untuk komponen
interface UserFormProps {
  user: {
    name?: string;
    email?: string;
    role?: string;
  };
  onSubmit: (form: { name: string; email: string; role: string }) => void;
}