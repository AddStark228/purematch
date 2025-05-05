import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Проверьте вашу почту</h2>
        
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Мы отправили вам письмо со ссылкой для подтверждения вашего email-адреса. 
          Пожалуйста, проверьте вашу почту и перейдите по ссылке для завершения регистрации.
        </p>
        
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Если вы не получили письмо, проверьте папку "Спам" или попробуйте зарегистрироваться снова.
        </p>
        
        <div className="flex justify-center">
          <Link 
            href="/auth/login" 
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Вернуться на страницу входа
          </Link>
        </div>
      </div>
    </div>
  );
}
