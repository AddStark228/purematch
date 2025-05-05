import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import UserCard from "@/components/matches/user-card";
import UserFilters from "@/components/matches/user-filters";

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createClient();
  
  // Проверяем, авторизован ли пользователь
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect("/auth/login");
  }
  
  // Получаем данные профиля пользователя
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();
  
  // Получаем параметры фильтрации
  const gender = searchParams.gender as string || currentProfile?.looking_for || "both";
  const minAge = parseInt(searchParams.minAge as string || "18");
  const maxAge = parseInt(searchParams.maxAge as string || "100");
  const location = searchParams.location as string || "";
  const interests = searchParams.interests as string || "";
  
  // Формируем запрос для получения профилей
  let query = supabase
    .from("profiles")
    .select(`
      *,
      photos!inner(*)
    `)
    .neq("id", session.user.id);
  
  // Применяем фильтры
  if (gender && gender !== "both") {
    query = query.eq("gender", gender);
  }
  
  if (location) {
    query = query.ilike("location", `%${location}%`);
  }
  
  if (interests) {
    const interestsArray = interests.split(",").map(i => i.trim());
    query = query.overlaps("interests", interestsArray);
  }
  
  // Получаем профили
  const { data: profiles, error } = await query
    .eq("photos.is_primary", true)
    .order("created_at", { ascending: false });
  
  // Получаем лайки текущего пользователя
  const { data: userLikes } = await supabase
    .from("matches")
    .select("*")
    .or(`user1_id.eq.${session.user.id},user2_id.eq.${session.user.id}`);
  
  // Формируем карту лайков
  const likesMap = new Map();
  userLikes?.forEach(match => {
    if (match.user1_id === session.user.id) {
      likesMap.set(match.user2_id, { matchId: match.id, liked: match.user1_likes });
    } else {
      likesMap.set(match.user1_id, { matchId: match.id, liked: match.user2_likes });
    }
  });
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Найти пару</h1>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <UserFilters
            initialGender={gender}
            initialMinAge={minAge}
            initialMaxAge={maxAge}
            initialLocation={location}
            initialInterests={interests}
          />
        </div>
        
        <div className="lg:col-span-3">
          {error ? (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md">
              Произошла ошибка при загрузке профилей: {error.message}
            </div>
          ) : profiles && profiles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile) => (
                <UserCard
                  key={profile.id}
                  profile={profile}
                  currentUserId={session.user.id}
                  likeStatus={likesMap.get(profile.id)}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">Пользователи не найдены</h3>
              <p className="text-muted-foreground">
                Попробуйте изменить параметры фильтрации или вернитесь позже.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
