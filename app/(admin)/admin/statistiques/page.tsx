"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

type StatsData = {
  totalViews: number;
  weeklyViews: number;
  monthlyViews: number;
  dailyViews: {
    date: string;
    views: number;
  }[];
  topArticles: {
    id: string;
    title: string;
    views: number;
  }[];
};

export default function StatistiquesPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"7" | "30">("7");

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/admin/statistiques?period=${period}`);
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setStats(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur lors du chargement des statistiques");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Rafraîchir les données toutes les 30 secondes
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [period]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/dashboard">
                <ChevronLeft className="h-4 w-4" />
                Retour
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Statistiques</h1>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-24" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div>Aucune statistique disponible</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/dashboard">
              <ChevronLeft className="h-4 w-4" />
              Retour
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Statistiques</h1>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Vues totales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalViews}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vues cette semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.weeklyViews}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vues ce mois</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.monthlyViews}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Évolution des vues</CardTitle>
            <Tabs
              value={period}
              onValueChange={(v) => setPeriod(v as "7" | "30")}
            >
              <TabsList>
                <TabsTrigger value="7">7 jours</TabsTrigger>
                <TabsTrigger value="30">30 jours</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.dailyViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    format(new Date(value), "d MMM", { locale: fr })
                  }
                />
                <YAxis domain={[0, "auto"]} />
                <Tooltip
                  labelFormatter={(value) =>
                    format(new Date(value), "d MMMM yyyy", { locale: fr })
                  }
                  formatter={(value: number) => [value, "vues"]}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Articles les plus vus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.topArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <span>{article.title}</span>
                <span className="font-bold">{article.views} vues</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
