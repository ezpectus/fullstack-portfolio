import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, AlertTriangle, BookX } from 'lucide-react';
import { reportsApi } from '../../api';
import { PageTransition, SkeletonShimmer } from '../../components/animations/MotionComponents';
import { ErrorState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';

const COLORS = ['#ca8a04', '#854d0e', '#a16207', '#facc15', '#eab308', '#fde047'];

export default function Reports() {
  const { data: genres, isLoading: genresLoading, isError: genresError, refetch: refetchGenres } = useQuery({
    queryKey: ['popular-genres'],
    queryFn: reportsApi.popularGenres,
  });
  const { data: lostDamaged, isLoading: ldLoading, isError: ldError, refetch: refetchLd } = useQuery({
    queryKey: ['lost-damaged'],
    queryFn: reportsApi.lostDamaged,
  });

  const handleExport = async () => {
    const blob = await reportsApi.exportCsv();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loans-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (genresError || ldError) return <ErrorState message="Failed to load reports data" onRetry={() => { refetchGenres(); refetchLd(); }} />;
  if (genresLoading || ldLoading) return <SkeletonShimmer className="h-96" />;

  const genreData = ((genres as { genre: string; count: number }[]) || []).map((g) => ({ name: g.genre, value: g.count }));
  const lostDamagedData = [
    { name: 'Damaged', count: (lostDamaged as { damaged?: number })?.damaged || 0 },
    { name: 'Lost', count: (lostDamaged as { lost?: number })?.lost || 0 },
  ];

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif">Reports</h1>
        <Button onClick={handleExport}><Download className="w-4 h-4 mr-1 inline" /> Export CSV</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-serif mb-4">Popular Genres</h2>
          {genreData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={genreData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {genreData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-center py-4">No data</p>}
        </div>

        <div className="card">
          <h2 className="text-lg font-serif mb-4">Lost & Damaged Books</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lostDamagedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Bar dataKey="count" fill="#ca8a04" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{(lostDamaged as { damaged?: number })?.damaged || 0}</div>
            <div className="text-sm text-gray-500">Damaged Books</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
            <BookX className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{(lostDamaged as { lost?: number })?.lost || 0}</div>
            <div className="text-sm text-gray-500">Lost Books</div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
