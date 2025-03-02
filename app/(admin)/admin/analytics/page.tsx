"use server"

/**
 * @description
 * Admin analytics page showing platform usage statistics.
 * This is a placeholder that could be expanded with real analytics data.
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function AnalyticsPage() {
  return (
    <div className="container py-6">
      <h1 className="mb-6 text-2xl font-bold">Analytics</h1>
      <p className="text-muted-foreground mb-6">
        View detailed analytics about platform usage and performance.
      </p>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              title="Daily Active Users"
              value="42"
              change="+12%"
              trend="up"
            />
            <MetricCard
              title="New Signups"
              value="18"
              change="+5%"
              trend="up"
            />
            <MetricCard
              title="Conversations Started"
              value="156"
              change="+23%"
              trend="up"
            />
            <MetricCard
              title="Messages Sent"
              value="1,243"
              change="+18%"
              trend="up"
            />
            <MetricCard
              title="Avg. Response Time"
              value="1.2s"
              change="-0.3s"
              trend="up"
            />
            <MetricCard
              title="Pro Conversion Rate"
              value="8.5%"
              change="+1.2%"
              trend="up"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usage Over Time</CardTitle>
              <CardDescription>
                Daily active users and conversations over the past 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-80 w-full items-center justify-center rounded-md border border-dashed p-6">
                <p className="text-muted-foreground">
                  Chart placeholder - would integrate with a charting library
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>
                New user registrations over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-80 w-full items-center justify-center rounded-md border border-dashed p-6">
                <p className="text-muted-foreground">
                  User growth chart placeholder
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversation Metrics</CardTitle>
              <CardDescription>
                Conversation volume and engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-80 w-full items-center justify-center rounded-md border border-dashed p-6">
                <p className="text-muted-foreground">
                  Conversation metrics chart placeholder
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Usage</CardTitle>
              <CardDescription>
                System prompt usage and effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <MetricCard
                  title="Active Prompts"
                  value="5"
                  change="+2"
                  trend="up"
                />
                <MetricCard
                  title="Most Used Prompt"
                  value="Default System"
                  change=""
                  trend="neutral"
                />
                <MetricCard
                  title="Avg. Prompt Length"
                  value="256 tokens"
                  change="+12%"
                  trend="up"
                />
              </div>
              <div className="mt-6 flex h-80 w-full items-center justify-center rounded-md border border-dashed p-6">
                <p className="text-muted-foreground">
                  Prompt usage and effectiveness chart placeholder
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
              <CardDescription>
                API response times and error rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-80 w-full items-center justify-center rounded-md border border-dashed p-6">
                <p className="text-muted-foreground">
                  Performance metrics chart placeholder
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({
  title,
  value,
  change,
  trend
}: {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p
          className={`text-xs ${
            trend === "up"
              ? "text-green-500"
              : trend === "down"
                ? "text-red-500"
                : "text-muted-foreground"
          }`}
        >
          {change} {change ? "from last period" : ""}
        </p>
      </CardContent>
    </Card>
  )
}
