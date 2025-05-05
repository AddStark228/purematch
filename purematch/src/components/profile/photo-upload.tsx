"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Photo } from "@/types/supabase";

interface PhotoUploadProps {
  userId: string;
  photos: Photo[];
}

export default function PhotoUpload({ userId, photos }: PhotoUploadProps) {
  const router = useRouter();
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [settingPrimary, setSettingPrimary] = useState<string | null>(null);
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `photos/${fileName}`;
    
    setUploading(true);
    
    try {
      // Загружаем файл в хранилище
      const { error: uploadError } = await supabase.storage
        .from("user-photos")
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Получаем публичный URL файла
      const { data: { publicUrl } } = supabase.storage
        .from("user-photos")
        .getPublicUrl(filePath);
      
      // Добавляем запись в таблицу photos
      const { error: dbError } = await supabase
        .from("photos")
        .insert({
          user_id: userId,
          url: publicUrl,
          is_primary: photos.length === 0, // Если это первое фото, делаем его основным
        });
      
      if (dbError) throw dbError;
      
      alert("Фото успешно загружено!");
      router.refresh();
    } catch (error) {
      console.error("Ошибка при загрузке фото:", error);
      alert("Произошла ошибка при загрузке фото");
    } finally {
      setUploading(false);
    }
  };
  
  const handleDelete = async (photoId: string) => {
    if (!confirm("Вы уверены, что хотите удалить это фото?")) {
      return;
    }
    
    setDeleting(photoId);
    
    try {
      const { error } = await supabase
        .from("photos")
        .delete()
        .eq("id", photoId);
      
      if (error) throw error;
      
      alert("Фото успешно удалено!");
      router.refresh();
    } catch (error) {
      console.error("Ошибка при удалении фото:", error);
      alert("Произошла ошибка при удалении фото");
    } finally {
      setDeleting(null);
    }
  };
  
  const handleSetPrimary = async (photoId: string) => {
    setSettingPrimary(photoId);
    
    try {
      // Сначала сбрасываем все фото как не основные
      await supabase
        .from("photos")
        .update({ is_primary: false })
        .eq("user_id", userId);
      
      // Затем устанавливаем выбранное фото как основное
      const { error } = await supabase
        .from("photos")
        .update({ is_primary: true })
        .eq("id", photoId);
      
      if (error) throw error;
      
      alert("Основное фото успешно обновлено!");
      router.refresh();
    } catch (error) {
      console.error("Ошибка при установке основного фото:", error);
      alert("Произошла ошибка при установке основного фото");
    } finally {
      setSettingPrimary(null);
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Загрузить новое фото</h3>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="photo">Выберите фото</Label>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />
          <p className="text-sm text-muted-foreground">
            Загружайте фото в формате JPG, PNG или GIF. Максимальный размер файла: 5MB.
          </p>
        </div>
        {uploading && <p className="text-sm text-muted-foreground">Загрузка...</p>}
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Ваши фотографии</h3>
        {photos.length === 0 ? (
          <p className="text-muted-foreground">У вас пока нет загруженных фотографий.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative overflow-hidden rounded-lg border">
                <div className="aspect-square relative">
                  <Image
                    src={photo.url}
                    alt="Фото профиля"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2 flex flex-col gap-2">
                  {photo.is_primary ? (
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      Основное фото
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetPrimary(photo.id)}
                      disabled={settingPrimary === photo.id}
                      className="w-full"
                    >
                      {settingPrimary === photo.id ? "Обновление..." : "Сделать основным"}
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(photo.id)}
                    disabled={deleting === photo.id}
                    className="w-full"
                  >
                    {deleting === photo.id ? "Удаление..." : "Удалить"}
                  </Button>
                </div>
                {photo.is_verified && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Проверено
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
