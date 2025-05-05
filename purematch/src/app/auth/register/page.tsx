import { redirect } from "next/navigation";
import Link from "next/link";
import RegisterForm from "@/components/auth/register-form";
import { createClient } from "@/lib/supabase/server";

export default async function RegisterPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Если пользователь уже вошел, перенаправляем на главную страницу
  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Уже есть аккаунт?{" "}
            <Link 
              href="/auth/login" 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
