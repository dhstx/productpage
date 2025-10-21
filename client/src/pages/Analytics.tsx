import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Users, ShoppingCart, XCircle } from "lucide-react";
import { Redirect } from "wouter";

export default function Analytics() {
  const { user, loading: authLoading } = useAuth();
  const { data: dashboard, isLoading } = trpc.analytics.getDashboard.useQuery();
  const { data: funnel } = trpc.analytics.getFunnel.useQuery();
  const { data: topDomains } = trpc.analytics.getTopDomains.useQuery({ limit: 20 });

  // Redirect if not admin
  if (!authLoading && (!user || user.role !== "admin")) {
    return <Redirect to="/" />;
  }

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track scans, conversions, and revenue performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-3xl font-bold">{dashboard?.totalScans || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Paid Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                <span className="text-3xl font-bold">{dashboard?.totalPaid || 0}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                ${((dashboard?.totalPaid || 0) * 29).toLocaleString()} revenue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span className="text-3xl font-bold">{dashboard?.conversionRate || "0%"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Checkout Abandonment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-3xl font-bold">{dashboard?.checkoutAbandoned || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Funnel */}
        {funnel && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Track user journey from scan to purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-semibold">1. Domain Scanned</p>
                    <p className="text-sm text-gray-600">Users who scanned a domain</p>
                  </div>
                  <Badge variant="default" className="text-lg px-4 py-2">
                    {funnel.step1_scanned}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-semibold">2. Checkout Initiated</p>
                    <p className="text-sm text-gray-600">Users who clicked "Buy"</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      {funnel.step2_initiated_checkout}
                    </Badge>
                    <p className="text-sm text-red-600 mt-1">
                      -{funnel.dropoff_after_scan} dropped off
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-semibold">3. Payment Completed</p>
                    <p className="text-sm text-gray-600">Users who paid $29</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="default" className="bg-green-600 text-lg px-4 py-2">
                      {funnel.step3_completed_payment}
                    </Badge>
                    <p className="text-sm text-red-600 mt-1">
                      -{funnel.dropoff_after_checkout} abandoned checkout
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Scanned Domains */}
        <Card>
          <CardHeader>
            <CardTitle>Top Scanned Domains</CardTitle>
            <CardDescription>Most frequently scanned domains and their conversion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Domain</th>
                    <th className="text-left py-3 px-4">Scan Count</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">First Scan</th>
                    <th className="text-left py-3 px-4">Paid Date</th>
                  </tr>
                </thead>
                <tbody>
                  {topDomains?.map((domain) => (
                    <tr key={domain.domain} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{domain.domain}</td>
                      <td className="py-3 px-4">{domain.scanCount}</td>
                      <td className="py-3 px-4">
                        {domain.status === "paid" ? (
                          <Badge variant="default" className="bg-green-600">Paid</Badge>
                        ) : (
                          <Badge variant="secondary">Free Scan</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {domain.createdAt ? new Date(domain.createdAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {domain.paidAt ? new Date(domain.paidAt).toLocaleDateString() : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold text-blue-900">
                  {dashboard?.scannedNoCheckout || 0} users scanned but never clicked "Buy"
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Consider adding urgency messaging or social proof to increase checkout rate
                </p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="font-semibold text-yellow-900">
                  {dashboard?.checkoutAbandoned || 0} users started checkout but didn't complete payment
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Consider cart abandonment emails or reducing friction in checkout flow
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="font-semibold text-green-900">
                  Current conversion rate: {dashboard?.conversionRate || "0%"}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Industry average for SaaS tools is 2-5%. You're {parseFloat(dashboard?.conversionRate || "0") > 2 ? "above" : "below"} average.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

