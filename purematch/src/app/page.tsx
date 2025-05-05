import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Найдите свою настоящую любовь с PureMatch
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Мы помогаем людям найти настоящую любовь через проверенные профили и умный алгоритм подбора пар.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                {session ? (
                  <Link
                    href="/matches"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Найти пару
                  </Link>
                ) : (
                  <Link
                    href="/auth/register"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Зарегистрироваться
                  </Link>
                )}
                <Link
                  href="/about"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Узнать больше
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-20 blur-3xl"></div>
                <div className="relative flex h-full w-full items-center justify-center rounded-full bg-muted p-4">
                  <svg
                    className="h-24 w-24 text-foreground"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Почему выбирают PureMatch</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Наш сервис предлагает уникальные возможности для поиска настоящей любви
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4 text-center">
              <div className="rounded-full bg-primary p-2 text-primary-foreground">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Проверенные профили</h3>
              <p className="text-muted-foreground">
                Все пользователи проходят верификацию через видео, что гарантирует отсутствие фейковых аккаунтов.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4 text-center">
              <div className="rounded-full bg-primary p-2 text-primary-foreground">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19.5 12.572 12 17l-7.5-4.428V5.5L12 1l7.5 4.5v7.072Z" />
                  <path d="M12 17v6" />
                  <path d="m4.5 7.5 7.5 4.5" />
                  <path d="m19.5 7.5-7.5 4.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Умный алгоритм</h3>
              <p className="text-muted-foreground">
                Наш алгоритм подбирает пары на основе общих интересов, ценностей и целей в отношениях.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4 text-center">
              <div className="rounded-full bg-primary p-2 text-primary-foreground">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <path d="M9 9h.01" />
                  <path d="M15 9h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Безопасное общение</h3>
              <p className="text-muted-foreground">
                Встроенный чат с возможностью видеозвонков позволяет безопасно общаться внутри платформы.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Готовы найти свою любовь?
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Присоединяйтесь к тысячам пользователей, которые уже нашли свою вторую половинку с PureMatch.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              {session ? (
                <Link
                  href="/matches"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Найти пару
                </Link>
              ) : (
                <Link
                  href="/auth/register"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Начать бесплатно
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t bg-background py-6 md:py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
            <p className="text-center text-sm text-muted-foreground md:text-left">
              © 2023 PureMatch. Все права защищены.
            </p>
            <nav className="flex gap-4 sm:gap-6">
              <Link className="text-sm font-medium hover:underline" href="#">
                Условия использования
              </Link>
              <Link className="text-sm font-medium hover:underline" href="#">
                Политика конфиденциальности
              </Link>
              <Link className="text-sm font-medium hover:underline" href="#">
                Контакты
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
