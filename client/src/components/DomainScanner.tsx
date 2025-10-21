import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ScanResult {
  domainId: string;
  spf: {
    status: string;
    hasAllTerm: boolean;
    tooLong: boolean;
  };
  dkim: {
    status: string;
    count: number;
  };
  dmarc: {
    status: string;
    policy: string;
    alignment: {
      spf: boolean;
      dkim: boolean;
    };
  };
  headers: {
    listUnsub: boolean;
    oneClick: boolean;
  };
}

export function DomainScanner() {
  const [domain, setDomain] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const scanMutation = trpc.scan.scanDomain.useMutation({
    onSuccess: (data) => {
      setScanResult(data);
      toast.success("Domain scan completed!");
    },
    onError: (error) => {
      toast.error(`Scan failed: ${error.message}`);
    },
  });

  const handleScan = () => {
    if (!domain || domain.length < 3) {
      toast.error("Please enter a valid domain");
      return;
    }
    setScanResult(null);
    
    // Collect analytics data
    scanMutation.mutate({ 
      domain,
      userAgent: navigator.userAgent,
      referrer: document.referrer || undefined,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ok":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "missing":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ok":
        return <Badge variant="default" className="bg-green-600">Pass</Badge>;
      case "missing":
        return <Badge variant="destructive">Missing</Badge>;
      default:
        return <Badge variant="secondary">Warning</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scan Your Domain</CardTitle>
          <CardDescription>
            Enter your domain to check SPF, DKIM, DMARC, and email header compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              disabled={scanMutation.isPending}
              className="flex-1"
            />
            <Button
              onClick={handleScan}
              disabled={scanMutation.isPending}
              size="lg"
            >
              {scanMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                "Scan Domain"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {scanResult && (
        <Card>
          <CardHeader>
            <CardTitle>Scan Results</CardTitle>
            <CardDescription>
              Compliance check for {domain}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* SPF Check */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(scanResult.spf.status)}
                <div>
                  <p className="font-semibold">SPF Record</p>
                  <p className="text-sm text-muted-foreground">
                    Sender Policy Framework
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {getStatusBadge(scanResult.spf.status)}
                {scanResult.spf.tooLong && (
                  <Badge variant="secondary">Too Long</Badge>
                )}
                {!scanResult.spf.hasAllTerm && scanResult.spf.status === "ok" && (
                  <Badge variant="secondary">No -all</Badge>
                )}
              </div>
            </div>

            {/* DKIM Check */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(scanResult.dkim.status)}
                <div>
                  <p className="font-semibold">DKIM Signatures</p>
                  <p className="text-sm text-muted-foreground">
                    {scanResult.dkim.count} selector{scanResult.dkim.count !== 1 ? "s" : ""} found
                  </p>
                </div>
              </div>
              {getStatusBadge(scanResult.dkim.status)}
            </div>

            {/* DMARC Check */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(scanResult.dmarc.status)}
                <div>
                  <p className="font-semibold">DMARC Policy</p>
                  <p className="text-sm text-muted-foreground">
                    Policy: {scanResult.dmarc.policy}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {getStatusBadge(scanResult.dmarc.status)}
                {scanResult.dmarc.policy === "none" && (
                  <Badge variant="secondary">Monitor Only</Badge>
                )}
              </div>
            </div>

            {/* Alignment Check */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {scanResult.dmarc.alignment.spf && scanResult.dmarc.alignment.dkim ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                )}
                <div>
                  <p className="font-semibold">DMARC Alignment</p>
                  <p className="text-sm text-muted-foreground">
                    SPF: {scanResult.dmarc.alignment.spf ? "Aligned" : "Not aligned"} | 
                    DKIM: {scanResult.dmarc.alignment.dkim ? "Aligned" : "Not aligned"}
                  </p>
                </div>
              </div>
            </div>

            {/* One-Click Unsubscribe */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {scanResult.headers.oneClick ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <div>
                  <p className="font-semibold">One-Click Unsubscribe</p>
                  <p className="text-sm text-muted-foreground">
                    RFC 8058 compliant headers
                  </p>
                </div>
              </div>
              {scanResult.headers.oneClick ? (
                <Badge variant="default" className="bg-green-600">Present</Badge>
              ) : (
                <Badge variant="destructive">Missing</Badge>
              )}
            </div>

            <div className="pt-4">
              <CheckoutButton domainId={scanResult.domainId} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CheckoutButton({ domainId }: { domainId: string }) {
  const checkoutMutation = trpc.payment.createCheckout.useMutation({
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      toast.error(`Checkout failed: ${error.message}`);
    },
  });

  const handleCheckout = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const couponCode = urlParams.get("code") || undefined;
    
    checkoutMutation.mutate({ domainId, couponCode });
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={checkoutMutation.isPending}
      size="lg"
      className="w-full"
    >
      {checkoutMutation.isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading checkout...
        </>
      ) : (
        <>Get Your Compliance Kit — $29</>
      )}
    </Button>
  );
}

