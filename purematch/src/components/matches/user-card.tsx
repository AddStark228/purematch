"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { calculateAge } from "@/lib/utils";
import type { Profile } from "@/types/supabase";

interface UserCardProps {
  profile: Profile & { photos: { url: string; is_primary: boolean }[] };
  currentUserId: string;
  likeStatus?: { matchId: string; liked: boolean } | undefined;
}

export default function UserCard({ profile, currentUserId, likeStatus }: UserCardProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(likeStatus?.liked || false);
  const [isMatch, setIsMatch] = useState(false);
  
  const primaryPhoto = profile.photos.find(photo => photo.is_primary)?.url || profile.photos[0]?.url;
  const age = profile.birth_date ? calculateAge(new Date(profile.birth_date)) : null;
  
  const handleLike = async () => {
    setLoading(true);
    
    try {
      if (likeStatus?.matchId) {
        // Обновляем существующую запись
        const { data, error } = await supabase
          .from("matches")
          .update({
            user1_likes: currentUserId === profile.id ? false : true,
            user2_likes: currentUserId === profile.id ? true : false,
          })
          .eq("id", likeStatus.matchId)
          .select();
        
        if (error) throw error;
        
        // Проверяем, есть ли взаимный лайк
        const match = data[0];
        if (match.user1_likes && match.user2_likes) {
          setIsMatch(true);
        }
      } else {
        // Создаем новую запись
        const { data, error } = await supabase
          .from("matches")
          .insert({
            user1_id: currentUserId,
            user2_id: profile.id,
            user1_likes: true,
            user2_likes: false,
          })
          .select();
        
        if (error) throw error;
      }
      
      setLiked(true);
      router.refresh();
    } catch (error) {
      console.error("Ошибка при лайке профиля:", error);
      alert("Произошла ошибка при лайке профиля");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDislike = async () => {
    setLoading(true);
    
    try {
      if (likeStatus?.matchId) {
        // Обновляем существующую запись
        const { error } = await supabase
          .from("matches")
          .update({
            user1_likes: currentUserId === profile.id ? false : false,
            user2_likes: currentUserId === profile.id ? false : false,
          })
          .eq("id", likeStatus.matchId);
        
        if (error) throw error;
      } else {
        // Создаем новую запись с дизлайком
        const { error } = await supabase
          .from("matches")
          .insert({
            user1_id: currentUserId,
            user2_id: profile.id,
            user1_likes: false,
            user2_likes: false,
          });
        
        if (error) throw error;
      }
      
      setLiked(false);
      setIsMatch(false);
      router.refresh();
    } catch (error) {
      console.error("Ошибка при дизлайке профиля:", error);
      alert("Произошла ошибка при дизлайке профиля");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <div className="relative aspect-square">
        {primaryPhoto ? (
          <Image
            src={primaryPhoto}
            alt={profile.full_name || "Фото пользователя"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">Нет фото</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold">
            {profile.full_name || profile.username || "Пользователь"}
            {age && <span className="ml-2 text-muted-foreground">{age}</span>}
          </h3>
          {profile.location && (
            <span className="text-sm text-muted-foreground">{profile.location}</span>
          )}
        </div>
        
        {profile.bio && (
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{profile.bio}</p>
        )}
        
        {profile.interests && profile.interests.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {profile.interests.slice(0, 3).map((interest, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs"
              >
                {interest}
              </span>
            ))}
            {profile.interests.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs">
                +{profile.interests.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          <Link
            href={`/profile/${profile.id}`}
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Профиль
          </Link>
          
          {isMatch ? (
            <Link
              href={`/messages?match=${likeStatus?.matchId}`}
              className="inline-flex h-9 flex-1 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Написать
            </Link>
          ) : liked ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDislike}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Загрузка..." : "Отменить лайк"}
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleLike}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Загрузка..." : "Лайк"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
