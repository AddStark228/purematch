import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">О проекте PureMatch</h1>
      
      <div className="max-w-3xl mx-auto space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Наша миссия</h2>
          <p className="text-muted-foreground">
            PureMatch создан с целью помочь людям найти настоящую любовь через честные и проверенные профили. 
            Мы верим, что каждый человек заслуживает искренних отношений, основанных на взаимном уважении и общих ценностях.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Как работает PureMatch</h2>
          <p className="text-muted-foreground mb-4">
            Наш сервис использует современные технологии и продуманный алгоритм для подбора пар, которые действительно подходят друг другу:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Верификация через видео для подтверждения личности</li>
            <li>Умный алгоритм подбора на основе общих интересов и ценностей</li>
            <li>Безопасное общение внутри платформы</li>
            <li>Система рейтинга профилей для повышения качества взаимодействия</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Наша команда</h2>
          <p className="text-muted-foreground">
            PureMatch создан командой профессионалов, объединенных общей целью - сделать онлайн-знакомства 
            безопасными, честными и эффективными. Наша команда включает специалистов в области разработки, 
            дизайна, психологии отношений и безопасности данных.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Наши ценности</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Честность</h3>
              <p className="text-sm text-muted-foreground">
                Мы поощряем создание честных профилей и настоящих фотографий
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Безопасность</h3>
              <p className="text-sm text-muted-foreground">
                Защита личных данных и безопасное общение - наш приоритет
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Уважение</h3>
              <p className="text-sm text-muted-foreground">
                Мы создаем среду, где все пользователи относятся друг к другу с уважением
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Качество</h3>
              <p className="text-sm text-muted-foreground">
                Мы стремимся предоставить лучший опыт онлайн-знакомств
              </p>
            </div>
          </div>
        </section>
        
        <div className="flex justify-center mt-8">
          <Link
            href="/auth/register"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Присоединиться к PureMatch
          </Link>
        </div>
      </div>
    </div>
  );
}
