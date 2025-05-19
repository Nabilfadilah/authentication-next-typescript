// definisi tipe props untuk komponen
interface UserFormProps {
  user: {
    name?: string;
    email?: string;
    role?: string;
  };
  onSubmit: (form: { name: string; email: string; role: string }) => void;
}

// form create/edit biodata
interface BiodataForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  photo: File | null;
}