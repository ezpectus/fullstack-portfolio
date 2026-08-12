import { useState } from 'react';
import { useLinks, useQrCode } from '../../api/hooks';
import { PageTransition, StaggerList, StaggerItem, SkeletonShimmer } from '../../components/animations/MotionComponents';
import { Card, CardContent } from '../../components/ui/Card';
import { ErrorState } from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import { QrCode, Download } from 'lucide-react';

export default function QrPage() {
  const { data: linksData, isLoading, isError, refetch } = useLinks({ limit: 100 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: qrData, isLoading: qrLoading } = useQrCode(selectedId ?? '');

  if (isError) return <ErrorState message="Failed to load links for QR codes" onRetry={() => refetch()} />;

  return (
    <PageTransition>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">QR Codes</h1>
          <p className="text-muted-foreground mt-1">Generate QR codes for your short links</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <SkeletonShimmer key={i} className="h-40 rounded-2xl" />)}
          </div>
        ) : (
          <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {linksData?.items?.map((link) => (
              <StaggerItem key={link.id}>
                <Card
                  className={`glass-card cursor-pointer transition-all ${selectedId === link.id ? 'neon-border' : 'hover:border-primary/30'}`}
                  onClick={() => setSelectedId(link.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <QrCode className="w-5 h-5 text-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{link.shortCode}</p>
                        <p className="text-xs text-muted-foreground truncate">{link.originalUrl}</p>
                      </div>
                    </div>
                    {selectedId === link.id && qrLoading && <SkeletonShimmer className="h-48 rounded-lg" />}
                    {selectedId === link.id && qrData && (
                      <div className="space-y-3">
                        <img src={qrData.qrCode} alt="QR Code" className="w-full rounded-lg bg-white p-3" />
                        <a href={qrData.qrCode} download={`qr-${link.shortCode}.png`}>
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="w-4 h-4 mr-1" /> Download
                          </Button>
                        </a>
                      </div>
                    )}
                    {selectedId !== link.id && (
                      <div className="h-32 flex items-center justify-center text-muted-foreground">
                        <QrCode className="w-12 h-12 opacity-30" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerList>
        )}
      </div>
    </PageTransition>
  );
}
