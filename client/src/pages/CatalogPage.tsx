import { useState, useMemo, memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getSections } from '@/shared/api';
import Spinner from '@/shared/ui/Spinner';

const CatalogPage = memo(() => {
  const {
    data: sections,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['sections'],
    queryFn: getSections,
  });
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );

  const activeSectionId = selectedSectionId || sections?.[0]?.id || null;
  const activeSection = useMemo(
    () => (sections || []).find((sec) => sec.id === activeSectionId),
    [activeSectionId, sections]
  );

  const expandedMobileSectionId = selectedSectionId;

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSectionId((currentId) =>
      currentId === sectionId ? null : sectionId
    );
  };

  if (isLoading) {
    return (
      <div className='flex min-h-150 items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-150 items-center justify-center text-center text-danger'>
        <h2 className='text-2xl font-bold'>Ошибка при загрузке каталога</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className='min-w-0 py-6 sm:py-8 lg:py-10'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-text-default sm:text-3xl'>
          Каталог товаров
        </h1>
      </div>

      <div className='grid min-w-0 grid-cols-1 gap-5 md:grid-cols-[17rem_minmax(0,1fr)] lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-8'>
        <aside className='hidden min-w-0 md:block'>
          <div className='sticky top-36 bg-background-default'>
            <ul className='flex flex-col gap-1'>
              {(sections || []).map((sec) => (
                <li key={sec.id}>
                  <button
                    type='button'
                    onMouseEnter={() => setSelectedSectionId(sec.id)}
                    onFocus={() => setSelectedSectionId(sec.id)}
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-3 text-left text-sm font-medium transition-colors lg:text-base ${
                      activeSectionId === sec.id
                        ? 'bg-primary-subtle text-primary-hover'
                        : 'text-text-default hover:bg-background-muted'
                    }`}
                  >
                    <span className='min-w-0 break-words'>{sec.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className='min-w-0 md:hidden'>
          <div className='bg-background-default'>
            <ul className='flex flex-col gap-1'>
            {(sections || []).map((sec) => (
              <li key={sec.id} className='min-w-0'>
                <button
                  type='button'
                  onClick={() => handleSectionToggle(sec.id)}
                  className={`flex w-full items-center rounded-md px-3 py-3 text-left text-base font-medium transition-colors ${
                    expandedMobileSectionId === sec.id
                      ? 'bg-primary-subtle text-primary-hover'
                      : 'text-text-default hover:bg-background-muted'
                  }`}
                >
                  <span className='min-w-0 break-words'>
                      {sec.name}
                  </span>
                </button>

                {expandedMobileSectionId === sec.id && (
                  <div className='pl-3 pt-1 pb-2'>
                    {sec.categories.length > 0 ? (
                      <ul className='grid grid-cols-1 gap-1'>
                        <li>
                          <Link
                            to={`/catalog/${sec.id}`}
                            className='block rounded-md px-3 py-2 font-medium text-primary hover:bg-primary-subtle hover:text-primary-hover'
                          >
                            Все
                          </Link>
                        </li>
                        {sec.categories.map((cat) => (
                          <li key={cat.id}>
                            <Link
                              to={`/catalog/${sec.id}/${cat.id}`}
                              className='block rounded-md px-3 py-2 text-text-default hover:bg-primary-subtle hover:text-primary-hover'
                            >
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className='px-1 py-2 text-sm text-text-muted'>
                        В этом разделе пока нет категорий.
                      </p>
                    )}
                  </div>
                )}
              </li>
            ))}
            </ul>
          </div>
        </section>

        <section className='hidden min-w-0 md:block'>
          {activeSection ? (
            <div className='min-w-0'>
              <div className='mb-5 bg-background-default'>
                <h2 className='break-words text-2xl font-semibold text-text-default'>
                  {activeSection.name}
                </h2>
              </div>

              {activeSection.categories.length > 0 ? (
                <ul className='grid grid-cols-2 gap-3 lg:grid-cols-3'>
                  <li className='min-w-0'>
                    <Link
                      to={`/catalog/${activeSection.id}`}
                      className='flex min-h-20 items-start rounded-md bg-background-default p-3 font-medium text-primary transition-colors hover:bg-primary-subtle hover:text-primary-hover'
                    >
                      Все
                    </Link>
                  </li>
                  {activeSection.categories.map((cat) => (
                    <li key={cat.id} className='min-w-0'>
                      <Link
                        to={`/catalog/${activeSection.id}/${cat.id}`}
                        className='flex min-h-20 flex-col justify-between rounded-md bg-background-default p-3 text-text-default transition-colors hover:bg-primary-subtle hover:text-primary-hover'
                      >
                        <span className='break-words font-medium'>
                          {cat.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='rounded-lg border border-border-default bg-background-default p-5 text-text-muted'>
                  В этом разделе пока нет категорий.
                </p>
              )}
            </div>
          ) : (
            <div className='rounded-lg border border-border-default p-6 text-center'>
              <p className='text-base text-text-muted'>
                Разделы каталога пока не загружены.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
});

export default CatalogPage;
