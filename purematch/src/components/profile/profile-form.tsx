"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Profile } from "@/types/supabase";

interface ProfileFormProps {
  profile: Profile | null;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: profile?.username || "",
    full_name: profile?.full_name || "",
    birth_date: profile?.birth_date ? new Date(profile.birth_date).toISOString().split("T")[0] : "",
    gender: profile?.gender || "",
    looking_for: profile?.looking_for || "",
    bio: profile?.bio || "",
    location: profile?.location || "",
    interests: profile?.interests?.join(", ") || "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: formData.username,
          full_name: formData.full_name,
          birth_date: formData.birth_date,
          gender: formData.gender,
          looking_for: formData.looking_for,
          bio: formData.bio,
          location: formData.location,
          interests: formData.interests.split(",").map(item => item.trim()).filter(Boolean),
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile?.id);
      
      if (error) throw error;
      
      alert("Профиль успешно обновлен!");
      router.refresh();
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
      alert("Произошла ошибка при обновлении профиля");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="username">Имя пользователя</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Ваше уникальное имя пользователя"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="full_name">Полное имя</Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Ваше полное имя"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="birth_date">Дата рождения</Label>
            <Input
              id="birth_date"
              name="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Местоположение</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Город, страна"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="gender">Пол</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleSelectChange("gender", value)}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Выберите пол" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Мужской</SelectItem>
                <SelectItem value="female">Женский</SelectItem>
                <SelectItem value="other">Другой</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="looking_for">Кого вы ищете</Label>
            <Select
              value={formData.looking_for}
              onValueChange={(value) => handleSelectChange("looking_for", value)}
            >
              <SelectTrigger id="looking_for">
                <SelectValue placeholder="Выберите предпочтение" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Мужчин</SelectItem>
                <SelectItem value="female">Женщин</SelectItem>
                <SelectItem value="both">Всех</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">О себе</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Расскажите о себе, своих увлечениях и интересах"
            rows={4}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="interests">Интересы (через запятую)</Label>
          <Input
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="Путешествия, музыка, спорт, кино"
          />
        </div>
      </div>
      
      <Button type="submit" disabled={loading}>
        {loading ? "Сохранение..." : "Сохранить изменения"}
      </Button>
    </form>
  );
}
