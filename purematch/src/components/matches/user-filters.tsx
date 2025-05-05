"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserFiltersProps {
  initialGender: string;
  initialMinAge: number;
  initialMaxAge: number;
  initialLocation: string;
  initialInterests: string;
}

export default function UserFilters({
  initialGender = "both",
  initialMinAge = 18,
  initialMaxAge = 100,
  initialLocation = "",
  initialInterests = "",
}: UserFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [gender, setGender] = useState(initialGender);
  const [minAge, setMinAge] = useState(initialMinAge);
  const [maxAge, setMaxAge] = useState(initialMaxAge);
  const [location, setLocation] = useState(initialLocation);
  const [interests, setInterests] = useState(initialInterests);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Создаем объект с параметрами фильтрации
    const params = new URLSearchParams();
    
    if (gender) params.set("gender", gender);
    if (minAge) params.set("minAge", minAge.toString());
    if (maxAge) params.set("maxAge", maxAge.toString());
    if (location) params.set("location", location);
    if (interests) params.set("interests", interests);
    
    // Обновляем URL с новыми параметрами
    router.push(`${pathname}?${params.toString()}`);
  };
  
  const handleReset = () => {
    setGender("both");
    setMinAge(18);
    setMaxAge(100);
    setLocation("");
    setInterests("");
    
    router.push(pathname);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border p-4">
      <h2 className="text-lg font-semibold">Фильтры</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Пол</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger id="gender">
              <SelectValue placeholder="Выберите пол" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="both">Все</SelectItem>
              <SelectItem value="male">Мужской</SelectItem>
              <SelectItem value="female">Женский</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Возраст</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="18"
              max="100"
              value={minAge}
              onChange={(e) => setMinAge(parseInt(e.target.value))}
              className="w-full"
            />
            <span>-</span>
            <Input
              type="number"
              min="18"
              max="100"
              value={maxAge}
              onChange={(e) => setMaxAge(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Местоположение</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Город, страна"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="interests">Интересы (через запятую)</Label>
          <Input
            id="interests"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Путешествия, музыка, спорт"
          />
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <Button type="submit">Применить фильтры</Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          Сбросить
        </Button>
      </div>
    </form>
  );
}
