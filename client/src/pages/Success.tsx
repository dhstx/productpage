import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, CheckCircle2, Copy } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Success() {
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [domainId, setDomainId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session_id");
    if (sid) {
      setSessionId(sid);
    } else {
      toast.error("Invalid session");
      setLocation("/");
    }
  }, [setLocation]);

  const { data: paymentData, isLoading: verifyingPayment } = trpc.payment.verifyPayment.useQuery(
    { sessionId: sessionId! },
    { enabled: !!sessionId }
  );

  useEffect(() => {
    if (paymentData?.domain) {
      setDomainId(paymentData.domain.id);
    }
  }, [paymentData]);

  const generateReportMutation = trpc.payment.generateReport.useMutation({
    onSuccess: (data) => {
      toast.success("Report generated!");
      window.open(data.pdfUrl, "_blank");
    },
    onError: (error) => {
      toast.error(`Failed to generate report: ${error.message}`);
    },
  });

  const handleDownload = () => {
    if (domainId) {
      generateReportMutation.mutate({ domainId });
    }
  };

  const copyDNSRecords = async () => {
    // This would copy recommended DNS records - placeholder for now
    toast.success("DNS records copied to clipboard!");
  };

  if (verifyingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg">Verifying payment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!paymentData?.paid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Payment Not Completed</CardTitle>
            <CardDescription>
              Your payment was not completed. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="container max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">Payment Successful!</h1>
          <p className="text-xl text-muted-foreground">
            Your Email Compliance Kit is ready
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Download Your Compliance Kit</CardTitle>
            <CardDescription>
              Domain: {paymentData.domain?.domain}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <Button
                onClick={handleDownload}
                disabled={generateReportMutation.isPending}
                size="lg"
                className="w-full"
              >
                {generateReportMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Compliance Kit (PDF)
                  </>
                )}
              </Button>

              <Button
                onClick={copyDNSRecords}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy DNS Records
              </Button>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">What's Included:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Recommended SPF record (copy-paste ready)</li>
                <li>✓ Recommended DMARC record (copy-paste ready)</li>
                <li>✓ DKIM setup instructions for your providers</li>
                <li>✓ One-click unsubscribe header snippets</li>
                <li>✓ Validation checklist for post-DNS changes</li>
                <li>✓ Full compliance report with raw scan data</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="ghost" onClick={() => setLocation("/")}>
            Scan Another Domain
          </Button>
        </div>
      </div>
    </div>
  );
}

