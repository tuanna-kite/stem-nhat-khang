'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import qs from 'query-string';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

const SearchInput = () => {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get('categoryId');
  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname]);

  return (
    <div className='relative'>
      <Search className='absolute h-4 w-4 top-3 left-3 text-slate-600' />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className='w-full pl-9 md:w-[300px] rounded-full bg-slate-100 focus-visible:ring-slate-200'
        placeholder='Search...'
      />
    </div>
  );
};

export default SearchInput;
