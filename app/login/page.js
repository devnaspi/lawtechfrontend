export default function Login() {
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, errors } = useForm();

    const passwordValidation = {
        length: true,
        uppercase: true,
        lowercase: true,
        numbers: true,
        special_chars: true,
        strong: true,
    };

    return (
        <main className={styles.main}>
            <h1> LAWTECH </h1>
        </main>
    );
}