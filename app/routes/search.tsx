import type { HeadersFunction, MetaFunction, LoaderFunction } from 'remix';
import { useLoaderData, json } from 'remix';
import SearchList from '~/components/SearchList';
import type { Entry } from '~/types';

export let headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control'),
  };
};

export let meta: MetaFunction = () => {
  return {
    title: 'Remix Guide - Search',
  };
};

export let loader: LoaderFunction = async ({ request, context }) => {
  const url = new URL(request.url);
  const keyword = url.searchParams.get('q') ?? '';
  const category = url.searchParams.get('category');
  const language = url.searchParams.get('language');
  const version = url.searchParams.get('version');
  const platform = url.searchParams.get('platform');

  const entries = await context.search({
    keyword,
    categories: category ? [category] : null,
    version,
    platform,
    language,
  });

  return json(
    {
      entries:
        keyword === ''
          ? entries.sort((prev, next) => next.views - prev.views)
          : entries,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=60',
      },
    }
  );
};

export default function Index() {
  let { entries } = useLoaderData<{ entries: Entry[] }>();

  return <SearchList entries={entries} />;
}
