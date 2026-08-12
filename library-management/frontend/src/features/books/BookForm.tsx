import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { booksApi } from '../../api';
import { useToastStore } from '../../components/ui/Toast';
import { PageTransition } from '../../components/animations/MotionComponents';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { BookInput } from '../../types';

export default function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [form, setForm] = useState({
    isbn: '', title: '', authors: '', publisher: '', publishYear: '',
    genre: '', description: '', coverUrl: '',
  });

  const { data: book } = useQuery({
    queryKey: ['book', id],
    queryFn: () => booksApi.getById(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (book) {
      setForm({
        isbn: book.isbn || '', title: book.title || '', authors: book.authors || '',
        publisher: book.publisher || '', publishYear: String(book.publishYear || ''),
        genre: book.genre || '', description: book.description || '', coverUrl: book.coverUrl || '',
      });
    }
  }, [book]);

  const mutation = useMutation({
    mutationFn: (data: BookInput) => isEdit ? booksApi.update(id!, data) : booksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      navigate('/books');
    },
    onError: (error: unknown) => {
      useToastStore.getState().addToast('error', isEdit ? 'Failed to update book' : 'Failed to create book');
      console.error('Book form error:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, publishYear: form.publishYear ? parseInt(form.publishYear) : undefined };
    mutation.mutate(data);
  };

  return (
    <PageTransition>
      <button onClick={() => navigate('/books')} className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-600 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Books
      </button>
      <h1 className="text-2xl font-serif mb-6">{isEdit ? 'Edit Book' : 'Add New Book'}</h1>
      <form onSubmit={handleSubmit} className="card max-w-2xl space-y-4">
        <Input label="ISBN *" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} required />
        <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <Input label="Authors *" value={form.authors} onChange={(e) => setForm({ ...form, authors: e.target.value })} required />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Publisher" value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} />
          <Input label="Publish Year" type="number" value={form.publishYear} onChange={(e) => setForm({ ...form, publishYear: e.target.value })} />
        </div>
        <Input label="Genre" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} />
        <Input label="Cover URL" value={form.coverUrl} onChange={(e) => setForm({ ...form, coverUrl: e.target.value })} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 rounded-lg border border-cream-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" loading={mutation.isPending}>{isEdit ? 'Update' : 'Create'} Book</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/books')}>Cancel</Button>
        </div>
      </form>
    </PageTransition>
  );
}
