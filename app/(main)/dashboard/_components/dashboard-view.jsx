"use client";

import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  BriefcaseIcon, LineChart, TrendingUp, TrendingDown, Brain, Loader2,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const getDemandColor = (level = "") => ({
  high: "bg-green-500",
  medium: "bg-yellow-500",
  low: "bg-red-500",
}[level.toLowerCase()] || "bg-gray-500");

const getOutlookInfo = (outlook = "") => {
  const map = {
    positive: { icon: TrendingUp, color: "text-green-500" },
    neutral: { icon: LineChart, color: "text-yellow-500" },
    negative: { icon: TrendingDown, color: "text-red-500" },
  };
  return map[outlook.toLowerCase()] || { icon: LineChart, color: "text-gray-500" };
};

const InsightCard = ({ title, icon: Icon, value, children }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {children}
    </CardContent>
  </Card>
);

const DashboardView = ({ insights }) => {
  if (!insights) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-muted-foreground">Loading your industry insights...</p>
      </div>
    );
  }

  const salaryData = Array.isArray(insights.salaryRanges)
    ? insights.salaryRanges.map(({ role, min, max, median }) => ({
        name: role,
        min: min / 1000,
        max: max / 1000,
        median: median / 1000,
      }))
    : [];

  const { icon: OutlookIcon, color: outlookColor } = getOutlookInfo(insights.marketOutlook);
  const lastUpdatedDate = insights.lastUpdated
    ? format(new Date(insights.lastUpdated), "dd/MM/yyyy")
    : "Unknown";

  const nextUpdateDistance = insights.nextUpdate
    ? formatDistanceToNow(new Date(insights.nextUpdate), { addSuffix: true })
    : "Unknown";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Last updated: {lastUpdatedDate}</Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard
          title="Market Outlook"
          icon={OutlookIcon}
          value={insights.marketOutlook || "Neutral"}
        >
          <p className="text-xs text-muted-foreground">Next update {nextUpdateDistance}</p>
        </InsightCard>

        <InsightCard
          title="Industry Growth"
          icon={TrendingUp}
          value={`${(insights.growthRate || 0).toFixed(1)}%`}
        >
          <Progress value={insights.growthRate || 0} className="mt-2" />
        </InsightCard>

        <InsightCard
          title="Demand Level"
          icon={BriefcaseIcon}
          value={insights.demandLevel || "Unknown"}
        >
          <div className={`h-2 w-full mt-2 rounded-full ${getDemandColor(insights.demandLevel)}`} />
        </InsightCard>

        <InsightCard title="Top Skills" icon={Brain} value="">
          <div className="flex flex-wrap gap-1">
            {(insights.topSkills || []).map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </InsightCard>
      </div>

      {/* Salary Chart */}
      {salaryData.length > 0 && (
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Salary Ranges by Role</CardTitle>
            <CardDescription>
              Showing minimum, median, and maximum (in thousands)
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) =>
                    active && payload?.length ? (
                      <div className="bg-background border rounded-lg p-2 shadow-md">
                        <p className="font-medium">{label}</p>
                        {payload.map((item) => (
                          <p key={item.name} className="text-sm">
                            {item.name}: ${item.value}K
                          </p>
                        ))}
                      </div>
                    ) : null
                  }
                />
                <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                <Bar dataKey="median" fill="#64748b" name="Median Salary (K)" />
                <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Trends and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Key Industry Trends</CardTitle>
            <CardDescription>Trends shaping the industry</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {(insights.keyTrends || []).map((trend, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Skills</CardTitle>
            <CardDescription>Skills to consider learning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(insights.recommendedSkills || []).map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
