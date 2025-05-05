import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/profile/profile-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhotoUpload from "@/components/profile/photo-upload";

export default async function ProfilePage() {
  const supabase = createClient();
  
  // Проверяем, авторизован ли пользователь
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect("/auth/login");
  }
  
  // Получаем данные профиля пользователя
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();
  
  // Получаем фотографии пользователя
  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("user_id", session.user.id)
    .order("is_primary", { ascending: false });
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Мой профиль</h1>
      
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="info">Основная информация</TabsTrigger>
          <TabsTrigger value="photos">Фотографии</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info">
          <div className="max-w-2xl mx-auto">
            <ProfileForm profile={profile} />
          </div>
        </TabsContent>
        
        <TabsContent value="photos">
          <div className="max-w-4xl mx-auto">
            <PhotoUpload userId={session.user.id} photos={photos || []} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
