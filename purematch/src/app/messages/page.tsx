import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChatList from "@/components/messages/chat-list";
import ChatWindow from "@/components/messages/chat-window";

export default async function MessagesPage({
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
  
  // Получаем выбранный чат из параметров URL
  const selectedMatchId = searchParams.match as string;
  
  // Получаем все совпадения пользователя
  const { data: matches } = await supabase
    .from("matches")
    .select(`
      *,
      user1:profiles!matches_user1_id_fkey(*),
      user2:profiles!matches_user2_id_fkey(*)
    `)
    .or(`user1_id.eq.${session.user.id},user2_id.eq.${session.user.id}`)
    .eq("user1_likes", true)
    .eq("user2_likes", true)
    .order("created_at", { ascending: false });
  
  // Получаем фотографии для каждого пользователя
  const matchesWithPhotos = await Promise.all(
    (matches || []).map(async (match) => {
      const otherUserId = match.user1_id === session.user.id ? match.user2_id : match.user1_id;
      
      const { data: photos } = await supabase
        .from("photos")
        .select("*")
        .eq("user_id", otherUserId)
        .eq("is_primary", true)
        .limit(1);
      
      const otherUser = match.user1_id === session.user.id ? match.user2 : match.user1;
      
      return {
        ...match,
        otherUser: {
          ...otherUser,
          avatar: photos?.[0]?.url || null,
        },
      };
    })
  );
  
  // Если выбран чат, получаем сообщения
  let selectedMatch = null;
  let messages = [];
  
  if (selectedMatchId) {
    // Проверяем, что выбранный чат принадлежит пользователю
    selectedMatch = matchesWithPhotos.find(match => match.id === selectedMatchId);
    
    if (selectedMatch) {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("match_id", selectedMatchId)
        .order("created_at", { ascending: true });
      
      messages = data || [];
    }
  }
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Сообщения</h1>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 xl:grid-cols-4">
        <div className="lg:col-span-1">
          <ChatList
            matches={matchesWithPhotos}
            selectedMatchId={selectedMatchId}
            currentUserId={session.user.id}
          />
        </div>
        
        <div className="lg:col-span-2 xl:col-span-3">
          {selectedMatch ? (
            <ChatWindow
              match={selectedMatch}
              messages={messages}
              currentUserId={session.user.id}
            />
          ) : (
            <div className="flex h-[500px] items-center justify-center rounded-lg border bg-muted/40">
              <div className="text-center">
                <h3 className="text-lg font-medium">Выберите чат</h3>
                <p className="text-sm text-muted-foreground">
                  Выберите чат из списка слева, чтобы начать общение
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
