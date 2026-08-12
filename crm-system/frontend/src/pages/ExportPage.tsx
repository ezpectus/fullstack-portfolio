import { Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useExportCustomers, useExportDeals } from '@/api/hooks';

export default function ExportPage() {
  const exportCustomers = useExportCustomers();
  const exportDeals = useExportDeals();

  const handleDownload = (data: Blob, filename: string) => {
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Export Data</h1>
        <p className="text-muted-foreground">Download your CRM data as CSV files</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg border bg-card p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Customers</h3>
              <p className="text-sm text-muted-foreground">Export all customers with details</p>
            </div>
          </div>
          <Button
            onClick={() => exportCustomers.mutate()}
            disabled={exportCustomers.isPending}
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            {exportCustomers.isPending ? 'Exporting...' : 'Export Customers CSV'}
          </Button>
          {exportCustomers.data && (
            <Button
              variant="outline"
              onClick={() => handleDownload(exportCustomers.data, 'customers.csv')}
              className="w-full"
            >
              Download File
            </Button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-lg border bg-card p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Deals</h3>
              <p className="text-sm text-muted-foreground">Export all deals with pipeline data</p>
            </div>
          </div>
          <Button
            onClick={() => exportDeals.mutate()}
            disabled={exportDeals.isPending}
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            {exportDeals.isPending ? 'Exporting...' : 'Export Deals CSV'}
          </Button>
          {exportDeals.data && (
            <Button
              variant="outline"
              onClick={() => handleDownload(exportDeals.data, 'deals.csv')}
              className="w-full"
            >
              Download File
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
